# M3 — Template Engine and V2 Template Compatibility

**Status:** Implemented foundation; V1 visual compatibility remains pending source/asset validation.

## 1. Objective

M3 establishes the V2 template boundary without allowing presentation templates to become owners of career data.

The implementation introduces:

- a template definition contract;
- a template registry;
- capability states;
- compatibility evaluation;
- template configuration switching;
- an explicit V1 template catalog.

It does **not** claim that any V1 template has passed visual or asset compatibility validation.

## 2. Implemented Components

### Template engine
`src/templates/template-engine.js`

Provides:
- versioned template definitions;
- lifecycle statuses;
- capability states;
- normalized metadata;
- registry registration/replacement/lookup/listing;
- compatibility evaluation;
- compatibility explanations;
- template configuration switching.

### V1 catalog
`src/templates/v1-template-catalog.js`

Records the nine logical V1 template IDs recovered during the V1 audit.

Because the actual V1 archive/assets are not currently available to the implementation runtime, the catalog deliberately marks the templates as **Asset Reconciliation Required** and their content capabilities as **Unknown**.

This is intentional. Unknown is not treated as Supported.

## 3. No-Silent-Loss Boundary

Compatibility evaluation distinguishes:
- Supported;
- Supported with Constraints;
- Adaptable;
- Unsupported but Preserved;
- Unknown;
- Retired.

A template switch only changes presentation configuration. It does not mutate authoritative career data.

Unsupported content therefore remains preserved for later use with another compatible presentation.

## 4. V1 Preservation

The catalog contains the nine audited V1 logical IDs:

1. t01-modern-minimalist-cv-design_ats
2. t01-modern-minimalist-cv-design_modern
3. t01-modern-minimalist-cv-design_simple
4. t02-professional-cv-design_modern
5. t03-professional-cv-design_modern
6. t04-modern-blue-corporate_modern
7. t05-simple-cv-graphic-web-designer_modern
8. t06-professional-cv-graphic-designer_modern
9. t07-professional-cv-store-manager-incharge_modern

The catalog is not a substitute for the V1 source. Before any template becomes V2-Compatible, its source/assets must be recovered, normalized/adapted, rendered, and compared with the Golden Baseline.

## 5. Testing

M3 test coverage includes:
- template registration;
- duplicate prevention;
- capability normalization/evaluation;
- preserved-content detection;
- constrained compatibility;
- configuration switching;
- V1 catalog completeness;
- explicit asset-reconciliation state.

The test file is:
`tests/m3/template-engine.test.js`

**Runtime execution status:** not claimed in this milestone record. Tests should be run in a Node environment before M3 is marked fully accepted.

## 6. Acceptance Status

M3 foundation is implemented.

M3 is **not fully accepted** until:
1. V1 source/assets are available;
2. each V1 template receives an evidence-backed compatibility state;
3. V1 template adapters are implemented where required;
4. visual regression evidence is captured;
5. pagination/export compatibility is validated;
6. no silent content loss is demonstrated.

## 7. Next Gate

The next dependency is **M4 — Layout and Pagination Engine**.

V1 template adapters remain a parallel compatibility track and must be validated before each affected template is published.

## 8. Governance

No UI/CSS modernization is introduced by M3.

The V1 visual baseline remains protected.
