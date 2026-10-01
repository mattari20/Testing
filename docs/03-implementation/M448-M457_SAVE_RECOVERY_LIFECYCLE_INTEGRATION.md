# M448–M457 — Save / Recovery Lifecycle Integration

## Purpose

This batch establishes an application-level lifecycle boundary around the editor's existing persistence and recovery capabilities.

## Completed

- Added `createEditorLifecycleController` as the lifecycle-facing abstraction.
- Lifecycle status is exposed as `saved`, `dirty`, or `recovered`.
- Lifecycle state reports `dirty`, `savedAt`, and `lastCommand`.
- Explicit save remains delegated to the existing persistence controller.
- Recovery remains delegated to the existing persistence controller.
- Recovery clearing and pending persistence flush are exposed through the lifecycle boundary.
- Editor runtime now exposes:
  - `runtime.lifecycle`
  - `runtime.save()`
  - `runtime.recover()`
  - `runtime.clearRecovery()`
- Existing persistence remains optional; the editor runtime continues to operate without a persistence adapter.
- Lifecycle integration tests cover save, recovery, and status subscriptions.
- CI now executes the M448–M457 validation test.

## Boundary

This batch does not introduce account/cloud behavior, provider-specific storage, or visual product design. It provides the application lifecycle contract needed for the next UI integration stage.

## Validation

Primary batch test:

`npm run test:m448-m457`

The test verifies that lifecycle operations preserve the existing editor surface and persistence boundaries while exposing deterministic lifecycle state.
