# V2 Implementation Blueprint and Work Breakdown

**Status:** Implementation planning  
**Authority:** Approved V2 architecture contract set  
**Implementation status:** Planning only; no application code introduced

## 1. Purpose

This document translates the approved V2 architecture into a controlled implementation plan.

It does not redefine architecture.

Its purpose is to establish:
- implementation domains;
- dependency order;
- work packages;
- acceptance criteria;
- test gates;
- V1 compatibility checkpoints;
- implementation sequencing;
- milestone boundaries.

## 2. Governing Rule

Implementation must proceed against the approved architecture contracts.

The implementation team must not:
- copy V1 architecture wholesale;
- bypass canonical data contracts;
- silently remove V1 capabilities;
- introduce technology choices that contradict approved boundaries;
- redesign UI/CSS during core migration without an approved change.

## 3. Implementation Source Hierarchy

Implementation planning uses these sources in order:

1. Approved architecture contracts;
2. V1 preservation contracts;
3. Master Capability Register;
4. Product Requirements;
5. Template Library/Distribution requirements;
6. Golden Baseline evidence;
7. This implementation blueprint.

This document organizes work; it does not override higher-level contracts.

## 4. Implementation Principles

1. Build the domain core before feature expansion.
2. Keep canonical data independent from presentation.
3. Build reusable engines rather than feature-specific patches.
4. Preserve V1 behavior through explicit compatibility layers.
5. Validate each layer before depending on it.
6. Keep import/migration reversible.
7. Treat templates as presentation assets with capability metadata.
8. Treat intelligence as derived analysis, not source data.
9. Treat exports as derived artifacts.
10. Keep security/privacy boundaries from the first implementation milestone.
11. Defer broad UI/CSS modernization until core parity is established.
12. Avoid premature implementation technology commitments where architecture is intentionally technology-neutral.

## 5. Dependency Graph

The primary dependency order is:

**Baseline/Safety**
→ **Domain/Data Core**
→ **Lifecycle/Persistence**
→ **Template Contract**
→ **Layout/Pagination**
→ **Preview**
→ **Export**
→ **Migration/Import**
→ **Intelligence**
→ **Distribution/Career Layer**
→ **Security/Commercial Hardening**
→ **Release Validation**

Some security controls and testing infrastructure begin earlier and continue throughout all stages.

## 6. Stage 0 — V1 Baseline and Safety Preparation

### Objective
Create the evidence and safety foundation required before core V2 implementation.

### Work Package 0.1 — V1 Asset Reconciliation
Recover or formally disposition:
- missing T01 ATS template source;
- missing T01 Simple template source;
- missing ATS preview asset;
- missing/extension-mismatched demo image asset.

### Work Package 0.2 — V1 Secret Reconciliation
- rotate/revoke exposed V1 credentials;
- remove secrets from source;
- review repository history;
- establish secure configuration boundary;
- revalidate tracking/reporting behavior.

### Work Package 0.3 — Golden Baseline Fixtures
Prepare representative fixtures for:
- personal data;
- summary;
- education;
- experience;
- projects;
- skills;
- languages;
- achievements;
- visibility combinations;
- themes;
- short CV;
- long CV;
- supported templates;
- mobile preview;
- desktop preview;
- PDF output.

### Work Package 0.4 — Regression Evidence
Capture stable evidence for:
- V1 visual output;
- template rendering;
- section behavior;
- visibility;
- theme behavior;
- PDF/page behavior.

### Acceptance Gate
Stage 0 passes when:
- required assets are reconciled;
- secrets are reconciled;
- baseline fixtures exist;
- Golden Baseline evidence is identifiable;
- no production credential remains in source used for V2.

---

## 7. Stage 1 — Canonical Domain and Data Core

### Objective
Build the authoritative V2 career-data model.

### Work Package 1.1 — Master Career Profile
Support:
- identity/contact career fields;
- professional links;
- education;
- experience;
- projects;
- skills;
- languages;
- achievements;
- certifications;
- awards;
- publications;
- volunteer work;
- internships;
- training/courses;
- licenses;
- memberships;
- leadership;
- research;
- conferences;
- interests;
- custom sections.

### Work Package 1.2 — Repeatable Data
Define consistent handling for:
- repeatable entries;
- ordering;
- addition/removal;
- empty states;
- optional fields.

### Work Package 1.3 — Custom Content
Support:
- custom sections;
- custom fields;
- repeatable custom items;
- field metadata;
- section ordering.

