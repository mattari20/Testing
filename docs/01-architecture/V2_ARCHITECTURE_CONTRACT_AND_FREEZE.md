# CV Builder V2 — Architecture Contract and Freeze Preparation

## 1. Purpose

This document converts the approved V1 → V2 reconciliation into the formal architecture contract for CV Builder V2.

It defines:
- module boundaries;
- responsibilities;
- data ownership;
- dependency direction;
- inputs and outputs;
- invariants;
- extension points;
- compatibility adapters;
- migration boundaries;
- testing boundaries;
- architecture-freeze rules.

It does **not** select a programming language, framework, database engine, hosting provider, search provider, map provider, AI provider, payment provider or other implementation technology.

## 2. Architectural objective

V2 is a clean rebuild of the core architecture around explicit domains and contracts.

The architecture must preserve the V1 Golden Baseline while eliminating V1 limitations such as:
- fixed schema assumptions;
- template-owned rendering logic;
- fixed field mappings;
- one-CV storage assumptions;
- image-slicing pagination as the primary document model;
- direct coupling between editor behavior and rendering;
- direct coupling between rendering and AI, ads, payments or cloud services.

Core principle:

> **Canonical career data → document configuration → presentation variants → template → layout → preview/export**

## 3. Architectural layers

The V2 platform is organized into six conceptual layers.

### Layer A — Career Data

Owns reusable career information.

Includes:
- Master Career Profile;
- profile assets;
- reusable education;
- experience;
- skills;
- projects;
- certifications;
- achievements;
- publications/research;
- custom profile information.

### Layer B — Document Core

Owns a particular CV document.

Includes:
- targeted CV identity;
- selected source content;
- document-specific visibility;
- section/field ordering;
- document overrides;
- selected presentation variants;
- selected template;
- theme/presentation configuration.

### Layer C — Presentation

Owns visual representation.

Includes:
- template definitions;
- template metadata;
- presentation variants;
- semantic layout blocks;
- page model;
- pagination;
- preview rendering.

### Layer D — Intelligence

Consumes structured document/profile data without owning it.

Includes:
- Resume Health / ATS Readiness;
- Job Matching;
- Skill Evidence;
- AI assistance;
- import extraction/confidence analysis.

### Layer E — Distribution and Commercial

Includes:
- Template Library;
- online CV;
- PDF/DOCX distribution;
- analytics;
- advertising boundary;
- entitlement/product catalog.

### Layer F — Platform / Integrations

Includes:
- optional accounts;
- optional cloud persistence;
- future Career Wallet;
- future application workspace;
- external integrations.

The renderer must remain independent from Layers E and F.

## 4. Module map

| Module | Owns | Must not own |
|---|---|---|
| Master Profile | reusable career data | template styling or ad/payment state |
| Document Engine | CV document lifecycle/configuration | raw template CSS or AI provider state |
| Section & Field Engine | field/section definitions, ordering, visibility, repeatability | template-specific layout |
| Template Engine | template metadata/rendering contract/compatibility | authoritative career data |
| Variant Engine | approved presentation variants | semantic source data |
| Layout & Pagination | semantic blocks, pages, overflow | user profile persistence |
| Preview Engine | interactive preview and editor bridge | independent copy of CV truth |
| PDF Export | PDF output | authoritative document state |
| Word Export | editable DOCX output | authoritative profile data |
| Storage & Version | persistence/recovery/version history | visual rendering decisions |
| Migration & Import | V1 migration/import/review | final authority over user approval |
| ATS / Resume Health | analysis findings | editing user data directly |
| Job Matching | JD extraction/matching | claiming user skills |
| Skill Evidence | evidence relationships | inventing evidence |
| AI Intelligence | suggestions | authoritative user facts |
| Template Library | discovery/distribution metadata | document source data |
| Cover Letter | cover-letter documents | Master Profile ownership |
| Online CV | publication configuration | canonical career ownership |
| Analytics | event records/reporting | raw CV content |
| Entitlement | capability access | renderer implementation |
| Advertising Boundary | ad inventory/privacy | CV document content |
| Platform/Account | identity/authorization | presentation semantics |

