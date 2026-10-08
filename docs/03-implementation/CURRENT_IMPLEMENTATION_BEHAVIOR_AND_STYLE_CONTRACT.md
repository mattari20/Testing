# Current Implementation Behavior & Style Contract — CV Builder V2

**Document ID:** DOC-IMPL-001  
**Baseline:** Production merge commit `316b48d30401844ff9be74d23c3592eeb01ed358`  
**Branch at documentation capture:** `release/cv-builder-v2-production`  
**Captured:** 2026-10-07  
**Status:** ACTIVE — implementation reference and regression contract

---

## 1. Purpose

This document is the **current implementation-level source of truth** for the behavior, interaction patterns, rendering rules, and visual conventions that have been established during the CV Builder V2 implementation.

It complements the higher-level architecture, product, requirements, milestone, and release documents.

The purpose is to prevent future versions from accidentally changing a behavior that has already been designed, implemented, tested, or accepted.

A future version must treat this document as a compatibility contract unless an intentional change is approved and documented.

---

## 2. Documentation Rule — Mandatory

From this release onward:

> **A feature/fix is not considered fully complete until its implementation, documentation, regression impact, and release evidence are aligned.**

For every accepted future change, update the appropriate documentation before closing the work.

At minimum, determine whether the change affects:

1. product behavior;
2. canonical data/state;
3. editor interaction;
4. preview/rendering;
5. template behavior;
6. visual/style patterns;
7. persistence/migration;
8. export/print;
9. accessibility;
10. regression tests;
11. deployment/cache behavior;
12. release evidence.

If any item changes, the corresponding contract/document must be updated.

---

## 3. Current Architectural Pattern

The current implementation follows a controlled separation:

**Canonical document state**  
→ **Command contract/executor**  
→ **Editor form renderer + DOM controllers**  
→ **Live preview runtime**  
→ **Native template renderer**  
→ **Print/export path**

The editor must not become the authoritative source for preview data.

The canonical document state remains the source of truth.

Preview rendering must derive from the same document state that drives the editor.

---

## 4. Canonical State Rules

### 4.1 Identity

Identity data is stored separately from repeatable CV sections.

Current identity concepts include:

- full name;
- professional/job title;
- email;
- phone;
- location;
- date of birth;
- nationality;
- gender;
- marital status;
- website;
- LinkedIn;
- WhatsApp;
- other configured/custom identity fields.

Legacy `address` is not treated as the canonical visible location field.

The runtime performs legacy location cleanup so duplicated/repeated location strings do not remain in the active identity state.

### 4.2 Identity configuration

Identity field selection is persisted through:

- `configuration.identityFields`

Identity visibility is persisted through:

- `configuration.hiddenIdentityFields`

These are separate concepts.

**Important invariant:**

> Hiding an identity field must not delete its value.

Removing an optional identity field is different from hiding it.

### 4.3 Core vs optional identity fields

Core identity fields cannot be removed through the optional-field remove action.

Optional/configured identity fields may be:

- shown;
- hidden;
- removed;
- added again when supported.

A removed optional field must not remain incorrectly active through stale configuration.

---

## 5. Identity Editor UX Pattern

Every identity information field follows the same control pattern:

**Field value/input**  
+ **Hide/Show control**  
+ **Remove control when the field is removable**

Hidden fields remain represented in the editor so the user can restore them.

Hidden state is visually indicated by disabled/dimmed presentation.

This is intentional.

Do not replace hidden fields with permanent deletion.

### Date of Birth

Date of Birth uses:

- a readable display value;
- a native date picker value underneath.

The user-facing date format is:

**25th April, 2025**

The canonical stored date remains an ISO-style date value:

**YYYY-MM-DD**

Formatting is a presentation concern and must not replace the canonical value.

---

## 6. Section Rules

### 6.1 Core section identity

Core sections have fixed semantic identifiers and headings.

Examples:

- Professional Summary;
- Work Experience;
- Education;
- Skills;
- Languages;
- Projects;
- Achievements;
- Contact;
- Photo.

Core section titles must not become arbitrary user-defined identifiers.

Custom sections may have editable titles.

### 6.2 Section visibility

Section visibility is independent from section deletion.

The user can hide/show a section without destroying its data.

### 6.3 Section ordering

Section ordering is stored in:

- `configuration.sectionOrder`

The editor and preview must use the same ordering source.

