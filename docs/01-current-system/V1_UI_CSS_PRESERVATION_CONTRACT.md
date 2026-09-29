# V1 UI / CSS Preservation Contract

## Status

**Contract:** Active  
**Scope:** CV Builder V1 → V2 migration  
**Initial UI strategy:** Preserve current visual presentation  
**CSS redesign:** Deferred to final UI/CSS phase

---

## 1. Decision

The first V2 implementation stages will **not redesign the current front-end view**.

The project will first modernize the underlying architecture, document model, persistence, rendering pipeline, pagination, ATS intelligence, AI capabilities, and other planned backend/core functionality.

The current visual presentation will remain the reference UI.

After the new core is stable and regression-tested, a dedicated UI/CSS phase will make only the necessary visual improvements.

This is a deliberate sequencing decision.

---

## 2. Why this matters

The current V1 interface contains more than visual styling.

The UI structure is coupled to:

- JavaScript selectors
- DOM IDs
- CSS classes
- field wrappers
- section containers
- progress controls
- preview containers
- mobile/desktop engine hooks
- photo/crop elements
- ad placeholders
- template rendering expectations

Changing the visual layer while changing the architecture would create two simultaneous moving targets and increase the risk of hidden regressions.

Therefore:

> Core migration first. Visual modernization later.

---

## 3. CSS freeze rules

During the core V2 migration:

### Do not change unless technically required

- global typography
- font sizes
- font weights
- colors
- spacing
- margins/padding
- borders
- radii
- shadows
- button appearance
- form appearance
- card appearance
- progress bar appearance
- tabs
- mobile navigation
- desktop navigation
- preview shell
- ad placement containers
- template visual styling

### Allowed changes

Only changes required to make the new architecture function correctly are allowed, such as:

- a compatibility selector
- a minimal CSS variable bridge
- a temporary structural rule required by the new rendering engine
- a bug fix that prevents an existing V1 behavior from working
- an explicitly documented accessibility or browser compatibility correction

Such changes must be recorded.

---

## 4. DOM compatibility rules

Existing DOM hooks should be treated as a compatibility API until the replacement is proven.

Important editor IDs include:

- `tab-edit`
- `tab-prev`
- `dynamic-progress-fill`
- `dynamic-pct-bubble`
- `dynamic-step-text`
- `editor-ui`
- `step-1`
- `step-2`
- `step-3`
- `step-4`
- `theme-palette`
- `img-thumb`
- `photo-upload`
- `crop-modal`
- `image-to-crop`
- `experience-list-container`
- `education-list-container`
- `skills-list-container`
- `languages-list-container`
- `achievements-list-container`
- `projects-list-container`
- `back-btn`
- `next-btn`
- `preview-stage`
- `preview-container`
- `preview-render`

Before removing or renaming any of these, identify all code that consumes the hook and provide a migration adapter or controlled replacement.

---

## 5. Data-field compatibility

The current editor uses:

- `full_name`
- `job_title`
- `email`
- `phone`
- `whatsapp`
- `address`
- `dob`
- `cnic`
- `linkedin`
- `website`
- `religion`
- `summary_text`

The V2 model may use richer internal identifiers, but the current user-visible fields must continue to work.

If an identifier changes internally, a compatibility mapping must exist during migration.

---

## 6. CSS and template separation

V2 should progressively separate:

1. document data
2. document semantics
3. template metadata
4. template presentation
5. editor UI presentation

However, this separation must not require an immediate visual redesign.

The existing templates are the baseline presentation assets.

---

## 7. Template CSS preservation

The supplied templates use template-specific HTML/CSS and A4 dimensions.

The V2 rendering architecture must be able to consume these templates during the transition.

Do not rewrite all templates into a new visual system simply because the V2 engine is new.

Instead:

- preserve existing template appearance
- introduce the new document model underneath
- add a controlled template adapter/compiler layer
- later migrate templates individually if required
- compare old and new rendered output visually

---

## 8. A4 layout preservation

The current system uses A4-oriented dimensions.

