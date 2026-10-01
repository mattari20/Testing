# M1928–M2007 — CV Editor Runtime Integration

## Purpose
Create the application runtime boundary that coordinates workspace identity, content projection, pagination, preview editing, and command history.

## Contract
- Resolve the active CV document from the workspace.
- Produce a source-aware content projection.
- Produce a layout result through the pagination runtime.
- Expose command history state.
- Keep rendering and persistence concerns behind their existing boundaries.
- Fence runtime operations after destruction.

## Validation
The milestone suite covers initialization, identity, deterministic refresh, history exposure, and lifecycle fencing.
