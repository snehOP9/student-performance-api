# Contributing

Thanks for improving Student Performance Predictor Pro.

## Development setup

### Backend

```bash
python -m venv .venv
```

Activate the environment:

```powershell
.venv\Scripts\Activate.ps1
```

Then install dependencies and create your local environment file:

```bash
pip install -r requirements.txt
copy .env.example .env
uvicorn api.main:app --reload
```

API documentation is available at `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd student-performance-predictor-pro
copy .env.local.example .env.local
npm install
npm run dev -- --port 3000
```

## Before opening a pull request

Run the relevant checks for the area you changed.

Backend:

```bash
pytest
```

Frontend:

```bash
cd student-performance-predictor-pro
npm run build
```

If a change affects both layers, verify both.

## Branch and commit guidance

Use a short descriptive branch name, for example:

- `fix/auth-refresh-token`
- `feat/risk-explanation-ui`
- `docs/api-setup`

Keep commits focused on one logical change. Prefer concise messages such as:

- `fix: handle missing model artifact`
- `feat: add confidence explanation panel`
- `docs: clarify local environment setup`

## Environment and secrets

Never commit `.env`, `.env.local`, access tokens, API keys, database credentials, or private model credentials.

Use `.env.example` and `.env.local.example` to document required variables with safe placeholder values.

## Pull request checklist

Before submitting a PR, confirm that:

- the change has a clear purpose
- unrelated files are not included
- tests or build checks relevant to the change pass
- no secrets or local environment files are committed
- documentation is updated when behavior or setup changes
- the PR description explains what changed and how it was verified

## Reporting bugs

When opening an issue, include:

- expected behavior
- actual behavior
- steps to reproduce
- relevant logs or screenshots with secrets removed
- environment details when they matter
