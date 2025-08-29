# FOXMandal Frontend

This is the frontend application for FOXMandal built with React.

## Features

- React-based user interface
- File upload and processing
- OCR functionality
- Translation services
- PDF processing
- Image processing

## Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Configure API endpoint:**
   - The app is configured to proxy requests to `http://localhost:8000` (backend)
   - Make sure the backend is running before starting the frontend

## Running the Frontend

```bash
# Development with React Scripts
npm start

# Or with Vite (faster development)
npm run dev
```

The application will be available at:
- React Scripts: http://localhost:3000
- Vite: http://localhost:5173

## Building for Production

```bash
# Build with React Scripts
npm run build

# Or with Vite
npm run build:vite
```

## Project Structure

- `App.jsx` - Main application component
- `App.css` - Main styles
- `index.js` - Application entry point
- `index.css` - Global styles
- `index.html` - HTML template
- `*.png` - Application images and logos 