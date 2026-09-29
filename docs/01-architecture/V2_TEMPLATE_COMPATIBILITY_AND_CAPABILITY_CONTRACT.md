# V2 Template Compatibility and Capability Contract

**Status:** Proposed for architecture approval  
**Scope:** Technology-neutral template capability, compatibility, and V1 reuse contract  
**Implementation status:** Documentation only; no application code

## 1. Purpose

This contract defines how CV Builder V2 describes, evaluates, adapts, publishes, switches, and retires presentation templates.

Its primary purpose is to prevent template limitations from causing data loss or unclear behavior.

The governing principle is:

> **A template is a presentation capability boundary, not a boundary on what career data the user is allowed to own.**

This contract also formalizes the reuse of existing V1 templates inside the V2 Template Engine.

## 2. Template Responsibilities

A template may define:

- visual structure;
- typography;
- colors;
- spacing;
- section hierarchy;
- column model;
- photo treatment;
- icons;
- supported sections;
- supported fields;
- supported field types;
- supported presentation variants;
- theme capabilities;
- page model;
- export capabilities;
- accessibility characteristics;
- ATS-oriented compatibility characteristics;
- responsive presentation behavior.

A template must not own authoritative career facts.

## 3. Template Capability Contract

Every V2 template should have a machine-readable conceptual capability description, even though this document does not prescribe how it is implemented.

The capability contract should describe at least:

### Identity
- template ID;
- name;
- version;
- lifecycle status;
- source lineage where relevant.

### Career targeting
- career level;
- industry;
- role/context;
- style classification.

### Content support
- supported sections;
- supported fields;
- supported field types;
- supported repeatable entries;
- custom-section behavior;
- custom-field behavior.

### Presentation support
- supported presentation variants;
- supported variant levels;
- column model;
- photo support;
- theme support;
- typography constraints;
- layout constraints.

### Page support
- page format;
- page model;
- pagination characteristics;
- keep-together capabilities;
- manual-break compatibility;
- overflow behavior.

### Distribution/export support
- web presentation;
- PDF;
- DOCX;
- blank DOCX;
- print;
- sample/demo artifact availability.

### Quality/accessibility
- ATS compatibility profile;
- accessibility characteristics;
- responsive behavior;
- visual regression baseline.

### Commercial/discovery
- free/premium state;
- entitlement/product reference;
- preview asset;
- demo data support;
- SEO/discovery metadata;
- related templates.

## 4. Capability Levels

Capabilities should be classified conceptually as:

- **Supported** — fully supported by the template.
- **Supported with Constraints** — supported only under defined conditions.
- **Adaptable** — can be represented through an approved compatible presentation variant or normalization.
- **Unsupported but Preserved** — cannot be rendered by this template, but source data remains safe.
- **Unknown** — compatibility has not yet been established.
- **Retired** — template is no longer eligible for normal selection.

Unknown must never be treated as Supported.

## 5. Content Compatibility Matrix

For each section/field relevant to a Targeted CV, compatibility should resolve to one of the capability levels.

Example conceptual matrix:

| Content | Template A | Template B |
|---|---|---|
| Personal identity | Supported | Supported |
| Summary | Supported | Supported |
| Experience | Supported | Supported with Constraints |
| Education | Supported | Supported |
| Projects | Supported | Adaptable |
| Skills | Supported | Supported with Constraints |
| Publications | Supported | Unsupported but Preserved |
| Custom Section | Adaptable | Unsupported but Preserved |
| Photo | Supported | Unsupported but Preserved |

This is a compatibility model, not a quality ranking.

## 6. No Silent Data Loss Rule

When a template cannot display content:

1. authoritative source data remains intact;
2. the system determines the compatibility result;
3. the user receives an explicit indication where the limitation affects the document;
4. the user may select another compatible template;
5. the system may select an approved compatible presentation variant;
6. the user may intentionally hide the content for that Targeted CV;
7. the system must never silently delete the source information.

Template switching therefore changes presentation configuration, not ownership of career data.

## 7. V1 Template Reuse Contract

Existing V1 templates are presentation assets that may be adapted into V2.

The approved flow is:

**V1 Template Source → Asset Recovery → Normalization/Adapter → V2 Template Contract → V2 Document Model → V2 Layout/Pagination → Preview/Export**

The V1 builder architecture is not carried into V2 merely because a template is reused.

## 8. V1 Template Compatibility States

Each recovered V1 template must receive an explicit state:

- **V2-Compatible**
- **Adapter Required**
- **Asset Reconciliation Required**
- **Not Yet Compatible**
- **Retired by Explicit Decision**

