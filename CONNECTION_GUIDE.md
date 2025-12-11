# Backend-Frontend Connection Guide

This guide explains how to connect and run the BookingAI backend (Django) and frontend (React/Vite) together.

## Architecture Overview

- **Backend**: Django REST API running on `http://localhost:8000`
- **Frontend**: React + Vite application running on `http://localhost:3000`
- **Connection**: Frontend communicates with backend via HTTP requests

## Prerequisites

### Backend Requirements
- Python 3.8+
- Django 4.2+
- django-cors-headers (for CORS support)
- requests (for external API calls)

### Frontend Requirements
- Node.js 18+
- npm or yarn

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/bookingai
```

2. Create and activate a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install django django-cors-headers requests
```

4. Run migrations:
```bash
python manage.py migrate
```

5. (Optional) Create a superuser:
```bash
python manage.py createsuperuser
```

6. Set environment variable for Gemini API (if using AI features):
```bash
export GEMINI_API_KEY="your-api-key-here"  # On Windows: set GEMINI_API_KEY=your-api-key-here
```

7. Start the Django development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file for custom API URL:
```bash
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

4. Start the Vite development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Connection Configuration

### Backend CORS Settings

The backend is configured to accept requests from:
- `http://localhost:3000` (Vite default port)
- `http://127.0.0.1:3000`
- `http://localhost:5173` (Vite alternative port)
- `http://127.0.0.1:5173`

This is configured in `backend/bookingai/bookingai/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### Frontend API Configuration

The frontend API client is configured in `frontend/src/lib/api.ts`:
- Default API base URL: `http://localhost:8000`
- Can be overridden with environment variable: `VITE_API_BASE_URL`

### Vite Proxy Configuration

The Vite dev server has a proxy configured in `frontend/vite.config.ts`:
- All requests to `/api/*` are proxied to `http://localhost:8000/api/*`
- This allows you to use relative URLs in the frontend

## Available API Endpoints

### Health Check
- **URL**: `GET /api/health/`
- **Description**: Check if backend is running
- **Response**: `{"status": "ok", "message": "Backend is running", "service": "BookingAI API"}`

### Gemini AI Chat
- **URL**: `POST /api/gemini/generate/`
- **Description**: Generate AI responses using Gemini API
- **Request Body**: `{"prompt": "your question here"}`
- **Response**: Gemini API response with generated content

## Testing the Connection

### Method 1: Using the Health Check Endpoint

1. Start both servers (backend and frontend)
2. Open browser console in the frontend
3. Run:
```javascript
import { checkBackendHealth } from './lib/api';
checkBackendHealth().then(console.log).catch(console.error);
```

### Method 2: Using Browser DevTools

1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to the frontend application
4. Try using a feature that calls the backend (e.g., AI Chat)
5. Check if requests to `http://localhost:8000/api/*` are successful

### Method 3: Using curl

Test the backend directly:
```bash
curl http://localhost:8000/api/health/
```

Expected response:
```json
{"status":"ok","message":"Backend is running","service":"BookingAI API"}
```

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
1. Verify the frontend URL is in `CORS_ALLOWED_ORIGINS` in `settings.py`
2. Make sure `corsheaders` is in `INSTALLED_APPS`
3. Make sure `CorsMiddleware` is in `MIDDLEWARE` (should be near the top)
4. Restart the Django server after making changes

### Connection Refused

If you see "Connection refused" errors:
1. Verify the backend server is running on port 8000
2. Check if port 8000 is not being used by another application
3. Verify `ALLOWED_HOSTS` in `settings.py` includes `localhost` and `127.0.0.1`

### 404 Not Found

If API endpoints return 404:
1. Verify the URL pattern in `backend/bookingai/api/urls.py`
2. Check that the URL is included in the main `urls.py`
3. Verify the request path matches the URL pattern exactly

### Environment Variables

If Gemini API calls fail:
1. Verify `GEMINI_API_KEY` environment variable is set
2. Restart the Django server after setting the variable
3. Check the backend logs for error messages

## Running Both Servers

### Option 1: Two Terminal Windows

**Terminal 1 (Backend):**
```bash
cd backend/bookingai
python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Option 2: Using a Process Manager

You can use tools like `concurrently` or `foreman` to run both servers together.

## Production Considerations

For production deployment:
1. Update `ALLOWED_HOSTS` with your production domain
2. Update `CORS_ALLOWED_ORIGINS` with your frontend domain
3. Set `DEBUG = False` in production
4. Use environment variables for sensitive configuration
5. Configure proper CORS headers for your production domain
6. Use HTTPS in production

## Additional Resources

- [Django CORS Headers Documentation](https://github.com/adamchainz/django-cors-headers)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)
- [Django REST Framework](https://www.django-rest-framework.org/)

