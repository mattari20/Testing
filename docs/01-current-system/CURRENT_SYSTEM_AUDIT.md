# Current System Audit — Production V1

## 1. Executive summary

The supplied production code is a client-heavy CV builder with a PHP/PHP-rendered template-selection layer and API endpoints for reporting/tracking. The browser-side builder is organized around a central `window.cv` state object, a separate visibility matrix, a template registry, token-based HTML compilation, and separate mobile/desktop export engines.

The current system is already partially decoupled from visual design. The data model does not store template markup, while templates consume tokens such as `{{NAME}}`, `{{EXPERIENCE_LIST}}`, and visibility markers.

However, the data model is still a fixed schema. Adding a genuinely new section or arbitrary user-defined field currently requires JavaScript model changes, input-rendering changes, token/loop compiler changes, and template changes.

## 2. Main production files

### Application shell
- `index.php` — template/category landing and selection layer.
- `bridge.php` — template bridge/selection page and metadata.
- `builder.html` — builder UI shell.

### Core client engine
- `builder.js` — state, persistence, input binding, visibility, template registry, template compiler, preview orchestration, theme handling and download orchestration.

### Rendering/export engines
- `builder-mobile-engine.js` — responsive preview scaling and mobile PDF pipeline.
- `builder-desktop-engine.js` — desktop print/PDF orchestration.

### Styling/assets
- `builder-ui-styles.css`
- `icons/builder-icons.js`
- `icons/builder-icons.css`
- template-specific inline HTML/CSS assets
- template preview images
- DOCX template files

### Server/API
- `api/track-event.php`
- `api/report.php`
- `api/.htaccess`

## 3. Current data model

The core state currently contains:

### Personal
- name
- job title
- email
- phone
- address
- WhatsApp
- CNIC
- date of birth
- religion
- LinkedIn
- website

### Top-level content
- summary
- photo

### Repeatable sections
- education
- experience
- projects
- skills
- languages
- achievements

The repeatable object structures are fixed.

### Education
- degree
- institute
- year
- grade

### Experience
- title
- company
- duration
- description

### Projects
- name
- role
- year
- description

### Primitive arrays
- skills
- languages
- achievements

## 4. Persistence

Current production persistence is browser-local.

The main data packet is serialized as JSON and stored under a canonical localStorage key. A version marker is used for migration.

The current reset function permanently clears the local browser CV data after user confirmation.

### V2 implication

The local-first experience should remain. Cloud/account storage should be an optional second persistence layer, not a replacement for anonymous/local creation.

## 5. Visibility model

Visibility is stored separately from CV content.

There are section-level visibility flags and field-level visibility flags.

This separation is architecturally useful and should be preserved in V2, but the registry should become dynamic rather than hard-coded.

## 6. Template selection

Templates are selected using a registry keyed by template IDs. The active template is resolved from the URL `tid` parameter with a fallback template.

The current registry contains nine logical entries, although the supplied archive contains seven HTML template files. Two registry-referenced template files are absent from the supplied archive and require reconciliation.

## 7. Template rendering

The current renderer:

1. fetches the selected HTML template;
2. compiles personal-field tokens;
3. expands repeatable array loops;
4. applies visibility blocks;
5. injects the compiled HTML into the preview;
6. executes embedded template scripts;
7. reapplies theme variables;
8. notifies the mobile engine to refresh scaling.

An AbortController is used to cancel stale preview fetch/render operations.

## 8. Token architecture

The current template language uses:

- scalar tokens such as `{{NAME}}`
- loop tokens such as `{{EXPERIENCE_LIST}}`
- conditional visibility blocks such as `{{#toggle_exp_visible}} ... {{/toggle_exp_visible}}`

The token compiler has explicit mappings for known fields and sections.

### V2 limitation

A new arbitrary section cannot currently be introduced solely through a data/configuration definition. The compiler knows the supported section names and field names in code.

## 9. Preview architecture

The preview is rendered from template HTML into the preview container. Theme colors are propagated into the preview and, where applicable, into an iframe document.

The mobile engine uses a fixed design width of approximately 794 CSS pixels and scales the rendered CV to available viewport width.

### V2 implication

The preview system is a strong foundation for preview-side editing, but the current architecture needs an interaction/data-binding layer that maps preview elements back to canonical CV fields/sections.

## 10. Page and paper model

The templates use A4 dimensions in CSS (210mm by 297mm or equivalent minimum/explicit dimensions).

The current CSS contains print rules including A4 portrait and page-break avoidance rules.

The mobile PDF engine captures the entire rendered CV into a canvas and then places that image into multiple PDF pages by vertical offset when the rendered height exceeds one A4 page.

### Important distinction

Current multi-page PDF generation is primarily image slicing based. It is not yet a semantic pagination engine that understands individual CV sections/items and decides safe page boundaries.

This is a major V2 architecture opportunity.

## 11. PDF/export

Desktop and mobile have separate export flows.

### Desktop
The desktop engine creates an isolated print iframe and invokes the browser print pipeline.

### Mobile
The mobile engine:

- creates an export clone
- waits for fonts/images/layout
- captures the clone with html2canvas
- validates/optimizes the canvas
- creates an A4 jsPDF document
- calculates the number of pages from rendered image height
- places the same tall image at different vertical offsets
- saves the PDF

### V2 implication

The export architecture should be retained as a compatibility layer while a new semantic page-layout model is designed.

## 12. Theme/color system

A small predefined theme palette exists. The chosen theme color is persisted in the CV state and propagated to the preview.

This is useful infrastructure for V2 template theming.

## 13. Input UI

The current builder has a four-step wizard and separate mobile edit/preview switching.

The form uses explicit `data-field` attributes for the personal fields.

Repeatable sections are rendered dynamically into containers for:

- experience
- education
- skills
- languages
- achievements
- projects

## 14. Existing security-positive patterns

The code includes:

- HTML escaping before token insertion
- AbortController for stale template fetches
- localStorage error handling
- validation of array indices before removal
- explicit data attributes for visibility toggles
- separate visibility state

## 15. Current architectural risks

1. Fixed CV schema.
2. Fixed section registry.
3. Fixed token compiler mappings.
4. Template-specific inline CSS/JS.
5. Template capabilities are not formally declared.
6. Page layout is not a semantic document model.
7. Preview editing is not a first-class data interaction layer.
8. Local-only persistence.
9. No account/cloud synchronization model.
10. No formal versioned master-profile model.
11. ATS is currently primarily a template/style positioning rather than a true analysis engine.
12. No standalone CV upload/analyzer workflow in the supplied code.
13. No job-description matching data model in the supplied code.
14. No formal AI service abstraction in the supplied code.
15. No formal template publishing/versioning contract.

## 16. V2 architectural conclusion

The correct V2 strategy is not a full rewrite of every existing component.

The strongest reusable foundation is:

- atomic CV state
- visibility separation
- template registry concept
- token/loop rendering concept
- mobile scaling engine
- desktop print engine
- theme propagation
- local-first persistence

The primary V2 work should be to introduce a formal metadata-driven document model above these foundations so sections, fields, templates, pagination, storage and intelligence can evolve independently.
