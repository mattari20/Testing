# M24 — Registry-Driven Browser Validation Runner

## Purpose

M24 connects the registry-driven M23 evidence model to an actual browser-runner boundary.

The runner discovers its template set from the V2 template registry unless an explicit template set is supplied. It therefore does not assume seven templates.

## Responsibilities

For each template the runner:
1. resolves template identity and source;
2. creates a browser page using the controlled viewport;
3. renders and measures the template through the browser page adapter;
4. sends measured blocks through the authoritative M4 pagination engine;
5. records render, geometry, pagination, and screenshot evidence;
6. preserves V1 baseline identity when available;
7. leaves compatibility as insufficient evidence until V1 comparison evidence is available.

## Browser adapter boundary

The runner does not embed a specific browser API into the template engine. `pageFactory()` supplies a page adapter with `renderAndMeasure()` and optional `close()`.

This keeps browser orchestration separate from rendering, template definitions, and pagination.

## Future templates

Adding a template to the registry automatically includes it in the default validation plan. No M24 template-ID list needs to be edited.

## V1 / new-template behavior

A V1-derived template carries its V1 baseline ID and can later enter V1/V2 comparison. A new native V2 template may have no V1 baseline and is validated against the current V2 contracts without inventing a legacy baseline.

## Evidence rule

Browser success does not certify visual equivalence. M24 produces evidence; M21/M22 comparison rules determine compatibility only after sufficient evidence exists.
