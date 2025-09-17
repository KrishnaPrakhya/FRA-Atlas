# FRA Atlas - Complete Setup Guide

This guide will help you set up the complete FRA Atlas system with EasyOCR document processing and Decision Support System (DSS).

## 🏗️ System Architecture

The FRA Atlas system consists of:

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Python FastAPI service with EasyOCR and NER
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Beautiful, responsive components with shadcn/ui

## 📋 Prerequisites

### System Requirements

- Node.js 18+ and npm/yarn
- Python 3.8+
- PostgreSQL 12+
- Git

### Hardware Requirements

- **Minimum**: 8GB RAM, 4 CPU cores
- **Recommended**: 16GB RAM, 8 CPU cores (for optimal OCR performance)

## 🚀 Installation Steps

### 1. Clone and Setup Frontend

```bash
# Clone the repository
git clone <repository-url>
cd fra-atlas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fra_atlas"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"

# API URLs
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_OCR_API_URL="http://localhost:8000"

# Optional: External services
OPENAI_API_KEY="your-openai-key"
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database (optional)
npm run db:seed
```

### 4. Setup Python OCR Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install spaCy language model
python -m spacy download en_core_web_sm
```

### 5. Start the Services

#### Terminal 1: Start Frontend

```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

#### Terminal 2: Start OCR Backend

```bash
cd backend
python start.py
```

Backend will be available at: http://localhost:8000

## 🎯 Features Overview

### 📄 Document Processing with EasyOCR

- **Multi-language OCR**: Supports 12+ Indian languages
- **Advanced NER**: Extracts entities like names, locations, dates, areas
- **Real-time processing**: WebSocket-based progress updates
- **Visual interface**: Beautiful UI for viewing results
- **Batch processing**: Handle multiple documents simultaneously

**Access**: http://localhost:3000/documents/processing

### 🧠 Decision Support System (DSS)

- **AI recommendations**: Data-driven decision suggestions
- **Risk assessment**: Comprehensive risk analysis
- **Precedent analysis**: Similar case comparisons
- **Visual analytics**: Interactive charts and dashboards
- **Transparent reasoning**: Explainable AI decisions

**Access**: http://localhost:3000/decision-support

### 🗺️ Spatial Data Management

- **Interactive maps**: Leaflet-based mapping
- **Boundary drawing**: Create and edit spatial boundaries
- **Area calculations**: Automatic area and perimeter calculations
- **Location search**: Geocoding and reverse geocoding

### 🔐 Authentication & Authorization

- **Role-based access**: Different permissions for different user types
- **Secure authentication**: JWT-based authentication
- **User management**: Complete user lifecycle management

## 🎨 UI Components

The system includes beautiful, responsive UI components:

### Document Processing Components

- `DocumentUploader`: Drag-and-drop file upload with progress
- `OCRResultsDisplay`: Interactive results viewer with entity highlighting
- `EntityVisualizationPanel`: Color-coded entity display
- `ProcessingStatusIndicator`: Real-time progress tracking

### Decision Support Components

- `DecisionSupportDashboard`: Comprehensive analysis dashboard
- `RecommendationEngine`: AI-powered recommendations
- `RiskAssessmentPanel`: Visual risk analysis
- `PrecedentCaseViewer`: Historical case comparisons

## 🔧 Configuration

### OCR Service Configuration

Edit `backend/ocr.py` to customize:

```python
# Supported languages
reader = easyocr.Reader(['en', 'hi', 'mr', 'te', 'ta', 'bn', 'gu', 'kn', 'ml', 'or', 'pa', 'ur'])

# Custom entity patterns
patterns = {
    "AREA": r'(\d+(?:\.\d+)?)\s*(?:hectares?|acres?|sq\.?\s*(?:km|m|ft))',
    "VILLAGE": r'\b(?:Village|Gram|Gaon)\s+([A-Za-z\s]+)\b',
    # Add more patterns as needed
}
```

### Frontend Configuration

Customize UI themes in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
    },
  },
};
```

## 📊 Usage Examples

### 1. Processing Documents

1. Navigate to http://localhost:3000/documents/processing
2. Upload documents using drag-and-drop
3. Watch real-time processing progress
4. View extracted text and entities
5. Verify and edit results as needed

### 2. Using Decision Support

1. Navigate to http://localhost:3000/decision-support
2. Review AI recommendations
3. Analyze risk factors and precedent cases
4. Make informed decisions with transparent reasoning

### 3. API Usage

```javascript
// Upload document for OCR processing
const formData = new FormData();
formData.append("file", file);

const response = await fetch("http://localhost:8000/ocr/extract-text", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log("OCR Result:", result);
```

## 🐛 Troubleshooting

### Common Issues

**1. OCR Service Not Starting**

```bash
# Check Python version
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Install spaCy model
python -m spacy download en_core_web_sm
```

**2. Database Connection Issues**

```bash
# Check PostgreSQL status
pg_ctl status

# Reset database
npx prisma db push --force-reset
```

**3. Frontend Build Issues**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**4. Memory Issues with Large Files**

- Reduce image resolution before upload
- Use batch processing for multiple files
- Increase system memory allocation

### Performance Optimization

**OCR Performance:**

- Use high-quality images (300+ DPI)
- Ensure proper image orientation
- Preprocess images for better contrast

**Frontend Performance:**

- Enable Next.js image optimization
- Use lazy loading for components
- Implement proper caching strategies

## 📈 Monitoring

### Health Checks

- Frontend: http://localhost:3000/api/health
- OCR Backend: http://localhost:8000/health

### Logs

- Frontend logs: Available in browser console and terminal
- Backend logs: Available in terminal where OCR service is running

## 🔒 Security

### Best Practices

- Use strong JWT secrets
- Implement proper CORS policies
- Validate all file uploads
- Sanitize user inputs
- Use HTTPS in production

### File Upload Security

- File type validation
- Size limits (default: 10MB)
- Virus scanning (recommended for production)
- Secure file storage

## 🚀 Deployment

### Production Deployment

**Frontend (Vercel/Netlify):**

```bash
npm run build
npm start
```

**Backend (Docker):**

```dockerfile
FROM python:3.9-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "start.py"]
```

**Database (PostgreSQL):**

- Use managed database services (AWS RDS, Google Cloud SQL)
- Set up proper backups and monitoring

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [EasyOCR Documentation](https://github.com/JaidedAI/EasyOCR)
- [spaCy Documentation](https://spacy.io/usage)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 You're All Set!

Your FRA Atlas system is now ready with:

- ✅ Advanced OCR document processing
- ✅ AI-powered decision support
- ✅ Beautiful, responsive UI
- ✅ Real-time processing updates
- ✅ Comprehensive analytics

Visit http://localhost:3000 to start using the system!
