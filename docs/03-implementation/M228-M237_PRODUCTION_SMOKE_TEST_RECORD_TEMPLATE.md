# R6 Production Smoke-Test Record Template

> Complete this document only from an observed production deployment. Do not enter passwords, API keys, database credentials, session tokens or other secrets.

## Deployment identity

- Production URL:
- Deployment commit SHA:
- Environment:
- Observed at (ISO-8601):

## Functional observations

- [ ] Production entrypoint loads V2
- [ ] Real CV can be created
- [ ] Real CV can be edited
- [ ] Template selection works
- [ ] Live preview works
- [ ] Multi-page pagination works
- [ ] Fragmentation/continuation works
- [ ] PDF/print export works
- [ ] DOCX export works

## Compatibility and safety observations

- [ ] V1 data preservation or approved migration path verified
- [ ] No unexpected V1 fallback observed
- [ ] Production configuration reviewed without exposing secrets
- [ ] No plaintext V1/test credentials observed

## Evidence

- Screenshot/evidence reference:
- Screenshot/evidence reference:
- Screenshot/evidence reference:
- Runtime/log reference:

## Acceptance

- All required observations completed: YES / NO
- R6 recommendation for gate state: PASS / OPEN

**Important:** PASS may only be selected after every required observation has been directly verified in the deployed environment.
