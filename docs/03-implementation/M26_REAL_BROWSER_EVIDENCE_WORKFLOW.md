# M26 — Real Registry-Driven Browser Evidence Workflow

## Purpose

M26 makes the M24/M25 pipeline executable in a real Chromium environment and removes the remaining hard-coded seven-template validation assumption from the browser evidence path.

## Runtime flow

The M26 browser test obtains its template set from the V2 native template registry, launches Chromium, uses the M25 Playwright adapter, runs M24 orchestration, sends measured blocks to M4, and writes real screenshot/evidence artifacts.

## Artifacts

The run produces:
- one screenshot per registered template;
- one consolidated browser evidence JSON artifact.

Artifact paths are derived from template IDs rather than a fixed template list.

## Future template behavior

A newly registered template is automatically included in the M26 browser run. No M26 test list needs to be edited.

## Acceptance boundary

M26 proves browser rendering/evidence collection only. It does not certify V1 visual equivalence. Golden comparison remains a separate evidence gate.

## CI

The existing browser workflow should execute the M26 test after Playwright/Chromium installation and upload the M26 artifact directory. A successful CI run is required before claiming actual browser evidence has been collected in the repository.
