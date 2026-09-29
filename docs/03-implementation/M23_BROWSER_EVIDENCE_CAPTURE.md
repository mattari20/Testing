# M23 — Registry-Driven Browser Evidence Capture

## Purpose

M23 separates browser evidence capture from declaring V1/V2 compatibility. The capture pipeline is registry-driven and is not limited to the seven templates currently present.

## Evidence captured

For every registered/native template:
- template identity and version;
- V1 baseline identity when one exists;
- controlled viewport;
- render status and diagnostics;
- measured semantic blocks;
- pagination result;
- screenshot artifact reference.

## Important boundary

Successful V2 browser rendering is not equivalent to V1 visual compatibility. After browser evidence is collected, the comparison remains insufficient-evidence until corresponding V1 evidence and dimension-level comparison are available.

## Future templates

A future native V2 template without a V1 predecessor is valid. Its v1BaselineId is null and it follows the native V2 contract, layout, accessibility, security, and export validation rather than an invented V1 comparison.

## Legacy templates

Templates derived from V1 retain their V1 baseline identity. Their original V1 source remains immutable and is used only as Golden Baseline/reference material.

## Implementation boundary

The M23 core records evidence and validates the lifecycle. Actual Playwright capture remains a browser-runner concern and must write real artifacts; the core must never fabricate screenshot or geometry evidence.
