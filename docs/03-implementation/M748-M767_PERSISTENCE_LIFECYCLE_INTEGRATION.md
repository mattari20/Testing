# M748–M767 — Persistence Lifecycle Integration

## Purpose

This batch carries the persistence safety model through the editor lifecycle boundary so save, recovery, failure, and clear operations expose one consistent state model to the application layer.

## Lifecycle visibility

The lifecycle controller now surfaces the persistence reconciliation and write-state fields already maintained by the recovery controller.

This makes the application-facing lifecycle state aware of:

- current versus stale persistence;
- persisted snapshot identity;
- persisted revision;
- persistence write status;
- persistence write errors;
- successful write identity and revision;
- write timestamp.

## Save failure semantics

A lifecycle save now preserves the editor dirty state when persistence fails.

The failure remains observable through the persistence write state instead of being converted into a false saved lifecycle state.

The previously reconciled snapshot remains the persistence reference until a later write succeeds.

## Successful save semantics

After a successful save:

- lifecycle status becomes saved;
- editor dirty state becomes false;
- persistence reconciliation points at the replacement snapshot;
- persistence write state records the new revision and identities.

## Recovery semantics

Verified recovery continues to restore the persisted document while keeping its snapshot identity observable through lifecycle state.

Recovery verification and persistence reconciliation remain distinct:

- recovery verification proves the restored content matches the snapshot;
- persistence reconciliation identifies whether the stored snapshot represents the current document.

## Clear semantics

Clearing recovery also clears the persistence reconciliation marker and resets persistence write diagnostics.

This prevents stale persistence metadata from surviving an explicit clear operation.

## Validation

Test:

tests/m748-m767/persistence-lifecycle.test.js

Coverage includes:

- lifecycle persistence visibility;
- failed lifecycle save;
- successful replacement visibility;
- verified recovery visibility;
- lifecycle clear/reset behavior.

Package script:

test:m748-m767

Remote CI remains unverified unless GitHub reports an actual workflow run/status.

## V1 safety

No V1 production asset or V1 runtime path is changed.
