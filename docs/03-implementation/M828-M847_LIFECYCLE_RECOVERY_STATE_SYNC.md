# M828–M847 — Lifecycle Recovery State Synchronization

The application lifecycle boundary now treats recovery initialization and explicit refresh as state-producing operations.

`initializeRecovery()` and `refreshRecovery()` emit lifecycle state after the underlying recovery controller updates persistence state. This ensures subscribed UI/application consumers observe the refreshed snapshot immediately rather than waiting for an unrelated editor event.

The lifecycle controller also exposes a read-only `getRecoveryAudit()` projection for application diagnostics.

Refresh does not mutate editor content or dirty state. It only reconciles the persistence/recovery view.

Validation: `tests/m828-m847/lifecycle-recovery-state-sync.test.js` and package script `test:m828-m847`.

No V1 production runtime or asset was changed.