# M2648–M2727 — AI Review / Apply Boundary

## Delivered
- Added an explicit AI review controller between AI results and the CV model.
- AI results are document-bound and must remain reviewable.
- Suggestions require an explicit target block and patch before application.
- Accepted suggestions are routed through the normal editor runtime, preserving undo/redo and workspace persistence.
- Rejected suggestions do not mutate the CV.
- A review cannot be applied after switching to another CV document.

## Human control
AI does not directly mutate the document. The user-facing boundary is submit → review → accept/reject. Accepted changes are ordinary editor commands and can be undone.