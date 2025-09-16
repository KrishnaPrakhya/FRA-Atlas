"""
FastAPI backend for FRA Atlas AI/ML services
Handles OCR, NER, computer vision, and decision support AI models
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import os
import tempfile
import json
from datetime import datetime
import logging

# AI/ML imports
import pytesseract
from PIL import Image
import spacy
import cv2
import numpy as np
from transformers import pipeline
import torch

# Database imports
import psycopg2
from psycopg2.extras import RealDictCursor
import asyncpg

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="FRA Atlas AI Backend",
    description="AI/ML services for Forest Rights Act management",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Load AI models
try:
    # Load spaCy model for NER
    nlp = spacy.load("en_core_web_sm")
    
    # Load sentiment analysis pipeline
    sentiment_analyzer = pipeline("sentiment-analysis", 
                                model="cardiffnlp/twitter-roberta-base-sentiment-latest")
    
    # Load document classification pipeline
    doc_classifier = pipeline("text-classification",
                            model="microsoft/DialoGPT-medium")
    
    logger.info("AI models loaded successfully")
except Exception as e:
    logger.error(f"Failed to load AI models: {e}")
    # Continue without models for development

# Pydantic models
class OCRRequest(BaseModel):
    document_id: int
    extract_entities: bool = True

class OCRResponse(BaseModel):
    success: bool
    text: str
    entities: Optional[Dict[str, List[str]]] = None
    confidence: float
    processing_time: float

class NERRequest(BaseModel):
    text: str
    document_type: str

class NERResponse(BaseModel):
    success: bool
    entities: Dict[str, List[Dict[str, Any]]]
    processing_time: float

class DecisionRequest(BaseModel):
    claim_id: int
    factors: Dict[str, float]

class DecisionResponse(BaseModel):
    success: bool
    recommendation: str
    confidence: float
    reasoning: List[str]
    risk_factors: List[str]

# Utility functions
async def get_db_connection():
    """Get database connection"""
    return await asyncpg.connect(DATABASE_URL)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token (simplified for demo)"""
    # In production, implement proper JWT verification
    if not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    return credentials.credentials

