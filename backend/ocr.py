import easyocr
import cv2
import spacy
import re
from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import io
import asyncio
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid
import json
# Optional PDF processing
try:
    import fitz  # PyMuPDF for PDF processing
    PDF_SUPPORT = True
except ImportError:
    print("⚠️  PyMuPDF not found. PDF processing will be disabled.")
    print("   Install with: pip install PyMuPDF==1.23.14")
    PDF_SUPPORT = False

# Initialize FastAPI app
app = FastAPI(title="FRA Atlas OCR & NER Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize EasyOCR reader with supported languages
# Note: Only using languages that are confirmed to work with EasyOCR
SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'te', 'ta', 'bn']

try:
    print("🔧 Initializing EasyOCR reader...")
    reader = easyocr.Reader(SUPPORTED_LANGUAGES)
    print(f"✅ EasyOCR initialized with languages: {', '.join(SUPPORTED_LANGUAGES)}")
except Exception as e:
    print(f"❌ Error initializing EasyOCR: {e}")
    # Fallback to English only
    reader = easyocr.Reader(['en'])
    print("⚠️  Fallback: Using English only")

# Load spaCy model for NER (install with: python -m spacy download en_core_web_sm)
try:
    print("🔧 Loading spaCy model...")
    nlp = spacy.load("en_core_web_sm")
    print("✅ spaCy model loaded successfully")
except OSError:
    print("⚠️  Warning: spaCy English model not found. Install with: python -m spacy download en_core_web_sm")
    nlp = None

# Data models
class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class ExtractedEntity(BaseModel):
    id: str
    type: str
    value: str
    confidence: float
    start_index: int
    end_index: int
    bounding_box: Optional[BoundingBox] = None
    verified: bool = False

class OCRResult(BaseModel):
    id: str
    document_id: str
    extracted_text: str
    confidence: float
    language: str
    processing_time: float
    bounding_boxes: List[BoundingBox]
    entities: List[ExtractedEntity]
    status: str
    created_at: datetime

class ProcessingStatus(BaseModel):
    document_id: str
    status: str
    progress: int
    message: str
    estimated_completion: Optional[int] = None

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_status_update(self, document_id: str, status: ProcessingStatus):
        message = {
            "type": "status_update",
            "document_id": document_id,
            "data": status.dict()
        }
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                pass

manager = ConnectionManager()

def convert_pdf_to_images(pdf_bytes: bytes) -> List[np.ndarray]:
    """
    Convert PDF pages to images for OCR processing
    """
    if not PDF_SUPPORT:
        raise HTTPException(
            status_code=400, 
            detail="PDF processing not available. Install PyMuPDF: pip install PyMuPDF==1.23.14"
        )
    
    images = []
    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            # Convert to image with high DPI for better OCR
            mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for better quality
            pix = page.get_pixmap(matrix=mat)
            img_data = pix.tobytes("ppm")
            
            # Convert to PIL Image then to numpy array
            pil_image = Image.open(io.BytesIO(img_data))
            image_np = np.array(pil_image)
            images.append(image_np)
        
        pdf_document.close()
        return images
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")

def preprocess_image(image: np.ndarray) -> np.ndarray:
    """
    Enhance image quality for better OCR accuracy
    """
    # Convert to PIL Image for enhancement
    if len(image.shape) == 3:
        pil_image = Image.fromarray(image)
    else:
        pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(pil_image)
    pil_image = enhancer.enhance(1.2)
    
    # Enhance sharpness
    enhancer = ImageEnhance.Sharpness(pil_image)
    pil_image = enhancer.enhance(1.1)
    
    # Apply slight blur to reduce noise
    pil_image = pil_image.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    # Convert back to OpenCV format
    enhanced_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    
    return enhanced_image

def extract_entities_with_ner(text: str) -> List[ExtractedEntity]:
    """
    Extract named entities using spaCy NER and custom patterns
    """
    entities = []
    
    if nlp:
        doc = nlp(text)
        for ent in doc.ents:
            entity = ExtractedEntity(
                id=str(uuid.uuid4()),
                type=ent.label_,
                value=ent.text,
                confidence=0.8,  # spaCy doesn't provide confidence scores by default
                start_index=ent.start_char,
                end_index=ent.end_char,
                verified=False
            )
            entities.append(entity)
    
    # Custom patterns for forest rights specific entities
    patterns = {
        "AREA": r'(\d+(?:\.\d+)?)\s*(?:hectares?|acres?|sq\.?\s*(?:km|m|ft))',
        "DATE": r'\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b',
        "PHONE": r'\b(?:\+91|91)?[-.\s]?[6-9]\d{9}\b',
        "VILLAGE": r'\b(?:Village|Gram|Gaon)\s+([A-Za-z\s]+)\b',
        "DISTRICT": r'\b(?:District|Zilla)\s+([A-Za-z\s]+)\b',
        "SURVEY_NUMBER": r'\b(?:Survey|S\.?)\s*(?:No\.?|Number)\s*:?\s*(\d+(?:[/-]\d+)*)\b'
    }
    
    for entity_type, pattern in patterns.items():
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            entity = ExtractedEntity(
                id=str(uuid.uuid4()),
                type=entity_type,
                value=match.group(0),
                confidence=0.9,
                start_index=match.start(),
                end_index=match.end(),
                verified=False
            )
            entities.append(entity)
    
    return entities

