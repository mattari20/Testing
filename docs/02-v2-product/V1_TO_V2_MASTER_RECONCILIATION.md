# CV Builder V2 — V1 → V2 Master Reconciliation

## 1. Purpose

This document is the final reconciliation control between the working CV Builder V1 Golden Baseline and the planned V2 architecture.

Its purpose is to ensure that V2 is a clean architectural rebuild **without silent functional loss**. V1 source code is not the architectural base, but the working V1 system remains the authoritative baseline for:

- user-visible behavior;
- data fields and sections;
- visibility controls;
- templates and visual output;
- preview behavior;
- mobile and desktop export;
- migration expectations;
- public template discovery;
- tracking/reporting intent.

V2 may replace implementation mechanisms where this produces a stronger architecture, but every replacement must have an explicit owner, migration method and regression requirement.

## 2. Governing principles

1. **No silent loss.** Every V1 capability has an identified V2 destination or an explicit documented replacement.
2. **V1 is the Golden Baseline.** Existing behavior and visual output are compatibility targets.
3. **V2 is not a blind rewrite.** The architecture is rebuilt around explicit domain boundaries and contracts.
4. **Data is independent from presentation.** Templates render document data; they do not own career data.
5. **Master Profile is authoritative.** Targeted CVs consume controlled profile data without corrupting the source.
6. **Presentation variants are separate from semantic data.**
7. **Pagination is semantic.** V2 may replace image-slicing export mechanisms while preserving complete A4 output.
8. **Security is part of preservation.** Tracking/reporting must survive migration without carrying forward exposed secrets.
9. **UI/CSS remains frozen during core migration.** Modernization is a later controlled phase.
10. **Technology choices remain implementation decisions.** This document defines responsibilities and contracts, not a mandatory programming language, framework, database, hosting provider, AI provider or payment provider.

## 3. Status legend

| Status | Meaning |
|---|---|
| PRESERVE | Existing V1 capability remains materially equivalent in V2. |
| UPGRADE | V1 capability is retained while its model/mechanism is expanded. |
| NEW | V2 capability not present as a complete V1 capability. |
| REPLACE | V1 mechanism is intentionally replaced while user-visible capability is preserved. |
| EVALUATE | Capability or asset requires evidence/decision before final implementation. |
| FUTURE | Reserved for a later product phase, not required for core migration. |
| BLOCKED | Cannot be considered complete until a named dependency or reconciliation item is resolved. |

## 4. V2 engine ownership model

| V2 owner | Primary responsibility |
|---|---|
| Document Engine | CV document lifecycle and document-level configuration. |
| Career Data / Master Profile | Authoritative reusable career information. |
| Section & Field Engine | Dynamic sections, fields, metadata, ordering, visibility and custom content. |
| Template Engine | Template metadata, rendering contracts, template compatibility and presentation. |
| Layout & Pagination Engine | A4 page model, semantic blocks, overflow and page-break behavior. |
| Preview Engine | Live preview, responsive preview, page navigation and preview-side editing contracts. |
| PDF Export Engine | Deterministic PDF generation from the canonical document/layout model. |
| Word Export Engine | Structured editable DOCX generation. |
| Storage & Version Engine | Local-first persistence, drafts, autosave, versions, recovery and optional account/cloud persistence. |
| Migration & Import Engine | V1 migration plus PDF/DOCX/structured import and confidence/review workflows. |
| ATS / Resume Health Engine | Explainable resume-quality and ATS-readiness analysis. |
| Job Matching Engine | Job-description extraction, matching and skill/keyword gap analysis. |
| AI Intelligence Engine | Controlled AI assistance, review, rewriting, summaries, tailoring and anti-fabrication rules. |
| Cover Letter Engine | CV/JD-aware cover-letter creation and export. |
| Online CV Engine | Future public/private/link-only career presentation. |
| Analytics / Tracking | Event taxonomy, privacy-aware analytics and reporting. |
| Platform / Entitlement | Accounts, permissions, products, premium access and entitlement lifecycle. |
| Advertising Boundary | Controlled ad inventory, consent/privacy and ad-free entitlement behavior. |

## 5. V1 data model → V2 reconciliation

### 5.1 Personal information