## 5. Dependency direction

The preferred dependency direction is:

**Career Data**
→ **Document Core**
→ **Presentation**
→ **Output**

Intelligence may consume Career Data and Document Core through explicit read/analysis contracts:

**Career Data / Document Core**
→ **Intelligence**

Distribution and commercial services consume approved capability metadata:

**Document / Template / Export capabilities**
→ **Distribution / Entitlement / Analytics**

The following direct dependencies are prohibited:

- Renderer → specific AI provider;
- Renderer → payment provider;
- Renderer → advertising provider;
- Document Core → specific cloud storage provider;
- Document Core → specific job platform;
- Template → Master Profile storage;
- Template → entitlement/payment implementation;
- Analytics → raw CV content as a default requirement;
- AI → authoritative mutation without user approval.

## 6. Master Profile contract

### Responsibility

The Master Profile is the reusable source of career information.

It may contain more information than any individual CV.

### Required properties

- structured;
- extensible;
- user-controlled;
- independently persisted;
- versionable;
- reusable across multiple targeted CVs.

### Invariant

> Selecting a template, hiding a field, changing a presentation variant or editing a targeted CV must not silently destroy Master Profile source data.

### Output

The Master Profile provides authorized source data to Document Configuration and intelligence services.

## 7. Document Engine contract

A Targeted CV is a document configuration over authorized source data.

It owns:
- document identity;
- target role/purpose;
- selected content;
- visibility;
- section order;
- field order;
- document-specific overrides;
- presentation variants;
- template selection;
- theme/presentation settings;
- document version state.

It does not own:
- template CSS;
- payment state;
- AI provider credentials;
- advertising state;
- external job-platform records.

### Invariant

A targeted CV may differ from another CV while both remain connected to the same Master Profile source.

## 8. Section & Field Engine contract

The Section & Field Engine replaces fixed V1 rendering/input assumptions.

It must support:
- standard sections;
- custom sections;
- standard fields;
- custom fields;
- field types;
- repeatable items;
- nested structures where appropriate;
- section ordering;
- field ordering;
- visibility;
- labels;
- metadata;
- validation;
- compatibility metadata.

### Extension rule

Adding a supported new section or field type must not require rewriting the Document Engine or every template.

### V1 compatibility

The engine must provide mappings for:
- personal fields;
- summary;
- education;
- experience;
- projects;
- skills;
- languages;
- achievements;
- section visibility;
- field visibility.

## 9. Template Engine contract

A template is a versioned presentation definition.

Minimum conceptual metadata:
- ID;
- version;
- name;
- career level;
- industry;
- style;
- supported sections;
- supported field types;
- supported presentation variants;
- photo support;
- column model;
- page model;
- theme support;
- ATS/accessibility profile;
- lifecycle status;
- Web/PDF/DOCX/blank-DOCX capability;
- demo assets;
- commercial reference where applicable.

### Template invariant

> A template may request and render data; it never becomes the authoritative owner of that data.

### Lifecycle

**Draft → Testing → Published → Deprecated → Retired**

Only Published templates may be generally selectable.

## 10. Presentation Variant contract

Presentation variants define approved ways of displaying the same semantic data.

Examples:
- language proficiency as text/bar/stars/percentage;
- education as timeline/list/two-column;
- experience as traditional/timeline/compact;
- skills as text/tags/grouped/level representation.

### Invariants

- variant selection does not mutate semantic content;
- each variant has compatibility metadata;
- incompatible variants are identified explicitly;
- fallback behavior is explicit;
- variant selection can be stored per targeted CV;
- variants must remain compatible with accessibility and export requirements.

## 11. Layout & Pagination contract

The Layout Engine converts semantic document content into a page-aware representation.

It owns:
- paper model;
- page dimensions;
- margins;
- spacing;
- semantic blocks;
- keep-together rules;
- orphan prevention;
- manual breaks;
- overflow detection;
- page count;
- page assignment;
- layout diagnostics.

### A4

A4 portrait is the initial first-class model.

Future paper sizes may be added without changing the semantic document model.

