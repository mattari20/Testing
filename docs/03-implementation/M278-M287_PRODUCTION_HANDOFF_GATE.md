# M278–M287 Production Handoff Gate

## Purpose

Turn the existing R6 smoke-test contract into an explicit final handoff decision boundary without claiming that production has already been verified.

## Gate rule

R6 can only become PASS when both conditions are true:

1. The complete production smoke-test record validates all nine required integration areas.
2. The production source bridge is explicitly in state `v2`.

A V1 bridge state keeps R6 OPEN even if a synthetic smoke record is otherwise complete.

## Safety

This milestone does not:

- invent a production deployment;
- invent a deployment commit SHA;
- claim that V2 is live;
- retire V1;
- store credentials or secrets;
- infer production success from repository tests.

## Repository implementation

Added:

- `src/release/production-handoff-gate.js`
- `tests/m278-m287/production-handoff-gate.test.js`

The gate returns:

- `PASS` only when the validated production smoke record is complete and the bridge state is explicitly `v2`;
- `OPEN` otherwise, with concrete reasons.

## Operational completion still required

The remaining action is execution against the real deployed environment. The operator must record the actual production URL, deployed commit SHA, timestamp, nine smoke observations, evidence references, and explicit V2 bridge state.

Until that happens, R6 remains OPEN and V1 remains protected.
