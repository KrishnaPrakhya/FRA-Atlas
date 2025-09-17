#!/usr/bin/env python3
"""
Initialize FRA Atlas System - Train ML Models and Setup
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        'fastapi', 'uvicorn', 'easyocr', 'opencv-python', 'Pillow', 
        'spacy', 'scikit-learn', 'pandas', 'numpy', 'joblib'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        logger.error(f"Missing packages: {', '.join(missing_packages)}")
        logger.info("Run 'python install.py' to install missing dependencies")
        return False
    
    logger.info("All required dependencies are installed")
    return True

def download_spacy_model():
    """Download spaCy English model if not present"""
    try:
        import spacy
        spacy.load("en_core_web_sm")
        logger.info("spaCy English model already available")
        return True
    except OSError:
        logger.info("Downloading spaCy English model...")
        try:
            subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"], check=True)
            logger.info("spaCy English model downloaded successfully")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to download spaCy model: {e}")
            return False

def initialize_ml_models():
    """Initialize and train ML models"""
    logger.info("Initializing ML models...")
    
    try:
        from ml_models import ml_models
        
        # Check if models already exist
        models_dir = Path("models")
        if models_dir.exists() and any(models_dir.glob("*.pkl")):
            logger.info("Existing ML models found, loading...")
            if ml_models.load_models():
                logger.info("ML models loaded successfully")
                return True
        
        # Train new models
        logger.info("Training new ML models (this may take a few minutes)...")
        ml_models.train_all_models()
        logger.info("ML models trained and saved successfully")
        return True
        
    except Exception as e:
        logger.error(f"Failed to initialize ML models: {e}")
        return False

def test_ocr_service():
    """Test OCR service functionality"""
    logger.info("Testing OCR service...")
    
    try:
        import easyocr
        
        # Test EasyOCR initialization
        reader = easyocr.Reader(['en', 'hi'])
        logger.info("EasyOCR initialized successfully")
        
        # Test with supported languages
        supported_langs = ['en', 'hi', 'mr', 'te', 'ta', 'bn']
        reader = easyocr.Reader(supported_langs)
        logger.info(f"OCR service ready with languages: {', '.join(supported_langs)}")
        
        return True
        
    except Exception as e:
        logger.error(f"OCR service test failed: {e}")
        return False

def test_dss_service():
    """Test DSS service functionality"""
    logger.info("Testing DSS service...")
    
    try:
        from dss_service import dss_service, ClaimData
        
        # Create test claim data
        test_claim = ClaimData(
            area_claimed=2.5,
            family_size=5,
            years_of_use=30,
            documentation_score=0.8,
            community_support=0.9,
            environmental_impact=0.3,
            legal_compliance=0.85,
            distance_to_forest=1.5,
            previous_violations=0,
            land_type='agricultural',
            state='Jharkhand',
            season_applied='winter'
        )
        
        # Test analysis
        recommendation = dss_service.analyze_claim(test_claim)
        logger.info(f"DSS test successful - Recommendation: {recommendation['recommended_action']}")
        
        return True
        
    except Exception as e:
        logger.error(f"DSS service test failed: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    directories = ['models', 'uploads', 'logs']
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        logger.info(f"Directory '{directory}' ready")

def main():
    """Main initialization function"""
    logger.info("🚀 Initializing FRA Atlas System")
    logger.info("=" * 50)
    
    # Step 1: Check dependencies
    if not check_dependencies():
        logger.error("❌ Dependency check failed")
        sys.exit(1)
    
    # Step 2: Create directories
    create_directories()
    
    # Step 3: Download spaCy model
    if not download_spacy_model():
        logger.warning("⚠️  spaCy model download failed - NER features may be limited")
    
    # Step 4: Initialize ML models
    if not initialize_ml_models():
        logger.error("❌ ML model initialization failed")
        sys.exit(1)
    
    # Step 5: Test OCR service
    if not test_ocr_service():
        logger.error("❌ OCR service test failed")
        sys.exit(1)
    
    # Step 6: Test DSS service
    if not test_dss_service():
        logger.error("❌ DSS service test failed")
        sys.exit(1)
    
    logger.info("🎉 FRA Atlas System initialized successfully!")
    logger.info("")
    logger.info("Next steps:")
    logger.info("1. Start the backend service: python start.py")
    logger.info("2. Start the frontend: npm run dev")
    logger.info("3. Access the application: http://localhost:3000")
    logger.info("")
    logger.info("Available endpoints:")
    logger.info("- OCR + DSS Analysis: POST /analyze-claim")
    logger.info("- OCR Only: POST /ocr/extract-text")
    logger.info("- DSS Only: POST /dss/analyze")
    logger.info("- Health Check: GET /health")
    logger.info("- API Documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main()