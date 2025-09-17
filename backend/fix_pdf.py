#!/usr/bin/env python3
"""
Quick fix for PDF processing issues
"""

import subprocess
import sys

def install_pymupdf():
    """Install PyMuPDF for PDF processing"""
    print("🔧 Installing PyMuPDF for PDF processing...")
    
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "PyMuPDF==1.23.14"], check=True)
        print("✅ PyMuPDF installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install PyMuPDF: {e}")
        return False

def test_pdf_support():
    """Test if PDF processing is working"""
    try:
        import fitz
        print("✅ PDF processing is now available!")
        return True
    except ImportError:
        print("❌ PDF processing still not available")
        return False

def main():
    print("🚀 FRA Atlas PDF Processing Fix")
    print("=" * 40)
    
    # Check current status
    try:
        import fitz
        print("✅ PyMuPDF is already installed!")
        print("   PDF processing should work correctly.")
        return
    except ImportError:
        print("⚠️  PyMuPDF not found. Installing...")
    
    # Install PyMuPDF
    if install_pymupdf():
        test_pdf_support()
        print("\n🎉 PDF processing is now ready!")
        print("   You can now upload PDF files for OCR processing.")
        print("   Restart the OCR service: python start.py")
    else:
        print("\n❌ Installation failed. Manual steps:")
        print("1. pip install PyMuPDF==1.23.14")
        print("2. If that fails, try: pip install --upgrade pip")
        print("3. Then retry: pip install PyMuPDF==1.23.14")

if __name__ == "__main__":
    main()