| V1 data | V2 destination | Status | Migration / preservation |
|---|---|---|---|
| name | Master Profile → personal identity | UPGRADE | Direct mapping; retain visibility behavior. |
| job | Master Profile → professional headline/target role | UPGRADE | Preserve value; allow richer role semantics later. |
| email | Master Profile → contact | PRESERVE | Direct mapping. |
| phone | Master Profile → contact | UPGRADE | Preserve value; support international format. |
| whatsapp | Master Profile → contact/social | UPGRADE | Preserve as optional regional contact field. |
| address | Master Profile → location/contact | UPGRADE | Preserve; allow country/city/region structure. |
| dob | Master Profile → personal data | PRESERVE | Preserve and retain field visibility. |
| cnic | Master Profile → regional/custom personal field | UPGRADE | Preserve as optional regional field; never make universal. |
| religion | Master Profile → regional/custom personal field | UPGRADE | Preserve as optional field; never make universal. |
| linkedin | Master Profile → professional links | UPGRADE | Preserve; normalize as a professional URL. |
| website | Master Profile → professional links | UPGRADE | Preserve; expand to portfolio and other professional links. |
| summary | Master Profile / targeted CV summary | UPGRADE | Preserve existing summary while allowing targeted versions. |
| photo | Master Profile asset + document presentation | UPGRADE | Preserve image/crop behavior; template compatibility remains explicit. |

### 5.2 Repeatable sections

| V1 section | V2 destination | Status |
|---|---|---|
| education[] | Section & Field Engine + Master Profile | UPGRADE |
| experience[] | Section & Field Engine + Master Profile | UPGRADE |
| projects[] | Section & Field Engine + Master Profile | UPGRADE |
| skills[] | Section & Field Engine + Master Profile | UPGRADE |
| languages[] | Section & Field Engine + Master Profile | UPGRADE |
| achievements[] | Section & Field Engine + Master Profile | UPGRADE |

The V2 model must additionally accommodate certifications, awards, publications, volunteer experience, internships, training/courses, licenses, memberships, references, interests, leadership, conferences, research and custom sections/fields without creating incompatible document models.

### 5.3 Visibility state

V1 section visibility:
- summary
- photo
- education
- experience
- projects
- skills
- languages
- achievements

V2 destination: Document Configuration + Section & Field Engine.

V1 field visibility:
- name
- job
- dob
- cnic
- religion
- linkedin
- website
- whatsapp
- phone
- email
- address

V2 destination: Document Configuration + Field metadata.

**Requirement:** visibility is document-specific. Hiding a field from one targeted CV must not delete the underlying Master Profile value.

### 5.4 Theme

V1 theme state is preserved as document presentation state.

Existing palette:
- #1e3a68
- #2e7d32
- #c62828
- #1565c0
- #37474f
- #6a1b9a

Status: **PRESERVE / UPGRADE**.

The existing templates must continue receiving equivalent theme values while V2 later supports richer template/theme metadata.

## 6. V1 persistence and migration

V1 persistence uses the canonical local-storage key:

`cv_estudent_v2_final`

and includes migration handling from:

`cvData`

V2 destination: Storage & Version Engine + Migration & Import Engine.

Required migration coverage:
- personal fields;
- summary;
- photo;
- every repeatable section;
- section visibility;
- field visibility;
- theme;
- legacy storage shape/version.

Migration must be deterministic, non-destructive, testable with real V1 fixtures and explicit about unsupported edge cases.

**No field may be dropped silently.**

## 7. V1 function → V2 capability reconciliation

### 7.1 State and persistence

| V1 capability/function | V2 owner | Status | Test requirement |
|---|---|---|---|
| _debounce | Storage / editor state layer | UPGRADE | Autosave/debounce regression |
| saveData | Storage & Version Engine | UPGRADE | Save/reload fixture |
| loadData | Storage & Version Engine | UPGRADE | Restore fixture |
| resetData | Document/Storage layer | PRESERVE | Reset and recovery test |

### 7.2 Section manipulation

| V1 capability/function | V2 owner | Status |
|---|---|---|
| compileArraySection | Section & Field Engine / Template Engine | REPLACE |
| addItem | Section & Field Engine | UPGRADE |
| removeItem | Section & Field Engine | UPGRADE |
| removeArrayItem | Section & Field Engine | UPGRADE |

The fixed V1 compilation helpers should not become V2 architecture. Their user-visible behavior is preserved through metadata-driven repeatable sections.

### 7.3 Visibility

