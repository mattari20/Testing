# CV Builder V2 — Template Library and Distribution System

## 1. Purpose

This document defines the product and architectural requirements for the V2 Template Library: the system through which users discover CV templates, inspect full previews, compare presentation options, download editable Word templates where available, and start an online CV using a selected template.

The Template Library is a product layer around the Template Engine. It is not merely a larger template dropdown inside the builder.

Primary journey:

**Template Library → Template Preview → Choose Template → Build Online / Download Word / Sample PDF → Customize → Export**

The library follows the V2 principle:

> **One canonical career-data model → many targeted CV documents → many presentation variants → many compatible templates and export formats.**

A template is a presentation definition. It must never become the owner of user career data.

## 2. Goals

The Template Library must:
- make templates discoverable by career level, industry and style;
- provide a trustworthy full-page preview;
- distinguish demo/template content from real user career data;
- allow a user to start an online CV directly from a template;
- allow an editable blank Word template when available;
- support user-data DOCX export when supported;
- expose compatibility information before selection;
- support free and premium templates through entitlement boundaries;
- support template versions and lifecycle states;
- grow without rewriting the Document Core;
- provide useful SEO landing pages without thin programmatic pages;
- support future comparison and recommendation;
- preserve the V1 visual baseline during core migration.

## 3. Non-goals

The Template Library must not:
- store the canonical Master Profile itself;
- redefine the CV data model per template;
- require a separate incompatible CV model for each template;
- silently delete unsupported user content;
- treat a PDF screenshot as an editable Word document;
- make every template responsible for every export format;
- force account creation merely to browse or start a free CV;
- make AI, advertising, payments or a specific cloud provider a rendering dependency.

## 4. Product layers

### 4.1 Career Data

The authoritative source information includes personal/contact information, education, experience, skills, languages, projects, certifications, achievements, publications, research, custom fields and custom sections.

This belongs to the Master Career Profile and related user-controlled career data.

### 4.2 Document Configuration

A targeted CV decides:
- included profile information;
- visible sections;
- section and field ordering;
- supported content overrides;
- selected presentation variants;
- selected template;
- theme/presentation settings;
- document-specific options.

### 4.3 Presentation Template

The template defines how selected document content is displayed, including layout, typography, spacing, visual hierarchy, supported variants, page model, themes, export compatibility and accessibility expectations.

### 4.4 Distribution/Product Layer

The Template Library provides:
- discovery and filtering;
- preview;
- comparison;
- metadata;
- Word download where available;
- online build entry;
- sample PDF;
- free/premium presentation;
- entitlement checks;
- SEO pages;
- related-template discovery.

This separation prevents a template from becoming a data container.

## 5. Template Library experience

The main library should present a browsable catalog.

### 5.1 Primary filters

Career Level:
- Student
- Fresh Graduate
- Entry Level
- Mid Level
- Senior
- Executive
- Academic

Industry:
- IT / Software
- Engineering
- Medical / Healthcare
- Business
- Finance
- Education
- Marketing
- Design
- Legal
- Research
- Other supported categories

Style:
- Modern
- Minimal
- Professional
- Creative
- Corporate
- Academic
- ATS-focused

### 5.2 Capability filters

Additional filters may include:
- ATS-friendly profile;
- photo / no photo;
- one column / multi-column;
- one page / multi-page capable;
- free / premium;
- Word available;
- online builder available;
- PDF export available;
- DOCX export available;
- academic support;
- student/fresh-graduate support.

Filters must reflect actual metadata.

## 6. Template card

Recommended card information:
- template thumbnail;
- template name;
- career level;
- industry;
- style;
- free/premium state;
- ATS-related badge where applicable;
- PDF support;
- Word/DOCX support;
- Online Builder availability.

Recommended actions:
- Preview
- Use Template / Build Online
- Download Word when a blank Word template is available

Optional:
- Compare
- Try with My Data
- Sample PDF

Exact visual treatment remains deferred to the controlled UI/CSS phase.

## 7. Template preview page

Every publishable template should have a full preview experience containing:
1. template identity;
2. full or near-full demo CV rendering;
3. career-level suitability;
4. industry suitability;
5. style classification;
6. supported sections;
7. supported presentation variants;
8. photo support;
9. page model;
10. ATS suitability information where applicable;
11. accessibility expectations;
12. export availability;
13. Word availability;
14. Online Builder availability;
15. free/premium state;
16. related templates.

Primary actions:
- Build Online
- Try with My Data
- Download Word
- View Sample PDF

Unavailable capabilities must be omitted or clearly disabled.

## 8. Demo Profile and preview safety

Template previews must use controlled demo data. A preview must not require private career information.