### Invariant

Long documents must flow to additional pages rather than being forced into one page through impractical text shrinking.

## 12. Preview Engine contract

The Preview Engine presents the current Document Configuration through a compatible Template and Layout result.

It must support:
- live update;
- responsive preview;
- page navigation;
- page thumbnails;
- zoom;
- preview-side editing where enabled;
- click-to-edit mapping;
- current page awareness;
- export-consistent pagination.

### Single-source-of-truth rule

The preview must not become an independent authoritative copy of document data.

Preview edits must write through the same canonical document model used by the structured editor.

## 13. Export contracts

### PDF Export

Input:
- validated Document Configuration;
- selected Template;
- resolved Presentation Variants;
- Layout/Pagination result;
- required assets.

Output:
- complete A4 PDF;
- all content preserved;
- stable page order;
- validated page count;
- no editor UI.

### Word Export

Input:
- structured Document Configuration;
- Word-compatible template definition;
- supported layout/content contract.

Output:
- editable DOCX;
- structured content;
- reusable styles;
- no screenshot-as-document behavior.

### Blank Word Template

A separate distribution asset.

It may contain placeholders and reusable styles but is not the same product as user-data DOCX export.

## 14. Storage & Version contract

The storage layer must support:
- local-first operation;
- autosave;
- draft state;
- recovery;
- backup/export;
- restore/import;
- schema versioning;
- migration;
- multiple targeted CVs;
- version history.

Optional account/cloud persistence must sit behind a replaceable storage boundary.

### Invariant

The no-login path remains valid.

## 15. Migration & Import contract

### V1 migration

Input:
- actual V1 local data fixtures;
- V1 schema/version information.

Process:
**detect → normalize → map → validate → migrate → verify**

Output:
- valid V2 Master Profile/document data;
- preserved visibility;
- preserved theme;
- preserved repeatable content.

### External document import

Initial conceptual inputs:
- PDF;
- DOCX;
- structured data.

Process:
**upload → extract → map → confidence → review → user approval → authoritative update**

Uncertain extraction must remain visibly uncertain until approved.

## 16. ATS / Resume Health contract

The ATS engine consumes a structured CV representation and returns explainable findings.

Output should support:
- category;
- issue;
- reason;
- evidence;
- recommended fix;
- severity/priority where defined;
- optional summary score.

The system must not represent an ATS score as a guarantee of employer-system acceptance.

## 17. Job Matching contract

Input:
- structured CV/document;
- user-supplied job description.

Output:
- extracted requirements;
- matched requirements;
- missing requirements;
- weak/unclear areas;
- terminology/keyword alignment;
- skill gaps;
- improvement suggestions;
- optional summary score.

The engine must distinguish:
- requirement present;
- related evidence;
- missing;
- uncertain.

It must not convert a missing requirement into a claim that the user possesses it.

## 18. Skill Evidence contract

The Skill Evidence Engine links claimed skills to supporting CV evidence.

Evidence may come from:
- experience;
- projects;
- education;
- certifications;
- publications;
- other approved career records.

If evidence is absent, the system may prompt the user for legitimate evidence.

It must never invent evidence.

## 19. AI Intelligence contract

AI is an optional assistance service.

Input may include:
- selected CV content;
- user instructions;
- job description;
- analysis findings.

Output must be classified as:
- suggestion;
- proposed revision;
- explanation;
- draft content.

### Approval rule

AI output must not silently replace authoritative user content.

### Anti-fabrication rule

AI must not invent:
- employment history;
- employers;
- qualifications;
- dates;
- achievements;
- metrics;
- skills;
- credentials.

If information is missing, the workflow must ask the user or use an explicit placeholder.

### Provider neutrality

The architecture exposes an AI capability contract, not a dependency on one provider.

## 20. Cover Letter contract

A cover letter is a separate career document that may consume:
- Master Profile data;
- selected CV data;
- job description;
- user instructions.

It must support:
- general;
- job-specific;
- CV-aware;
- JD-aware;
- editable;
- PDF/DOCX output;
- multiple versions.

