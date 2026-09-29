# M27 — V1 Browser Validation Runner

## Purpose

M27 provides a browser-evidence runner for the immutable recovered V1 template sources. It compiles actual V1 token syntax using a source-derived adapter and then sends the resulting HTML/CSS to the same browser adapter boundary used by Native V2.

## Preservation

The original V1 source is read-only. Compilation creates a temporary rendered representation for evidence; no V1 file is modified.

## Shared browser path

V1 and Native V2 can now use the same Playwright page adapter for browser rendering, screenshots, and DOM measurement. Their rendering languages remain separate.

## Data control

The same controlled canonical snapshot should be supplied to V1 and V2 runs. This is essential for a meaningful visual comparison.

## Evidence boundary

V1 browser rendering is evidence collection, not compatibility certification. V1/V2 comparison remains the responsibility of the Golden Baseline comparison pipeline.
