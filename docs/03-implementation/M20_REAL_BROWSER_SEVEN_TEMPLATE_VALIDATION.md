# M20 — Real Browser Seven-Template Validation

## Purpose

M20 executes the actual Native V2 templates in Chromium and measures their rendered semantic layout blocks before passing those measurements into M4 pagination.

## Evidence collected

For each of the seven templates:
- rendered HTML size;
- visible text presence;
- semantic block count;
- browser-computed block height and width;
- root document height;
- zero-height anomalies;
- M4 page count;
- M4 overflow diagnostics.

## Test environment

The repository workflow provisions Chromium through Playwright. This is intentionally a validation dependency rather than a runtime application dependency.

## Compatibility gate

Passing M20 means that the templates can render and produce measurable semantic layout evidence in the controlled browser fixture.

It **does not** by itself establish V1 visual equivalence or final V2 compatibility.

Final compatibility still requires:
- V1 Golden Baseline screenshot/geometry comparison;
- functional/visibility comparison;
- pagination comparison;
- preview/PDF/print regression evidence;
- accessibility/security checks.

## Source integrity

The seven original V1 HTML files remain untouched. Native V2 templates are derived assets and are the only files annotated with V2 semantic layout metadata.