No template should be treated as production-ready until its state is established.

## 9. V1 Template Preservation Requirements

Where technically compatible, preserve:

- visual structure;
- typography;
- colors;
- spacing;
- section hierarchy;
- one/two-column arrangement;
- photo treatment;
- icons;
- theme behavior;
- A4 assumptions;
- supported V1 fields;
- supported repeatable sections;
- visibility behavior;
- template-specific presentation characteristics.

Internal V2 changes may replace:

- V1 token syntax with V2 field bindings;
- V1 loop syntax with V2 repeatable-entry bindings;
- V1 visibility blocks with V2 document configuration;
- V1 theme variables with V2 presentation tokens;
- V1 page/print behavior with the V2 Layout/Pagination Engine.

## 10. Template Versioning

A template version must be independently identifiable.

Changes that may require a new template version include:

- supported content changes;
- variant changes;
- layout changes;
- page-model changes;
- export capability changes;
- asset changes that materially affect presentation;
- accessibility changes;
- compatibility changes.

A document referencing a template must be able to identify the relevant template version where reproducibility requires it.

## 11. Template Lifecycle

The lifecycle is:

**Draft → Testing → Published → Deprecated → Retired**

### Draft
Under development and not normally selectable.

### Testing
Available for controlled validation and regression testing.

### Published
Eligible for supported product use.

### Deprecated
Existing documents may continue to use it, while new selection may be restricted.

### Retired
No longer normally selectable.

Retirement must not delete user career data or silently invalidate historical documents.

## 12. Template Switching

When a user changes templates:

1. preserve the Master Profile;
2. preserve Targeted CV source selections;
3. preserve compatible section/field selections;
4. preserve compatible presentation variants;
5. evaluate unsupported content;
6. apply only approved compatibility fallbacks;
7. report meaningful compatibility limitations;
8. update the presentation configuration;
9. re-evaluate pagination and export capabilities.

Template switching must not silently rewrite user-authored career facts.

## 13. Template Compatibility and Custom Content

Custom sections and fields are especially important.

A template should declare whether it can:

- render arbitrary text;
- render custom scalar fields;
- render custom repeatable entries;
- provide a compatible generic block;
- preserve but hide unsupported custom content.

If generic rendering is unavailable, unsupported custom content remains preserved outside the current presentation.

## 14. Presentation Variant Compatibility

Templates must declare which variants they support.

Example:

A Skills section may support:
- text;
- tags;
- grouped skills;
- level labels;
- progress representation.

A particular template may support only some of these.

Variant incompatibility must result in:

**Compatible Variant → Approved Fallback → Explicit User Choice**

not silent semantic transformation.

For example, a numeric proficiency value must not automatically be converted into a visual percentage unless that representation is explicitly compatible with the field semantics.

## 15. Theme Compatibility

A template must declare theme capabilities.

Conceptual states include:

- fixed theme;
- theme tokens supported;
- limited theme customization;
- full supported palette;
- custom color constraints.

V1 theme behavior should be preserved where compatible.

A theme change must not alter career data.

## 16. Photo Compatibility

A template should declare:

- photo supported;
- photo optional;
- photo required;
- photo not supported;
- photo supported only in defined layout modes.

If photo is unsupported, the user's photo asset remains preserved.

The document configuration may hide the photo for that Targeted CV without deleting the profile asset.

## 17. Page and Layout Compatibility

Templates must declare relevant page behavior, including:

- A4 compatibility;
- expected page model;
- single/multi-page behavior;
- semantic keep-together support;
- controlled page breaks;
- overflow behavior;
- minimum/maximum layout constraints.

The V2 Layout/Pagination Engine remains authoritative for pagination behavior. A template provides presentation constraints and capabilities rather than implementing the entire document lifecycle.

## 18. Export Capability Compatibility

A template must distinguish among:

- Web presentation;
- PDF generation;
- print;
- generated DOCX;
- blank DOCX template;
- sample PDF.

These are different capabilities.

A template being visually available online does not imply that it automatically has a faithful editable DOCX equivalent.

### Word distinction

**Blank Word Template:** reusable editable DOCX asset containing structure/styles/placeholders.

**User-data Word Export:** generated editable DOCX created from the structured user document.

A PDF screenshot must never be treated as an equivalent editable Word template.

## 19. ATS and Accessibility Capability Metadata

Template metadata may describe:

### ATS profile
- machine-readability characteristics;
- column/layout considerations;
- structural constraints;
- known compatibility limitations.

