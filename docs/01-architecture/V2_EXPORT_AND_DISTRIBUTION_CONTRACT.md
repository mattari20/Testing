# V2 Export and Distribution Contract

**Status:** Proposed for architecture approval  
**Scope:** PDF, DOCX, print, online CV, sharing, generated artifacts, template distribution, and export integrity  
**Implementation status:** Documentation only; no application code

## 1. Purpose

This contract defines how V2 turns an approved document configuration into distributable outputs.

It covers:
- PDF export;
- editable DOCX export;
- print output;
- online/public CV;
- private and link-only sharing;
- generated artifacts;
- blank Word templates;
- template distribution;
- export validation;
- artifact provenance;
- version consistency;
- privacy and access boundaries.

The governing principle is:

> **Export is a controlled projection of an approved document state, not a separate source of truth.**

## 2. Source-of-Truth Hierarchy

The authoritative hierarchy is:

1. Master Career Profile — authoritative reusable career facts;
2. Targeted CV / Document Configuration — authoritative document-specific selection, ordering, visibility, and presentation choices;
3. Template Version — authoritative presentation contract;
4. Layout/Pagination result — authoritative calculated document layout for that export context;
5. Generated Artifact — immutable output derived from the above.

Generated PDF, DOCX, print output, or online presentation must not silently become a new source of career truth.

## 3. Export Input Contract

An export request should resolve:

- target document;
- document version/state;
- selected template and template version;
- selected presentation variants;
- visibility configuration;
- theme/presentation configuration;
- assets;
- layout requirements;
- requested output type.

The export must use a coherent document snapshot.

## 4. Snapshot Consistency

An export should not combine unrelated revisions.

Conceptually:

**Approved Document Snapshot → Layout → Render → Artifact**

If the underlying document changes during generation, the system should either:
- complete from the captured snapshot; or
- invalidate/restart the export.

It must not silently mix revisions.

## 5. PDF Export Contract

PDF is a primary distribution format.

PDF output should preserve:
- document content;
- section ordering;
- visibility;
- supported presentation variants;
- template styling;
- theme;
- A4/page configuration;
- page breaks;
- images/assets;
- typography as far as the selected export path permits.

PDF export must support dynamic page counts.

## 6. PDF Pagination Integrity

The PDF result must follow the V2 Layout and Pagination Contract.

The system should avoid:
- accidental clipping;
- overlapping content;
- unexpected blank pages;
- broken section boundaries;
- orphaned headings where preventable;
- distorted images;
- uncontrolled text shrinking.

Export and preview should use the same semantic layout decisions wherever practical.

## 7. PDF Metadata

Where supported, generated PDF artifacts may retain metadata such as:
- document title;
- creation/generation context;
- template/version;
- export type;
- artifact/version identifier.

Metadata must not expose private information unnecessarily.

## 8. DOCX Export Contract

DOCX is an editable document output.

Generated DOCX should preserve, where technically supported:
- content;
- section order;
- headings;
- lists;
- tables/columns where appropriate;
- basic typography;
- spacing;
- links;
- images;
- document hierarchy.

DOCX does not have to reproduce every pixel of a PDF template if the underlying editable document model requires different construction.

## 9. DOCX Fidelity Rule

The system must distinguish:

**Visual fidelity**  
from  
**Editable-document fidelity**

A DOCX should remain genuinely editable rather than being a screenshot or flattened image of the CV.

Where a template feature cannot be reproduced faithfully in editable DOCX, the compatibility system must identify that limitation.

## 10. Blank Word Template vs Generated DOCX

These are separate products/capabilities.

### Blank Word Template

A reusable DOCX asset containing:
- structure;
- styles;
- placeholders;
- editable layout.

It does not contain a user's authoritative career data.

### Generated User-data DOCX

A DOCX generated from:
- Master Profile;
- Targeted CV configuration;
- selected template/presentation configuration.

One must never be substituted for the other.

## 11. Print Contract

Print output should respect:
- page size;
- margins;
- page breaks;
- section flow;
- repeated page elements;
- print-safe styling;
- accessibility where applicable.

Browser/native print behavior may differ from PDF generation and must therefore be treated as an explicit output capability.

## 12. Export Capability Metadata

Each template version should declare capabilities such as:

- Web Presentation;
- PDF;
- Print;
- Generated DOCX;
- Blank DOCX;
- Online/Public CV;
- supported page models;
- supported variants;
- known constraints.

A template must not be advertised as supporting an output that it cannot reliably generate.

## 13. Export Compatibility

Before export, the system should resolve content/template compatibility.

Possible outcomes include:

- Fully Supported;
- Supported with Constraints;
- Adaptable;
- Unsupported but Preserved;
- Unknown;
- Retired.

Unsupported content must not be silently deleted.

The user should receive an understandable compatibility result where action is required.

## 14. Export Validation

