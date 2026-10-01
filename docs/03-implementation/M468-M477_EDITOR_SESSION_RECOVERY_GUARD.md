# M468–M477 — Editor Session Recovery Guard

## Purpose
This batch completes the editor safety boundary around recovery, autosave, and unsaved-session protection.

## Completed scope
- Prevent recovery from silently replacing dirty editor changes.
- Add injectable recovery confirmation so browser UI can explicitly confirm destructive recovery.
- Keep recovery cancellation non-destructive.
- Cancel pending autosave timers before explicit save, recovery, and recovery clear.
- Preserve dirty state when persistence/save fails.
- Keep browser `beforeunload` protection active while unsaved changes exist.
- Prevent automatic recovery from replacing an already-dirty editor session.
- Expose recovery availability through lifecycle state so UI controls can disable themselves when no snapshot exists.

## Boundary
The recovery controller remains responsible for persistence mechanics and timer lifecycle. The lifecycle controller owns the recovery safety decision. The session guard owns browser-leave protection. The runtime wires these boundaries together.

No V1 production code is modified by this batch.

## Validation
The dedicated suite is:
`npm run test:m468-m477`

Coverage includes dirty-session leave protection, browser `beforeunload`, recovery availability, blocked and confirmed recovery, stale autosave cancellation after save/recovery/clear, and failed-save dirty-state preservation.

## Acceptance criteria
M468–M477 is complete when the dedicated suite passes and the integration workflow executes the suite after M458–M467.