Representative Demo Profiles should cover major categories such as Student, Fresh Graduate, Software/IT, Engineering, Business and Academic.

The Demo Profile is presentation content only. It is not authoritative user data.

### Try with My Data

When selected:
1. obtain authorized Master Profile data;
2. map it into a temporary or selected CV document configuration;
3. apply the selected template;
4. preserve the original Master Profile;
5. let the user review compatibility before committing.

Template selection must never overwrite or destructively transform the Master Profile.

## 9. Build Online flow

Standard journey:

**Library → Preview → Build Online → Targeted CV creation or selection → Template applied → Compatibility review → Builder → Preview → Export**

For a new anonymous user, the no-login local-first path remains available.

For an existing user, the system may offer:
- use Master Profile;
- create a new targeted CV;
- use an existing CV as the starting point;
- start with Demo Profile and replace content later.

The selected template is part of document presentation configuration, not career-data ownership.

## 10. Word product model

The system must distinguish two Word products.

### 10.1 Blank Word Template

A downloadable editable DOCX containing:
- template layout;
- headings;
- styles;
- placeholders;
- formatting;
- example or placeholder structure as appropriate.

This is a standalone product asset and should be labeled **Blank Word Template**.

### 10.2 User-data Word Export

A user builds or imports a CV online and exports actual CV data as an editable DOCX.

This should be labeled **Download Word / Export DOCX**.

It is a document-generation capability, not merely a downloadable asset.

### 10.3 Capability relationship

A web template may support:
- Web: Yes
- PDF: Yes
- DOCX Export: Yes
- Blank DOCX: Yes

or another valid combination.

Not every web template must support every Word capability. The UI and metadata must make differences visible.

## 11. Word implementation principle

A professional editable Word document must be generated from structured content and Word-oriented layout rules.

The system must not treat a PDF screenshot or rendered image as an editable Word document.

Blank Word templates and user-data DOCX exports may share template family, identity, style definitions, metadata and compatibility rules, but may use different generation mechanisms.

## 12. Template metadata contract

Minimum conceptual metadata:
- Template ID
- Name
- Version
- Career level
- Industry
- Style
- Description
- Supported sections
- Supported field types
- Supported presentation variants
- Photo support
- Column model
- Page model
- Theme options
- ATS profile
- Accessibility profile
- Status
- Web presentation support
- PDF export support
- DOCX export support
- Blank DOCX availability
- Demo/preview assets
- Free/premium classification
- Entitlement/product reference where applicable
- Related templates

The metadata contract must be versioned.

## 13. Template lifecycle

Recommended lifecycle:
1. Draft
2. Testing
3. Published
4. Deprecated
5. Retired

A template must not become publicly selectable merely because its source asset exists.

## 14. Compatibility model

Compatibility must be explicit.

A template may support Education, Experience, Skills, Languages, Projects and Certifications while not supporting Publications or Research.

If the Master Profile contains unsupported content, the system must never silently delete it.

Valid responses:
- hide unsupported content for this CV;
- choose another template;
- choose a compatible presentation variant;
- show a clear compatibility notice;
- preserve source content in the Master Profile.

The same rule applies to unsupported field types and presentation variants.

## 15. Presentation variants

Template selection and presentation-variant selection are separate.

A Languages section may support text proficiency, progress bar, stars, percentage or compact label. A template may support only some.

When a template changes:
1. canonical content remains unchanged;
2. compatible variants remain selected;
3. incompatible variants are identified;
4. an explicit compatible fallback may be recommended;
5. meaning is never silently changed.

## 16. Template comparison

A future V2 release should compare the same CV content across templates.

Comparison should cover:
- supported sections;
- presentation variants;
- photo support;
- column/page model;
- pagination behavior;
- PDF support;
- DOCX export support;
- blank Word availability.

The same underlying content must be rendered for each comparison.

## 17. Template recommendation

A recommendation layer may use:
- career level;
- industry;
- intended role;
- section count;
- content density;
- photo preference;
- ATS target;
- student/academic profile;
- presentation variants;
- export requirements.

Recommendations must be explainable, for example:

> Supports your selected sections, technical-skills presentation and DOCX export requirement.

No opaque hiring-outcome claims should be attached to recommendations.

## 18. Template switching inside the builder

When switching:
- canonical data remains unchanged;
- document visibility remains controlled;
- compatible variants remain selected;
- incompatible features are identified;
- page count may change;
- layout is recalculated;
- export capabilities update;
- meaningful compatibility changes are communicated.

Template switching must not create a new incompatible career-data model.

## 19. Free and premium templates

The library supports free and premium templates.

Premium access is controlled through the entitlement layer:

