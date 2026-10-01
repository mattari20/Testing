# M488–M497 — Editor Persistence Integrity and Recovery Diagnostics

## Purpose

This batch hardens the local editor recovery boundary against missing, malformed, outdated, or otherwise invalid persisted snapshots.

## Completed

- Recovery state now distinguishes:
  - `missing` — no persisted recovery snapshot exists.
  - `available` — a valid persisted snapshot is available.
  - `invalid` — stored content exists but cannot be accepted as a valid editor persistence record.
  - `error` — the storage operation failed for an unexpected reason.
- Corrupt JSON no longer causes `hasRecovery()` or `recover()` to throw.
- Invalid recovery data is never applied to the active editor surface.
- A dirty editor session remains unchanged when recovery data is invalid.
- Recovery diagnostics expose a deterministic error message for UI/application consumers.
- Successful save/autosave establishes `available` recovery state.
- Clearing recovery removes invalid snapshots and resets diagnostics.
- Lifecycle state mirrors recovery integrity status and error metadata.
- Editor DOM exposes recovery status and error metadata through dedicated data attributes.
- Dedicated M488–M497 tests and CI validation are wired.

## Recovery state contract

The recovery controller exposes:

- `getRecoveryState()`
- `recoveryStatus`
- `recoveryError`

The existing `hasRecovery()` contract remains boolean and is now safe against malformed persisted data.

## DOM contract

- `data-v2-editor-recovery-status`
- `data-v2-editor-recovery-error`

## Safety boundary

Recovery is an all-or-nothing operation. Persistence validation happens before the active editor surface is changed. An invalid or unreadable snapshot therefore cannot overwrite or corrupt the user's current editing session.

No V1 production code, cloud/account behavior, provider-specific storage, or implementation technology choice was introduced.

## Validation

`npm run test:m488-m497`

Coverage includes malformed JSON, invalid persisted documents, preservation of dirty editor state, missing-vs-invalid diagnostics, clearing invalid recovery data, and successful recovery availability after autosave.
