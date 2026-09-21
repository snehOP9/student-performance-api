# API Guide

The API is served by FastAPI and exposes prediction, uncertainty, recommendation, and authentication routes.

## Health

### `GET /`

Use this endpoint to confirm that the API process is responding.

### `GET /healthz`

Use this endpoint for readiness/health checks.

## Prediction

### `POST /predict`

Returns a student risk prediction and explanation.

Use the interactive OpenAPI page at `/docs` to inspect the current request schema before sending a request. This keeps client code aligned with the backend's validated model fields.

## Uncertainty

### `POST /uncertainty`

Returns confidence and uncertainty information associated with the prediction workflow.

## Recommendations

### `POST /recommend`

Returns intervention recommendations based on the prediction inputs and model output.

## Authentication

### `POST /auth/signup`

Creates a student or teacher account.

### `POST /auth/login`

Authenticates an account and returns access/refresh tokens.

### `GET /auth/me`

Returns the currently authenticated user's profile.

## Local API docs

After starting FastAPI:

```text
http://127.0.0.1:8000/docs
```

The OpenAPI interface is the source of truth for request and response schemas.
