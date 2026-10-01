# M868–M887 — Persistence Diagnostics Contract

The application lifecycle now exposes a stable `getPersistenceState()` projection for persistence/recovery diagnostics.

The projection includes persisted snapshot identity, revision, current/stale relation, write outcome and identity, inspection readiness, retryability, timestamp, and inspection sequence.

This creates a stable application-facing diagnostics boundary without exposing the storage adapter itself. Returned state is frozen and derived from the current lifecycle snapshot.

The lifecycle contract version advances to 1.6.0 because the public application surface gained the diagnostics method.

Validation: `tests/m868-m887/persistence-diagnostics-contract.test.js` and package script `test:m868-m887`.

No V1 production runtime or asset was changed.