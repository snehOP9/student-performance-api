# Environment Configuration

Keep environment-specific values outside the source code.

## Backend

The backend expects configuration such as:

- `DATABASE_URL` — database connection string.
- `JWT_SECRET_KEY` — secret used for token signing.
- `FRONTEND_ORIGINS` — allowed browser origins.
- `FRONTEND_BASE_URL` — public frontend URL.

Optional email and OAuth settings are documented in `.env.example`.

## Frontend

Set:

```text
VITE_API_URL=http://127.0.0.1:8000
```

Use the deployed API URL outside local development.

## Safe workflow

1. Copy the example environment file.
2. Fill values locally.
3. Keep `.env` files out of commits.
4. Configure secrets through the hosting provider for deployments.
5. Rotate credentials if a secret is accidentally exposed.

Do not place passwords, API keys, JWT secrets, or database credentials in README files, source code, or issue comments.