### Accessibility
- semantic structure;
- keyboard implications;
- readable typography;
- contrast characteristics;
- interactive accessibility where relevant;
- accessible document/export considerations.

These are capability descriptions, not guarantees.

## 20. Demo Data and Preview Assets

Template previews must use controlled demo/presentation data.

Demo data is not authoritative user career data.

A template preview must be able to show the template's intended presentation without requiring a real user's private profile.

Where “Try with My Data” exists:

1. authorized user data is read;
2. Master Profile remains unchanged;
3. compatibility is evaluated;
4. a Targeted CV configuration may be created or updated;
5. unsupported content is explicitly handled.

## 21. Template Discovery and Product Metadata

Template discovery may expose:

- name;
- career level;
- industry;
- style;
- supported sections;
- presentation variants;
- ATS profile;
- accessibility information;
- PDF/DOCX/Web availability;
- free/premium state;
- product/entitlement information;
- preview;
- sample PDF;
- related templates.

Discovery metadata must describe documented capabilities and must not imply unsupported functionality.

## 22. SEO and Public Template Pages

A public template page should provide genuine utility, potentially including:

- full or meaningful preview;
- template description;
- suitability information;
- supported sections;
- variant information;
- ATS information;
- Word availability;
- online builder availability;
- sample PDF;
- FAQs;
- related templates.

Template pages must not be thin programmatic pages whose only purpose is search traffic.

## 23. Template Recommendation Boundary

Future template recommendation may use:

- target role;
- career level;
- industry;
- selected sections;
- desired presentation style;
- required export format;
- compatibility requirements;
- accessibility needs.

Recommendations must be explainable through documented compatibility/capability factors.

The recommendation system must not silently remove user content merely to make a template appear compatible.

## 24. Commercial Boundary

Template monetization follows:

**Template/Product → Entitlement → Access**

The Template Engine must not own payment processing.

Premium status may affect access, but must not change the semantic meaning of career data.

An expired/revoked entitlement must not delete user-created documents or career data.

## 25. Analytics Boundary

Template analytics may record events such as:

- template viewed;
- preview opened;
- template selected;
- template switched;
- variant selected;
- export requested;
- export completed.

Analytics should not transmit raw CV content merely to measure template behavior.

## 26. V1 Golden Baseline Validation

Every V1-reused template must be validated against the V1 Golden Baseline for:

- visual structure;
- typography;
- colors;
- spacing;
- section hierarchy;
- supported V1 fields;
- repeatable sections;
- visibility behavior;
- theme behavior;
- A4 assumptions;
- preview behavior;
- PDF output where supported.

Visual differences caused by intentional V2 improvements must be explicitly classified rather than treated as accidental compatibility.

## 27. Template Acceptance Criteria

A template becomes V2-Compatible only when:

1. its source/assets are recovered or reconciled;
2. its capability contract is defined;
3. supported V1 content renders correctly;
4. visibility behavior is preserved;
5. supported themes behave correctly;
6. supported presentation variants are defined;
7. pagination behavior is validated;
8. supported export capabilities are validated;
9. unsupported content has an explicit preservation path;
10. visual regression against the V1 Golden Baseline is completed where applicable;
11. no silent data loss is observed;
12. lifecycle state is explicitly recorded.

## 28. Domain Invariants

1. Templates never own authoritative career data.
2. Template incompatibility never deletes source career data.
3. Unknown capability is not treated as support.
4. Template switching preserves source data.
5. Presentation variants cannot change semantic facts.
6. Unsupported custom content remains preserved.
7. Template version is traceable.
8. Retiring a template does not delete user data.
9. Blank DOCX and generated user-data DOCX remain distinct concepts.
10. V1 template reuse does not require V1 architecture reuse.
11. V1 visual baseline remains protected during core migration.
12. ATS/accessibility metadata does not constitute a guarantee.
13. Premium state is separate from rendering logic.
14. Analytics does not require raw CV content.
15. No implementation technology is selected by this contract.

## 29. Approval Gate

Review this contract together with:

- V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md
- V2_DOMAIN_AND_DATA_CONTRACT_SPECIFICATION.md
- V2_DOCUMENT_LIFECYCLE_AND_STATE_CONTRACT.md
- V1_TO_V2_MASTER_RECONCILIATION.md
- V1_FUNCTIONALITY_PRESERVATION_INVENTORY.md
- V1_UI_CSS_PRESERVATION_CONTRACT.md
- V2_TEMPLATE_LIBRARY_AND_DISTRIBUTION_SYSTEM.md

After approval, continue with the **V2 Layout and Pagination Contract**.

**No application code is introduced by this milestone.**