It remains separate from the CV Document Core while using compatible career-data contracts.

## 21. Template Library contract

The Template Library consumes Template metadata and provides:
- discovery;
- filters;
- full preview;
- Demo Profile;
- Build Online;
- Try with My Data;
- Sample PDF;
- Blank Word availability;
- DOCX export availability;
- premium/free presentation;
- compatibility information;
- future comparison/recommendation.

The library must never become a second source of template definitions.

## 22. Online CV contract

Future Online CV publication consumes an authorized CV/document version.

It supports conceptual visibility:
- public;
- link-only;
- private.

Search-engine visibility must be independently controllable where publishing supports indexing.

Online CV publication must not duplicate or fork authoritative career data.

## 23. Analytics contract

Analytics receives defined events, not arbitrary document content.

Event examples:
- CV created;
- template viewed;
- template selected;
- export started/completed;
- ATS analysis run;
- job match run;
- AI suggestion accepted;
- Word download;
- public CV view where enabled.

Analytics must:
- use stable taxonomy;
- support privacy controls;
- avoid sensitive CV content by default;
- support retention policy;
- support secure configuration.

## 24. Entitlement contract

Commercial access follows:

**Product/Capability → Entitlement → User Access**

The entitlement layer may represent:
- free;
- premium;
- subscription;
- credit/package;
- promotional;
- administrative grant;
- expired;
- revoked;
- refunded.

Feature modules query capability access through the entitlement boundary rather than embedding payment-provider logic.

## 25. Advertising boundary

Advertising is external to the professional CV document.

The boundary owns:
- ad inventory;
- placement rules;
- consent/privacy integration;
- ad-free entitlement behavior;
- provider integration.

The CV renderer must not depend on an advertising provider to render or export a CV.

## 26. Compatibility adapter strategy

During migration, compatibility adapters may temporarily translate:

### V1 → V2
- legacy local storage → V2 document/profile model;
- V1 field names → metadata-driven fields;
- V1 visibility flags → document configuration;
- V1 theme → presentation theme;
- V1 template tokens → V2 template contract;
- V1 DOM hooks → V2 editor adapter.

### Adapter rules

1. Adapters are temporary compatibility boundaries.
2. Adapters must not become the new core architecture.
3. Each adapter must have tests.
4. Removal requires proof that no supported V1 path depends on it.
5. Adapters must not change user-visible behavior silently.

## 27. V1 template compatibility boundary

The V1 templates are preserved as Golden Baseline presentation assets during core migration.

The compatibility layer must support:
- existing scalar tokens;
- repeatable loops;
- visibility behavior;
- theme propagation;
- A4 assumptions.

Where V1 template behavior conflicts with a stronger V2 contract, compatibility translation should occur at the Template Engine boundary rather than contaminating the Document Core.

## 28. Security boundaries

Security responsibilities must be explicit.

### Input boundary
- validate uploads;
- sanitize untrusted content;
- reject unsupported/malicious formats.

### Data boundary
- protect career data;
- enforce authorization;
- support user-controlled export/delete where implemented.

### Service boundary
- secrets are deployment configuration, never source code;
- external providers are isolated behind service contracts.

### Analytics boundary
- no raw CV content by default;
- event data is minimized.

### Commercial boundary
- payment security is delegated to the selected payment architecture;
- renderer receives entitlement results, not payment credentials.

## 29. Error and recovery principles

The architecture should prefer explicit recoverable states over silent failure.

Examples:
- unsupported template content → compatibility notice;
- import uncertainty → review state;
- export failure → actionable export error;
- unavailable premium capability → entitlement explanation;
- missing asset → template validation failure;
- invalid legacy data → migration warning/recovery path.

Silent deletion or silent fallback is prohibited for user career data.

## 30. Testing boundaries

Each module must have tests at its contract boundary.

### Contract-level tests
- data mapping;
- visibility;
- template compatibility;
- variant compatibility;
- pagination;
- export;
- migration;
- AI approval;
- import confidence;
- entitlement decisions.

