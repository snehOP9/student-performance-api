# Student Performance Predictor API

FastAPI service for student dropout risk prediction using trained model artifacts.

## Repository

- GitHub: https://github.com/snehOP9/student-performance-api

## Live URL

- Vercel: https://student-performance-api-three.vercel.app/

## API Endpoints

- `GET /` → health check
- `GET /healthz` → readiness check (fails if model artifacts are not loaded)
- `POST /predict` → returns `risk_probability`
- `POST /uncertainty` → conformal prediction set + uncertainty label
- `POST /recommend` → top risk-reduction recommendations

## Local Setup

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
# optional: comma-separated list, example below
# $env:FRONTEND_ORIGINS="http://localhost:3000,https://your-ui-domain.com"
uvicorn api.main:app --reload
```

Open docs at:

- http://127.0.0.1:8000/docs

## Project Structure

- `api/main.py` → FastAPI app
- `artifacts/` → trained model + metadata files
- `app/main.py` → Streamlit app

## Notes

- Model files are loaded from `artifacts/` at startup.
- CORS origins are controlled with `FRONTEND_ORIGINS` environment variable.

## Deploy Dark UI on Render

This repo includes a Render Blueprint at `render.yaml` to deploy both:

- `student-performance-api` (FastAPI backend)
- `sri-center-ui` (Streamlit dark UI)

### Steps

1. Push this repo to GitHub.
2. In Render, choose **New +** → **Blueprint** and select this repository.
3. Render will create both services from `render.yaml`.
4. After first deploy, update `API_BASE` on the `sri-center-ui` service to your real API URL:

	- Example: `https://student-performance-api.onrender.com`

5. Redeploy `sri-center-ui` once after setting `API_BASE`.

The Streamlit app now reads API URL from environment (`API_BASE`) and defaults to `http://127.0.0.1:8000` for local development.