The native renderer applies the canonical section order before custom-section insertion.

This ordering sequence is important because custom sections inserted too early can otherwise appear before/after native sections incorrectly.

**Regression rule:**

> If the editor shows Award → Education, the preview must also show Award → Education.

No independent preview ordering logic may contradict the canonical section order.

---

## 7. Repeatable Entry Rules

Experience and Education are repeatable entry sections.

Entries support:

- add;
- edit;
- remove;
- duplicate;
- hide/show;
- ordering where applicable.

Entry visibility must not delete entry data.

### Experience

Experience uses dedicated fields:

- Role;
- Company;
- Start Date;
- End Date;
- Description.

Start Date and End Date are month/year controls.

The implementation uses native month inputs where appropriate.

Legacy duration/date strings may be retained for compatibility, but new structured editing must use Start Date and End Date.

### Education

Education supports structured fields including:

- Degree / Qualification;
- Institution;
- Grade where configured;
- Dates where configured.

---

## 8. Experience/Education Ordering

Experience and Education use date-aware editor ordering.

Current controls support:

- Newest first;
- Oldest first.

The configuration is stored under presentation entry-sort settings.

Do not create a second unrelated ordering model.

Manual entry order and date-based sorting must remain clearly distinguished.

---

## 9. Skills and Languages

Skills and Languages use list-oriented controls.

Current display style concepts include:

### Skills

- **Tags** — compact theme-colored pills; supports Off, Stars, or Dots ratings.
- **Inline (comma-separated)** — plain text on one flowing line; ratings are automatically Off.
- **Bullets** — clean vertical list; supports Off, Stars, Bars, or Dots ratings.
- **Compact** — dense inline text separated by bullets; supports Off, Stars, or Dots ratings.

### Languages

- **List** — clean vertical language list; supports Off, Stars, Bars, or Dots ratings.
- **Inline (comma-separated)** — one flowing line; ratings are automatically Off.
- **Pills** — theme-colored language pills; ratings are automatically Off because ratings visually conflict with the pill treatment.
- **Compact** — dense inline language labels separated by bullets; supports Off, Stars, or Dots ratings.

### Rating compatibility

Rating is an optional presentation layer and never changes the underlying skill/language value.

The editor enforces a compatibility matrix so a user cannot accidentally create a visually broken combination:

| Section | Display style | Allowed rating |
| --- | --- | --- |
| Skills | Tags | Off, Stars, Dots |
| Skills | Inline | Off only |
| Skills | Bullets | Off, Stars, Bars, Dots |
| Skills | Compact | Off, Stars, Dots |
| Languages | List | Off, Stars, Bars, Dots |
| Languages | Inline | Off only |
| Languages | Pills | Off only |
| Languages | Compact | Off, Stars, Dots |

When an incompatible display style is selected, the system automatically changes the section rating to **Off** and disables the Rating selector while that style is active. Returning to a compatible style re-enables the selector with Off selected.

The renderer independently enforces the same matrix so stale or legacy configuration cannot produce an invalid visual combination.

**Regression rule:**

> Display style must always produce a predictable, professional layout, and rating must never distort the selected list style.

---

## 10. Professional Summary

Professional Summary is a section-level content block.

Its normal editor behavior is intentionally simpler than generic custom fields.

The Summary editor does **not** expose unnecessary field-level move/remove controls.

The section-level controls remain available for:

- visibility;
- section ordering.

### Auto Suggestion

The Auto Suggestion control is located at the bottom of the Summary block.

The control is role-aware.

The current suggestion logic recognizes broad role families including:

- Civil / Structural / Construction / Site / Architecture / Quantity Survey / Surveying / Geotechnical;
- Software / IT / Developer / Engineer / Programmer / Web / Mobile / DevOps / Data / Cyber;
- Finance / Accounting / Banking / Audit;
- Teaching / Education / Training;
- Marketing / Sales / Business Development / HR;
- Medical / Health / Pharmacy;
- generic fallback.

The suggestion uses the current job title and available skills to generate candidate summary text.

It updates the existing visible Summary field through the normal command/state flow.

**Regression rule:**

> Auto Suggestion must not be hard-coded to Software Engineer only.

---

## 11. Photo Rules

The profile photo is treated as an asset.

Current behavior includes:

- Upload Photo;
- Change Photo;
- Adjust Crop;
- Hide/Show;
- Remove through the appropriate asset lifecycle;
- template-defined photo shape.

