# M12 — Template Rendering and Browser Measurement Foundation

**Status:** Implementation foundation complete; V1 template ingestion and visual regression remain pending.

## Objective

M12 establishes the browser-facing rendering boundary needed to turn a V2 template definition into measurable DOM output.

The intended flow is:

**Template Source → V2 Render Definition → Browser DOM → Binding Application → DOM Measurement → Semantic Layout Blocks → M4 Layout/Pagination**

This milestone deliberately keeps the renderer separate from the canonical career-data model and from pagination.

## Implemented

### Template render engine

File: `src/render/template-render-engine.js`

Provides:

- render-definition normalization;
- binding-plan normalization;
- dotted-path value resolution;
- browser DOM template mounting;
- text binding through `textContent`;
- restricted attribute binding;
- missing-target diagnostics;
- rendered-template measurement;
- conversion of measurements into semantic layout blocks;
- render result/provenance structure.

### Security boundary

User values are assigned through DOM text/attribute APIs rather than being concatenated into template HTML.

Attribute bindings reject obvious executable URL schemes.

The template source itself is treated as a trusted presentation asset and must be reconciled before publication.

## Relationship to V1

The supplied V1 Golden Baseline archive contains the seven recoverable HTML template sources and associated DOCX/preview assets identified during the audit.

M12 does **not** yet mark those templates V2-Compatible.

The next V1-specific work remains:

1. ingest the seven recovered HTML sources into a controlled V2 template asset package;
2. reconcile the two previously identified missing T01 variants;
3. map each V1 token/loop/visibility/theme behavior through the M10 adapter;
4. render representative V1 data;
5. compare against the Golden Baseline;
6. record evidence-backed compatibility state for each template.

No V1 template is promoted merely because it can be mounted in the browser.

## Measurement boundary

M12 produces measured semantic blocks but does not itself decide page breaks.

M4 remains authoritative for:

- page flow;
- keep-together;
- splitting;
- overflow;
- manual breaks;
- page count.

This keeps browser measurement separate from pagination policy.

## Golden Baseline protection

No CSS redesign is introduced.

No template is recreated from screenshots.

Existing V1 presentation remains the visual reference until the controlled final UI/CSS modernization phase.

## Acceptance status

M12 foundation is implemented.

Remaining gates:

- actual V1 source ingestion;
- V1 token/loop/visibility mapping;
- browser rendering against each recovered template;
- real DOM measurements;
- M4 integration with measured blocks;
- V1 visual regression evidence;
- output regression against the Golden Baseline.

Runtime tests must be executed in a Node/browser-capable environment before full acceptance.
