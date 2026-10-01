# M2408–M2487 — Multi-CV Document Switching Integration

## Delivered
- Added an editor-facing document switching controller.
- Exposes active/inactive CV documents and their status.
- Blocks switching while dirty unless explicit confirmation is supplied.
- Confirmed switching changes the workspace active document and refreshes the runtime.
- Destruction fences further switching.

## Boundary
The controller does not own document data. The workspace remains authoritative and the runtime remains responsible for projection/layout refresh.