| V1 capability/function | V2 owner | Status |
|---|---|---|
| toggleCVVisibility | Section & Field Engine / Document Configuration | UPGRADE |
| toggleFieldVisibility | Section & Field Engine / Document Configuration | UPGRADE |
| _syncVisibilityUI | Preview/editor adapter | REPLACE |
| _applyVisibilityToggles | Template Engine | REPLACE |
| _processToggleBlock | Template Engine compatibility layer | REPLACE |

V2 should retain equivalent behavior without hard-coding every possible field into the renderer.

### 7.4 Form synchronization

| V1 capability/function | V2 owner | Status |
|---|---|---|
| _syncFormFields | Section & Field Engine / Preview adapter | REPLACE |
| _resolveFieldTarget | Metadata-driven field registry | REPLACE |
| _writeToModel | Document/Profile state service | REPLACE |
| initInputBinding | Editor interaction layer | REPLACE |
| _readFromModel | Document/Profile state service | REPLACE |
| restoreFormInputs | Editor state adapter | REPLACE |

The V1 DOM contract remains a temporary compatibility boundary during migration.

### 7.5 Navigation and initialization

| V1 capability/function | V2 owner | Status |
|---|---|---|
| initApp | Application shell/orchestration | REPLACE |
| initWizard | Editor workflow layer | REPLACE |
| navStep | Editor navigation contract | PRESERVE behavior |
| switchMobileView | Preview/editor responsive layer | UPGRADE |

### 7.6 Photo workflow

| V1 capability/function | V2 owner | Status |
|---|---|---|
| handlePhotoUpload | Asset/import layer | UPGRADE |
| executeCrop | Image/profile asset layer | UPGRADE |
| cancelCrop | Image/profile asset layer | PRESERVE |

Required behavior remains: file selection, crop state, crop execution, cancellation, thumbnail/preview update and persistence.

### 7.7 Existing AI/helper behavior

| V1 capability/function | V2 owner | Status |
|---|---|---|
| suggestSummary | AI Intelligence Engine | UPGRADE |

V2 must not accidentally lose this existing capability. It must operate under the V2 AI rules: user control, review before replacement and no invented facts.

### 7.8 Dynamic input rendering

| V1 capability/function | V2 owner | Status |
|---|---|---|
| renderInputs | Section & Field Engine | REPLACE |
| _renderObjectArrayInputs | Section & Field Engine | REPLACE |
| _renderPrimitiveArrayInputs | Section & Field Engine | REPLACE |
| _renderNestedObject | Section & Field Engine | REPLACE |

V2 expands this into a metadata-driven field/section system supporting custom sections, custom fields, repeatable items and future presentation variants.

## 8. Template compiler reconciliation

V1 compiler behavior:
- scalar personal-field tokens;
- object-array loops;
- primitive-array loops;
- visibility/toggle blocks;
- HTML escaping;
- token validation.

V2 owner: **Template Engine**, backed by the canonical Document/Section model.

Status: **UPGRADE / REPLACE mechanism**.

Required preservation:
1. scalar values render correctly;
2. repeatable sections render correctly;
3. primitive lists render correctly;
4. hidden content does not render;
5. unsafe user text is safely handled;
6. unsupported tokens are detectable;
7. templates remain presentation definitions rather than data stores.

V2 should replace fixed token families with metadata-driven field references while providing compatibility for the V1 template set during migration.

## 9. Template registry and asset reconciliation

V1 logical registry contains nine template keys:

1. t01-modern-minimalist-cv-design_ats
2. t01-modern-minimalist-cv-design_modern
3. t01-modern-minimalist-cv-design_simple
4. t02-professional-cv-design_modern
5. t03-professional-cv-design_modern
6. t04-modern-blue-corporate_modern
7. t05-simple-cv-graphic-web-designer_modern
8. t06-professional-cv-graphic-designer_modern
9. t07-professional-cv-store-manager-incharge_modern

Seven template HTML files were present in the supplied archive.

Missing archive references:
- t01-modern-minimalist-cv-design_ats.html
- t01-modern-minimalist-cv-design_simple.html
- associated ATS/simple preview assets referenced by the working system.

Status: **BLOCKED / EVALUATE** until the missing assets are reconciled.

Rule: absence from the archive is not permission to delete a registry entry.

V2 destination: Template Engine + Template Library metadata/lifecycle.

## 10. Template visual preservation

V1 templates are A4-oriented and contain template-specific CSS/layout.

Status: **PRESERVE during core migration**.

