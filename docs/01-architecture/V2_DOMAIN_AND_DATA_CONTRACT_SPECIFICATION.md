# V2 Domain and Data Contract Specification

**Status:** Proposed for architecture approval  
**Scope:** Technology-neutral domain/data contract  
**Implementation status:** Documentation only; no application code

## 1. Purpose

This document defines the conceptual domain model and canonical data contracts for CV Builder V2. It establishes what the major information objects mean, how they relate, what owns authoritative data, and which boundaries must remain stable while implementation evolves.

This is not a database schema, API specification, programming model, storage implementation, or framework design.

> **One authoritative career data model → many targeted documents → many presentation variants/templates → multiple distribution/export forms.**

## 2. Core Domain Principles

1. Career facts exist independently of templates, layouts, exports, ATS analysis, and AI output.
2. The Master Career Profile is the authoritative reusable career record.
3. A Targeted CV is a configured representation of the Master Profile for a particular purpose.
4. Imported data and AI-generated suggestions are not authoritative until explicitly reviewed/accepted.
5. Template or presentation changes must never silently delete authoritative data.
6. Semantic meaning is separate from presentation.
7. Existing V1 functionality remains protected by the V1 preservation contracts.
8. Existing V1 templates may be reused through compatibility normalization; V1 architecture is not carried forward merely because templates are reused.

## 3. Core Entities

### 3.1 Master Career Profile
The authoritative reusable career record. It may contain identity/contact information, professional links, summary, education, experience, projects, skills, languages, achievements, certifications, awards, publications, volunteer experience, internships, training, licenses, memberships, references, interests, leadership, conferences, research, academic information, custom sections, custom fields, and other supported career evidence.

The Master Profile may contain more information than any individual CV.

### 3.2 Career Data
Structured facts within the Master Profile, conceptually divided into:
- scalar fields;
- repeatable entries;
- grouped collections;
- custom sections/fields;
- supporting assets.

### 3.3 Targeted CV
A reusable document configuration derived from the Master Profile for a specific objective, such as Software Engineer, Internship, Data Analyst, Academic, or International CV.

A Targeted CV may define selected content, ordering, visibility, supported document-specific overrides, presentation variants, template, theme, target role/context, associated job description, cover letter, and document metadata.

Each Targeted CV must be independently configurable without corrupting the Master Profile.

### 3.4 Document Configuration
The content-selection and presentation configuration of a Targeted CV. It controls included content, ordering, visibility, selected entries, variants, template, theme, layout preferences, and document metadata.

It must not unnecessarily duplicate the entire Master Profile.

## 4. Sections, Fields, and Repeatable Entries

### Section
A semantically meaningful group such as Summary, Experience, Education, Skills, Projects, Certifications, Publications, Research, or a Custom Section.

### Field
An individual semantic value such as name, job title, email, phone, address, date of birth, LinkedIn, website, WhatsApp, institution, degree, employer, dates, description, skill name, or proficiency.

V1 fields remain supported where appropriate. V2 permits international and extensible field definitions. Regional fields such as CNIC and religion remain optional rather than universal assumptions.

### Repeatable Entry
One item inside a repeatable section, such as an education record, employment record, project, certification, award, or publication.

Repeatable entries require stable identity so they can be selected, reordered, edited, hidden, duplicated, referenced by analysis, and preserved during template changes.

### Custom Sections and Fields
Custom content must preserve semantic identity, values, ordering, visibility, repeatability where applicable, and presentation compatibility. A template that cannot display custom content must not cause its underlying data to disappear.

## 5. Presentation Variants

A Presentation Variant defines how semantic information is visually represented without changing its meaning.

Examples:
- Skills: text, tags, grouped, levels, progress representation.
- Education: timeline, compact list, two-column, cards.
- Experience: traditional role block, timeline, compact role block.

Variants may operate at field, entry, section, or document level.

Rules:
1. Variant selection belongs to document presentation configuration.
2. Variants must be compatible with the selected template.
3. Unsupported variants require explicit fallback or user-visible compatibility information.
4. Switching variants must not alter authoritative career facts.
5. Variant choices should support persistence and undo/redo where applicable.

## 6. Template Domain

### Template
A presentation definition controlling visual structure and rendering.

Conceptual metadata includes stable ID, name, version, career level, industry, style, supported sections/fields, supported variants, photo support, column model, page model, themes, ATS profile, accessibility, compatibility rules, lifecycle status, Web/PDF/DOCX capabilities, blank DOCX availability, demo assets, free/premium state, entitlement/product reference, and related templates.

