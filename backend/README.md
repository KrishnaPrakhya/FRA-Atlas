# FRA Atlas OCR & NER Backend Service

Advanced document processing service with EasyOCR and Named Entity Recognition for the FRA Atlas project.

## Features

### 🔍 Advanced OCR Processing

- **Multi-language support**: English, Hindi, Marathi, Telugu, Tamil, Bengali, Gujarati, Kannada, Malayalam, Odia, Punjabi, Urdu
- **Image preprocessing**: Automatic contrast enhancement, sharpness adjustment, and noise reduction
- **High accuracy**: Optimized for forest rights documents and Indian languages
- **Batch processing**: Handle multiple documents simultaneously

### 🧠 Named Entity Recognition (NER)

- **Custom entities**: Person names, locations, dates, areas, phone numbers, villages, districts, survey numbers
- **Confidence scoring**: Each extracted entity comes with a confidence score
- **Verification workflow**: Manual verification and correction capabilities
- **Structured output**: Clean, structured data extraction from unstructured documents

### ⚡ Real-time Processing

- **WebSocket support**: Real-time status updates during processing
- **Progress tracking**: Detailed progress information with estimated completion times
- **Error handling**: Comprehensive error handling and recovery

### 📊 Analytics & Monitoring

- **Processing metrics**: Track processing times, accuracy, and throughput
- **Health monitoring**: Built-in health checks and system status
- **Performance optimization**: Optimized for speed and accuracy

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Install spaCy Language Model

```bash
python -m spacy download en_core_web_sm
```

## Usage

### Start the Service

```bash
# Using the startup script
python start.py

# Or directly with uvicorn
uvicorn ocr:app --host 0.0.0.0 --port 8000 --reload
```

The service will be available at:

- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### API Endpoints

#### POST /ocr/extract-text

Extract text and entities from a single document.

**Request:**

```bash
curl -X POST "http://localhost:8000/ocr/extract-text" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.jpg"
```

**Response:**

```json
{
  "id": "uuid",
  "document_id": "uuid",
  "extracted_text": "Full extracted text...",
  "confidence": 0.92,
  "language": "multi",
  "processing_time": 3.45,
  "entities": [
    {
      "id": "uuid",
      "type": "PERSON",
      "value": "राम कुमार शर्मा",
      "confidence": 0.95,
      "start_index": 45,
      "end_index": 60,
      "verified": false
    }
  ],
  "status": "completed",
  "created_at": "2024-03-15T10:30:00Z"
}
```

#### POST /ocr/batch-process

Process multiple documents in batch.

#### WebSocket /ws/{document_id}

Real-time processing status updates.

#### GET /health

Service health check.

## Entity Types

The system recognizes the following entity types:

| Type            | Description           | Example           |
| --------------- | --------------------- | ----------------- |
| `PERSON`        | Person names          | राम कुमार शर्मा   |
| `LOCATION`      | General locations     | Mumbai, Delhi     |
| `VILLAGE`       | Village names         | Village Ramgarh   |
| `DISTRICT`      | District names        | District Ranchi   |
| `DATE`          | Dates                 | 15/03/2024        |
| `AREA`          | Land areas            | 2.5 hectares      |
| `PHONE`         | Phone numbers         | +91 9876543210    |
| `SURVEY_NUMBER` | Survey numbers        | Survey No. 123/4  |
| `ORG`           | Organizations         | Forest Department |
| `GPE`           | Geopolitical entities | Jharkhand State   |

## Configuration

### Environment Variables

- `FASTAPI_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging level (debug/info/warning/error)
- `MAX_FILE_SIZE`: Maximum file size for uploads (default: 10MB)
- `PROCESSING_TIMEOUT`: Processing timeout in seconds (default: 300)

### Supported File Formats

- **Images**: JPEG, PNG, TIFF, BMP, WebP
- **Documents**: PDF (converted to images for processing)

## Performance Optimization

### Image Preprocessing

The service automatically optimizes images for better OCR accuracy:

- Contrast enhancement (1.2x)
- Sharpness adjustment (1.1x)
- Gaussian blur for noise reduction (0.5 radius)

### Memory Management

- Efficient memory usage with automatic cleanup
- Batch processing optimization
- Connection pooling for WebSocket connections

## Error Handling

The service provides comprehensive error handling:

- Invalid file format detection
- File size validation
- Processing timeout handling
- Memory overflow protection
- Network error recovery

## Monitoring

### Health Check Response

```json
{
  "status": "healthy",
  "ocr_ready": true,
  "ner_ready": true,
  "timestamp": "2024-03-15T10:30:00Z"
}
```

### Metrics

- Processing time per document
- Accuracy scores
- Entity extraction counts
- Error rates
- System resource usage

## Development

### Adding New Entity Types

1. Update the `patterns` dictionary in `extract_entities_with_ner()`
2. Add the new entity type to `entityTypeConfig` in the frontend
3. Update the documentation

### Custom NER Models

The service supports custom spaCy models for domain-specific entity recognition:

```python
# Load custom model
nlp = spacy.load("path/to/custom/model")
```

## Troubleshooting

### Common Issues

**1. spaCy model not found**

```bash
python -m spacy download en_core_web_sm
```

**2. Memory issues with large files**

- Reduce image resolution before processing
- Use batch processing for multiple files
- Increase system memory allocation

**3. Low OCR accuracy**

- Ensure good image quality (300+ DPI)
- Check image orientation
- Verify language settings match document content

### Logs

Service logs are available in the console output and can be configured for file output:

```python
import logging
logging.basicConfig(filename='ocr_service.log', level=logging.INFO)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

This project is part of the FRA Atlas system and follows the same licensing terms.