Observed template conventions include approximately:

- 210mm width
- 297mm height/min-height
- A4 portrait
- template-specific page layout

V2 semantic pagination is expected to improve multi-page behavior, but the visual page size must remain A4 unless the user explicitly chooses another supported paper size in a future feature.

---

## 9. Final UI/CSS phase

The UI/CSS redesign will occur only after:

- V2 document model is stable
- migration is stable
- rendering is stable
- pagination is stable
- template metadata is stable
- export is stable
- ATS analysis is stable
- regression tests pass

At that point, CSS work can be performed intentionally rather than as side effects of backend migration.

---

## 10. Visual regression requirement

Before and after core migration, representative V1 CVs should be rendered through the same templates and compared.

Minimum visual regression set:

- empty CV
- short CV
- medium CV
- long CV
- all personal fields populated
- optional fields hidden
- photo enabled/disabled
- all repeatable sections populated
- multiple pages
- each available template
- each theme color

The goal during the core migration is not to make the UI prettier.

The goal is to ensure that architecture changes do not unexpectedly change the existing user experience.

---

## 11. Change classification

Every future change should be classified as one of:

### A. Core / backend change

Changes document model, persistence, services, migration, pagination, analysis, AI, or other internal architecture.

**Default:** allowed without visual redesign.

### B. Compatibility change

Required to keep V1 UI functioning while V2 core changes.

**Default:** allowed, but document the compatibility reason.

### C. Visual/CSS change

Changes appearance or visual layout.

**Default during core migration:** defer.

### D. Intentional V2 UX redesign

A planned new experience that changes the existing user flow.

**Default:** defer until the dedicated UI/UX phase unless it is required for a V2 capability and explicitly documented.

---

## 12. No accidental CSS drift

A developer/agent must not:

- reformat CSS solely for style preference
- replace class names unnecessarily
- remove selectors considered "unused" without tracing JavaScript/template use
- simplify DOM structure without checking selectors
- alter template dimensions without pagination review
- remove ad containers because they appear unrelated to CV logic
- remove icon classes because they appear cosmetic
- replace inline template styles without a rendering comparison

"Unused-looking" does not mean unused.

---

## 13. Preservation principle for new features

New V2 features must be layered onto the existing visual contract wherever possible.

Examples:

### ATS analysis

The first implementation may add a functional analysis layer without redesigning the entire editor.

### Job description matching

The matching engine may operate on the document model before a new visual dashboard is introduced.

### AI rewriting

The AI service may generate suggestions while the current editor remains visually unchanged.

### Multiple CV versions

Versioning may be introduced in storage/model layers before the UI is redesigned.

### Cloud backup

Cloud synchronization may be added without replacing the local-first editor view.

### Semantic pagination

The rendering engine can become page-aware while keeping the current template appearance.

---

## 14. Required architecture consequence

The V2 architecture must not assume:

> "New backend means new frontend."

Instead it must support:

> "New core + compatibility layer + existing UI first; UI modernization later."

This requirement must be reflected in the document model, template engine, rendering engine, persistence layer, migration strategy, and test strategy.

---

## 15. Approval gate

No broad UI/CSS redesign should begin until a dedicated milestone is created for:

- UI/UX review
- CSS architecture
- template visual updates
- responsive improvements
- accessibility improvements
- visual regression
- browser/device regression

That milestone is separate from the core V2 architecture migration.

---

## 16. Final acceptance condition

The core V2 migration is considered UI-preserving when:

1. The current editor opens and functions through the new core.
2. Existing fields still work.
3. Existing sections still work.
4. Existing visibility controls still work.
5. Existing photo/crop behavior still works.
6. Existing template selection still works.
7. Existing preview behavior still works.
8. Existing theme behavior still works.
9. Existing desktop/mobile behavior still works.
10. Existing export behavior still works.
11. The visual appearance has not been intentionally redesigned.
12. Any unavoidable visual difference is documented and explained.

Only after this gate should the project enter the dedicated UI/CSS improvement phase.
