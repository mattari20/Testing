# M518–M527 — Autosave Retry Cancellation Safety

## Purpose

This batch hardens the bounded autosave retry mechanism against stale timer callbacks and overlapping editor operations.

## Completed

- Added an internal operation-generation token to autosave scheduling.
- Every new edit schedule invalidates the previous autosave generation.
- Explicit Save invalidates queued autosave/retry callbacks before writing.
- Recovery invalidates queued retry work before restoring persisted state.
- Clear Recovery invalidates queued retry work before clearing persistence.
- Destroy invalidates queued retry work and prevents later callbacks from writing.
- A callback that was already queued but belongs to an older generation is ignored.
- Existing bounded retry/backoff behavior remains unchanged.
- Dedicated tests cover newer-edit replacement, destroy cancellation, and recovery cancellation.
- Package test wiring added for M518–M527.

## Safety boundary

The generation guard prevents stale persistence operations from applying after a newer editor operation has taken control of the lifecycle. It does not change CV document content or introduce account/cloud behavior.

No V1 production code or provider-specific technology was changed.

## Validation

npm run test:m518-m527

Coverage includes stale retry suppression, destroy cancellation, recovery cancellation, and preservation of the existing retry contract.