### Work Package 1.4 — Document Configuration
Support:
- selected content;
- section visibility;
- field visibility;
- ordering;
- presentation variants;
- template selection;
- theme/presentation settings.

### Work Package 1.5 — Assets
Establish canonical asset references for:
- photos;
- document images;
- template assets;
- other supported career-document assets.

### Acceptance Gate
Pass when:
- canonical data is independent from presentation;
- Master Profile and Targeted CV are distinct;
- visibility is distinct from deletion;
- custom content works conceptually;
- data versioning is defined;
- V1 supported fields can map without semantic loss.

### V1 Checkpoint
Verify V1 `window.cv`, `window.cvVisibility`, repeatable arrays, theme, and supported fields map into the V2 model.

---

## 8. Stage 2 — Lifecycle, Versioning and Persistence

### Objective
Make the domain recoverable and state-aware.

### Work Package 2.1 — Document Lifecycle
Implement approved states for:
- draft;
- active;
- archived;
- deleted;
- recovered.

### Work Package 2.2 — Versioning
Support:
- document versions;
- source version references;
- restoration;
- historical state.

### Work Package 2.3 — Autosave/Recovery
Support:
- safe autosave;
- recovery;
- interrupted-operation handling;
- explicit restoration.

### Work Package 2.4 — Import/AI/Analysis State
Provide lifecycle foundations for:
- import review;
- AI suggestions;
- ATS analysis;
- Job Match;
- export jobs.

### Acceptance Gate
Pass when:
- destructive actions have defined states;
- versions are distinguishable;
- recovery does not corrupt canonical data;
- analysis/export results can reference document versions.

---

## 9. Stage 3 — V2 Template Engine

### Objective
Convert presentation templates into formal V2 template contracts.

### Work Package 3.1 — Template Registry
Support:
- template ID;
- name;
- version;
- status;
- career level;
- industry;
- style;
- supported sections;
- supported fields;
- supported variants;
- theme capabilities.

### Work Package 3.2 — Output Capabilities
Declare:
- Web;
- PDF;
- Print;
- generated DOCX;
- blank DOCX;
- online CV;
- page model.

### Work Package 3.3 — Compatibility Matrix
Implement outcomes:
- Supported;
- Supported with Constraints;
- Adaptable;
- Unsupported but Preserved;
- Unknown;
- Retired.

### Work Package 3.4 — V1 Template Adapters
For each recovered V1 template:
**Recover → Normalize → Adapt → Validate**

Do not recreate a template unnecessarily.

### Acceptance Gate
Pass when:
- every required V1 template has a documented status;
- template capabilities are machine-readable conceptually;
- unsupported content cannot silently disappear;
- template switching preserves canonical data.

### V1 Checkpoint
All preserved V1 templates render required V1 content within approved visual tolerance.

---

## 10. Stage 4 — Layout and Pagination Engine

### Objective
Replace V1's implementation-specific page mechanism with semantic layout/pagination.

### Work Package 4.1 — Semantic Layout Blocks
Represent:
- sections;
- entries;
- headings;
- text blocks;
- lists;
- images;
- columns;
- page elements.

### Work Package 4.2 — Page Flow
Support:
- A4;
- margins;
- safe areas;
- page flow;
- dynamic page count.

### Work Package 4.3 — Flow Constraints
Support:
- keep-together;
- splittable content;
- orphan/widow prevention;
- manual breaks;
- controlled overflow.

### Work Package 4.4 — Measurement
Support deterministic layout measurement sufficiently for:
- preview;
- PDF;
- print;
- supported DOCX planning.

### Acceptance Gate
Pass when:
- short and long CVs paginate correctly;
- overflow is detected;
- page count is dynamic;
- content is not silently clipped;
- aggressive text shrinking is avoided.

### V1 Checkpoint
Preserved templates maintain their intended page structure and A4 behavior.

---

## 11. Stage 5 — Preview Engine

### Objective
Create a canonical live preview from the V2 document model.

### Work Package 5.1 — Renderer
Render:
- canonical fields;
- repeatable sections;
- custom content;
- visibility;
- variants;
- themes;
- template assets.

### Work Package 5.2 — Responsive Preview
Support:
- desktop;
- mobile;
- responsive scaling;
- page navigation;
- zoom.

### Work Package 5.3 — Preview Interaction
Where supported:
- click-to-edit;
- synchronized field updates;
- section navigation;
- variant changes.

### Acceptance Gate
Pass when preview is a faithful representation of canonical document state and layout.

### V1 Checkpoint
Compare supported V1 templates against Golden Baseline screenshots/evidence.

---

