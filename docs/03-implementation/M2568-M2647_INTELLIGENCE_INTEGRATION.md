# M2568–M2647 — ATS / Job Matching Integration

## Delivered
- Added one runtime-facing intelligence coordinator.
- ATS analysis and job matching now consume the current projected CV state.
- Combined inspection returns both diagnostic streams with the active document identity.
- The coordinator re-reads runtime state for every operation, preventing stale analysis after edits.

## Boundary
The coordinator does not invent recommendations or select a winner. Existing ATS and matching contracts remain diagnostic and evidence-oriented.