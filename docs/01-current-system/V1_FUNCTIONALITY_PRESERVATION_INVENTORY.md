# V1 Functionality Preservation Inventory

## Purpose

This document is the **non-loss contract** for the transition from the working CV Builder V1 to CV Builder V2.

The V2 project must not silently remove, weaken, or forget any V1 capability.

The objective is to change the underlying architecture and add the planned V2 capabilities while preserving the currently working user-facing behavior unless a deliberate V2 requirement explicitly replaces it.

## Core preservation rule

> Every V1 function, interaction, state field, visibility control, template behavior, export path, tracking path, asset dependency, and integration point must have an identified V2 owner or an explicitly documented replacement before V1 code is retired.

No functionality may disappear merely because it is not part of the new architecture's first implementation.

---

## 1. UI / visual preservation rule

The current V1 front-end visual presentation is **frozen for the initial V2 migration**.

During the architecture and backend/core-engine migration:

- Do not redesign the editor UI.
- Do not redesign the template visual appearance.
- Do not redesign the cards, controls, spacing, typography, colors, icons, progress UI, tabs, forms, preview shell, or navigation.
- Do not rewrite CSS merely because the underlying implementation is changing.
- Preserve existing DOM hooks where practical: IDs, classes, data attributes, containers, and structural expectations used by the current JavaScript/CSS.
- New required data must first be integrated through the new model/engine while maintaining the existing visual contract.
- CSS changes are deferred to a dedicated final UI/CSS pass.
- If an architectural change technically requires a temporary compatibility adapter, use the adapter rather than changing the visual layer prematurely.

The final UI/CSS pass is a separate controlled stage after core functionality is stable.

---

## 2. V1 source inventory

The supplied working V1 archive contains the following principal source files:

| Area | File | Approx. lines | Preservation requirement |
|---|---|---:|---|
| Main application | `builder.js` | 3,144 | Preserve all functional behavior; migrate by capability |
| Mobile engine | `builder-mobile-engine.js` | 1,345 | Preserve responsive preview and mobile PDF workflow |
| Desktop engine | `builder-desktop-engine.js` | 552 | Preserve isolated print/PDF workflow |
| Main editor | `builder.html` | 764 | Preserve current visual/editor contract initially |
| Central UI CSS | `builder-ui-styles.css` | 2,304 | Treat as UI baseline; do not redesign during core migration |
| Public template page | `index.php` | 1,164 | Preserve template discovery/filter/preview/build behavior |
| Bridge/template chooser | `bridge.php` | 487 | Preserve template option presentation and related actions |
| Event API | `api/track-event.php` | 712 | Preserve supported tracking behavior after security hardening |
| Reporting API | `api/report.php` | 2,229 | Preserve supported reporting behavior after security hardening |
| Template set | `cv-template/*.html` | 7 files supplied | Preserve all supplied template layouts |
| Icons | `icons/builder-icons.js/css` | small | Preserve icon behavior/assets |
| SEO | `sitemap.xml` | small | Preserve/reconcile SEO behavior |
| DOCX assets | template Word files | supplied | Preserve export/template dependencies where supported |
| Images | previews/demo assets | supplied/partial | Reconcile every reference before baseline freeze |

The archive contained 42 filesystem entries. The source archive itself is the reference point for the V1 behavior audit.

---

## 3. Canonical V1 data model

The V1 application maintains a global CV object with these principal domains:

### Personal data

- name
- job
- email
- phone
- address
- whatsapp
- cnic
- dob
- religion
- linkedin
- website

### Other document data

- summary
- photo
- education[]
- experience[]
- projects[]
- skills[]
- languages[]
- achievements[]

### Visibility state

Section visibility:

- summary
- photo
- education
- experience
- projects
- skills
- languages
- achievements

Field visibility:

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

### Persistence

The current canonical local storage key is:

`cv_estudent_v2_final`

The V1 code also contains migration handling from the legacy:

`cvData`

The V2 architecture must preserve migration compatibility until the replacement migration path is explicitly tested.

---

## 4. V1 function inventory — main builder

The following functions/capabilities were identified in `builder.js`. Each must be mapped to a V2 owner before the V1 implementation is retired.