The template shape must remain authoritative.

For the current professional template, the photo shape is circular.

The crop system supports:

- zoom;
- horizontal position;
- vertical position;
- rotation;
- reset;
- apply crop.

The crop result is generated as an image asset and returned through the normal asset upload/state flow.

### Crop failure handling

Crop controls must:

- prevent unwanted default browser behavior;
- stop accidental event propagation where required;
- resolve the current stored photo asset;
- fall back to the visible photo source when stored asset lookup is stale.

This fallback exists specifically to make the crop workflow resilient to stale asset references.

**Regression rule:**

> The presence of a valid visible profile photo must be sufficient for Adjust Crop to open and operate even if an older asset reference is stale.

---

## 12. Editor Command Pattern

Editor mutations must go through the command/state architecture rather than direct uncontrolled DOM mutation.

Important command categories include:

- set field;
- set identity;
- add/remove identity field;
- set visibility;
- add/remove section;
- set section title;
- add/remove/duplicate entry;
- reorder;
- set theme color;
- set list style;
- set rating style;
- set item rating;
- set entry sort;
- upload/remove asset;
- template/variant selection;
- undo/redo/restore.

When adding a new mutation, first determine whether it belongs in the existing command contract/executor.

Do not create a parallel state mutation path without architectural approval.

---

## 13. Renderer Rules

The native renderer is responsible for translating canonical document state into the selected template.

Current important renderer responsibilities include:

1. identity visibility;
2. section visibility;
3. repeatable entry rendering;
4. list styles;
5. canonical section ordering;
6. custom section rendering;
7. identity extras;
8. theme application;
9. legacy value compatibility.

### Identity extras

The renderer dynamically resolves active identity fields for template areas that support additional personal information.

It must:

- honor active identity configuration;
- honor hidden identity configuration;
- skip already-bound identity fields;
- avoid reintroducing legacy address;
- render populated supported extras.

Supported examples include:

- nationality;
- gender;
- marital status;
- website;
- LinkedIn;
- WhatsApp;
- custom identity fields.

---

## 14. Editor ↔ Preview Synchronization

This is a critical system invariant.

Any accepted change made in the editor must propagate to the preview from canonical state.

The preview must not maintain a competing hidden copy of CV data.

For visibility changes:

**Editor Hide/Show**  
→ command  
→ canonical state  
→ renderer  
→ preview visibility.

For ordering:

**Editor reorder**  
→ `configuration.sectionOrder` / `entryOrder` / relevant order state  
→ renderer  
→ preview order.

For identity fields:

**Add/Remove/Hide/Show**  
→ identity configuration + visibility state  
→ renderer  
→ preview.

---

## 15. Theme / Color System

The current editor exposes a controlled professional palette.

Current palette IDs include:

- navy;
- blue;
- teal;
- green;
- burgundy;
- charcoal;
- purple;
- orange.

Theme selection uses the command/state architecture.

Templates consume theme variables rather than the editor directly rewriting arbitrary template styles.

The visual palette should remain professional and compatible with the eStudent visual direction.

When adding a new palette:

1. define the palette in the centralized palette model;
2. provide primary/dark/light/contrast values;
3. wire it through the theme command;
4. ensure the native renderer consumes it;
5. verify print/export;
6. document the new option.

---

## 16. UI Style Pattern

The current editor uses a consistent card/control language.

### Cards

- clean white surfaces;
- soft borders/shadows;
- restrained radius;
- clear internal spacing;
- grouped controls.

### Controls

- compact icon-based inline actions where appropriate;
- accessible title/aria-label;
- Hide/Show represented by eye-style icons;
- Remove represented by a clear remove icon;
- Move Up/Move Down use directional icons;
- avoid duplicate textual controls when an icon is sufficient.

### Hidden state

Hidden fields/entries should look inactive but remain discoverable.

Do not visually imply that hidden means deleted.

### Primary actions

Actions should remain clear and professional.

Avoid introducing multiple controls that perform the same mutation.

---

## 17. Template Contract

Templates are not allowed to invent their own independent document state.

Template rendering must consume canonical document state.

Template-specific presentation may define:

- layout;
- typography;
- photo shape;
- spacing;
- section placement;
- visual hierarchy;
- supported variants.

Template-specific presentation must not silently discard canonical data that the template contract says it supports.

---

