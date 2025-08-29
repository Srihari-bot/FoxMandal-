# FOXMandal

A comprehensive document processing application with OCR, translation, and PDF processing capabilities.

## Project Structure

```
FOXMandal/
├── backend/          # FastAPI backend
│   ├── main.py       # Main API application
│   ├── app.py        # Additional app configuration
│   ├── requirements.txt
│   ├── config.env    # Environment variables
│   └── README.md     # Backend documentation
├── frontend/         # React frontend
│   ├── App.jsx       # Main React component
│   ├── App.css       # Styles
│   ├── index.js      # Entry point
│   ├── index.html    # HTML template
│   ├── package.json  # Node.js dependencies
│   └── README.md     # Frontend documentation
├── venv/             # Python virtual environment
└── README.md         # This file
```

## Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Tesseract OCR:**
   - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
   - Or use Chocolatey: `choco install tesseract`

4. **Start the backend:**
   ```bash
   python main.py
   ```

The backend will be available at: http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm start
   ```

The frontend will be available at: http://localhost:3000

## Features

- **OCR Processing**: Extract text from images and PDFs
- **Translation**: Multi-language text translation
- **PDF Processing**: Convert and process PDF documents
- **Image Processing**: Advanced image manipulation
- **File Upload**: Drag-and-drop file upload interface
- **Real-time Processing**: Live feedback and progress tracking

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

- Backend: FastAPI with Python
- Frontend: React with modern JavaScript
- Database: SQLAlchemy (if needed)
- File Processing: PyMuPDF, Tesseract, OpenCV

## Environment Variables

Configure your environment variables in `backend/config.env`:
- API keys
- Database connections
- External service configurations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 
