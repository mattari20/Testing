# M768–M787 — Recovery Inspection Readiness

## Purpose

This batch hardens the startup and state-read boundary of editor persistence. Recovery inspection is now an explicit, cached lifecycle concern instead of an implicit storage read on every state request.

## Inspection lifecycle

The recovery controller now tracks:
- inspection readiness status;
- last inspection timestamp;
- inspection sequence;
- whether the current inspection result remains valid.

A first state read performs one persistence inspection. Repeated lifecycle or recovery state reads reuse that inspected result until the editor changes or an explicit refresh is requested.

## Mutation invalidation

Editor mutations invalidate the cached inspection because the relationship between the current editor content and the persisted snapshot may have changed.

The next state read then re-inspects persistence and reconciles the snapshot against the new editor content.

## Explicit external refresh

The recovery controller exposes an explicit refreshRecovery operation for external persistence changes.

This is intentionally separate from normal state reads so application code can request a fresh storage read when another process, tab, or integration may have changed the persisted snapshot.

## Lifecycle exposure

The editor lifecycle controller now exposes recovery inspection readiness and provides the same refresh boundary to the application layer.

This keeps startup/readiness state observable without coupling UI code directly to the persistence adapter.

## Clear semantics

A clear operation establishes a valid ready state representing a confirmed missing snapshot. It does not leave the controller in an uninitialized inspection state.

## Validation

Test:

tests/m768-m787/recovery-inspection-readiness.test.js

Coverage includes:
- first inspection and cached repeated reads;
- lifecycle state reads without duplicate persistence loads;
- mutation-driven inspection invalidation;
- explicit external refresh;
- clear establishing a ready missing state.

Package script:

test:m768-m787

Remote CI remains unverified unless GitHub reports an actual workflow run/status.

## V1 safety

No V1 production asset or V1 runtime path is changed.