### State and persistence

- `_debounce`
- `saveData`
- `loadData`
- `resetData`

### Array/section compilation and manipulation

- `compileArraySection`
- `addItem`
- `removeItem`
- `removeArrayItem`

### Visibility

- `toggleCVVisibility`
- `toggleFieldVisibility`
- `_syncVisibilityUI`
- `_applyVisibilityToggles`
- `_processToggleBlock`

### Form synchronization

- `_syncFormFields`
- `_resolveFieldTarget`
- `_writeToModel`
- `initInputBinding`
- `_readFromModel`
- `restoreFormInputs`

### Application initialization/navigation

- `initApp`
- `initWizard`
- `navStep`
- `switchMobileView`

### Photo workflow

- `handlePhotoUpload`
- `executeCrop`
- `cancelCrop`

The complete photo workflow includes file selection, crop state, crop execution, cancellation, thumbnail/preview update, and persistence.

### AI/helper behavior already present in V1

- `suggestSummary`

This must not be accidentally lost when the V2 AI layer is introduced.

### Dynamic input rendering

- `renderInputs`
- `_renderObjectArrayInputs`
- `_renderPrimitiveArrayInputs`
- `_renderNestedObject`

These functions represent the current dynamic editor generation capability.

### Preview/render pipeline

- `renderPreview`
- `_compileTemplate`
- `_compilePersonalFields`
- `_validateTokens`
- `_compileArrayLoops`
- `_processArrayLoop`
- `_processPrimitiveArrayLoop`

The V2 template architecture must preserve the functional intent of this pipeline while removing fixed-schema limitations.

### Theme/color

- `renderColorPalette`
- `hexToRgb`
- `rgbToHex`
- `mixWhite`
- `mixBlack`
- `applyThemeColor`

The theme color must remain part of the document's presentation state unless a V2 design decision explicitly supersedes it.

### Export and download

- `waitForImages`
- `waitForLayout`
- `downloadDesktopPDF`
- `triggerDownload`
- `trackPdfDownloadEvent`

### Preview helpers / browser callbacks

- `getPreviewContainer`
- `getPreviewCanvas`
- `calculateResponsivePreviewScale`
- `onload`
- `onerror`
- `onclick`

Some names are browser/event callback handlers rather than product-level features; they must still be considered when migrating behavior.

---

## 5. Mobile engine preservation inventory

File: `builder-mobile-engine.js`

Core functions/capabilities:

- `init`
- `refresh`
- `isMobileDevice`
- `collectDOM`
- `adaptPreview`
- `calculateScale`
- `applyScale`
- `updateHeight`
- `handleResize`
- `handleOrientationChange`
- `preparePDF`
- `log`
- `logDOMStatus`
- `getScale`
- `isInitialized`
- `getViewport`
- `getState`
- browser `onload` / `onerror` handlers

### Required behavior

- A4 design dimensions must remain stable.
- Mobile preview must scale to available viewport width.
- Preview height must remain synchronized with transformed content.
- Resize/orientation changes must continue to refresh the preview.
- Mobile PDF generation must continue to work.
- Export cleanup must remain safe.
- The existing mobile/desktop separation must not be lost during V2 pagination work.

### Current PDF limitation to preserve during migration

The V1 mobile PDF path captures the rendered document as a large image and slices that image across A4 pages. This is an implementation limitation, not a user feature to remove.

V2 may replace the mechanism with semantic pagination, but the user-visible requirement remains:

> A complete CV must export as a usable multi-page A4 PDF without losing content.

---

## 6. Desktop engine preservation inventory

File: `builder-desktop-engine.js`

Functions:

- `escapeHtml`
- `prepare`
- `restore`
- `collect`
- `freeze`
- `createFrame`
- `download`
- `print`
- `cleanup`
- `isReady`
- `getVersion`

### Required behavior

- Desktop export/print must remain available.
- Isolated rendering must not corrupt the editor.
- Print/PDF output must remain based on the CV document rather than the surrounding editor UI.
- Cleanup must remove temporary rendering resources.

---

## 7. Editor DOM contract

The current editor contains important IDs and containers. They must be treated as compatibility hooks until a replacement contract is explicitly approved.