The V2 Template Engine must preserve:
- A4 page assumptions;
- one/two-column structures;
- typography;
- spacing;
- colors;
- icons;
- section hierarchy;
- current theme behavior.

The UI/CSS modernization phase is explicitly deferred until after core architecture, migration, rendering and export are stable.

## 11. Public template discovery reconciliation

V1 public page capabilities:
- keyword filtering;
- hybrid filtering;
- template preview;
- full-screen preview;
- modal open/close;
- filter scrolling;
- exit-modal behavior.

V2 owner: Template Library / Distribution layer.

Status: **UPGRADE**.

V2 adds formal metadata, capability filters, template lifecycle, free/premium state, Word availability, online builder entry, sample PDF, compatibility information and future comparison/recommendation.

V1 behavior must remain available during migration.

## 12. Bridge page reconciliation

V1 bridge behavior includes:
- tracking bridge events;
- configuring template options;
- presenting modern/simple/ATS-related variants;
- Word/PDF-related actions.

V2 owner: Template Library / Distribution layer + Analytics.

Status: **UPGRADE**.

The bridge must not become a second source of template truth. Template metadata and capabilities must come from the formal Template Engine/Library contract.

## 13. Mobile engine reconciliation

V1 mobile engine provides:
- A4 design dimensions;
- responsive scaling;
- viewport adaptation;
- preview height synchronization;
- resize handling;
- orientation handling;
- mobile PDF preparation/export;
- export cleanup.

V2 owners:
- Preview Engine;
- Layout & Pagination Engine;
- PDF Export Engine.

Status: **UPGRADE / REPLACE mechanism**.

The V1 image-slicing PDF mechanism may be replaced by semantic pagination. The preserved user requirement is:

> A complete CV exports as a usable multi-page A4 PDF without losing content.

Regression requirements:
- desktop/mobile viewport;
- resize;
- orientation;
- preview scale;
- preview height;
- multi-page output;
- image/font readiness;
- export cleanup.

## 14. Desktop engine reconciliation

V1 desktop engine provides:
- HTML preparation;
- isolated rendering;
- print/PDF;
- cleanup;
- readiness checks;
- temporary frame management.

V2 owners:
- Preview Engine;
- PDF Export Engine;
- Layout & Pagination Engine.

Status: **UPGRADE / REPLACE mechanism**.

Required behavior:
- export must not corrupt editor state;
- output must represent the CV document, not editor chrome;
- temporary resources must be cleaned safely;
- A4 output must remain stable.

## 15. Export reconciliation

### PDF

V1:
- mobile PDF generation;
- desktop print/PDF;
- A4;
- multi-page output;
- image/font/layout readiness;
- download tracking.

V2 owner: PDF Export + Layout/Pagination + Analytics.

Status: **UPGRADE**.

### DOCX

V1 includes Word-related assets/capabilities but not a complete generalized V2 Word engine.

V2 owner: Word Export Engine.

Status: **UPGRADE / FORMALIZE**.

The V2 contract distinguishes:
- Blank Word Template;
- User-data DOCX Export.

A PDF screenshot must never be presented as an editable Word document.

## 16. Layout and pagination reconciliation

V1 uses CSS page dimensions, print behavior and image-slicing constraints.

V2 introduces semantic pagination:
- A4 page model;
- dynamic page count;
- semantic blocks;
- keep-together rules;
- orphan prevention;
- manual breaks;
- margins/spacing;
- overflow detection;
- preview/export consistency;
- no impractical global text shrinking.

Status: **NEW / REPLACE mechanism**.

This is a deliberate architectural improvement that must preserve V1 output expectations where practical.

## 17. Preview reconciliation

V1 preview is primarily generated from the selected template and injected into a preview container.

V2 Preview Engine must preserve live rendering while adding:
- page navigation;
- page thumbnails;
- zoom;
- preview-side editing/click-to-edit;
- consistent canonical state;
- layout awareness;
- export-consistent pagination.

Status: **UPGRADE**.

The existing preview shell remains a visual baseline during core migration.

## 18. Storage, multiple CVs and Master Profile

V1 is essentially one local CV state.

V2 introduces:
- Master Career Profile;
- multiple targeted CVs;
- independent per-CV visibility;
- per-CV ordering;
- per-CV presentation variants;
- selected template;
- document-specific configuration;
- autosave;
- drafts/recovery;
- duplicate/clone;
- undo/redo;
- version history;
- local-first storage;
- optional account/cloud persistence.

