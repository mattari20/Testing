# M728–M747 — Persistence Write Safety

## Purpose

This batch hardens the persistence boundary so a newer stored snapshot cannot be silently replaced by a stale editor operation.

## Guarded writes

The persistence adapter now accepts optional write guards:

- 'expectedRevision';
- 'expectedSnapshotId'.

A mismatch is rejected before a replacement is written. This establishes an explicit compare-before-replace contract while keeping the persistence layer provider-neutral.

## Snapshot replacement

A successful guarded write:

1. validates the editor session;
2. reads the current valid persisted snapshot;
3. verifies the caller's expected identity when supplied;
4. advances the persistence revision;
5. creates a new snapshot identity and content identity;
6. replaces the stored snapshot.

The previous snapshot therefore remains the reference until the new write succeeds.

## Write observability

The recovery controller now exposes:

- 'persistenceWriteStatus';
- 'persistenceWriteError';
- 'persistenceWriteRevision';
- 'persistenceWriteSnapshotId';
- 'persistenceWriteSnapshotContentId';
- 'persistenceWriteAt';
- 'persistenceWriteSequence'.

Write state distinguishes an active write, successful replacement, and a failed write without falsely changing the reconciliation identity.

## Failure behavior

If a persistence write fails:

- the previous persistence reconciliation marker is retained;
- the write error is exposed;
- the editor document remains untouched;
- the failed operation does not become the current persisted snapshot.

Successful replacement clears the previous write error and records the new snapshot identity.

## Operation fencing

Existing autosave operation tokens remain the final controller-level fence. Dismissal and clear now also invalidate the persistence write sequence and reset write diagnostics so a cancelled persistence path cannot remain represented as an active write.

## Validation

Test:

'tests/m728-m747/persistence-write-safety.test.js'

Coverage includes:

- revision-conflict rejection;
- snapshot-identity conflict rejection;
- guarded revision advancement;
- failed-write preservation of the previous snapshot;
- successful replacement and write-state reconciliation.

Package script:

'test:m728-m747'

It runs the recovery resolution, recovery integrity, and persistence write-safety suites together.

Remote CI remains unverified unless GitHub reports an actual workflow run/status.

## V1 safety

No V1 production asset or V1 runtime path is changed.
