# V1 → V2 Master Reconciliation

## Purpose

This document is the canonical reconciliation index between the audited V1 system and the V2 architecture. It records what V2 preserves, upgrades, replaces, or reserves for later work.

## Governing rule

V1 source code is not the V2 architectural base. V1 behavior, data, visual output, templates, integrations, and edge cases are the Golden Baseline. V2 is the intended final production architecture.

No V1 capability may disappear silently.

## 1. Core document model

| V1 capability | V2 owner | Status |
|---|---|---|
| Personal information | Career Document Core / Section-Field model | Implemented |
| Summary | Career Document Core | Implemented |
| Education | Repeatable section model | Implemented |
| Experience | Repeatable section model | Implemented |
| Projects | Repeatable section model | Implemented |
| Skills | Primitive/repeatable values | Implemented |
| Languages | Primitive/repeatable values | Implemented |
| Achievements | Repeatable section model | Implemented |
| Photo | Asset/document configuration boundary | Implemented |
| Section visibility | Canonical visibility model + editor commands | Implemented |
| Field visibility | Canonical visibility model + editor commands | Implemented |
| Theme/presentation state | Document configuration / presentation variants | Implemented |
| Local persistence | Lifecycle/session/storage boundaries | Implemented |
| Template selection | Template registry + selection controller | Implemented |
| Live preview | Preview engine + editor preview flow | Implemented |
| Mobile/desktop presentation | Preview/export boundaries | Architecture preserved |
| PDF/print | Export engine and adapters | Runtime evidence pending |
| DOCX | DOCX generation/export boundary | Runtime evidence pending |
| V1 migration | Import/migration engine | Runtime evidence pending |

## 2. V1 rendering/template contract

V1 scalar tokens, repeatable loops, visibility blocks, escaping, validation, theme behavior and template-specific presentation are mapped into the V2 Template Engine, compatibility adapter and Native V2 Template Renderer.

Seven recovered V1 HTML templates are stored under src/templates/assets/v1/ and seven corresponding Native V2 templates are stored under src/templates/assets/v2/.

The following historical V1 variants remain unresolved because their original source was not supplied:
- T01 ATS
- T01 Simple

They are not recreated by assumption.

## 3. Editor behavior

V1 editor behavior is mapped into:
- Editor Session
- Editor Command Contract
- Editor Command Executor
- Editor Runtime
- DOM Controller
- Form Renderer
- Section Editor Controller
- Template Controller
- Live Preview
- Browser Evidence

The V2 editor owns canonical data; presentation state must not become the data source of truth.

## 4. Pagination and preview

V1 mobile PDF used image capture and slicing. V2 replaces that mechanism with semantic layout/pagination architecture while preserving the user requirement of complete A4 multi-page output.

Current V2 path:

Canonical Document → Assembly → Template Rendering → Browser Measurement → Semantic Layout/Pagination → Paginated Preview → Export

M100–M109 define and connect the current editor pagination/layout boundaries. Browser runtime remains evidence-gated.

## 5. Intelligence and AI

V1 helper behavior such as summary suggestion is preserved as a capability boundary. V2 expands this into ATS readiness, Job Description matching, skill/keyword evidence, explainable findings, controlled AI suggestions, provenance and anti-fabrication rules.

AI must never become an authority that silently changes canonical career facts.

## 6. Tracking/reporting

V1 tracking/reporting intent is preserved through the V2 analytics/tracking boundary. The V1 plaintext database credential issue remains a security gate; credentials are not carried into V2 source.

## 7. Public/template discovery

V1 template discovery, preview and build flows are mapped to the V2 Template Library, Preview/Demo Profile and Build Online boundaries.

## 8. Explicit V2 upgrades

V2 intentionally expands beyond V1 with:
- Master Profile
- multiple Targeted CVs
- custom sections/fields
- section/field ordering
- cloning/versioning
- structured import
- PDF/DOCX import boundaries
- ATS intelligence
- Job Match
- AI assistance with approval
- Online CV
- Cover Letter
- career ecosystem boundaries
- privacy/security/entitlement architecture

These are additions, not silent replacements for existing V1 capabilities.

## 9. Retirement rule

V1 runtime/adapters are temporary migration and regression infrastructure. They are not the intended permanent production runtime.

A V1 capability may be retired only after:
1. a V2 owner or explicit replacement exists;
2. migration behavior is evidenced where applicable;
3. functional/visual regression requirements are satisfied;
4. the retirement is recorded.

## 10. Current reconciliation status

### Reconciled
- V1 data domains
- visibility model
- template model
- template rendering contract
- editor command ownership
- preview/layout ownership
- export boundaries
- security boundary
- V1 Golden Baseline storage for seven recovered templates

### Conditional / evidence pending
- missing T01 ATS source
- missing T01 Simple source
- missing historical asset references
- production credential rotation/revocation
- V2 repository history secret verification
- Golden Baseline output fixtures
- real browser/CI validation
- final V1 runtime retirement

## 11. Authority

This document is an index, not permission to ignore the more detailed preservation and architecture contracts. Where a detailed contract exists, that contract governs the specific behavior.