Status: **NEW / UPGRADE**.

Critical invariant:

> Master Profile source data is never destructively changed by template selection, targeted-CV hiding, import review or presentation changes.

## 19. Presentation variant reconciliation

V2 introduces a formal presentation-variant layer.

Examples:
- Languages: name only / proficiency text / percentage / progress / stars / compact label;
- Education: timeline / compact list / two-column / cards;
- Experience: traditional / timeline / compact role block;
- Skills: text / tags / grouped / levels / bars.

Status: **NEW**.

Variants must remain separate from semantic meaning and template styling.

Template changes must identify incompatible variants and use explicit compatible fallback behavior rather than silently changing meaning.

## 20. Import and migration reconciliation

### V1 migration

Status: **PRESERVE / UPGRADE**.

Must support actual V1 fixtures.

### PDF/DOCX import

Status: **NEW for V2 release planning**.

Imported information must be marked for user review before becoming authoritative profile data.

Import confidence should be explicit where extraction is uncertain.

Supported conceptual flow:

**Upload → Extract → Map → Confidence → Review → User approval → Targeted CV/Profile update**

No imported fact should be silently treated as authoritative when confidence is uncertain.

## 21. ATS and career intelligence reconciliation

V1 has no complete formal ATS intelligence layer.

V2 introduces:

### Resume Health / ATS Readiness
- structure;
- chronology;
- consistency;
- parsing-sensitive issues;
- explainable findings;
- issue → reason → evidence → recommended fix.

### Job Matching
- job-description extraction;
- title/skill/keyword/qualification/tool/responsibility/experience extraction;
- matched/missing/weak areas;
- keyword and skill gaps;
- score as a summary, never as a guarantee.

### Skill Evidence Engine
- identify claimed skills;
- identify supporting evidence;
- detect missing/weak evidence;
- prompt for legitimate evidence;
- never invent experience.

Status: **NEW**.

These engines must remain separate from the renderer.

## 22. AI reconciliation

V1 capability:
- summary suggestion.

V2 expands to:
- summary generation;
- bullet rewriting;
- clarity/grammar;
- achievement framing;
- skill suggestions;
- job-specific tailoring;
- review;
- issue explanation;
- cover letters;
- future conversational assistant.

Status: **UPGRADE / NEW**.

AI rules:
- user approval before replacing content;
- distinguish AI Suggested from User Approved;
- never invent employers, qualifications, dates, achievements, metrics, skills or credentials;
- ask for missing facts or use an explicit placeholder;
- provider remains replaceable;
- data sent to AI services must be controlled and documented.

## 23. Cover Letter reconciliation

V1: not a complete dedicated system.

V2 owner: Cover Letter Engine.

Status: **NEW**.

Requirements:
- general cover letters;
- job-specific cover letters;
- CV-aware generation;
- JD-aware generation;
- editable content;
- PDF/DOCX export;
- multiple versions;
- same anti-fabrication and user-approval rules as CV AI.

## 24. Online CV / Portfolio reconciliation

V1: public template/build pages exist, but not a complete user-controlled online career profile system.

V2 owner: Online CV Engine.

Status: **FUTURE / NEW**.

Future capabilities:
- public/private/link-only modes;
- professional profile;
- downloadable CV;
- portfolio links;
- privacy/search visibility controls;
- analytics where explicitly enabled.

## 25. Career ecosystem reconciliation

V2 reserves a broader Student Career Wallet and Application Workspace.

Status: **FUTURE**.

Potential connected capabilities:
- ATS Checker;
- Job Matcher;
- Cover Letter Builder;
- Online CV;
- Job Application Tracker;
- Interview Coach;
- education/student tools;
- credentials/certificates;
- cloud backup;
- external job services.

The CV Builder must expose documented boundaries rather than becoming the owner of every future career feature.

## 26. Commercial reconciliation

### Advertising

V1 contains ad placeholders and tracking-related behavior.

V2 owner: Advertising Boundary + Analytics.

Status: **PRESERVE / UPGRADE**.

Requirements:
- controlled inventory;
- privacy/consent;
- no sensitive CV content in ad payloads;
- no ads inside generated CV documents;
- ad-free entitlement;
- no material obstruction of editing.

### Premium products

V2 supports the architectural concept of:
- premium templates;
- template packs;
- advanced ATS/job intelligence;
- AI packages/subscriptions;
- premium cover letters;
- online CV customization;
- additional CV versions/storage;
- ad-free access.

