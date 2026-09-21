# Student Performance Predictor Pro

An end-to-end student-risk prediction platform combining **FastAPI + machine learning + uncertainty reporting + recommendations + authentication + React**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black)](https://student-performance-predictor-pro-w.vercel.app/)
[![API](https://img.shields.io/badge/API-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Language](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)

> **Goal:** detect academic risk early and turn model output into an actionable intervention workflow.

## ✨ Features

- 📊 Student performance risk prediction
- 🔎 Prediction explanations
- 📐 Confidence and uncertainty reporting
- 💡 Intervention recommendations
- 🔐 Student/teacher authentication
- ⚡ Vite + React frontend
- 🚀 FastAPI backend with separate deployment
- 🧪 Dedicated test suite
- 📚 Documented model-change workflow

## 🧩 Architecture

```text
┌──────────────────────────┐
│      React / Vite UI     │
│     Student Dashboard    │
└────────────┬─────────────┘
             │ HTTP / JSON
             ▼
┌──────────────────────────┐
│          FastAPI         │
│ Prediction + Auth + API  │
└──────┬─────────┬─────────┘
       │         │
       ▼         ▼
   ML models   Database
       │
       ▼
Recommendations + explanations
```

## 🔌 API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Basic health response |
| GET | `/healthz` | Readiness/health check |
| POST | `/predict` | Predict academic risk and explanation |
| POST | `/uncertainty` | Return confidence and uncertainty |
| POST | `/recommend` | Generate intervention recommendations |
| POST | `/auth/signup` | Create a student or teacher account |
| POST | `/auth/login` | Authenticate and return tokens |
| GET | `/auth/me` | Return the authenticated user |

After starting the backend, open:

`http://127.0.0.1:8000/docs`

FastAPI's OpenAPI page is the source of truth for current request and response schemas.

## 📁 Repository layout

```text
api/                                  FastAPI application
artifacts/                            Runtime ML artifacts
docs/                                 Engineering and model documentation
student-performance-predictor-pro/    Vite + React frontend
tests/                                Automated tests
Dockerfile                            Container configuration
render.yaml                           Render deployment configuration
requirements.txt                      Python dependencies
```

## 🛠️ Local setup

### Backend

```bash
python -m venv .venv
pip install -r requirements.txt
```

Windows PowerShell:

```powershell
.venv\\Scripts\\Activate.ps1
copy .env.example .env
```

Start the API:

```bash
uvicorn api.main:app --reload
```

### Frontend

```bash
cd student-performance-predictor-pro
copy .env.local.example .env.local
npm install
npm run dev -- --port 3000
```

Set `VITE_API_URL` to the backend URL.

## 🚀 Deployment

- **Frontend:** Vercel
- **Backend:** Render

The repository includes deployment configuration for both surfaces.

Backend configuration uses variables such as:

- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `FRONTEND_ORIGINS`
- `FRONTEND_BASE_URL`

Frontend configuration uses:

- `VITE_API_URL`

See `.env.example` for the complete backend configuration.

## 🔐 Security

Never commit real secrets, production credentials, tokens, OAuth credentials, or real student records.

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## 🤝 Contributing

Contributions that improve correctness, usability, reliability, documentation, testing, or model transparency are welcome.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## 📖 Documentation

- [API Guide](docs/API.md)
- [Model Change Checklist](docs/MODEL-CHANGE-CHECKLIST.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)

## 🌐 Links

- **Live demo:** https://student-performance-predictor-pro-w.vercel.app/
- **Portfolio:** https://snehraunak.in
- **Repository:** https://github.com/snehOP9/student-performance-api

If this project is useful to you, sharing it with someone working on ML, education technology, or FastAPI can help the project reach more developers.