@app.websocket("/ws/{document_id}")
async def websocket_endpoint(websocket: WebSocket, document_id: str):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/ocr/extract-text", response_model=OCRResult)
async def extract_text_with_ner(file: UploadFile = File(...)):
    """
    Advanced OCR with NER extraction and real-time status updates
    """
    start_time = datetime.now()
    document_id = str(uuid.uuid4())
    
    try:
        # Send initial status
        await manager.send_status_update(document_id, ProcessingStatus(
            document_id=document_id,
            status="processing",
            progress=10,
            message="Reading uploaded file...",
            estimated_completion=30
        ))
        
        # Read file contents
        contents = await file.read()
        
        # Check file type and process accordingly
        if file.content_type == "application/pdf":
            if not PDF_SUPPORT:
                raise HTTPException(
                    status_code=400, 
                    detail="PDF processing not available. Please install PyMuPDF: pip install PyMuPDF==1.23.14"
                )
            # Process PDF
            images = convert_pdf_to_images(contents)
            if not images:
                raise HTTPException(status_code=400, detail="No pages found in PDF")
            # Use first page for now (can be extended for multi-page processing)
            image_np = images[0]
        else:
            # Process image file
            try:
                image = Image.open(io.BytesIO(contents)).convert("RGB")
                image_np = np.array(image)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")
        
        await manager.send_status_update(document_id, ProcessingStatus(
            document_id=document_id,
            status="processing",
            progress=30,
            message="Preprocessing image for better accuracy...",
            estimated_completion=25
        ))
        
        # Convert RGB to BGR for OpenCV and enhance
        image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        enhanced_image = preprocess_image(image_cv)
        
        await manager.send_status_update(document_id, ProcessingStatus(
            document_id=document_id,
            status="processing",
            progress=50,
            message="Extracting text with EasyOCR...",
            estimated_completion=20
        ))
        
        # Perform OCR
        ocr_results = reader.readtext(enhanced_image)
        
        await manager.send_status_update(document_id, ProcessingStatus(
            document_id=document_id,
            status="processing",
            progress=70,
            message="Analyzing entities with NER...",
            estimated_completion=10
        ))
        
        # Extract text and create bounding boxes
        extracted_text = " ".join([text for _, text, _ in ocr_results])
        bounding_boxes = []
        
        for bbox, text, confidence in ocr_results:
            # Convert bbox to our format
            x_coords = [point[0] for point in bbox]
            y_coords = [point[1] for point in bbox]
            
            bounding_box = BoundingBox(
                x=min(x_coords),
                y=min(y_coords),
                width=max(x_coords) - min(x_coords),
                height=max(y_coords) - min(y_coords)
            )
            bounding_boxes.append(bounding_box)
        
        # Extract entities using NER
        entities = extract_entities_with_ner(extracted_text)
        
        await manager.send_status_update(document_id, ProcessingStatus(
            document_id=document_id,
            status="processing",
            progress=90,
            message="Finalizing results...",
            estimated_completion=2
        ))
        
        # Calculate overall confidence
        overall_confidence = np.mean([conf for _, _, conf in ocr_results]) if ocr_results else 0.0
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # Create result
        result = OCRResult(
            id=str(uuid.uuid4()),
            document_id=document_id,
            extracted_text=extracted_text,
            confidence=overall_confidence,
            language="multi",
            processing_time=processing_time,
            bounding_boxes=bounding_boxes,
            entities=entities,
            status="completed",
            created_at=start_time
        )
        
        await manager.send_status_update(document_id, ProcessingStatus(
            document_id=document_id,
            status="completed",
            progress=100,
            message="Processing completed successfully!",
            estimated_completion=0
        ))
        
        return result
        
    except Exception as e:
        await manager.send_status_update(document_id, ProcessingStatus(
            document_id=document_id,
            status="failed",
            progress=0,
            message=f"Processing failed: {str(e)}",
            estimated_completion=0
        ))
        raise

@app.post("/ocr/batch-process")
async def batch_process_documents(files: List[UploadFile] = File(...)):
    """
    Process multiple documents in batch
    """
    results = []
    total_files = len(files)
    
    for i, file in enumerate(files):
        try:
            result = await extract_text_with_ner(file)
            results.append(result)
            
            # Send batch progress update
            progress = int((i + 1) / total_files * 100)
            await manager.send_status_update("batch", ProcessingStatus(
                document_id="batch",
                status="processing",
                progress=progress,
                message=f"Processed {i + 1} of {total_files} documents",
                estimated_completion=max(0, (total_files - i - 1) * 10)
            ))
            
        except Exception as e:
            print(f"Error processing file {file.filename}: {str(e)}")
            continue
    
    return {"processed_count": len(results), "results": results}

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "ocr_ready": reader is not None,
        "ner_ready": nlp is not None,
        "pdf_support": PDF_SUPPORT,
        "supported_languages": SUPPORTED_LANGUAGES,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/languages")
async def get_supported_languages():
    """
    Get list of supported languages
    """
    language_info = {
        'en': 'English',
        'hi': 'Hindi (हिंदी)',
        'mr': 'Marathi (मराठी)',
        'te': 'Telugu (తెలుగు)',
        'ta': 'Tamil (தமிழ்)',
        'bn': 'Bengali (বাংলা)'
    }
    
    return {
        "supported_languages": SUPPORTED_LANGUAGES,
        "language_names": {code: language_info.get(code, code) for code in SUPPORTED_LANGUAGES},
        "total_count": len(SUPPORTED_LANGUAGES)
    }
