# M19 — Seven-Template Browser Validation Harness

## Purpose

M19 defines the consolidated validation boundary for all seven native V2 templates.

The harness accepts:
- the actual native V2 template definitions;
- one representative canonical document snapshot;
- a real browser document factory;
- the M4 page model.

For every template it records:
- render state;
- render diagnostics;
- measured semantic block count;
- M4 page count;
- pagination overflow;
- zero-height measurement anomalies;
- browser-measurement evidence state.

## Compatibility rule

The harness deliberately reports **pending-golden-baseline** even when rendering and pagination succeed.

A template can only become V2-compatible after:
1. real browser measurement;
2. pagination evidence;
3. V1 Golden Baseline visual comparison;
4. functional/visibility comparison;
5. preview/export regression evidence.

## Important limitation

This repository milestone creates the browser-facing harness contract. It does not claim that a browser runtime was available or that visual parity has been proven.
