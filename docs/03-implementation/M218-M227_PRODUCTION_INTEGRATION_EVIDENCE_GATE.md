# M218–M227 — Production Integration Evidence Gate

## Purpose

This batch turns the R6 production-integration requirement into an explicit evidence contract. It does not claim that production is already integrated.

## Evidence requirements

A production acceptance record must explicitly verify all nine requirements:

1. The production entrypoint loads the V2 application/editor.
2. A real CV can be created and edited.
3. Template selection and live preview work in production.
4. Multi-page pagination/fragmentation works in production.
5. PDF/print and DOCX export work in production.
6. V1 data preservation or an approved migration path is demonstrated.
7. No unexpected V1 fallback is observed.
8. Production configuration contains no plaintext V1/test credentials.
9. The smoke-test record includes production URL, deployment commit SHA, environment and observation time.

The executable contract is implemented in:
- `src/release/production-integration-evidence.js`
- `tests/m218-m227/production-integration-evidence.test.js`

## Acceptance boundary

The evidence contract intentionally requires every field to be explicitly true. A partially tested deployment cannot be represented as a passing R6 record.

This batch does not invent a production URL, deployment SHA, selectors, credentials, or live behavior. Those values must come from the actual production environment.

## Current status

**M218–M227: repository contract complete; R6 remains OPEN.**

The next operational action is to run this evidence checklist against the actual deployed V2 environment. Once the production URL and deployment context are available, the live editor, preview, pagination, export, migration/fallback, and security checks can be recorded without changing the release-gate definitions.

## Release rule

R6 may be marked PASS only after an observed production evidence record satisfies all nine requirements. R7 V1 retirement remains blocked until R6 is accepted.
