# 🚀 Quick Start Guide - FRA Atlas OCR & DSS

Get up and running with the FRA Atlas system in just a few minutes!

## 🔧 Prerequisites

- **Node.js 18+** and npm
- **Python 3.8+** and pip
- **Git**

## ⚡ Quick Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Setup OCR Backend

```bash
cd backend

# Install Python dependencies
python install.py

# Test the installation
python test_ocr.py
```

### 3. Start the Services

**Terminal 1 - Start OCR Backend:**

```bash
cd backend
python start.py
```

**Terminal 2 - Start Frontend:**

```bash
npm run dev
```

## 🎯 Access the Features

- **Main Dashboard**: http://localhost:3000
- **Document Processing**: http://localhost:3000/documents/processing
- **Decision Support**: http://localhost:3000/decision-support
- **OCR API Docs**: http://localhost:8000/docs

## 🧪 Test Everything Works

1. **Test OCR Backend:**

   ```bash
   cd backend
   python test_ocr.py
   ```

2. **Test Document Upload:**

   - Go to http://localhost:3000/documents/processing
   - Upload an image or PDF with text
   - Watch real-time processing

3. **Test Decision Support:**
   - Go to http://localhost:3000/decision-support
   - View the demo analysis with AI recommendations

## 🐛 Common Issues & Solutions

### ❌ "Cannot connect to OCR service"

**Solution:** Make sure the backend is running on port 8000

```bash
cd backend
python start.py
```

### ❌ EasyOCR language error

**Solution:** The languages have been fixed to supported ones only:

- English (en)
- Hindi (hi)
- Marathi (mr)
- Telugu (te)
- Tamil (ta)
- Bengali (bn)

### ❌ spaCy model not found

**Solution:** Install the English model:

```bash
python -m spacy download en_core_web_sm
```

### ❌ PDF processing fails

**Solution:** Install PyMuPDF:

```bash
pip install PyMuPDF==1.23.14
```

### ❌ Port 8000 already in use

**Solution:** Kill the process or use a different port:

```bash
# Kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Kill process on port 8000 (Linux/Mac)
lsof -ti:8000 | xargs kill -9
```

## 🎨 Features Overview

### 📄 Document Processing

- **Multi-language OCR** with EasyOCR
- **Real-time progress** updates
- **Entity extraction** (names, dates, locations, areas)
- **PDF support** with automatic conversion
- **Batch processing** for multiple files

### 🧠 Decision Support System

- **AI recommendations** with confidence scores
- **Risk assessment** with mitigation strategies
- **Precedent analysis** for similar cases
- **Transparent reasoning** with explainable AI
- **Interactive dashboards** with visual analytics

### 🎯 Key Benefits

- **Visual appeal**: Modern, responsive UI
- **Real-time updates**: WebSocket integration
- **Multi-language**: Support for Indian languages
- **Production ready**: Comprehensive error handling
- **Easy setup**: Automated installation scripts

## 📚 Next Steps

1. **Customize entities**: Edit `backend/ocr.py` to add custom patterns
2. **Add languages**: Extend supported languages (check EasyOCR docs)
3. **Deploy**: Use the deployment guides in `SETUP_GUIDE.md`
4. **Integrate**: Connect with your existing systems via APIs

## 🆘 Need Help?

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Test Suite**: `python backend/test_ocr.py`
- **Full Setup Guide**: See `SETUP_GUIDE.md`

---

## 🎉 You're Ready!

Your FRA Atlas system is now running with:
✅ Advanced OCR processing  
✅ AI-powered decision support  
✅ Beautiful, responsive UI  
✅ Real-time processing updates

Happy processing! 🚀