## 12. Stage 6 — Export Engines

### Objective
Produce validated distributable artifacts.

### Work Package 6.1 — PDF
Support:
- A4;
- multi-page;
- semantic page flow;
- images;
- typography;
- links where supported;
- metadata where appropriate.

### Work Package 6.2 — Print
Support:
- print page size;
- margins;
- page flow;
- print-safe output.

### Work Package 6.3 — DOCX
Support genuinely editable output where template capability permits.

### Work Package 6.4 — Artifact Lifecycle
Support:
- artifact identity;
- source version;
- template version;
- output type;
- validation state;
- immutable completed artifact.

### Acceptance Gate
Pass when all advertised output types validate successfully.

### V1 Checkpoint
PDF/print behavior for preserved V1 templates is compared with Golden Baseline outputs.

---

## 13. Stage 7 — Migration and Import

### Objective
Move existing and external documents into the canonical V2 model safely.

### Work Package 7.1 — V1 Migration
Map:
- legacy localStorage;
- canonical V1 localStorage;
- V1 CV state;
- visibility;
- theme;
- template selection;
- migration version.

### Work Package 7.2 — Structured Import
Accept supported structured career data.

### Work Package 7.3 — PDF/DOCX Import
Pipeline:
**Input → Extraction → Confidence → Provenance → Review → User Acceptance → Canonical Data**

### Work Package 7.4 — Conflict Handling
Support:
- source precedence;
- user choice;
- merge;
- preserve;
- reject.

### Work Package 7.5 — Recovery
Ensure failed migration/import can recover without destroying source data.

### Acceptance Gate
Pass when:
- migration is idempotent;
- no unexpected data loss occurs;
- imported information is reviewable;
- provenance is preserved;
- original source remains recoverable until success is established.

---

## 14. Stage 8 — Intelligence and AI

### Objective
Add explainable career intelligence after canonical data and document rendering are stable.

### Work Package 8.1 — Resume Health
Analyze:
- completeness;
- structure;
- chronology;
- consistency;
- clarity;
- evidence quality;
- parsing risks.

### Work Package 8.2 — ATS Readiness
Produce:
- findings;
- evidence;
- explanations;
- recommended actions;
- uncertainty where relevant.

### Work Package 8.3 — Skill Evidence
Connect skills to:
- experience;
- projects;
- education;
- certifications;
- other valid evidence.

### Work Package 8.4 — Job Match
Analyze:
- target role;
- skills;
- keywords;
- tools;
- responsibilities;
- qualifications;
- experience;
- matched/missing/weak/related evidence.

### Work Package 8.5 — AI Assistance
Support:
- summary;
- bullet improvement;
- achievement framing;
- job-specific tailoring;
- explanations;
- cover-letter assistance.

### Work Package 8.6 — AI Safety
Enforce:
- no fabricated facts;
- user approval;
- provenance;
- authorized context;
- uncertainty;
- no silent Master Profile mutation.

### Acceptance Gate
Pass only when adversarial AI tests and provenance/approval tests pass.

---

## 15. Stage 9 — Distribution and Career Layer

### Objective
Turn validated documents into controlled career-distribution surfaces.

### Work Package 9.1 — Online CV
Support:
- private;
- link-only;
- public;
- field-level public selection.

### Work Package 9.2 — Sharing
Support:
- controlled access;
- revocation;
- download permissions.

### Work Package 9.3 — Cover Letters
Support:
- standalone;
- CV-aware;
- Job Description-aware;
- editable;
- PDF/DOCX where supported.

### Work Package 9.4 — Application Workspace Foundations
Connect:
- Job Description;
- Targeted CV;
- cover letter;
- match analysis;
- application state.

### Acceptance Gate
Pass when distribution never bypasses private-data controls.

---

## 16. Stage 10 — Security, Commercial and Operational Hardening

### Work Package 10.1 — Security
Validate:
- authorization;
- ownership;
- uploads;
- secrets;
- abuse protection;
- secure failure.

### Work Package 10.2 — Privacy
Validate:
- data minimization;
- consent/choice;
- AI boundaries;
- analytics minimization;
- deletion;
- retention.

### Work Package 10.3 — Entitlements
Support:
- free/premium templates;
- AI capabilities;
- advanced intelligence;
- storage/feature entitlements.

### Work Package 10.4 — Accessibility
Validate:
- keyboard;
- focus;
- semantics;
- labels;
- contrast;
- non-color communication.

### Work Package 10.5 — Performance
Validate:
- long CVs;
- many entries;
- complex templates;
- large images;
- export;
- import;
- analysis.