**Template/Product → Entitlement → User Access**

The renderer must not contain hard-coded payment logic.

A premium entitlement may govern online use, variants, PDF export, DOCX export, blank Word download, premium profile packages or future online themes.

Commercial packaging can evolve without rewriting the template engine.

## 20. Template packs and marketplace direction

The architecture should allow:
- CV Template Pack;
- Student CV Pack;
- ATS Template Pack;
- Academic Pack;
- Industry Pack;
- Premium Profile Pack;
- CV + Cover Letter Pack;
- CV + Word + Online Profile Pack.

Commercial metadata remains separate from rendering metadata and may include product/catalog ID, template/package ID, version, price, currency, entitlement, purchase state, activation, refund/revocation, availability and future regional/promotional pricing.

Payment-provider selection is deferred.

## 21. SEO architecture

Template pages can become useful search landing pages when they provide genuine utility.

A template page may include:
- full preview;
- description;
- suitable career levels;
- suitable industries;
- supported sections;
- presentation variants;
- ATS information;
- Word availability;
- online builder availability;
- sample PDF;
- FAQs;
- related templates;
- clear build/download actions.

Avoid thin pages differing only by title or template ID.

## 22. Analytics and measurement

Potential events:
- template library view;
- filter use;
- template preview opened;
- template selected;
- Build Online started;
- Try with My Data started;
- Word download started;
- Sample PDF viewed/downloaded;
- comparison opened;
- template switch completed;
- premium access attempt.

Analytics must use stable taxonomy and privacy controls. Raw CV content should not be transmitted merely to measure template usage.

## 23. Accessibility

Library and preview experiences should support:
- keyboard navigation;
- visible focus;
- semantic controls;
- accessible labels;
- meaningful button names;
- readable typography;
- adequate contrast;
- accessible filters;
- accessible preview controls.

Template-level accessibility metadata should be available for compatibility decisions.

## 24. Security and privacy

Requirements include:
- no private career data in public demo previews;
- authorization before using private Master Profile data;
- secure handling of imported/uploaded CV data;
- entitlement checks that do not expose private career content;
- no sensitive CV content in ordinary advertising payloads;
- explicit privacy controls for future public CVs;
- secure configuration for protected commercial or analytics services.

## 25. V1 preservation requirements

During core V2 migration:
- V1 visual presentation remains the Golden Baseline;
- current template behavior is preserved or explicitly mapped;
- current template registry entries are inventoried;
- template assets are reconciled;
- PDF/export behavior is regression-tested;
- theme behavior is regression-tested;
- missing V1 template assets are resolved before baseline completion.

The Template Library is a V2 product layer and must not require a premature redesign of the existing builder.

## 26. Testing requirements

Tests must cover:

### Discovery
Filters, search, category metadata, free/premium visibility, Word availability and online builder availability.

### Preview
Demo Profile rendering, full-page rendering, responsive preview, metadata and supported sections.

### Build Online
Anonymous start, Master Profile start, new targeted CV, existing CV start, compatibility review and template application.

### Word
Blank Word download, user-data DOCX export, editable structure, capability handling and metadata/version consistency.

### Compatibility
Unsupported sections, unsupported fields, variant compatibility, template switching and no silent data deletion.

### Commercial
Free access, premium entitlement, expired/revoked entitlement, promotional entitlement and refund/revocation behavior.

### Regression
V1 templates, visual output, PDF, theme, page count, mobile and desktop.

## 27. Acceptance criteria

Implementation planning can begin when:
1. template metadata is formally defined;
2. lifecycle is defined;
3. library filters are defined;
4. preview behavior is defined;
5. Demo Profile behavior is defined;
6. Build Online flow is defined;
7. Blank Word and DOCX Export are explicitly separated;
8. compatibility rules are defined;
9. presentation-variant compatibility is defined;
10. entitlement boundaries are defined;
11. comparison and recommendation boundaries are defined;
12. SEO requirements are defined;
13. privacy/analytics requirements are defined;
14. V1 template preservation is mapped;
15. testing/regression requirements are defined.

## 28. Architectural summary

Conceptual document flow:

**MASTER PROFILE → TARGETED CV → Selected Sections / Fields → Presentation Variants → Template → Preview → PDF / DOCX / Online CV**

Discovery/distribution flow:

**Template Library → Template Preview → Build Online / Try with My Data / Download Word / Sample PDF → Builder or Document Asset → Export / Publish**

Strong architectural rule:

> **A template controls presentation; it does not own career data.**

This allows the same career information to power multiple targeted CVs, presentation variants, templates, Word output, PDF output and future online CV experiences without duplicating or corrupting the underlying data.