### Template Version
A controlled version of the template presentation contract. It may change visual structure, supported variants/fields, layout behavior, export compatibility, and assets. It must remain identifiable for reproducibility.

### V1 Template Compatibility
Compatibility flow:

**V1 Template → Compatibility/Normalization → V2 Template Contract → V2 Document Model → V2 Layout/Pagination → Preview/Export**

Reusing V1 templates does not mean reusing V1 builder architecture.

## 7. Assets

Assets are files/resources associated with a profile, document, template, import, or export, such as profile photos, previews, demo images, icons, uploaded source documents, and generated artifacts.

Ownership/context boundaries must be maintained. A private user asset must not automatically become a public template asset.

## 8. Layout and Pagination

### Layout Block
A semantically meaningful layout unit such as an experience entry, education entry, project block, skill group, heading/paragraph group, or controlled spacer.

The layout model must understand semantic grouping rather than treating the CV as one undifferentiated image.

### Page
A paginated representation of layout blocks for a selected format. The model must support A4, dynamic page count, margins, spacing, keep-together rules, orphan prevention, controlled page breaks, overflow detection, and preview/export consistency.

Pagination is presentation output, not authoritative career data.

## 9. Import and Review

### Import Record
Information obtained from PDF, DOCX, structured data, or approved future external sources.

Imported information is not automatically authoritative.

### Review State
Conceptually supports states such as imported, parsed, needs review, accepted, rejected, partially accepted, and unresolved.

Imported information must be reviewable before becoming authoritative Master Profile data.

### Import Confidence
Where available, extraction confidence may be associated with imported values/findings. Confidence is not factual certainty; low-confidence extraction should be surfaced for review.

## 10. ATS Intelligence

### ATS Finding
An analysis result about document readiness or machine-readable career-document quality. Findings may cover structure, formatting, parsing risks, standard information, keywords, skills evidence, chronology, or consistency.

Meaningful findings should support:

**Issue → Reason → Evidence → Recommended Fix**

Any score is a summary, not a guarantee of external ATS performance.

### ATS Readiness
Evaluates the document itself and remains distinct from Job Match.

## 11. Job Matching

### Job Description
Target-job information used for analysis, including title, skills, keywords, qualifications, tools/technologies, responsibilities, experience requirements, and other extracted requirements.

### Job Match Finding
Compares a selected Targeted CV with a Job Description and may identify matched, missing, weakly evidenced, or related requirements, keyword coverage, skill gaps, evidence gaps, and suggested actions.

ATS Readiness and Job Match are separate analytical domains.

## 12. AI Intelligence

### AI Suggestion
Generated assistance based on authorized user data/context, such as summary suggestions, bullet rewrites, clarity improvements, achievement framing, skill suggestions, job-specific tailoring, cover-letter drafts, and issue explanations.

### AI Suggestion State
Conceptual states include generated, reviewed, accepted, rejected, and user-edited.

**Anti-fabrication rule:** AI must not invent employers, qualifications, dates, achievements, credentials, experience, metrics, or skills the user does not possess. Unknown facts require user input or an explicit placeholder.

## 13. Cover Letters

A Cover Letter is a separate career document that may be associated with a Master Profile, Targeted CV, Job Description, and future Job Application.

It may support general, job-specific, CV-aware, JD-aware, editable, PDF/DOCX, and multiple-version workflows.

Cover-letter content remains distinct from authoritative CV data.

## 14. Export

### Export Job
A request to produce a document artifact such as PDF, DOCX, or supported future formats.

It consumes:

**Career Data + Document Configuration + Template + Presentation Variants + Layout Rules**

It must not mutate authoritative career data.

### Export Result
Generated artifact plus metadata such as format, template version, document version, generation status, validation status, artifact reference, timestamp, and compatibility outcome.

## 15. Entitlement and Monetization

### Product
A monetizable offering such as a premium template, template pack, advanced ATS capability, AI package, cover-letter package, additional CV/version capacity, ad-free access, or online CV customization.

### Entitlement
A user's right to access a product or feature.

Architecture rule:

**Feature → Entitlement → Monetization**

Rendering and document-generation logic must not contain hard-coded payment assumptions.

## 16. Analytics

An Analytics Event represents a measurable product event, such as template viewed/selected, CV created, export completed, ATS analysis requested, job match requested, AI suggestion accepted, or public CV viewed.