### Golden Baseline tests
The V1 system remains the reference for:
- fields;
- sections;
- visibility;
- templates;
- theme;
- preview;
- mobile behavior;
- desktop behavior;
- PDF output;
- public template discovery.

### Security tests
- secret scanning;
- authorization;
- upload validation;
- privacy checks;
- analytics payload checks.

## 31. Architecture invariants

The following are non-negotiable:

1. Canonical career data is independent from templates.
2. Master Profile is not destructively changed by targeted CV presentation.
3. A targeted CV can select/hide content without deleting source data.
4. Templates control presentation, not career ownership.
5. Presentation variants do not mutate semantic meaning.
6. Preview and editor share the same authoritative document model.
7. PDF and DOCX are output representations, not sources of truth.
8. Layout/pagination is independent from the editor UI.
9. AI is not required to render a CV.
10. Ads are not required to render/export a CV.
11. Payments are not required to render a CV.
12. Cloud/account services are not required for anonymous local-first use.
13. Imported data is not authoritative until user review/approval where required.
14. Unsupported content is never silently deleted.
15. V1 compatibility adapters do not become permanent domain ownership.
16. UI/CSS modernization is not part of the core migration.
17. Secrets never enter source-controlled V2 content.
18. Every V1 capability has a V2 owner or an explicit documented replacement.

## 32. Architecture freeze checklist

### Domain boundaries
- [ ] Career Data / Master Profile approved.
- [ ] Document Engine approved.
- [ ] Section & Field Engine approved.
- [ ] Template Engine approved.
- [ ] Variant Engine approved.
- [ ] Layout/Pagination approved.
- [ ] Preview Engine approved.
- [ ] PDF Export approved.
- [ ] Word Export approved.
- [ ] Storage/Version approved.
- [ ] Migration/Import approved.
- [ ] ATS/Resume Health approved.
- [ ] Job Matching approved.
- [ ] Skill Evidence approved.
- [ ] AI boundary approved.
- [ ] Cover Letter boundary approved.
- [ ] Online CV boundary approved.
- [ ] Analytics boundary approved.
- [ ] Entitlement boundary approved.
- [ ] Advertising boundary approved.

### Cross-boundary invariants
- [ ] No template-owned career data.
- [ ] No renderer-owned payment logic.
- [ ] No renderer-owned AI provider.
- [ ] No renderer-owned cloud dependency.
- [ ] No silent data deletion.
- [ ] No silent compatibility fallback.
- [ ] No AI silent replacement of authoritative content.
- [ ] No raw CV content in analytics by default.

### V1 compatibility
- [ ] V1 fields mapped.
- [ ] V1 sections mapped.
- [ ] V1 visibility mapped.
- [ ] V1 themes mapped.
- [ ] V1 templates mapped.
- [ ] V1 mobile/desktop behavior mapped.
- [ ] V1 export paths mapped.
- [ ] V1 migration fixtures defined.
- [ ] missing assets reconciled.
- [ ] exposed credentials/security blocker resolved.

## 33. Implementation authorization gate

This architecture contract authorizes **architecture planning**, not uncontrolled application coding.

Before implementation begins, the project should produce:
1. finalized domain/data contracts;
2. document lifecycle/state model;
3. template/variant contracts;
4. pagination contract;
5. storage/version contract;
6. migration fixture plan;
7. export contracts;
8. intelligence input/output contracts;
9. security/privacy boundary specification;
10. test strategy and Golden Baseline fixture set.

After those are approved, implementation can proceed module-by-module against the frozen contracts.

## 34. Next milestone

The next controlled documentation milestone is:

**V2 Domain/Data Contract Specification**

It should define the conceptual entities and relationships for:
- Master Profile;
- Career Data;
- Targeted CV;
- Document Configuration;
- Sections;
- Fields;
- Repeatable entries;
- Presentation Variants;
- Templates;
- Template versions;
- Assets;
- Layout blocks/pages;
- Export jobs/results;
- Import/review records;
- ATS findings;
- Job Match findings;
- AI suggestions/approval states;
- Cover Letters;
- Entitlements;
- Analytics events.

The specification must remain technology-neutral and must not become a database schema.

No application code is authorized by this document.
