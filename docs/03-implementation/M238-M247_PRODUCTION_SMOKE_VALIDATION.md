# M238–M247 — Production smoke record validation

This batch adds `src/release/production-smoke-record.js` and automated tests. The record maps granular operator observations into the existing nine-point M218–M227 R6 evidence contract.

## Required input

A versioned record must identify the HTTPS production URL, full 40-character deployment commit SHA, environment `production`, valid timezone-aware ISO-8601 observation time, an observations object, and at least one nonempty evidence reference. Each of the thirteen individual observations in `PRODUCTION_SMOKE_OBSERVATIONS` must explicitly be `true`. An absent or false observation fails its corresponding aggregate R6 requirement. The mapping does not infer successful observations from metadata.

## Execution

Run `npm run test:m238-m247`. The V2 integration workflow now executes this contract. Its complete synthetic fixture tests validation behavior only; it is not evidence that the live website was inspected.

## Operator handling

Use the M228–M237 operator template to gather real observations. Keep evidence references free of credentials, API keys, passwords, session tokens and personal CV data. A passing validator is a necessary documentation/contract check, not sufficient authorization to change R6 to PASS. A human operator must verify and retain live production evidence. R6 remains OPEN until that work is done. R7 and R8 remain dependent on their own release requirements.