V2 owner: Platform / Entitlement.

Status: **NEW / FUTURE by product phase**.

Commercial principle:

**Feature → Entitlement → Monetization**

Payment-provider selection is deliberately outside this reconciliation.

## 27. Analytics and tracking reconciliation

V1:
- track-event API;
- reporting API;
- PDF download tracking;
- bridge event tracking.

V2 owner: Analytics / Tracking.

Status: **PRESERVE / UPGRADE**.

Requirements:
- stable event taxonomy;
- privacy review;
- no raw CV content merely for measurement;
- secure configuration;
- retention controls;
- reporting continuity;
- regression testing.

### Security blocker

The supplied V1 archive contains plaintext database credentials in tracking/reporting source.

Before any raw V1 source baseline is committed:
1. rotate/revoke exposed production credentials as appropriate;
2. remove credentials from source;
3. move secrets to secure deployment configuration;
4. verify secrets do not remain in the intended V2 repository history;
5. re-test tracking/reporting.

This is a **BLOCKED** baseline-security item, not a reason to remove tracking functionality.

## 28. V1 DOM/data-field compatibility

The following V1 fields must remain functionally supported during migration:

- full_name
- job_title
- email
- phone
- whatsapp
- address
- dob
- cnic
- linkedin
- website
- religion
- summary_text

Important V1 DOM hooks include:
- editor/navigation/progress containers;
- personal-field wrappers;
- dynamic section containers;
- preview containers;
- theme/photo controls;
- ad placeholders.

Status: **PRESERVE temporarily / REPLACE only after compatibility adapter and regression approval**.

The final V2 UI may use a cleaner internal contract, but the initial migration must not alter the visual layer simply to accommodate the new core.

## 29. Dependency reconciliation

V1 references:
- html2canvas 1.4.1
- jsPDF 2.5.1
- html2pdf.js 0.10.1
- Cropper.js 1.5.13
- Font Awesome 6
- Google Fonts Inter
- local icon assets
- local builder scripts/CSS.

Status: **EVALUATE individually**.

A dependency may be replaced only when its capability has:
1. a V2 owner;
2. an explicit replacement mechanism;
3. regression coverage;
4. no silent behavior loss.

This document does not mandate a particular replacement technology.

## 30. V1 → V2 release-phase mapping

| Capability group | V2 phase |
|---|---|
| V1 core data/sections/visibility | Core migration |
| V1 templates/theme/rendering | Core migration |
| V1 mobile/desktop preview | Core migration |
| Semantic pagination | Core migration |
| PDF export | Core migration |
| DOCX export contract | V2 core release |
| Master Profile | V2 core release |
| Multiple targeted CVs | V2 core release |
| Dynamic sections/fields | V2 core release |
| Presentation variants | V2 core release |
| Template Library | V2 core release |
| PDF/DOCX import | V2 release |
| Resume Health / ATS readiness | V2 release |
| Job Matching | V2 release |
| Skill Evidence | V2 release |
| Controlled AI | V2 release |
| Cover Letters | V2 release |
| Online CV / portfolio | Future |
| Application Workspace | Future |
| Career Wallet | Future |
| Job Application Tracker | Future |
| Interview Coach integration | Future |
| External career integrations | Future |
| UI/CSS modernization | Final controlled UI/CSS phase |

Release sequencing may be refined by the approved product requirements, but no V1 capability may be dropped merely because its preferred phase is later.

## 31. Regression test master list

### Data
- empty CV creation;
- every V1 personal field;
- summary;
- every V1 repeatable section;
- nested repeatable fields;
- save/reload;
- reset;
- V1 migration fixture.

### Visibility
- every V1 section toggle;
- every V1 field toggle;
- persistence;
- preview correctness;
- Master Profile remains unchanged.

### Templates
- every available V1 template;
- every registry entry after asset reconciliation;
- template switching;
- optional fields;
- theme colors;
- compatibility behavior;
- no silent deletion.

### Preview
- desktop;
- mobile;
- responsive scaling;
- resize;
- orientation;
- page count;
- thumbnails/navigation;
- preview-side edits where enabled.

### Export
- desktop PDF/print;
- mobile PDF;
- multi-page A4;
- images/fonts;
- page breaks;
- export cleanup;
- DOCX output;
- editable Word structure;
- download tracking.

