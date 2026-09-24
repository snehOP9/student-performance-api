# Deployment Guide

The project is split into a Vite frontend and FastAPI backend.

## Frontend

Deploy `student-performance-predictor-pro/` to a Vercel project and configure:

```text
VITE_API_URL=<deployed-backend-url>
```

## Backend

Deploy the FastAPI application using `api.main:app` as the application entry point. The repository also contains `render.yaml` for the Render deployment configuration.

Set the backend environment variables before starting the service:

```text
DATABASE_URL
JWT_SECRET_KEY
FRONTEND_ORIGINS
FRONTEND_BASE_URL
```

## Post-deployment checks

1. Open `GET /` and confirm the API responds.
2. Open `GET /healthz` and confirm the service is ready.
3. Open `/docs` and verify the API documentation loads.
4. Test authentication before testing protected prediction endpoints.
5. Confirm the frontend points to the deployed API rather than localhost.

Never commit production secrets or `.env` files.