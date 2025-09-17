#!/usr/bin/env python3
"""
Test script for FRA Atlas OCR service
"""

import requests
import json
from pathlib import Path
import time

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed")
            print(f"   OCR Ready: {data.get('ocr_ready', False)}")
            print(f"   NER Ready: {data.get('ner_ready', False)}")
            print(f"   Supported Languages: {', '.join(data.get('supported_languages', []))}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to OCR service. Is it running?")
        print("   Start it with: python start.py")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_languages_endpoint():
    """Test the languages endpoint"""
    try:
        response = requests.get("http://localhost:8000/languages")
        if response.status_code == 200:
            data = response.json()
            print("✅ Languages endpoint working")
            print(f"   Total languages: {data.get('total_count', 0)}")
            for code, name in data.get('language_names', {}).items():
                print(f"   {code}: {name}")
            return True
        else:
            print(f"❌ Languages endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Languages endpoint error: {e}")
        return False

def create_test_image():
    """Create a simple test image with text"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        import io
        
        # Create a simple image with text
        img = Image.new('RGB', (400, 200), color='white')
        draw = ImageDraw.Draw(img)
        
        # Try to use a default font, fallback to basic if not available
        try:
            font = ImageFont.truetype("arial.ttf", 24)
        except:
            font = ImageFont.load_default()
        
        # Add some test text
        text = "Forest Rights Claim\nApplicant: Ram Kumar\nArea: 2.5 hectares\nDate: 15/03/2024"
        draw.text((20, 20), text, fill='black', font=font)
        
        # Save to bytes
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        return img_bytes.getvalue()
    except Exception as e:
        print(f"⚠️  Could not create test image: {e}")
        return None

def test_ocr_processing():
    """Test OCR processing with a sample image"""
    print("\n🧪 Testing OCR processing...")
    
    # Create test image
    test_image = create_test_image()
    if not test_image:
        print("⚠️  Skipping OCR test - could not create test image")
        return False
    
    try:
        files = {'file': ('test.png', test_image, 'image/png')}
        
        print("   Uploading test image...")
        start_time = time.time()
        response = requests.post("http://localhost:8000/ocr/extract-text", files=files)
        processing_time = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print("✅ OCR processing successful")
            print(f"   Processing time: {processing_time:.2f}s")
            print(f"   Confidence: {data.get('confidence', 0):.2f}")
            print(f"   Extracted text: {data.get('extracted_text', '')[:100]}...")
            print(f"   Entities found: {len(data.get('entities', []))}")
            
            # Show some entities
            entities = data.get('entities', [])[:3]  # Show first 3 entities
            for entity in entities:
                print(f"     - {entity.get('type')}: {entity.get('value')} ({entity.get('confidence', 0):.2f})")
            
            return True
        else:
            print(f"❌ OCR processing failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ OCR processing error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 FRA Atlas OCR Service Test Suite")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 3
    
    # Test 1: Health check
    print("\n1. Testing health check endpoint...")
    if test_health_check():
        tests_passed += 1
    
    # Test 2: Languages endpoint
    print("\n2. Testing languages endpoint...")
    if test_languages_endpoint():
        tests_passed += 1
    
    # Test 3: OCR processing
    print("\n3. Testing OCR processing...")
    if test_ocr_processing():
        tests_passed += 1
    
    # Summary
    print(f"\n📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! OCR service is working correctly.")
    elif tests_passed > 0:
        print("⚠️  Some tests failed. Check the errors above.")
    else:
        print("❌ All tests failed. Please check your installation.")
        print("\nTroubleshooting:")
        print("1. Make sure the OCR service is running: python start.py")
        print("2. Check if all dependencies are installed: python install.py")
        print("3. Verify the service is accessible: curl http://localhost:8000/health")

if __name__ == "__main__":
    main()