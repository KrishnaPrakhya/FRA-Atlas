# 🔌 API Documentation

## **Base URLs**

- **Development**: `http://localhost:8000`
- **Production**: `https://api.fra-atlas.gov.in`

## **Authentication**

### **JWT Token Authentication**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "official"
  }
}
```

### **Authorization Header**

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## **OCR & Document Processing**

### **Single Document OCR**

```http
POST /ocr/extract-text
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: [binary file data]

Response:
{
  "id": "uuid",
  "document_id": "uuid",
  "extracted_text": "Full extracted text content...",
  "confidence": 0.92,
  "language": "multi",
  "processing_time": 3.45,
  "bounding_boxes": [
    {
      "x": 100,
      "y": 200,
      "width": 300,
      "height": 50
    }
  ],
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

### **Complete Analysis (OCR + DSS)**

```http
POST /analyze-claim
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: [binary file data]

Response:
{
  "analysis_id": "uuid",
  "document_id": "uuid",
  "ocr_result": {
    // OCR response object
  },
  "dss_recommendation": {
    "id": "uuid",
    "recommended_action": "approve",
    "confidence": 0.87,
    "reasoning": [
      "Strong documentation provided with all required documents",
      "Traditional use evidence spans over 40 years",
      "Community support confirmed through gram sabha approval"
    ],
    "risk_score": 0.23,
    "risk_level": "low",
    "risk_factors": [
      {
        "type": "Environmental Impact",
        "severity": "low",
        "description": "Minimal environmental concerns identified",
        "mitigation": "Regular monitoring recommended"
      }
    ],
    "precedent_cases": [
      {
        "id": "case-001",
        "similarity": 0.92,
        "outcome": "approved",
        "summary": "Similar claim approved in same region"
      }
    ]
  },
  "total_processing_time": 5.67,
  "status": "completed"
}
```

### **Batch Processing**

```http
POST /ocr/batch-process
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- files: [multiple binary files]

Response:
{
  "batch_id": "uuid",
  "processed_count": 5,
  "total_count": 5,
  "results": [
    // Array of OCR results
  ],
  "processing_time": 18.45,
  "status": "completed"
}
```

## **Decision Support System**

### **DSS Analysis Only**

```http
POST /dss/analyze
Content-Type: application/json
Authorization: Bearer {token}

{
  "area_claimed": 2.5,
  "family_size": 5,
  "years_of_use": 30,
  "documentation_score": 0.8,
  "community_support": 0.9,
  "environmental_impact": 0.3,
  "legal_compliance": 0.85,
  "distance_to_forest": 1.5,
  "previous_violations": 0,
  "land_type": "agricultural",
  "state": "Jharkhand",
  "season_applied": "winter",
  "claimant_name": "Ram Kumar Sharma",
  "village": "Ramgarh",
  "district": "Ranchi"
}

Response:
{
  "id": "uuid",
  "recommended_action": "approve",
  "confidence": 0.87,
  "reasoning": [...],
  "risk_assessment": {...},
  "precedent_cases": [...],
  "processing_time": 1.23
}
```

## **Claims Management**

### **Create Claim**

```http
POST /api/claims
Content-Type: application/json
Authorization: Bearer {token}

{
  "claimantName": "Ram Kumar Sharma",
  "villageName": "Ramgarh",
  "district": "Ranchi",
  "state": "Jharkhand",
  "areaRequested": 2.5,
  "landType": "agricultural",
  "traditionalUse": "farming and grazing",
  "yearsOfUse": 30,
  "familySize": 5,
  "documents": [
    {
      "type": "identity_proof",
      "url": "/uploads/identity.pdf"
    }
  ]
}

Response:
{
  "id": "uuid",
  "claimNumber": "FRA-2024-001",
  "status": "submitted",
  "submissionDate": "2024-03-15T10:30:00Z",
  "estimatedProcessingTime": 21
}
```

### **Get Claims List**

```http
GET /api/claims?page=1&limit=10&status=pending&district=Ranchi
Authorization: Bearer {token}

Response:
{
  "claims": [
    {
      "id": "uuid",
      "claimNumber": "FRA-2024-001",
      "claimantName": "Ram Kumar Sharma",
      "villageName": "Ramgarh",
      "district": "Ranchi",
      "status": "pending",
      "submissionDate": "2024-03-15T10:30:00Z",
      "areaRequested": 2.5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16
  }
}
```

## **Analytics & Reporting**

### **Dashboard Statistics**

```http
GET /api/analytics/dashboard
Authorization: Bearer {token}

Response:
{
  "totalClaims": 1247,
  "pendingClaims": 89,
  "approvedClaims": 913,
  "rejectedClaims": 187,
  "approvalRate": 73.2,
  "avgProcessingTime": 18.5,
  "monthlyTrend": {
    "submissions": [120, 135, 148, 162],
    "approvals": [85, 95, 110, 125]
  }
}
```

### **Regional Analytics**

```http
GET /api/analytics/regional?state=Jharkhand&timeframe=12months
Authorization: Bearer {token}

Response:
{
  "stateData": {
    "totalClaims": 285,
    "approvalRate": 75.4,
    "avgProcessingTime": 17.2
  },
  "districtBreakdown": [
    {
      "district": "Ranchi",
      "claims": 85,
      "approvalRate": 78.2
    }
  ]
}
```
