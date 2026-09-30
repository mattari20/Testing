# M368–M377 — Builder Editing Foundation

## Purpose

Return the implementation sequence from release-asset preparation to the actual CV Builder experience.

This batch strengthens the editor as a usable builder foundation without changing the production V1 path.

## Completed

1. Added an explicit set-identity editor command so canonical personal information can be edited through the same command boundary as section fields.
2. The editor executor now refreshes the document snapshot after a mutation.
3. Added editor-surface undo/redo history using immutable before/after session snapshots.
4. Undo/redo clears stale preview state so the next preview is based on the restored document.
5. The form renderer now exposes canonical identity fields.
6. Repeatable sections now render existing entries, entry fields, Add controls and Remove controls.
7. The DOM controller now binds identity and repeatable-entry inputs to editor commands.
8. Added executable tests covering identity editing, repeatable entries, snapshot freshness, and undo/redo.

## Scope boundary

This is an editor-foundation batch, not a claim that the full production CV Builder is complete.

Still required in later batches include richer field controls, section/field management UI, drag/reorder interactions, robust autosave/recovery, template switching UX, compatibility review, real export providers, import workflows, intelligence/AI workflows, accessibility hardening, production deployment and final release gates.

## Preservation rule

The batch changes V2 editor internals only. It does not authorize changes to the frozen V1 production front-end.

## Acceptance

The batch is complete when its test file passes in CI and the existing V2 integration/browser gates remain green.