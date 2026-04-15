# Student Performance Predictor Pro

Unified repository for:

- `api/` -> FastAPI backend for prediction, uncertainty, recommendations, and auth
- `artifacts/` -> model artifacts loaded by the backend at runtime
- `student-performance-predictor-pro/` -> Vite + React frontend used for local development and Vercel deployment

## Repository

- GitHub: https://github.com/snehOP9/student-performance-api

## API Endpoints

- `GET /` -> health check
- `GET /healthz` -> readiness check
- `POST /predict` -> returns risk probability and explanation
- `POST /uncertainty` -> returns confidence and uncertainty
- `POST /recommend` -> returns intervention recommendations
- `POST /auth/signup` -> creates a student or teacher account
- `POST /auth/login` -> returns access and refresh tokens
- `GET /auth/me` -> returns the current authenticated user

## Local Setup

### Backend

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
copy .env.example .env
uvicorn api.main:app --reload
```

Backend docs:

- http://127.0.0.1:8000/docs

### Frontend

```bash
cd student-performance-predictor-pro
copy .env.local.example .env.local
npm install
npm run dev -- --port 3000
```

## Deployment Split

- Vercel serves the Vite frontend from `student-performance-predictor-pro/`
- Render serves the FastAPI backend using `render.yaml`

### Required backend env

- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `FRONTEND_ORIGINS`
- `FRONTEND_BASE_URL`
- optional email and OAuth variables from `.env.example`

### Required frontend env

- `VITE_API_URL`

## Notes

- Local root `npm run dev` already starts the Vite frontend on `localhost:3000`
- Password hashing now uses a stable PBKDF2 flow and still supports legacy bcrypt hashes for existing accounts
- The repository is intentionally trimmed to the canonical Vercel frontend and backend paths only
