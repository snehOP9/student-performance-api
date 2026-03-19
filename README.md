# Student Performance Predictor API

FastAPI service for student dropout risk prediction using trained model artifacts.

## Repository

- GitHub: https://github.com/snehOP9/student-performance-api

## Live URL

- Vercel: https://student-performance-api-three.vercel.app/

## API Endpoints

- `GET /` → health check
- `POST /predict` → returns `risk_probability`
- `POST /uncertainty` → conformal prediction set + uncertainty label
- `POST /recommend` → top risk-reduction recommendations

## Local Setup

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
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