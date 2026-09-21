# Contributing

Thanks for helping improve Student Performance Predictor Pro.

## Before opening a change

- Check existing issues and pull requests first.
- Keep changes focused on one problem.
- Never commit secrets or real student data.
- Add or update tests when behavior changes.
- For model changes, follow `docs/MODEL-CHANGE-CHECKLIST.md`.

## Local checks

Backend:

```bash
pip install -r requirements.txt
pytest
```

Frontend:

```bash
cd student-performance-predictor-pro
npm install
npm run build
```

Run the checks relevant to the files you changed.

## Pull requests

Please include:

- What changed
- Why it changed
- How it was tested
- Any API, model, database, or deployment impact

Prefer small, reviewable pull requests over large unrelated changes.
