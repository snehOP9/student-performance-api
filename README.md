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

## Student UI (Next.js) — Dynamic form + proxy (no CORS headaches)

This repo includes a `student-ui/` Next.js app that:
- loads the FastAPI OpenAPI schema from `/openapi.json`
- renders a dynamic form for `StudentInput`
- calls FastAPI endpoints via Next.js route-handlers (`/api/*`) to avoid browser CORS issues

### Run locally (recommended)

1) Start the API:

```bash
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

2) Start the UI:

```bash
cd student-ui
cp .env.local.example .env.local
# edit .env.local if needed
npm install
npm run dev
```

Open: http://localhost:3000

### Deploy

- API: Render (or any Python host). If calling API directly from a browser, set `FRONTEND_ORIGINS` env var on the API (comma-separated).
- UI: Vercel (or any Node host). Set `API_BASE` env var in Vercel project settings.
