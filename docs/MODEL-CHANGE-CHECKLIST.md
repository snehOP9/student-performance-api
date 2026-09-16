# Model change checklist

Use this checklist when changing training, inference, or model artifacts.

- [ ] Confirm the expected input features and types.
- [ ] Confirm preprocessing matches the model artifact.
- [ ] Test a valid prediction request.
- [ ] Test invalid or incomplete input.
- [ ] Verify response shape and error handling.
- [ ] Document compatibility changes.
- [ ] Avoid committing generated secrets or local environment files.