---

## 17. Stage 11 — Final UI/CSS Modernization

This stage is intentionally late.

Only after core V2 parity and regression stability:

- modernize UI;
- refine visual system;
- improve interaction design;
- improve responsive UX;
- update cards/components;
- optimize accessibility presentation;
- preserve approved document/template output.

Any redesign must not silently change canonical behavior.

## 18. Cross-Stage Test Strategy

Every stage must have:

**Build → Test → Regression → Acceptance → Checkpoint → Next Stage**

No stage should accumulate unvalidated foundational changes.

## 19. Mandatory V1 Checkpoints

At minimum:

### Checkpoint A
V1 data → V2 canonical model.

### Checkpoint B
V1 template → V2 template adapter.

### Checkpoint C
V2 canonical model → V2 preview.

### Checkpoint D
V2 canonical model → PDF.

### Checkpoint E
V2 migration → final user-visible result.

### Checkpoint F
V1 Golden Baseline → V2 preserved output comparison.

## 20. Definition of Done

A work package is complete only when:

1. required behavior is implemented;
2. architecture contract is satisfied;
3. acceptance criteria pass;
4. relevant regression tests pass;
5. V1 preservation impact is checked;
6. security/privacy impact is checked;
7. documentation is updated where required;
8. no known silent data loss exists.

## 21. Blocking Conditions

Stop progression when a work package reveals:
- canonical data corruption;
- silent migration loss;
- template content loss;
- unauthorized data exposure;
- credential exposure;
- broken export integrity;
- unsafe AI fabrication;
- architecture contradiction.

Do not patch around a foundational contradiction without review.

## 22. Work Package Tracking

Each implementation work package should track:

- ID;
- objective;
- dependencies;
- affected contracts;
- inputs;
- outputs;
- acceptance criteria;
- test requirements;
- V1 checkpoint;
- security/privacy considerations;
- status;
- blockers;
- evidence.

## 23. Recommended First Implementation Milestone

The first coding milestone should be:

**M1 — Canonical Career Document Core**

Scope:
- Master Profile;
- Targeted CV;
- Document Configuration;
- sections;
- fields;
- repeatable entries;
- custom fields/sections;
- visibility;
- ordering;
- presentation configuration;
- versioning foundation.

Explicitly excluded from M1:
- full visual redesign;
- ATS;
- Job Match;
- AI generation;
- public CV;
- monetization;
- broad external integrations.

M1 establishes the stable data foundation on which later engines depend.

## 24. M1 Acceptance Gate

M1 is complete only when:

- Master Profile exists as authoritative career data;
- Targeted CV can reference/select career data;
- visibility is independent of deletion;
- repeatable sections work;
- custom content works;
- ordering works;
- presentation settings are separate from career facts;
- versioning foundation exists;
- V1 supported data can be represented without semantic loss;
- representative fixtures pass.

## 25. Technology-Neutral Constraint

This blueprint deliberately does not select:
- programming language;
- framework;
- database engine;
- hosting provider;
- search provider;
- map provider;
- AI provider;
- payment provider.

Those choices must be made only through an approved implementation decision process when necessary.

## 26. Implementation Governance

The implementation team should not create feature-specific architecture in isolation.

When a task exposes a missing architectural rule:
1. stop the affected decision;
2. identify the missing boundary;
3. document the proposed change;
4. review contract impact;
5. approve the change;
6. then continue implementation.

## 27. Final Blueprint Invariants

1. Implementation follows architecture.
2. Domain/data precedes dependent feature engines.
3. Canonical data remains independent from presentation.
4. V1 is a compatibility baseline, not a V2 architecture.
5. No-silent-loss applies throughout implementation.
6. Templates are adapted before replacement is considered.
7. Layout is semantic.
8. Export is derived.
9. Intelligence is derived.
10. AI cannot become authoritative career data.
11. Public distribution is explicit.
12. Security/privacy are continuous requirements.
13. UI/CSS modernization is deferred until core parity.
14. Every major stage has an acceptance gate.
15. Foundational failures block downstream expansion.
16. Architecture changes require controlled approval.

## 28. Next Step

The next controlled milestone is:

**M0 — V1 Baseline, Asset and Security Reconciliation**

Before M1 coding begins, complete:
- V1 missing asset reconciliation;
- V1 credential/security reconciliation;
- Golden Baseline fixture preparation;
- template compatibility inventory;
- initial regression evidence.

After M0 passes, begin **M1 — Canonical Career Document Core**.

**No application code is introduced by this blueprint.**
