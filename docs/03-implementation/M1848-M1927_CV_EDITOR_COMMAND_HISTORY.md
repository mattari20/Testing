# M1848–M1927 — CV Editor Command History

## Purpose
Introduce an explicit undo/redo boundary for editor mutations without coupling command history to preview rendering, persistence, or UI controls.

## Contract
- Capture immutable before/after snapshots around each command.
- Provide deterministic execute, undo, and redo operations.
- Clear redo history after a new command following undo.
- Bound history growth.
- Expose only stable history diagnostics to consumers.
- Fence command execution after destruction.

## Validation
The milestone suite covers command execution, undo, redo, redo invalidation, history bounds, and lifecycle fencing.

## Current architecture position
The CV Builder V2 now has:
workspace/document management → versioning → dirty-state safety → persistence/recovery → template selection → layout state → preview navigation → assembly diagnostics → editor facade → capability resolution → section/field projection → pagination runtime → preview editing → command history.

## Next boundary
The next major work can integrate these boundaries into the actual editor runtime surface and connect command execution with dirty-state, persistence, preview refresh, and eventual UI controls.