### Library/distribution
- search;
- filters;
- preview;
- full-screen preview;
- Build Online;
- Try with My Data;
- Blank Word;
- Sample PDF;
- premium entitlement.

### Intelligence
- ATS findings;
- Job Match extraction;
- matched/missing/weak areas;
- skill evidence;
- AI approval;
- anti-fabrication;
- import confidence/review.

### Security/privacy
- no secret leakage;
- secure service configuration;
- upload validation;
- authorization;
- analytics privacy;
- CV data export/delete behavior where implemented.

### Accessibility/SEO
- keyboard navigation;
- focus;
- labels;
- contrast;
- semantic controls;
- template page utility;
- metadata/canonical behavior.

## 32. Architecture-freeze readiness gate

Architecture freeze may begin only when the following are true:

### A. V1 reconciliation
- [ ] Every V1 data field has a V2 owner.
- [ ] Every V1 section has a V2 owner.
- [ ] Every V1 visibility state has a mapping.
- [ ] Every V1 function has an owner or explicit replacement.
- [ ] Every V1 template registry entry is reconciled.
- [ ] Missing template assets are resolved or explicitly blocked.
- [ ] V1 mobile behavior is mapped.
- [ ] V1 desktop behavior is mapped.
- [ ] V1 export behavior is mapped.
- [ ] V1 public discovery/bridge behavior is mapped.
- [ ] V1 migration behavior is mapped.
- [ ] Tracking/reporting is mapped and security-hardened.

### B. V2 architecture
- [ ] Document Core boundary is stable.
- [ ] Master Profile boundary is stable.
- [ ] Targeted CV/document configuration boundary is stable.
- [ ] Section/Field Engine boundary is stable.
- [ ] Template Engine boundary is stable.
- [ ] Layout/Pagination boundary is stable.
- [ ] Preview boundary is stable.
- [ ] PDF/DOCX export boundaries are stable.
- [ ] Storage/version boundary is stable.
- [ ] Import/migration boundary is stable.
- [ ] Intelligence boundaries are independent from rendering.
- [ ] AI boundaries are independent and provider-neutral.
- [ ] Commercial/entitlement boundaries are independent from rendering.

### C. Preservation gate
- [ ] No-silent-loss rule is accepted.
- [ ] V1 visual baseline is frozen.
- [ ] UI/CSS redesign is deferred to its dedicated phase.
- [ ] Real V1 fixtures are available for migration tests.
- [ ] Security blockers are tracked.

## 33. Explicit decisions recorded

1. **V1 code is not the V2 architectural base.**
2. **V1 behavior/output is the compatibility baseline.**
3. **Master Profile is the reusable source of career data.**
4. **Targeted CVs are independent document configurations.**
5. **Templates own presentation, not career data.**
6. **Presentation variants are independent of semantic data.**
7. **Pagination is a first-class V2 engine.**
8. **PDF and Word export are first-class output engines.**
9. **ATS, Job Matching and AI are separate intelligence boundaries.**
10. **Imported data requires review before becoming authoritative.**
11. **Premium access is entitlement-driven, not renderer-driven.**
12. **Analytics must not require raw CV content.**
13. **V1 UI/CSS remains frozen through core migration.**
14. **Missing V1 assets must be reconciled before preservation is declared complete.**
15. **Exposed V1 credentials must never enter the V2 repository.**

## 34. Reconciliation outcome

The V1 → V2 relationship is now defined as:

**V1 Golden Baseline**
→ preserve documented behavior  
→ migrate canonical data  
→ replace fixed mechanisms with explicit V2 engines  
→ add Master Profile / targeted CV architecture  
→ add presentation variants  
→ add semantic pagination and formal export engines  
→ add Template Library and distribution  
→ add import, ATS, Job Matching and controlled AI  
→ add cover letters and future career ecosystem boundaries  
→ modernize UI/CSS only in the final controlled phase.

This document is the control point for deciding whether a later V2 implementation change preserves, upgrades, replaces, or defers an existing V1 capability.

## 35. Next controlled milestone

With this reconciliation recorded, the project can proceed to **V2 Architecture Freeze Preparation**.

The next documentation task is to convert the reconciled capability ownership into the formal architecture contract:

- module boundaries;
- responsibilities;
- inputs/outputs;
- invariants;
- dependency direction;
- data ownership;
- extension points;
- compatibility adapters;
- migration boundaries;
- testing boundaries.

No application implementation code is authorized by this document.
