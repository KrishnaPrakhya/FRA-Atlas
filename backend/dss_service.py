#!/usr/bin/env python3
"""
Decision Support System Service for FRA Atlas
"""

from fastapi import HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime
import uuid
import logging
from ml_models import ml_models, initialize_models

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ClaimData(BaseModel):
    area_claimed: float
    family_size: int
    years_of_use: float
    documentation_score: float
    community_support: float
    environmental_impact: float
    legal_compliance: float
    distance_to_forest: float
    previous_violations: int
    land_type: str
    state: str
    season_applied: str
    claimant_name: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    claim_id: Optional[str] = None

class DSSService:
    """Decision Support System Service"""
    
    def __init__(self):
        self.models_initialized = False
    
    def ensure_models_loaded(self):
        """Ensure ML models are loaded"""
        if not self.models_initialized:
            logger.info("Initializing ML models...")
            initialize_models()
            self.models_initialized = True
            logger.info("ML models initialized successfully")
    
    def extract_features_from_ocr(self, ocr_result: Dict) -> Dict:
        """Extract claim features from OCR results"""
        extracted_text = ocr_result.get('extracted_text', '').lower()
        entities = ocr_result.get('entities', [])
        
        features = {
            'area_claimed': 2.0,
            'family_size': 4,
            'years_of_use': 20.0,
            'documentation_score': 0.7,
            'community_support': 0.8,
            'environmental_impact': 0.3,
            'legal_compliance': 0.8,
            'distance_to_forest': 2.0,
            'previous_violations': 0,
            'land_type': 'agricultural',
            'state': 'Jharkhand',
            'season_applied': 'winter'
        }
        
        # Extract information from entities
        for entity in entities:
            entity_type = entity.get('type', '').upper()
            entity_value = entity.get('value', '').lower()
            confidence = entity.get('confidence', 0)
            
            if confidence < 0.7:
                continue
            
            if entity_type == 'AREA':
                import re
                area_match = re.search(r'(\d+(?:\.\d+)?)', entity_value)
                if area_match:
                    area = float(area_match.group(1))
                    if 'hectare' in entity_value or 'ha' in entity_value:
                        features['area_claimed'] = area
                    elif 'acre' in entity_value:
                        features['area_claimed'] = area * 0.4047
            
            elif entity_type == 'PERSON':
                features['claimant_name'] = entity.get('value', '')
            
            elif entity_type in ['VILLAGE', 'LOCATION']:
                features['village'] = entity.get('value', '')
            
            elif entity_type == 'DISTRICT':
                features['district'] = entity.get('value', '')
        
        return features
    
    def analyze_claim(self, claim_data: ClaimData, ocr_result: Optional[Dict] = None):
        """Perform comprehensive claim analysis"""
        start_time = datetime.now()
        
        self.ensure_models_loaded()
        
        claim_dict = claim_data.dict()
        
        if ocr_result:
            ocr_features = self.extract_features_from_ocr(ocr_result)
            for key, value in ocr_features.items():
                if key not in claim_dict or claim_dict[key] is None:
                    claim_dict[key] = value
        
        prediction = ml_models.predict_decision(claim_dict)
        risk_assessment = ml_models.assess_risk(claim_dict)
        similar_cases = ml_models.find_similar_cases(claim_dict)
        reasoning = ml_models.generate_reasoning(claim_dict, prediction, risk_assessment)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return {
            'id': str(uuid.uuid4()),
            'claim_id': claim_data.claim_id or str(uuid.uuid4()),
            'recommended_action': prediction['recommended_action'],
            'confidence': prediction['confidence'],
            'reasoning': reasoning,
            'risk_factors': risk_assessment.get('risk_factors', []),
            'precedent_cases': similar_cases,
            'risk_score': risk_assessment['risk_score'],
            'risk_level': risk_assessment['risk_level'],
            'created_at': datetime.now().isoformat(),
            'processing_time': processing_time
        }

# Global DSS service instance
dss_service = DSSService()