# M708–M727 — Persistence Reconciliation

## Purpose

This batch strengthens the relationship between the current editor document and the latest persisted snapshot. Persistence is now explicitly reconciled instead of being inferred only from recovery diagnostics.

## Persistence reconciliation state

The recovery controller exposes:

- `persistenceRelation`: `current`, `stale`, `missing`, or `unknown`;
- `persistenceSnapshotId`;
- `persistenceSnapshotContentId`;
- `persistenceRevision`;
- `persistenceReconciledAt`.

These values identify the latest persisted snapshot and whether its content identity still represents the current editor document.

## Autosave and explicit save

After autosave or explicit save, the newly written snapshot becomes the reconciliation reference.

A current persisted snapshot is reported as `current`.

When the editor changes after persistence, the persisted identity remains available but is classified as `stale`. This prevents the system from losing the persisted snapshot reference merely because the editor became dirty.

A later save replaces the persistence identity with the new snapshot and revision.

## Recovery relationship

Successful recovery still requires content verification. After recovery, subsequent document changes can make the persisted snapshot stale again without destroying its identity.

This keeps recovery state and persistence state separate but mutually consistent:

- recovery state answers whether an explicit recovery decision is required;
- persistence state answers whether the latest stored snapshot matches the current document.

## Dismissal

Explicit recovery dismissal clears the persisted snapshot and therefore resets the reconciliation marker to `missing`.

The current editor document is not modified by dismissal.

## Validation

Test:

`tests/m668-m687/editor-recovery-integrity.test.js`

The suite now covers:

- persisted snapshot identity reconciliation;
- autosave reconciliation;
- stale persistence after post-recovery editing;
- replacement of persistence identity after explicit save;
- clearing reconciliation state after dismissal.

Package script:

`test:m708-m727`

It runs the recovery-resolution and recovery-integrity suites together.

Remote CI execution remains unverified unless GitHub reports an actual workflow run/status.

## V1 safety

No V1 production asset or V1 runtime path was changed.