Important IDs include:

### Navigation/progress

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

### Theme/photo

- `theme-palette`
- `img-thumb`
- `photo-upload`
- `crop-modal`
- `image-to-crop`

### Personal field wrappers

- `field-wrapper-name`
- `field-wrapper-job`
- `wrapper-email`
- `wrapper-phone`
- `wrapper-whatsapp`
- `wrapper-address`
- `wrapper-dob`
- `wrapper-cnic`
- `wrapper-linkedin`
- `wrapper-website`
- `wrapper-religion`

### Dynamic section containers

- `experience-list-container`
- `education-list-container`
- `skills-list-container`
- `languages-list-container`
- `achievements-list-container`
- `projects-list-container`

### Navigation/preview

- `back-btn`
- `next-btn`
- `preview-stage`
- `preview-container`
- `preview-render`

### Ad placeholders

- `mobile-ad-space`
- `mobile-anchor-ad`
- `desktop-ad-space`

---

## 8. Existing form data-field contract

The current editor exposes these data fields:

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

V2 may internally normalize these into a richer metadata-driven model, but no existing field may silently disappear.

---

## 9. Template registry preservation

The current logical template registry contains nine keys:

1. `t01-modern-minimalist-cv-design_ats`
2. `t01-modern-minimalist-cv-design_modern`
3. `t01-modern-minimalist-cv-design_simple`
4. `t02-professional-cv-design_modern`
5. `t03-professional-cv-design_modern`
6. `t04-modern-blue-corporate_modern`
7. `t05-simple-cv-graphic-web-designer_modern`
8. `t06-professional-cv-graphic-designer_modern`
9. `t07-professional-cv-store-manager-incharge_modern`

Seven corresponding template HTML files were present in the supplied archive.

Two registry-referenced files were absent from the archive:

- `t01-modern-minimalist-cv-design_ats.html`
- `t01-modern-minimalist-cv-design_simple.html`

This is a **completeness reconciliation item**, not permission to remove those template variants.

---

## 10. Template compiler contract

The current compiler supports:

- scalar personal-field tokens
- object-array loops
- primitive-array loops
- visibility/toggle blocks
- HTML escaping
- token validation
- dynamic template compilation

Known visibility token families include:

- NAME
- JOB
- DOB
- CNIC
- RELIGION
- LINKEDIN
- WEBSITE
- WHATSAPP
- PHONE
- EMAIL
- ADDRESS

V2 must retain equivalent capability and expand it through metadata rather than reducing it.

---

## 11. Template visual preservation

Supplied templates use A4-oriented dimensions and template-local CSS.

Observed conventions include:

- approximately 210mm page width
- approximately 297mm page height/min-height
- A4 portrait assumptions
- template-specific typography and spacing
- template-specific colors
- template-specific two-column/one-column structures
- template-specific icons and section presentation

The template HTML/CSS is therefore not generic decoration; it is part of the current rendering contract.

V2 architecture must separate document data from presentation without forcing an immediate visual redesign.

---

## 12. Theme preservation

Current theme palette contains:

- #1e3a68
- #2e7d32
- #c62828
- #1565c0
- #37474f
- #6a1b9a

Theme color is propagated to CSS variables and the preview iframe where applicable.

The V2 document model must preserve theme state and allow the existing templates to continue using it.

---

## 13. Public template discovery page

File: `index.php`

Existing capabilities identified include:

- keyword filtering
- hybrid filtering
- template preview
- full-screen preview
- modal open/close behavior
- filter scrolling
- exit modal behavior

Functions identified:

- `setKeywordFilter`
- `applyHybridFilter`
- `openPreview`
- `viewFullScreen`
- `closeModal`
- `scrollToFilters`
- `closeExitModal`

The V2 public template discovery experience must retain equivalent behavior during the backend/core migration.

---

## 14. Bridge page

File: `bridge.php`

Functions identified:

- `trackBridgeEvent`
- `configureTemplateOption`

The page includes template choices for modern/simple/ATS-related variants and Word/PDF-related actions.

These behaviors must be preserved or mapped to their V2 equivalents.

---

## 15. API / tracking preservation

