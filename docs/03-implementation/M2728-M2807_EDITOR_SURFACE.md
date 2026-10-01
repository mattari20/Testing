# M2728–M2807 — Editor Surface Contract

Added a thin user-facing editor surface over the existing runtime. It exposes current projection, layout, history and workspace state while routing edits and undo/redo through the authoritative runtime. It is deliberately DOM-neutral so browser rendering can be attached without duplicating document semantics.