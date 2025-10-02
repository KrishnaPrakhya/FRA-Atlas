#!/usr/bin/env python3
"""
FRA Atlas OCR Backend Installation Script
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during {description}:")
        print(f"   Command: {command}")
        print(f"   Error: {e.stderr}")
        return False

def main():
    """Install all dependencies for the OCR backend"""
    print("🚀 FRA Atlas OCR Backend Installation")
    print("=" * 50)
    
    # Check Python version
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro} detected")
    
    # Install pip requirements
    if not run_command("pip install -r requirements.txt", "Installing Python packages"):
        print("⚠️  Some packages failed to install. Trying individual installation...")
        
        # Try installing critical packages individually
        critical_packages = [
            "fastapi==0.104.1",
            "uvicorn[standard]==0.24.0", 
            "easyocr==1.7.0",
            "opencv-python==4.8.1.78",
            "Pillow==10.1.0",
            "spacy==3.7.2",
            "pandas==2.0.3"
        ]
        
        optional_packages = [
            "PyMuPDF==1.23.14"  # For PDF processing
        ]
        
        for package in critical_packages:
            run_command(f"pip install {package}", f"Installing {package}")
        
        # Install optional packages
        print("\n📦 Installing optional packages...")
        for package in optional_packages:
            if not run_command(f"pip install {package}", f"Installing {package}"):
                print(f"⚠️  Optional package {package} failed to install. Some features may be limited.")
    
    # Apply EasyOCR patch for Pillow compatibility
    print("\n🩹 Applying EasyOCR patch...")
    patch_script_path = Path(__file__).parent / "fix_easyocr.py"
    if not run_command(f"python {patch_script_path}", "Patching EasyOCR for Pillow 10.x"):
        print("⚠️  EasyOCR patch failed to apply. The application may not run correctly.")

    # Install spaCy language model
    print("\n📚 Installing spaCy language model...")
    if not run_command("python -m spacy download en_core_web_sm", "Installing English language model"):
        print("⚠️  spaCy model installation failed. NER features may not work properly.")
    
    # Test EasyOCR installation
    print("\n🧪 Testing EasyOCR installation...")
    try:
        import easyocr
        # Test with supported languages only
        reader = easyocr.Reader(['en', 'hi'])
        print("✅ EasyOCR installation test passed")
    except Exception as e:
        print(f"❌ EasyOCR test failed: {e}")
        print("   This might be due to missing system dependencies")
        print("   On Ubuntu/Debian: sudo apt-get install libgl1-mesa-glx")
        print("   On CentOS/RHEL: sudo yum install mesa-libGL")
    
    # Test spaCy installation
    print("\n🧪 Testing spaCy installation...")
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        print("✅ spaCy installation test passed")
    except Exception as e:
        print(f"⚠️  spaCy test failed: {e}")
        print("   NER features will be limited")
    
    print("\n🎉 Installation completed!")
    print("\nNext steps:")
    print("1. Start the OCR service: python start.py")
    print("2. Test the service: http://localhost:8000/health")
    print("3. View API docs: http://localhost:8000/docs")

if __name__ == "__main__":
    main()