# OCR Processing
@app.post("/api/ai/ocr", response_model=OCRResponse)
async def process_ocr(
    file: UploadFile = File(...),
    extract_entities: bool = True,
    token: str = Depends(verify_token)
):
    """
    Extract text from uploaded document using OCR
    """
    start_time = datetime.now()
    
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Only image files are supported")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Preprocess image
        image = cv2.imread(tmp_file_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply image enhancement
        denoised = cv2.fastNlMeansDenoising(gray)
        
        # OCR processing
        custom_config = r'--oem 3 --psm 6'
        extracted_text = pytesseract.image_to_string(denoised, config=custom_config)
        
        # Get confidence score
        data = pytesseract.image_to_data(denoised, output_type=pytesseract.Output.DICT)
        confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        # Extract entities if requested
        entities = None
        if extract_entities and extracted_text.strip():
            entities = extract_entities_from_text(extracted_text)
        
        # Clean up temporary file
        os.unlink(tmp_file_path)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return OCRResponse(
            success=True,
            text=extracted_text.strip(),
            entities=entities,
            confidence=avg_confidence / 100.0,
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"OCR processing error: {e}")
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

# Named Entity Recognition
@app.post("/api/ai/ner", response_model=NERResponse)
async def process_ner(
    request: NERRequest,
    token: str = Depends(verify_token)
):
    """
    Extract named entities from text
    """
    start_time = datetime.now()
    
    try:
        entities = extract_entities_from_text(request.text, request.document_type)
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return NERResponse(
            success=True,
            entities=entities,
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"NER processing error: {e}")
        raise HTTPException(status_code=500, detail=f"NER processing failed: {str(e)}")

def extract_entities_from_text(text: str, document_type: str = "general") -> Dict[str, List[Dict[str, Any]]]:
    """
    Extract entities using spaCy and custom rules for FRA documents
    """
    try:
        doc = nlp(text)
        entities = {
            "PERSON": [],
            "ORG": [],
            "GPE": [],  # Geopolitical entities (villages, districts)
            "DATE": [],
            "MONEY": [],
            "QUANTITY": [],
            "CUSTOM": []  # Custom FRA-specific entities
        }
        
        # Extract standard entities
        for ent in doc.ents:
            if ent.label_ in entities:
                entities[ent.label_].append({
                    "text": ent.text,
                    "start": ent.start_char,
                    "end": ent.end_char,
                    "confidence": 0.9  # spaCy doesn't provide confidence scores
                })
        
        # Custom FRA-specific entity extraction
        custom_entities = extract_fra_entities(text)
        entities["CUSTOM"].extend(custom_entities)
        
        return entities
        
    except Exception as e:
        logger.error(f"Entity extraction error: {e}")
        return {}

def extract_fra_entities(text: str) -> List[Dict[str, Any]]:
    """
    Extract FRA-specific entities like claim numbers, forest areas, etc.
    """
    import re
    
    entities = []
    
    # Claim number pattern (FRA followed by year and number)
    claim_pattern = r'FRA\d{4}\d{3,6}'
    for match in re.finditer(claim_pattern, text):
        entities.append({
            "text": match.group(),
            "start": match.start(),
            "end": match.end(),
            "type": "CLAIM_NUMBER",
            "confidence": 0.95
        })
    
    # Forest area pattern (hectares)
    area_pattern = r'(\d+\.?\d*)\s*(hectare|hectares|ha)'
    for match in re.finditer(area_pattern, text, re.IGNORECASE):
        entities.append({
            "text": match.group(),
            "start": match.start(),
            "end": match.end(),
            "type": "FOREST_AREA",
            "confidence": 0.9
        })
    
    # Village/District patterns
    location_keywords = ['village', 'district', 'tehsil', 'block', 'panchayat']
    for keyword in location_keywords:
        pattern = rf'(\w+)\s+{keyword}'
        for match in re.finditer(pattern, text, re.IGNORECASE):
            entities.append({
                "text": match.group(),
                "start": match.start(),
                "end": match.end(),
                "type": f"LOCATION_{keyword.upper()}",
                "confidence": 0.8
            })
    
    return entities

# Decision Support System
@app.post("/api/ai/decision", response_model=DecisionResponse)
async def process_decision(
    request: DecisionRequest,
    token: str = Depends(verify_token)
):
    """
    AI-powered decision support for claim evaluation
    """
    try:
        # Get claim data from database
        conn = await get_db_connection()
        
        claim_query = """
            SELECT c.*, 
                   COUNT(d.id) as document_count,
                   AVG(CASE WHEN d.verification_status = 'Verified' THEN 1 ELSE 0 END) as doc_verification_rate
            FROM forest_rights_claims c
            LEFT JOIN claim_documents d ON c.id = d.claim_id
            WHERE c.id = $1
            GROUP BY c.id
        """
        
        claim_data = await conn.fetchrow(claim_query, request.claim_id)
        await conn.close()
        
        if not claim_data:
            raise HTTPException(status_code=404, detail="Claim not found")
        
        # Calculate decision factors
        factors = calculate_decision_factors(claim_data, request.factors)
        
        # Generate recommendation
        recommendation, confidence, reasoning, risk_factors = generate_recommendation(factors)
        
        return DecisionResponse(
            success=True,
            recommendation=recommendation,
            confidence=confidence,
            reasoning=reasoning,
            risk_factors=risk_factors
        )
        
    except Exception as e:
        logger.error(f"Decision processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Decision processing failed: {str(e)}")

def calculate_decision_factors(claim_data, additional_factors: Dict[str, float]) -> Dict[str, float]:
    """
    Calculate weighted decision factors for claim evaluation
    """
    factors = {
        "document_completeness": float(claim_data.get('doc_verification_rate', 0)),
        "area_size": min(float(claim_data.get('forest_area_hectares', 0)) / 10.0, 1.0),
        "claim_type_weight": 0.8 if claim_data.get('claim_type') == 'Individual' else 0.9,
        "processing_time": max(0, 1.0 - (
            (datetime.now() - claim_data.get('submission_date', datetime.now())).days / 365
        ))
    }
    
    # Add additional factors
    factors.update(additional_factors)
    
    return factors

def generate_recommendation(factors: Dict[str, float]) -> tuple:
    """
    Generate AI recommendation based on factors
    """
    # Weighted scoring
    weights = {
        "document_completeness": 0.3,
        "environmental_impact": 0.25,
        "social_dependency": 0.25,
        "legal_compliance": 0.2
    }
    
    # Calculate weighted score
    total_score = 0
    total_weight = 0
    
    for factor, value in factors.items():
        weight = weights.get(factor, 0.1)
        total_score += value * weight
        total_weight += weight
    
    final_score = total_score / total_weight if total_weight > 0 else 0
    
    # Generate recommendation
    if final_score >= 0.8:
        recommendation = "APPROVE"
        confidence = final_score
        reasoning = [
            "High document completeness score",
            "Positive environmental and social factors",
            "Strong legal compliance indicators"
        ]
        risk_factors = []
    elif final_score >= 0.6:
        recommendation = "CONDITIONAL_APPROVE"
        confidence = final_score
        reasoning = [
            "Moderate overall score",
            "Some factors need attention",
            "Recommend additional verification"
        ]
        risk_factors = ["Requires field verification", "Monitor environmental impact"]
    else:
        recommendation = "REJECT"
        confidence = 1.0 - final_score
        reasoning = [
            "Low overall compliance score",
            "Significant concerns identified",
            "Insufficient documentation"
        ]
        risk_factors = ["Incomplete documentation", "Environmental concerns", "Legal compliance issues"]
    
    return recommendation, confidence, reasoning, risk_factors

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Document analysis endpoint
@app.post("/api/ai/analyze-document")
async def analyze_document(
    file: UploadFile = File(...),
    document_type: str = "general",
    token: str = Depends(verify_token)
):
    """
    Comprehensive document analysis combining OCR and NER
    """
    try:
        # First, extract text using OCR
        ocr_result = await process_ocr(file, extract_entities=False, token=token)
        
        if not ocr_result.success:
            raise HTTPException(status_code=500, detail="OCR processing failed")
        
        # Then, perform NER on extracted text
        ner_request = NERRequest(text=ocr_result.text, document_type=document_type)
        ner_result = await process_ner(ner_request, token=token)
        
        # Combine results
        return {
            "success": True,
            "ocr": {
                "text": ocr_result.text,
                "confidence": ocr_result.confidence
            },
            "entities": ner_result.entities if ner_result.success else {},
            "document_type": document_type,
            "processing_time": ocr_result.processing_time + ner_result.processing_time
        }
        
    except Exception as e:
        logger.error(f"Document analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
