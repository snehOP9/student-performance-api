# Model Artifacts

The backend loads trained model artifacts from the repository's `artifacts/` directory.

## Expectations

- Keep artifact filenames consistent with the paths used by the backend.
- Treat model artifacts as versioned application inputs.
- Do not replace a production artifact without validating inference first.
- Keep generated or temporary files out of source control.

## Validation checklist

Before changing an artifact:

1. Confirm the file exists at the expected path.
2. Start the API locally.
3. Exercise `/predict` with a representative payload.
4. Exercise `/uncertainty` and `/recommend` when the change affects those flows.
5. Confirm the returned probabilities and response schema are valid.
6. Run the repository's automated checks before opening a PR.

If an artifact format changes, update the loader and its compatibility checks in the same change.