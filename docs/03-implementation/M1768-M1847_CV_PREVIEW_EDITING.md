# M1768–M1847 — CV Preview Editing

## Purpose
Establish the source-aware preview editing boundary: a preview block identifies its underlying section, field, or entry and routes edits back to the master profile model.

## Contract
- Use stable block IDs to resolve source targets.
- Apply edits through core model mutation functions rather than mutating preview output.
- Support section titles, field definitions/values, and repeatable-entry values.
- Record bounded edit history for diagnostics and future command integration.
- Reject unknown preview targets instead of silently ignoring them.
- Fence the session after destruction.

## Validation
The milestone suite covers target resolution, section editing, field editing, entry editing, invalid target rejection, and lifecycle fencing.

## Next boundary
Preview edits now need an explicit command history boundary so undo/redo can restore model state without coupling history to the preview renderer.
