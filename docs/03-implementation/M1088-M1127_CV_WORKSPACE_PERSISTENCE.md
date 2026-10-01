# M1088-M1127 — CV Workspace Persistence Contract

## M1088-M1107 — Serialization and validation
- Adds a versioned workspace persistence record.
- Validates the master profile and every persisted CV document.

## M1108-M1127 — Guarded persistence
- Adds workspace identity conflict detection.
- Verifies persisted identity after writes and supports explicit clear behavior.

## Safety
No V1 runtime or asset is changed.

## Validation
Tests: tests/m1088-m1127/cv-workspace-persistence.test.js.