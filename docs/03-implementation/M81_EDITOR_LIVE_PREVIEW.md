# M81 — Editor Live Preview

M81 adds revision-based stale-preview protection.

A slower preview render cannot overwrite a newer editor state. This keeps the preview deterministic while allowing rendering and measurement to remain asynchronous.