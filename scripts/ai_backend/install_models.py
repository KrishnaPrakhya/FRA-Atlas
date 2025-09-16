"""
Script to download and install required AI models
"""

import spacy
import subprocess
import sys
from transformers import pipeline
import os

def install_spacy_model():
    """Install spaCy English model"""
    try:
        print("Installing spaCy English model...")
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
        print("✓ spaCy model installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install spaCy model: {e}")

def download_transformers_models():
    """Download required transformer models"""
    models = [
        "cardiffnlp/twitter-roberta-base-sentiment-latest",
        "microsoft/DialoGPT-medium"
    ]
    
    for model_name in models:
        try:
            print(f"Downloading {model_name}...")
            pipeline("text-classification", model=model_name)
            print(f"✓ {model_name} downloaded successfully")
        except Exception as e:
            print(f"✗ Failed to download {model_name}: {e}")

def setup_tesseract():
    """Setup instructions for Tesseract OCR"""
    print("\n" + "="*50)
    print("TESSERACT OCR SETUP INSTRUCTIONS")
    print("="*50)
    print("Please install Tesseract OCR on your system:")
    print("\nUbuntu/Debian:")
    print("  sudo apt-get install tesseract-ocr")
    print("\nmacOS:")
    print("  brew install tesseract")
    print("\nWindows:")
    print("  Download from: https://github.com/UB-Mannheim/tesseract/wiki")
    print("\nAfter installation, make sure 'tesseract' is in your PATH")
    print("="*50)

if __name__ == "__main__":
    print("Setting up AI models for FRA Atlas...")
    
    install_spacy_model()
    download_transformers_models()
    setup_tesseract()
    
    print("\n✓ Model setup complete!")
    print("Run 'python main.py' to start the AI backend server")
