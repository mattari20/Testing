# M64 — Concrete Editor Command Execution

M64 moves editor commands from contract-only definitions to canonical-data mutations.

Commands execute against the existing V2 Master Profile and Targeted CV model. Presentation selection remains configuration; canonical career data is not duplicated.

Unsupported history operations such as undo/redo remain higher-level concerns and are intentionally not silently treated as successful mutations.