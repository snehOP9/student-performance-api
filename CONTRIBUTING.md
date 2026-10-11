# Contributing

Thanks for helping improve Student Performance Predictor Pro.

## Before opening a change

- Check existing issues and pull requests first.
- Keep each change focused on one problem.
- Never commit secrets, production credentials, or real student records.
- Add or update tests when behavior changes.
- For model changes, follow `docs/MODEL-CHANGE-CHECKLIST.md` and document artifact/metric impact.

## Local setup

Backend:

```bash
python -m venv .venv
python -m pip install -r requirements.txt
```

Activate the virtual environment for your shell, copy `.env.example` to `.env`, and use development-only values.

Frontend:

```bash
cd student-performance-predictor-pro
npm install
```

Use `.env.local.example` as the starting point for local frontend configuration.

## Verification

For a full local verification from the repository root, run:

```bash
python scripts/verify_contributor.py
```

The helper runs the backend test suite first and then the production frontend build. You can still run the individual checks below while iterating on one side of the application.


Backend:

```bash
pytest
```

Frontend:

```bash
cd student-performance-predictor-pro
npm run build
```

Also exercise the affected API endpoint or UI path when the change modifies runtime behavior. Model changes should include the checks required by the model-change checklist rather than relying only on a successful import or build.

## Pull requests

Please include:

- what changed;
- why it changed;
- how it was tested;
- any API, model, database, privacy, or deployment impact;
- migration or rollback notes when applicable.

Prefer small, reviewable pull requests over large unrelated changes.
