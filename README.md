# Student Performance Predictor API (FastAPI)

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.main:app --reload
```

Open: http://127.0.0.1:8000

## Endpoints
- `GET /` health
- `POST /predict` -> risk_probability
- `POST /uncertainty` -> conformal-style uncertainty label
- `POST /recommend` -> actionable recommendations

## Docker
```bash
docker build -t student-risk-api .
docker run -p 8000:8000 student-risk-api
```