Before an artifact is considered successful, validation should cover as applicable:

- content presence;
- section ordering;
- visibility;
- page count;
- page boundaries;
- asset availability;
- required fonts/styles where relevant;
- links;
- image placement;
- template compatibility;
- file integrity.

A failed validation must not be reported as a successful export.

## 15. Export Failure States

The system should distinguish:

- requested;
- preparing;
- rendering;
- validating;
- completed;
- completed with constraints;
- failed;
- cancelled;
- expired/unavailable.

Failure messages should identify actionable causes without exposing sensitive internal details.

## 16. Generated Artifact Identity

A generated artifact should conceptually retain:

- artifact identifier;
- source document/version;
- template/version;
- output type;
- generation context;
- creation time;
- validation status.

This supports reproducibility and troubleshooting.

## 17. Artifact Immutability

Once a generated artifact is delivered, it should be treated as immutable.

If the user changes the CV and exports again, the new output should be a new artifact/version rather than silently modifying the earlier file.

## 18. Reproducibility

Given the same approved document snapshot, template version, presentation configuration, and export rules, the system should aim for deterministic output.

Where deterministic reproduction is not possible because of external rendering conditions, the limitation should be understood and documented.

## 19. Online CV Contract

Online CV is a presentation/distribution representation of a selected Targeted CV.

It should not require creating a separate incompatible career-data model.

The online representation should derive from the same canonical document model.

## 20. Online CV Visibility

An online CV may support states such as:

- private;
- link-only/unlisted;
- public.

The exact public-search behavior is a product/privacy decision, but the architecture must preserve explicit visibility control.

Changing online visibility must not alter the user's underlying career data.

## 21. Public CV Privacy

A user should be able to control whether sensitive or optional fields are displayed publicly.

Examples include:
- phone;
- email;
- address;
- date of birth;
- national identifiers;
- other regional/personal fields.

A field being present in the Master Profile does not mean it must appear on a public CV.

## 22. Online CV and Template

Online CV presentation should respect template capabilities while remaining compatible with responsive web presentation.

A PDF-only limitation must not be silently presented as an online-capable template.

## 23. Online CV Versioning

Published/online CV content should be associated with a document version.

Editing a draft should not silently alter an already published representation unless the user explicitly republishes or the product's documented publishing model states otherwise.

## 24. Sharing Contract

Sharing should distinguish:

- private ownership;
- link-only access;
- public access;
- downloadable artifact access.

Access boundaries must be explicit.

A public online CV and a downloadable PDF are related but separate distribution surfaces.

## 25. Public CV Search Visibility

Search-engine discoverability must be an explicit capability/control.

The architecture should not assume that every public CV is automatically indexed.

Where search visibility is supported, privacy and removal behavior must be defined before enabling it.

## 26. Online Analytics

Where analytics are supported, they may include:
- page views;
- document views;
- download events;
- selected engagement events.

Analytics must not expose raw CV content merely to count usage.

Privacy controls and retention requirements apply.

## 27. Download Permissions

The owner may control whether visitors can:
- view;
- download PDF;
- access other allowed artifacts.

Permissions should be explicit and independently configurable where product requirements justify it.

## 28. Export and Entitlements

Export capabilities may be affected by product entitlements.

The architecture must distinguish:

**Capability → Entitlement → Product/Commercial Rule**

A user-facing restriction should be clear about whether it is:
- unavailable for the selected template;
- unavailable for the current document state;
- unavailable under the current entitlement.

The commercial layer must not corrupt the canonical document data.

## 29. Premium and Free Templates

A template may be:
- free;
- premium;
- restricted by entitlement;
- deprecated.

Changing entitlement must not delete the user's career data.

If a user loses access to a template, existing documents should have a documented preservation/recovery behavior.

## 30. Template Distribution

Template distribution may include:
- template library;
- preview;
- sample PDF;
- blank DOCX where available;
- online build;
- generated PDF;
- generated DOCX.

Each distribution capability must be declared by the Template Version.

## 31. Sample PDF

A Sample PDF is controlled demonstration output.

It should use controlled demo data and must not be treated as the user's career data.

Its purpose is to demonstrate:
- visual design;
- pagination;
- typography;
- supported sections;
- presentation variants.

## 32. Try With My Data

“Try with My Data” should use an authorized user's profile/document data.

It must:
- preserve the source profile;
- preserve the existing targeted CV;
- resolve compatibility;
- clearly identify any unsupported content;
- avoid silently deleting data.

The generated preview/output is a derived representation.

## 33. Asset Handling

Export assets may include:
- profile photographs;
- template graphics;
- icons;
- logos where permitted;
- other document images.

Assets must have defined ownership/source/usage status where relevant.

Missing or invalid assets should produce a controlled compatibility or export failure rather than broken output.

## 34. Accessibility

Export and online distribution should preserve accessibility where the format permits.