The V1 system contains:

- `api/track-event.php`
- `api/report.php`
- `api/.htaccess`

The functional intent includes event tracking and reporting.

### Security requirement

The supplied archive contains plaintext database credentials.

The credentials must never be copied into GitHub, documentation, V2 source, logs, or generated examples.

Before any source baseline is committed:

1. Rotate/revoke exposed production credentials as appropriate.
2. Remove credentials from source.
3. Move configuration to secure deployment configuration.
4. Verify no secrets remain in repository history intended for V2.
5. Re-test tracking/reporting after hardening.

Security hardening must not accidentally remove legitimate tracking/reporting functionality.

---

## 16. External dependency preservation

The supplied editor references:

- html2canvas 1.4.1
- jsPDF 2.5.1
- html2pdf.js 0.10.1
- Cropper.js 1.5.13
- Font Awesome 6
- Google Fonts Inter
- local icon assets
- local builder scripts/CSS

V2 may replace dependencies when architecture requires it, but every replaced dependency must have an explicit capability mapping and regression test.

---

## 17. Data migration preservation

The V2 migration must support the real V1 data shape, including:

- personal information
- summary
- photo
- all repeatable sections
- field visibility
- section visibility
- theme color
- legacy storage migration where applicable

Migration must be:

- deterministic
- reversible where practical
- testable with real V1 fixtures
- non-destructive
- explicit about unsupported legacy edge cases

No field may be dropped silently.

---

## 18. Regression matrix required before V1 retirement

At minimum, V2 must be tested against these V1 workflows:

### Editing

- create CV from empty state
- edit every personal field
- edit summary
- add/remove/reorder repeatable entries where V1 supports the action
- edit nested repeatable fields
- upload photo
- crop photo
- cancel photo crop
- restore persisted data
- reset data

### Visibility

- hide/show every section
- hide/show every supported personal field
- verify preview reflects each toggle
- verify persistence of visibility state

### Templates

- load every available template
- switch templates without data loss
- verify every section renders
- verify optional fields do not produce broken output
- verify template token validation

### Theme

- apply each existing theme color
- persist/reload theme
- verify preview receives theme state

### Responsive behavior

- desktop editor
- mobile editor
- resize
- orientation change
- preview scaling
- preview height adjustment

### Export

- desktop PDF/print path
- mobile PDF path
- multi-page output
- image/font readiness
- cleanup after export
- download event tracking

### Public discovery

- keyword search
- filters
- preview modal
- full-screen preview
- template selection/build flow

---

## 19. V2 capability mapping rule

For every V1 capability, the V2 architecture must record:

| V1 capability | V2 owner | Migration status | Regression test | Notes |
|---|---|---|---|---|
| Function/feature | V2 module/contract | Pending/In progress/Verified | Test ID | Compatibility notes |

A feature is not considered preserved merely because a new feature appears to provide something similar.

---

## 20. No-silent-loss rule

The following are explicitly prohibited during V2 migration:

- deleting an old field without a migration mapping
- deleting an old section without a replacement decision
- removing a visibility toggle without a replacement
- removing an export path without a verified replacement
- removing a template variant because its file was not in the archive
- changing the visual UI simply to simplify migration
- removing tracking/reporting behavior because it is not part of the new editor
- replacing a V1 function without recording its V2 owner
- changing template CSS before the dedicated UI/CSS phase
- assuming an undocumented behavior is unused

When uncertain, preserve first and investigate second.

---

## 21. Definition of preservation complete

V1 preservation is complete only when:

1. The full source inventory is reconciled.
2. Missing assets/references are resolved.
3. Every V1 capability has a V2 owner.
4. Every V1 data field has a migration mapping.
5. Every V1 visibility state has a migration mapping.
6. Every template has a migration/preservation decision.
7. Export behavior has regression coverage.
8. Mobile and desktop behavior has regression coverage.
9. Tracking/reporting behavior is security-hardened and tested.
10. The existing visual/UI contract remains stable through the core migration.
11. Any intentional UI/CSS change is documented separately and approved for the final UI/CSS phase.

This document is a living project control document and must be updated whenever an existing V1 capability is discovered.
