# M688–M707 — Post-Recovery Session Consistency

## Purpose

This batch makes the explicit recovery result conditional on the editor continuing to represent the recovered snapshot. A successful recovery is no longer treated as permanently resolved after the user changes the document.

## Resolved-state identity

The recovery controller now retains `recoveryResolvedContentId` when a recovery is successfully verified.

The resolved state is preserved only while the current editor content identity remains equal to that recovered identity.

## Post-recovery editing

Any content-changing editor operation, including normal edits and undo/redo, changes the content identity when applicable.

When the current content no longer matches the resolved recovery snapshot:

- `recoveryAction` leaves `resolved`;
- the recovery state is reclassified;
- a conflicting persisted snapshot becomes `pending`;
- the previous verification result is invalidated;
- the user can make a new explicit recovery decision instead of relying on stale resolution state.

This keeps recovery state aligned with the actual current editor document.

## Save consistency

A normal save establishes the newly persisted snapshot as the current persistence state. The previous recovery resolution identity is therefore cleared rather than carried forward as an active recovery result.

The resulting recovery state can be `safe` when the persisted snapshot matches the current document, with recovery action `none`.

## Lifecycle consistency

The existing lifecycle controller automatically exposes the updated recovery state. Post-recovery edits therefore produce a dirty editor state and a new pending recovery decision when a persisted conflicting snapshot remains.

No separate session-tracking mechanism was introduced.

## Validation

Test:

`tests/m668-m687/editor-recovery-integrity.test.js`

The suite now also covers:

- invalidation after post-recovery editing;
- clearing of resolved state after a normal save;
- stable resolved state during repeated inspection when identity still matches;
- undo/redo invalidation;
- lifecycle exposure of post-recovery invalidation.

Package script:

`test:m688-m707`

It runs the explicit recovery-resolution tests together with the post-recovery integrity and session-consistency tests.

Remote CI remains unverified unless GitHub reports an actual workflow run/status.

## V1 safety

No V1 production asset or V1 runtime path was changed.