Relevant considerations include:
- semantic headings;
- readable text;
- meaningful link labels;
- logical order;
- non-color-only meaning;
- accessible online controls.

PDF/DOCX accessibility capability may vary by output path and should not be overstated.

## 35. Internationalization

Export must support international career documents without assuming one country's conventions.

Examples include:
- international phone numbers;
- multilingual content;
- regional address structures;
- localized date formats;
- optional regional fields;
- right-to-left languages where explicitly supported.

Regional fields must remain optional unless required by the selected use case.

## 36. Security and Privacy

Export and distribution must protect:
- private career information;
- uploaded assets;
- generated artifacts;
- public/private access controls;
- download permissions;
- account ownership;
- deletion/revocation state.

Temporary export artifacts should not be retained indefinitely without a documented reason.

## 37. Deletion and Revocation

The lifecycle must define what happens when:
- a document is deleted;
- an online CV is unpublished;
- a shared link is revoked;
- an artifact is deleted;
- an entitlement expires;
- an account is deleted.

Revocation of distribution access must not imply deletion of the underlying Master Profile unless explicitly requested.

## 38. Cover Letter Distribution

Cover letters use the same general export principles.

A cover letter may be exported independently or alongside a targeted CV.

The cover letter remains its own document with its own version and lifecycle.

## 39. Application Workspace Relationship

Future Application Workspace functionality may associate:

**Job Description → Targeted CV → Cover Letter → Match Analysis → Exported Artifacts → Application Record**

Export artifacts should therefore retain enough provenance to identify their originating document/version.

## 40. V1 Compatibility

V1 currently provides:
- mobile PDF generation;
- desktop/browser print/PDF;
- A4 output;
- multi-page PDF behavior;
- template-specific rendering;
- existing template assets;
- existing export-related user flows.

V2 must preserve the user-visible export intent while replacing V1 implementation limitations where required.

V1 output remains a Golden Baseline reference for visual and functional regression.

## 41. Export Regression Requirements

V2 validation should compare relevant outputs against the V1 Golden Baseline for:
- supported templates;
- supported fields;
- section visibility;
- themes;
- page count where applicable;
- page flow;
- visual structure;
- export integrity.

Differences introduced intentionally by V2 must be documented rather than treated as accidental drift.

## 42. Export Acceptance Criteria

The export/distribution architecture is contractually complete when:

1. PDF is a controlled projection of an approved document state;
2. DOCX is genuinely editable;
3. blank DOCX and generated DOCX are distinct;
4. print is an explicit capability;
5. template output capabilities are declared;
6. compatibility is resolved before export;
7. unsupported content is not silently deleted;
8. export validation exists conceptually;
9. generated artifacts are traceable to source versions;
10. generated artifacts are immutable;
11. online CV derives from the canonical document model;
12. public/private/link-only visibility is explicit;
13. public field visibility is controllable;
14. online publication is version-aware;
15. sharing and download permissions are explicit;
16. entitlement boundaries do not corrupt career data;
17. sample/demo data remains separate from user data;
18. Try with My Data preserves the source data;
19. export/privacy deletion rules are defined;
20. V1 export behavior remains covered by Golden Baseline regression.

## 43. Domain Invariants

1. Generated artifacts are derived outputs, not career-data sources.
2. Export must use a coherent document snapshot.
3. A successful export must pass applicable validation.
4. Unsupported content must never disappear silently.
5. PDF and DOCX are different output contracts.
6. Blank Word templates and user-data Word exports are different products.
7. Online CV uses the canonical document model.
8. Public visibility does not imply public display of every personal field.
9. Public CV publication must be explicitly controlled.
10. Export artifacts are traceable and immutable.
11. Entitlement changes must not destroy career data.
12. Sample/demo data must never become authoritative user data.
13. Revoking distribution access does not automatically delete source career data.
14. Export implementation details must not become the source of truth.
15. No implementation technology is selected by this contract.

## 44. Approval Gate

Review this contract with:
- V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md
- V2_DOMAIN_AND_DATA_CONTRACT_SPECIFICATION.md
- V2_DOCUMENT_LIFECYCLE_AND_STATE_CONTRACT.md
- V2_TEMPLATE_COMPATIBILITY_AND_CAPABILITY_CONTRACT.md
- V2_LAYOUT_AND_PAGINATION_CONTRACT.md
- V2_IMPORT_AND_MIGRATION_CONTRACT.md
- V2_INTELLIGENCE_AI_SAFETY_AND_PROVENANCE_CONTRACT.md
- V2_TEMPLATE_LIBRARY_AND_DISTRIBUTION_SYSTEM.md
- V2_MONETIZATION_AND_CAREER_ECOSYSTEM.md

After approval, continue with the **V2 Security, Privacy, Account and Data Governance Contract**.

**No application code is introduced by this milestone.**
