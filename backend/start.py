#!/usr/bin/env python3
"""
FRA Atlas OCR & NER Service Startup Script
"""

import uvicorn
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

def check_dependencies():
    """Check if required dependencies are installed"""
    missing_deps = []
    
    try:
        import easyocr
    except ImportError:
        missing_deps.append("easyocr")
    
    try:
        import spacy
    except ImportError:
        missing_deps.append("spacy")
    
    try:
        import cv2
    except ImportError:
        missing_deps.append("opencv-python")
    
    try:
        import PIL
    except ImportError:
        missing_deps.append("Pillow")
    
    # Check optional dependencies
    optional_missing = []
    try:
        import fitz
    except ImportError:
        optional_missing.append("PyMuPDF (PDF support)")
    
    if missing_deps:
        print(f"❌ Missing required dependencies: {', '.join(missing_deps)}")
        print("💡 Run 'python install.py' to install all dependencies")
        return False
    
    print("✅ All required dependencies found")
    if optional_missing:
        print(f"⚠️  Optional dependencies missing: {', '.join(optional_missing)}")
        print("   Install with: pip install PyMuPDF==1.23.14")
    
    return True

def main():
    """Start the OCR & NER service"""
    print("🚀 Starting FRA Atlas OCR & NER Service...")
    print("📋 Features:")
    print("   • Multi-language OCR with EasyOCR (English, Hindi, Marathi, Telugu, Tamil, Bengali)")
    print("   • Named Entity Recognition (NER)")
    print("   • Real-time processing status via WebSocket")
    print("   • Batch document processing")
    print("   • Advanced image preprocessing")
    print("   • PDF document support")
    print("")
    
    # Check dependencies
    if not check_dependencies():
        print("\n🛠️  Please install dependencies first:")
        print("   python install.py")
        sys.exit(1)
    
    print("🌐 Service will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("🧪 Test Service: python test_ocr.py")
    print("")
    
    try:
        uvicorn.run(
            "ocr:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n👋 Service stopped by user")
    except Exception as e:
        print(f"❌ Error starting service: {e}")
        print("\n🛠️  Troubleshooting:")
        print("1. Check if port 8000 is already in use")
        print("2. Verify all dependencies are installed: python install.py")
        print("3. Test the installation: python test_ocr.py")
        sys.exit(1)

if __name__ == "__main__":
    main()