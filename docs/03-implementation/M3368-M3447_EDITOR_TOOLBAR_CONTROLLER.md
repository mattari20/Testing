# M3368–M3447 — Editor Toolbar Controller
Provides browser controls for core editor history actions through the existing browser adapter.

## Boundary
- Native button controls only.
- Uses adapter methods rather than touching CV state directly.
- No persistence, export, or framework dependency.

## Acceptance
Undo, redo, and refresh actions are exposed with stable data attributes and delegated to the editor adapter.