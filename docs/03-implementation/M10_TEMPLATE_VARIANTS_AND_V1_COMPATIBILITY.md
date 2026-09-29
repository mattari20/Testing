# M10 — Template Variants and V1 Compatibility Adapter

**Status:** Implemented foundation; V1 asset/visual compatibility remains conditional.

## Objective

M10 connects the V2 Template Engine to the Presentation Variant system and creates an explicit adapter boundary for recovered V1 templates.

The core rule is:

**One canonical career-data model → multiple presentation variants → template-specific compatible presentation.**

## Implemented

### 1. V1 Compatibility Adapter
File: `src/templates/template-compatibility-adapter.js`

The adapter represents the approved conceptual translation:

- V1 scalar tokens → V2 field bindings
- V1 object loops → V2 repeatable-entry bindings
- V1 primitive loops → V2 repeatable-value bindings
- V1 visibility blocks → V2 document/presentation visibility bindings
- V1 theme variables → V2 presentation theme bindings

It also provides readiness diagnostics and a safe template-switch boundary.

This adapter does **not** recreate missing V1 templates and does **not** claim visual compatibility.

### 2. Presentation Variant Engine
File: `src/templates/presentation-variant-engine.js`

Provides:

- field, entry, section and document variant levels;
- versioned variant definitions;
- variant registry;
- template/field/section/semantic/data-type compatibility checks;
- compatible-variant listing;
- explicit fallback selection;
- per-targeted-CV presentation selection storage;
- validation of saved variant selections.

Variant configuration is presentation state. It does not mutate canonical career data.

### 3. V1 safety

Unknown/unsupported compatibility remains preserved rather than silently converted.

A variant cannot create a factual proficiency value. Visual representations such as percentages/stars require compatible source semantics; the engine does not invent them.

### 4. Template switching

M10 keeps template switching separate from career data. Switching writes presentation configuration only. Existing Master Profile and Targeted CV source data remain outside the adapter.

## Tests

Test file:

`tests/m10/template-compatibility-variants.test.js`

Coverage includes:

- variant creation and registry;
- supported/incompatible variant evaluation;
- compatible variant discovery;
- approved fallback selection;
- per-scope variant persistence;
- variant selection validation;
- V1 token/loop/visibility/theme mapping;
- adapter readiness.

Runtime execution must be performed before the milestone is declared fully accepted.

## Acceptance status

M10 foundation is implemented.

M10 remains conditionally accepted until:

1. V1 source/assets are reconciled;
2. each V1 template receives evidence-backed compatibility state;
3. actual adapter mappings are validated against recovered V1 template source;
4. visual regression is captured against the Golden Baseline;
5. variant rendering is integrated with actual preview/layout/export paths;
6. no-silent-loss behavior is demonstrated end-to-end.

## Governance

No frontend/CSS modernization is introduced.

The V1 UI/CSS preservation contract remains active. UI modernization remains a later controlled phase.
