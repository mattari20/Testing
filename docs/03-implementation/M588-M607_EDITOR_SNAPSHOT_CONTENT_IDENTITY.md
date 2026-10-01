# M588–M607 — Editor Snapshot Content Identity

## Purpose

This batch extends persistence identity from snapshot metadata to the actual persisted editor content.

## Content identity

Persisted records now include `snapshotContentId`, a deterministic fingerprint of the persisted application and local-first session data while excluding transient save metadata such as `savedAt`, `lastCommand`, and `dirty`.

The existing `snapshotId` remains the full snapshot identity and now incorporates the content identity.

## Recovery diagnostics

The recovery controller exposes `recoveryContentRelation`:

- `same` — current editor content and persisted content have the same content identity.
- `different` — both identities are available and differ.
- `unknown` — persisted content identity is unavailable or cannot be compared.
- `missing` — no persisted snapshot exists.

This is intentionally separate from `recoveryRelation`, which continues to describe timestamp freshness.

Therefore, equal timestamps no longer imply equal CV content.

## Integrity

A persisted `snapshotContentId` is verified during deserialization. A mismatch is rejected as an invalid persisted snapshot.

Legacy records without `snapshotContentId` remain readable for backward compatibility.

## Lifecycle

Successful save/autosave and recovery normalize content relation to `same` because the persisted snapshot is the state being represented as current.

Clear resets both freshness and content diagnostics.

## Validation

Coverage is provided by:

`tests/m588-m607/editor-snapshot-content-identity.test.js`

The test set covers deterministic identity, tamper rejection, same content, changed content, and legacy records.

No V1 production assets are modified.