Analytics must not require raw CV content merely to measure product behavior.

V1 tracking/reporting remains within preservation scope, subject to security and privacy hardening.

## 17. Conceptual Relationships

**User → Master Career Profile → Targeted CV → Document Configuration → Template + Template Version → Presentation Variants → Layout/Pagination → Preview / Export**

**Targeted CV + Job Description → Job Match Findings**

**Targeted CV → ATS Findings**

**Authorized Career Data / Job Context → AI Suggestion → User Review → User-Approved Content**

**Targeted CV + Job Description → Cover Letter**

**Feature / Product → Entitlement → User Access**

**Product Action → Analytics Event**

**Source Document → Import Record → Review → Accepted Career Data**

## 18. Ownership and Mutation Rules

**Master Profile owns:** authoritative reusable career facts and user-approved career information.

**Targeted CV owns:** document-specific selections, ordering, visibility, presentation choices, and explicit document-specific overrides.

**Template owns:** visual definition, compatibility metadata, template assets, and presentation capabilities.

**Analysis owns:** findings, evidence references, analysis metadata, and recommendations. Analysis does not become career truth.

**AI owns:** suggestions and generation metadata. AI does not own authoritative career facts.

**Export owns:** generated artifacts and generation metadata. Export does not mutate the source document.

## 19. Versioning Principles

The model must distinguish conceptually between:
1. Master Profile version;
2. Targeted CV/document version;
3. Template version;
4. imported-source version/state;
5. analysis result version;
6. generated artifact/version.

Changing one versioned object must not silently rewrite unrelated authoritative objects.

A reproducible document should be traceable to its relevant document configuration and template version.

## 20. V1 Compatibility Mapping

| V1 concept | V2 domain |
|---|---|
| window.cv | Master Profile / Career Data |
| window.cvVisibility | Document Configuration visibility |
| V1 repeatable arrays | Repeatable Entries |
| V1 template registry | Template + Template Version |
| V1 template compiler bindings | V2 field/section bindings |
| V1 theme color | Presentation/theme configuration |
| V1 localStorage document state | V2 local-first profile/document state |
| V1 mobile preview | V2 Preview/Layout pipeline |
| V1 desktop print engine | V2 Export/print capability |
| V1 mobile PDF mechanism | V2 PDF Export capability |
| V1 tracking events | V2 Analytics Events |
| V1 migration | V2 Import/Migration boundary |

This mapping is conceptual and does not require V2 to preserve V1 implementation structures.

## 21. Domain Invariants

1. Authoritative career facts remain independent of presentation.
2. A Targeted CV cannot silently destroy Master Profile information.
3. Template changes cannot silently delete unsupported content.
4. Presentation variant changes cannot change semantic career facts.
5. AI suggestions are not authoritative until explicitly accepted.
6. Imported information is not authoritative until reviewed/accepted.
7. ATS findings are analysis, not guarantees.
8. Job Match findings are distinct from ATS Readiness.
9. Export does not mutate source career data.
10. Template version must be identifiable for reproducibility.
11. Regional fields must not become universal schema assumptions.
12. Custom sections/fields remain preservable even when a template cannot display them.
13. Monetization state remains separate from presentation rendering.
14. Analytics must not require raw CV content.
15. V1 functionality remains covered by the preservation contract.
16. Existing V1 templates may be reused through compatibility normalization rather than mandatory recreation.
17. This document selects no implementation technology.

## 22. Explicit Non-Scope

This contract does not define:
- database tables or database engine;
- API endpoints;
- programming language or framework;
- hosting/deployment;
- search provider;
- AI provider;
- payment provider;
- map provider;
- UI component implementation.

Those decisions belong to later approved implementation specifications.

## 23. Approval Gate

Review this contract together with:
- V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md
- V1_TO_V2_MASTER_RECONCILIATION.md
- V1_FUNCTIONALITY_PRESERVATION_INVENTORY.md
- V1_UI_CSS_PRESERVATION_CONTRACT.md
- V2_MASTER_CAPABILITY_REGISTER.md
- V2_PRODUCT_REQUIREMENTS.md

After approval, the next implementation-neutral contracts should cover:
- document lifecycle/state;
- template compatibility/capability;
- layout/pagination;
- import/migration;
- intelligence/AI safety and provenance;
- export;
- testing/acceptance.

**No application code is introduced by this milestone.**
