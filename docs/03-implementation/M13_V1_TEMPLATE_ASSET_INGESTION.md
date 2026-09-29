# M13 — V1 Template Asset Ingestion and Reconciliation Boundary

**Status:** Asset manifest implemented; actual archive extraction and template compatibility validation remain pending.

## Objective

M13 establishes a controlled inventory and ingestion boundary for the real V1 template assets.

The supplied V1 Golden Baseline archive was inspected and contains seven recoverable HTML template sources, seven DOCX template assets, and seven preview assets.

This milestone records those source paths without pretending that source extraction or compatibility validation has already occurred.

## Manifest

File: `src/templates/v1-asset-manifest.js`

The manifest records:

- V1 template ID;
- original HTML source path;
- DOCX asset path;
- preview asset path;
- ingestion state;
- extraction/reconciliation evidence;
- diagnostics.

The seven confirmed HTML template sources are:

1. t01-modern-minimalist-cv-design_modern
2. t02-professional-cv-design_modern
3. t03-professional-cv-design_modern
4. t04-modern-blue-corporate_modern
5. t05-simple-cv-graphic-web-designer_modern
6. t06-professional-cv-graphic-designer_modern
7. t07-professional-cv-store-manager-incharge_modern

## Important source limitation

The current execution environment can inspect the RAR archive directory but does not have a working RAR extraction utility. Therefore the individual HTML/DOCX/preview bytes could not be extracted into the repository during this milestone.

This is deliberately recorded as **Extraction Pending**, not treated as compatibility.

No template has been promoted to V2-Compatible.

## Ingestion lifecycle

**Archive Confirmed → Extraction Pending → Reconciliation Required → Validated**

A template becomes adapter-ready only after:

- source HTML is actually recovered;
- assets are reconciled;
- V1 bindings are inspected;
- token/loop/visibility/theme mappings are evidence-backed;
- visual regression evidence is captured.

## Golden Baseline rule

The original V1 source remains authoritative.

The V2 system must not recreate these templates from screenshots or preview images.

## M0 relationship

This milestone does not close M0. The V1 asset reconciliation gate remains open until actual source/assets are recovered and validated.

## Acceptance

M13 implementation foundation is complete.

The next concrete dependency is actual source extraction/recovery of at least one V1 HTML template, followed by its M10 adapter mapping and M12 browser rendering validation.
