# API Testing Guide

The FastAPI backend can be tested locally through Swagger UI or with `curl`.

## Swagger UI

Start the backend:

```bash
uvicorn api.main:app --reload
```

Then open `http://127.0.0.1:8000/docs` in a browser.

## Health checks

```bash
curl http://127.0.0.1:8000/
curl http://127.0.0.1:8000/healthz
```

## Prediction flow

1. Start the backend and open Swagger UI.
2. Select `POST /predict`.
3. Choose **Try it out**.
4. Enter the required student fields shown by the generated request schema.
5. Execute the request and inspect the risk probability and explanation.

The same process can be used for `/uncertainty` and `/recommend`.

## Authentication flow

For a local test account, use `POST /auth/signup` first, then `POST /auth/login`.

Keep test credentials local and never commit real passwords, tokens, database URLs, or secret keys.

## Before opening a PR

- Verify the backend starts without errors.
- Check `/healthz`.
- Exercise any changed endpoint in Swagger UI.
- Run the project's available checks before submitting the pull request.
