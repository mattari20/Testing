# M568–M587 — Editor Recovery Freshness Diagnostics

## Purpose

This batch hardens the editor persistence/recovery layer after snapshot identity and revision support.

The implementation keeps the existing `recoveryIsNewer` field for compatibility while adding an explicit `recoveryRelation` diagnostic.

## Recovery relation

`recoveryRelation` is one of:

- `missing` — no persisted snapshot exists.
- `newer` — persisted snapshot has a later valid `savedAt` than the current editor session.
- `same` — persisted and current session have the same valid save timestamp. This is a temporal comparison, not a cryptographic identity claim.
- `older` — persisted snapshot has an earlier valid `savedAt`.
- `unknown` — a freshness comparison cannot be made because the timestamp is missing or invalid.

`recoveryIsNewer` remains true only when `recoveryRelation === 'newer'`.

## Lifecycle behavior

Successful autosave and explicit save normalize recovery relation to `same`, because the newly persisted snapshot represents the current saved state.

Successful recovery also normalizes the relation to `same`, because the recovered snapshot becomes the current editor state.

Clear resets the relation to `missing`.

Invalid persistence data continues to surface as an `unknown` freshness relation while preserving the existing recovery error classification.

## Compatibility

The existing persistence version remains `1.0.0`. Existing snapshot identity validation and legacy snapshots without `snapshotId` remain supported.

No V1 production assets are changed.

## Validation

New coverage is in:

`tests/m568-m587/editor-recovery-freshness.test.js`

The tests cover newer, same-time, older, missing-current-time, invalid-time, save, and recovery lifecycle behavior.

Remote CI execution must still be verified separately when workflow/status data is available.
