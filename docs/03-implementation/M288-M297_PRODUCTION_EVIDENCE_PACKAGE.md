# M288–M297 — Production Evidence Package

## Purpose

This batch adds a repository-side packaging boundary for the R6 production evidence already defined by M218–M287.

The package combines:

- the controlled production smoke-test record;
- the explicit V1/V2/blocked production-source bridge state;
- non-secret evidence references;
- the machine-checkable R6 handoff result.

## Acceptance behavior

The package has two meaningful states:

- `evidence-incomplete` with R6 `OPEN`;
- `ready-for-acceptance` with R6 `PASS`.

R6 can only become PASS when the existing production handoff gate accepts the complete smoke record and the bridge state is explicitly `v2`.

## Security boundary

The package rejects secret-like keys such as password, secret, API key, token, private key, and credential indicators. It does not store production credentials.

This is a structural safeguard, not a replacement for production security review or Git-history verification.

## Evidence boundary

This batch does not invent:

- a production URL;
- a deployment commit;
- a production observation;
- a successful deployment;
- a V2 production switch;
- V1 retirement.

Those remain operator/production evidence.

## Verification

Dedicated tests cover:

1. V1 bridge keeps R6 OPEN.
2. Complete smoke evidence plus V2 bridge reaches the package's acceptance-ready state.
3. Secret-like fields are rejected.
4. Invalid package states are rejected.

## Release status

R6 remains OPEN until the package is populated from actual production observations and those observations are independently accepted under the release-gate policy.