## 18. Print / PDF Preview Pattern

The print flow intentionally separates the CV from the editor workspace.

The print handler creates a dedicated print context containing the CV template output rather than printing the entire builder UI.

The print context must preserve:

- active template;
- active theme;
- A4 dimensions;
- template styles;
- CV content.

The print layout uses:

- A4 portrait;
- 210mm width;
- 297mm height;
- zero print margin at the document boundary where configured;
- print-color preservation;
- no editor workspace controls.

**Regression rule:**

> Print/PDF preview must show the CV, not the builder workspace.

---

## 19. Cache-Busting Pattern

Runtime module references use explicit version query strings.

When a production JavaScript module is changed:

1. update the module version reference where required;
2. update dependent imports if necessary;
3. ensure the production entrypoint points to the new version;
4. deploy;
5. hard-refresh and verify the live browser loads the changed module.

This is especially important for:

- editor runtime;
- DOM controller;
- form renderer;
- live preview runtime;
- native template loader;
- native renderer.

A code fix that remains hidden behind a stale browser cache is not considered deployed successfully.

---

## 20. Runtime Startup Rule

The production runtime must import every command/helper it executes.

A previous startup failure occurred because `createEditorCommand` was referenced without being imported.

Current runtime explicitly imports it from:

`src/application/editor-command-contract.js`

**Regression rule:**

> No runtime helper may be referenced through an undeclared global or missing module import.

---

## 21. Summary / Identity / Photo Regression Set

Every future editor release should include at least these manual checks:

### Identity
- populate all supported fields;
- hide a field;
- show it again;
- remove an optional field;
- add it again;
- verify data persistence;
- verify preview.

### Summary
- enter summary;
- hide/show Summary;
- run Auto Suggestion for a software role;
- run Auto Suggestion for a Civil Engineer role;
- verify generated text uses current role context.

### Experience
- add entry;
- edit role/company;
- set Start Date;
- set End Date;
- hide/show;
- reorder;
- verify preview.

### Education
- add entry;
- edit values;
- hide/show;
- reorder;
- verify preview.

### Photo
- upload;
- Adjust Crop;
- zoom;
- position;
- rotate;
- apply;
- verify template shape;
- hide/show;
- verify preview.

### Ordering
- move Award/custom section relative to Education;
- verify editor order;
- verify preview order.

### Print
- open print/PDF preview;
- verify only CV appears;
- verify A4 layout;
- verify theme.

---

## 22. Documentation Update Matrix

| Change type | Documentation that must be checked |
|---|---|
| New feature | Product requirements + implementation contract |
| New editor control | UI/UX + implementation behavior |
| New data field | Data architecture + behavior contract |
| New section | Requirements + document model + renderer contract |
| Visibility change | State/behavior + regression |
| Ordering change | Document configuration + renderer |
| Template change | Template contract + style/preview |
| CSS/style change | UI/CSS preservation/style contract |
| Export change | Export/print contract |
| Migration change | Migration/lifecycle documentation |
| Bug fix | Implementation behavior + regression note |
| Production deployment | Release/deployment evidence |
| Cache/version change | Runtime/deployment notes |
| Browser-only fix | Browser validation evidence |

---

## 23. Definition of Done — Updated

A future task is complete only when all applicable items are true:

- [ ] implementation complete;
- [ ] canonical state impact reviewed;
- [ ] editor behavior verified;
- [ ] preview behavior verified;
- [ ] visual/style impact reviewed;
- [ ] regression impact reviewed;
- [ ] relevant automated validation passes;
- [ ] manual browser validation completed where required;
- [ ] documentation updated;
- [ ] deployment completed when the task is production-bound;
- [ ] live verification completed when deployment is required;
- [ ] final commit/deployment evidence recorded.

---

## 24. Versioning Rule for This Contract

When behavior changes intentionally:

1. do not silently overwrite history;
2. update the relevant section;
3. record the changed behavior;
4. record the reason;
5. identify affected tests;
6. identify affected templates;
7. identify migration/compatibility implications;
8. identify deployment/cache implications.

If a change is breaking, explicitly mark it as a breaking behavior change.

---

## 25. Current Production-Ready Behavior Snapshot

At the documentation capture point, the current implementation includes the following established patterns:

- canonical editor command/state flow;
- structured identity configuration;
- identity hide/show/remove/add behavior;
- professional Summary block;
- role-aware Summary Auto Suggestion;
- structured Experience dates;
- Education/Experience entry controls;
- skills/languages presentation controls;
- theme palette;
- template-aware profile photo;
- crop workflow with resilient asset lookup;
- canonical section ordering;
- dynamic identity extras in native rendering;
- editor/preview synchronization;
- dedicated CV-only print context;
- cache-busted runtime modules;
- production runtime command import protection.

This snapshot is a compatibility reference, not a claim that every item is permanently frozen. Intentional future changes must be recorded through the documentation rule above.

---

## 26. Next-Version Starting Procedure

When work begins on a new version:

### Step 1
Read this document first.

### Step 2
Read the architecture/product/release documents relevant to the planned change.

### Step 3
Compare the requested change against the current behavior contract.

### Step 4
Identify whether the request is:

- additive;
- corrective;
- visual;
- architectural;
- breaking.

### Step 5
Implement the smallest controlled change.

### Step 6
Run automated validation.

### Step 7
Deploy when production verification is required.

### Step 8
Perform manual browser testing.

### Step 9
Update this contract and related documentation.

### Step 10
Only then close the milestone.

---

## 27. Governing Principle

> **Code records what the system does. Documentation records what the system is supposed to continue doing. Tests prove that the two still agree.**

All three must remain aligned.



### Regression clarifications — 2026-10-07 R2

- Experience date display is canonical: when `startDate` and/or `endDate` exist, preview duration must be derived from those values and must not be masked by legacy `dates` text.
- Experience and Education date-order controls are command-driven through the canonical `set-entry-sort` editor command. The command must exist in the command contract as well as the executor.
- Date of Birth editor control uses a contained display/picker wrapper so the field and its visibility/remove actions remain inside the identity grid at all supported widths.
- Personal-information rendering is template-independent: every populated, active identity field that is not already bound by a template must be rendered through the native renderer. Templates with no native Personal Information block receive a renderer-generated block in an appropriate column.
- Custom sections are renderer-independent of template class names: the native renderer resolves `main`/column and `aside`/sidebar targets and renders custom sections in every native template, respecting section placement and configured section order.
- These rules are regression requirements for every subsequent template and editor change.

### Regression clarifications — 2026-10-07 R3

- Date of Birth is directly editable in the identity editor using a readable text value, with a separate calendar picker action; the canonical stored value remains ISO `YYYY-MM-DD`.
- Experience Start Date and End Date are fully typeable month/year text controls with a dedicated visible calendar picker button. They accept readable month/year input and commit canonical `YYYY-MM` values on change, while the calendar picker also commits the same canonical value. This avoids native segmented month inputs stealing focus after a single digit.
- Additional personal-information rows inherit the template's existing personal-information/contact styling so labels and values use the same visual color treatment as the surrounding CV design.

### Regression clarification — 2026-10-07 R4

- Experience Start Date and End Date remain fully typeable month/year controls and now also provide a dedicated calendar/month picker button. Calendar selection writes the same canonical `YYYY-MM` value as manual entry, so sorting and preview behavior are identical regardless of input method.

### Regression clarifications — 2026-10-07 R4

- Experience Start Date and End Date calendar selection must use a directly clickable native month input positioned over the visible calendar affordance. The input must remain rendered and interactive; do not rely only on programmatic `showPicker()` against a 1px/pointer-events-none control.
- The visible text input remains independently typeable and stores canonical `YYYY-MM` values.
- The preview container must not retain unnecessary bottom padding beneath the scaled A4 page; side/top breathing room is retained while excess bottom space is removed.


### Regression clarification — 2026-10-07 R5

- Experience Start Date and End Date must present the calendar affordance **inside the date field, aligned to the right**, not as a second row beneath the field.
- The visible calendar button is the complete clickable control. Its click handler opens the co-located transparent native `input[type="month"]` through the browser picker API during the direct user gesture. The native input remains physically aligned with the button so the browser anchors the picker correctly.
- The experience month picker must not depend on `showPicker()` or `click()` against a hidden/1px control. Programmatic opening is permitted only from the direct user click on the visible calendar button, with the native input kept co-located at the same screen position. This prevents Chrome from opening the native month chooser at an unrelated screen position.
- Manual typing remains available in the visible text input and continues to normalize to canonical `YYYY-MM`.
- The native month picker and manual text input must update the same canonical state path and therefore produce identical sorting and preview results.
