# M528–M547 — Autosave Operation Fencing and Snapshot Freshness

## Purpose

This 20-milestone batch completes the next persistence hardening layer after M518–M527. It combines stale-operation protection with explicit persisted-snapshot freshness diagnostics.

## M528–M537 — Autosave operation fencing

- Autosave scheduling uses an operation-generation token.
- Older callbacks cannot persist after a newer edit or lifecycle operation.
- Save, Recovery, Clear Recovery, and Destroy invalidate older operations.
- Retry callbacks are checked against the active operation generation.
- Existing bounded retry/backoff behavior remains unchanged.

## M538–M547 — Persistence snapshot freshness

- Persistence records carry a positive revision.
- The standard persistence adapter derives the next revision from the currently stored valid snapshot.
- Recovery diagnostics expose the persisted snapshot savedAt and revision.
- Successful autosave and explicit save update freshness diagnostics.
- Recovery restores the snapshot freshness metadata.
- Clear and invalid recovery reset freshness diagnostics.
- Existing records without a revision remain readable for backward compatibility.
- Invalid stored snapshots are replaced by a fresh valid revision when a new save succeeds.

## Safety boundary

This batch changes persistence metadata and lifecycle fencing only. It does not change CV document semantics, template behavior, V1 production code, cloud/account behavior, or provider-specific technology.

## Validation

npm run test:m528-m547

Coverage includes operation fencing inherited from M518–M527, revision serialization, revision incrementing, recovery freshness diagnostics, and successful autosave freshness updates.
