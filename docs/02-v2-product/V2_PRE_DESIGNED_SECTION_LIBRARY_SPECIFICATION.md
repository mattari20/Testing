# CV Builder V2 — Pre-designed Section Library Specification

**Status:** Implementation candidate ported on `qa/cv-workspace-release-gates`; automated validation passed on candidate commit `c2b7fdf6ad4c0ff939d754664b54b31e3ca713b9`; merge and production deployment remain pending  
**Repository:** `mattari20/Testing`  
**Branch baseline:** `release/cv-builder-v2-production` at `3a4b7706e3102930dad4ebc17f85bc76a71776bb`  
**Scope:** Section catalogue, structured field definitions, add-section experience, compatibility, preservation and acceptance criteria  
**Research basis:** Existing V2 competitive research plus public product/help materials for Novorésumé, Teal, Zety, Tabhar, Canva, and academic/professional CV guidance. Competitor capabilities can change and must be rechecked before public product claims.


> **Current implementation note (2026-10-12):** The candidate branch now includes the production-branch-compatible Section Library implementation and automated browser coverage. Full repository validation, V2 integration validation, native V2 browser validation, CV Workspace validation, and the E2E contract all passed on the candidate commit listed above. This is CI evidence only; it does not represent a production deployment or live-site smoke test.

## 1. Decision

Build a reusable **Pre-designed Section Library** on top of the existing V2 document/editor/template architecture. Users choose a prepared section; the builder adds a complete section definition with its default fields, repeatable-entry behavior, metadata and compatible presentation—not merely an empty title or generic text box.

This is a documentation-first scope. It does not authorize a renderer rewrite, new application code, database/schema selection, deployment changes, or V1 changes. Implementation should begin only after this specification is reconciled with the existing code and the relevant release gates.

## 2. Source audit — observed baseline

The production branch source was inspected at the baseline commit listed above. The following are direct code observations, not assumptions:

- `src/ui/editor-form-renderer.js` has a fixed `CORE_SECTIONS` set: `summary`, `experience`, `education`, `skills`, `languages`, `projects`, `achievements`, `contact`, and `photo`.
- The same renderer displays sections from `documentData.careerData.sections`, renders custom section titles, handles entry lists, offers Add Entry where a section is repeatable (and for Skills/Languages), offers Add Field in the applicable section flow, and currently renders a generic **Add Custom Section** action with title `New Section` and type `custom`.
- Entry rendering is partly section-specific: Experience, Education, Skills and Languages receive special field/proficiency treatment; other entry values are largely inferred from their stored keys. This is not yet equivalent to a field-complete library for Awards, Research, Publications, Grants, etc.
- `src/ui/section-editor-controller.js` already exposes command-based operations for adding/removing sections, setting section titles, adding/removing fields, adding/updating/removing/duplicating entries, visibility and ordering. These are useful existing boundaries to reuse, not proof that every UI workflow is complete.
- `src/application/cv-editor-section-model.js` currently exposes a list of sections from the adapter; it is not itself a catalogue of prepared section definitions.
- `src/application/cv-editor-field-types.js` currently lists `text`, `textarea`, `email`, `url`, `date`, `select`, `checkbox`, and `richtext`.
- `src/templates/template-engine.js` already describes template metadata including supported sections, fields, field types, variants and output capabilities. `src/application/cv-template-capability-resolution.js` evaluates template and variant compatibility.
- `src/templates/presentation-variant-engine.js` already models field-, entry-, section- and document-level variants.
- Existing architecture/product documents already require dynamic sections/fields, repeatable entries, visibility, ordering, presentation variants, and “unsupported but preserved” template compatibility.

### Audit conclusion

The architecture has useful building blocks for this feature, but the inspected source does **not** establish that a curated, typed, versioned Section Library, per-section field schemas, catalogue discovery UI, or all 26 planned catalogue items are implemented. The current generic Add Custom Section action is not sufficient for the desired end-user experience.

This audit is bounded to the listed files and documents. It does not certify every existing template's current visual support or every export path; those require targeted tests when implementation starts.

## 3. Product rules

1. **Select, don't start blank.** The default entry point is a categorized catalogue of prepared blocks. Generic Custom Section remains available as a fallback.
2. **Complete block insertion.** Selecting a catalogue item creates a section with its canonical ID/type, default title, fields, entry behavior, default presentation preference and version metadata.
3. **Data is not presentation.** Section data must not be mutated merely because the user changes template or presentation variant.
4. **Preserve unknown content.** If a template cannot render a section, keep the source data and clearly communicate the compatibility limitation. Never silently delete it.
5. **Optional by default.** A catalogue item is added only on user action; unused sections do not clutter a CV.
6. **Repeatable entries.** Sections representing multiple awards, publications, projects, certifications, etc. support multiple entries unless a documented reason says otherwise.
7. **Custom fields remain possible.** Prepared fields are a useful default, not a hard limit. Users may add supported custom fields and reorder where appropriate.
8. **No fabrication.** Suggestions may guide users, but no award, publication, qualification, metric, skill, or other career fact may be invented.
9. **Privacy by design.** Contact details for references and sensitive/regional data require explicit user control and must not be made mandatory by global defaults.
10. **Preserve accepted UX.** Add Section, Add Entry, Add Field, Add Skill and Add Language must not cause a visible viewport jump or steal the current editing context.

## 4. Section catalogue and initial priorities

Priority meanings: **P1** = Core Library release candidate; **P2** = specialized/academic extension; **P3** = optional/edge-case extension. Priority is a planning proposal, not a statement of existing implementation.

| ID | Prepared section | Priority | Default repeatable? | Default field set |
|---|---|---:|---|---|
| `awards-honors` | Awards & Honors | P1 | Yes | Award name, issuer, date, level/type, reason/description, URL |
| `key-achievements` | Key Achievements | P1 | Yes | Achievement title, context, action, result, date, optional evidence/link |
| `projects-portfolio` | Projects & Portfolio | P1 | Yes | Project name, role, dates, description, tools/technologies, outcome, demo/repository/portfolio URL |
| `certifications-licenses` | Licenses & Professional Certifications | P1 | Yes | Credential name, issuer, issue date, expiry date, credential ID, verification URL, status |
| `courses-training` | Courses & Professional Training | P1 | Yes | Course name, provider, completion date, duration, learning/outcome, certificate URL |
| `volunteer-service` | Volunteer & Community Service | P1 | Yes | Organization, role, dates, responsibilities, community/project, outcomes |
| `leadership-activities` | Leadership & Extracurricular Activities | P1 | Yes | Organization/club, position, dates, responsibilities, events/team, achievements |
| `research-experience` | Research Experience | P1 | Yes | Research title, institution/lab, role, supervisor, dates, research area, methods/tools, description, outcomes, related URL |
| `publications` | Publications | P1 | Yes | Title, authors, publication type, journal/publisher, year/date, volume, issue, pages, DOI/URL, status |
| `conferences-presentations` | Conferences & Presentations | P1 | Yes | Title, event, presentation type, authors, location, date, event URL |
| `professional-memberships` | Professional Memberships & Affiliations | P1 | Yes | Association, membership type, start/end dates, optional ID, official URL |
| `additional-information` | Additional Information | P1 | Yes | User-defined item label, value/body, optional URL; constrained generic fallback |
| `scholarships-fellowships` | Scholarships & Fellowships | P2 | Yes | Name, awarding body, program, date/duration, funding type, description |
| `research-grants` | Research Grants & Funding | P2 | Yes | Grant title, funding body, role/PI status, optional amount/currency, duration, purpose, status |
| `thesis-dissertation` | Thesis & Dissertation | P2 | Usually one per targeted CV; permit multiple when needed | Title, degree, institution, supervisor, completion date, abstract, methods, repository URL |
| `patents-ip` | Patents & Intellectual Property | P2 | Yes | Title, patent/registration number, inventors, authority, filing/grant dates, status, URL |
| `teaching-experience` | Teaching Experience | P2 | Yes | Course/subject, institution, role, dates, level, responsibilities, supervision |
| `professional-service-mentoring` | Professional Service & Mentoring | P2 | Yes | Organization, committee/service role, dates, reviewing/judging/mentoring details |
| `open-source-contributions` | Open-Source Contributions | P2 | Yes | Project/repository, role, contribution, technologies, URL, date |
| `technical-lab-experience` | Technical & Laboratory Experience | P2 | Yes | Technology/equipment, use/context, level/experience, project/employer, evidence |
| `case-studies` | Selected Work / Case Studies | P2 | Yes | Project/client (optional), problem, approach, result, media URL, portfolio URL |
| `media-appearances` | Media & Public Appearances | P3 | Yes | Outlet/event, role, topic, date, URL |
| `speaking-engagements` | Guest Lectures & Speaking Engagements | P3 | Yes | Talk title, event/organization, role, date, topic/audience, URL |
| `interests-hobbies` | Interests & Hobbies | P3 | Yes | Interest, optional short description |
| `references` | References | P3 | Yes | Name, designation, organization, relationship, optional professional contact, consent/verification note |
| `language-profiles` | Languages (additional profiles) | P1 | Yes | Language, self-reported proficiency, context/certification, optional evidence URL; distinct type from the core Languages section |
| `custom-section` | Custom Section | Always available as fallback | User-selected | User-defined title, user-defined supported fields/entries |

### Existing sections to retain and improve, not duplicate

Personal/Contact Information, Professional Summary, Work Experience, Education, Skills, and Languages remain core editor sections. The optional `language-profiles` preset is a separate user-inserted block for additional language details and evidence; it must not replace, mutate, or collide with the core `languages` type. Internships may use the existing Experience section with a role/type or be promoted to a dedicated preset only if the audit shows a meaningful distinct workflow. Do not create parallel duplicate systems for Skills, Experience or Education merely to populate the library.

### Section-specific modelling rules

- **Publication status** must distinguish Published, Accepted, Under Review, Submitted and In Progress; the UI must not present an unaccepted manuscript as published.
- **Certification expiry** is optional; do not infer current validity when expiry is absent.
- **Award amount, grant amount and project metrics** are optional and user-supplied only. Currency must be explicit when an amount is present.
- **Research supervisor, grant PI and author lists** are role/people fields; they must not be confused with the user's own job title.
- **References** are optional and privacy-sensitive; never require users to disclose referees' phone/email to complete a CV.
- **Additional Information** must remain a fallback rather than a replacement for typed sections, because typed sections enable better editing, accessibility, compatibility and future intelligence.

## 5. Add Section Library UX contract

The catalogue should open from the editor's Add Section action and present:

- search by section name and synonym;
- five category groups: Achievements & Qualifications, Academic & Research, Technical & Professional Work, Experience & Involvement, Additional CV Sections;
- a separate priority filter for Recommended/P1, P2, and P3 presets;
- a short explanation and preview of the fields provided;
- an Add action;
- relevant guidance (for example, Academic CV sections are more useful for academic applications);
- an explicit Custom Section fallback.

Initial recommended cards should be context-aware but not intrusive: Awards & Honors, Projects & Portfolio, Certifications & Licenses, Research Experience, Volunteer Experience. Recommendations must not auto-insert sections.

After selection, the section appears in the document and editor without moving the viewport. Its title, entries and fields are editable. The user may add another entry, add/reorder supported fields, hide/show, reorder, or remove the section. Removal must follow the existing document-state contract and must not be conflated with permanent deletion of any shared/master career data.

## 6. Field definition contract

Each prepared field definition must specify:

- stable field ID/key and display label;
- semantic purpose/help text;
- supported field type;
- optional/required state and validation;
- placeholder/example that does not masquerade as user data;
- formatting rules (date, URL, identifier, currency where applicable);
- visibility and ordering support;
- export and template compatibility expectations;
- accessibility label and error message;
- migration/default behavior when a definition version changes.

Use existing field types first: text, textarea, email, URL, date, select, checkbox and rich text. Do not add new field types just for a cosmetic difference. If structured multi-value fields (e.g., authors/technologies) are required, decide whether they are repeatable child items or a supported multi-value type before coding; do not encode arbitrary comma-separated values inconsistently across sections.

Required fields should be minimal. A title/name is usually required for an entry; dates, IDs, amounts, URLs and descriptive fields are optional unless a specific validation reason is documented.

## 7. Presentation and template compatibility

The canonical section definition must be independent from template-specific markup. Each template should advertise supported sections/fields/variants using the existing template capability model. For each catalogue item, resolve compatibility to one of:

- Supported;
- Supported with Constraints;
- Adaptable through an approved variant;
- Unsupported but Preserved;
- Unknown.

Unknown must not be treated as Supported. A fallback presentation may be used only where it is an approved compatible option. When no safe presentation exists, preserve the data and inform the user rather than hiding or deleting it silently.

Suggested initial presentations (subject to real template audit):

| Section family | Default presentation candidates |
|---|---|
| Awards / Achievements | Compact list, timeline, highlighted cards |
| Research / Teaching / Volunteer | Chronological experience entries |
| Publications / Conferences | Citation or bibliography list |
| Projects / Case Studies | Compact list or featured cards |
| Certifications / Courses | Credential list or compact cards |
| Memberships / Service | Compact role entries |
| Languages / Skills | Reuse existing presentation-variant engine and controls |

Do not promise that all listed variants already work in every template. Build a template-by-section compatibility matrix during implementation and test every published template's supported/fallback state.

## 8. Data, ordering and lifecycle rules

- Every section instance has a stable instance ID; every preset has a stable catalogue ID and definition version.
- Repeatable entries have stable IDs and their own visibility/order state.
- Section order, entry order and field order remain separate concerns.
- A preset's definition update must not overwrite user values or custom field definitions.
- If a preset is renamed, retain its stable ID.
- Removing a section from one targeted CV must not erase its source data from a future Master Career Profile or another CV version.
- Cloning a section/entry must generate new instance IDs and must not share mutable nested data.
- Hidden content remains recoverable and is not exported as visible content unless the existing export contract explicitly defines otherwise.
- Empty prepared sections should not be inserted automatically; the user chooses them.
- Any new persistence fields need explicit backward-compatible defaults and migration tests.

## 9. Acceptance criteria

The feature is not complete until all applicable criteria pass:

### Catalogue and insertion
- Catalogue opens from the existing editor workflow and works on desktop and mobile.
- Search, category filtering, descriptions, field previews and Custom Section fallback work.
- Each P1 preset inserts the correct type/title/default fields and entry behavior.
- Repeated insertion follows a documented per-section duplicate policy; no accidental duplicate is created by a double click.
- New section IDs and entry IDs are unique and stable.

### Editing and data
- Add/edit/remove entry and add/reorder/remove field work through the existing command/document model.
- Hide/show and ordering work without losing values.
- Existing CVs with no new sections continue to load.
- Preset definition changes do not overwrite user data.
- Unknown or unsupported sections are preserved.

### Viewport and focus
- Add Section, Add Entry, Add Field, Add Skill and Add Language cause no visible viewport jump.
- The current focus/editing context is not unexpectedly stolen.
- Newly added content extends below existing content; no automatic scroll-to-top or scroll-to-new-field behavior.
- Run targeted mobile browser regression for the accepted 2026-10-11 viewport-stability milestone.

### Template, preview and export
- Live preview displays each supported P1 section accurately.
- Every published template has a tested compatibility/fallback result for each P1 section.
- Template switching preserves all section/entry/field data.
- PDF, print and supported DOCX exports preserve content, order, visibility and readable pagination.
- Unsupported sections are never silently dropped.
- Keyboard navigation, labels, focus states and error messaging remain accessible.

### Automated validation
- Unit tests cover catalogue definitions, schema validation, insertion, duplicate policy, version defaults, cloning and migration.
- Integration tests cover editor commands, visibility, ordering and canonical data updates.
- Browser tests cover mobile/desktop catalogue flows, viewport stability, template switching and export.
- Existing workspace CI failures (including the previously reported viewport test, mobile More menu and multi-CV lifecycle persistence failures) must be tracked independently and must not be reported as green without evidence.

## 10. Implementation sequence

1. **Specification reconciliation (this task):** record catalogue, code audit, priorities and acceptance criteria.
2. **Focused implementation audit:** map current section model, command reducer, document persistence, renderer, preview compiler, template capabilities and export paths; identify exact insertion points and gaps.
3. **P1 schema/registry design:** create definitions and validation tests before UI wiring.
4. **Catalogue UX:** search, categories, previews, add flow, duplicate policy and fallback.
5. **P1 rendering and compatibility:** implement the default presentations and template compatibility matrix.
6. **Data/export/regression:** migrations/defaults, PDF/DOCX, mobile and viewport tests.
7. **P2/P3 expansion:** add specialized presets using the same registry and rendering contract.
8. **Release gate:** do not deploy application changes until targeted and full relevant validations pass.

## 11. Implementation checkpoint (2026-10-11)

The implementation is available on `feature/pre-designed-section-library` in pull request [#112](https://github.com/mattari20/Testing/pull/112).

- **Implemented:** 26 versioned presets in five category groups, including a distinct optional Languages profile preset, searchable/category-filtered catalogue, prepared blank entries, editable field definitions, repeatable entry management, field visibility/order/removal, and generic preview fallback for sections without a template-native anchor.
- **Targeted validation:** [Section Library Feature Validation passed](https://github.com/mattari20/Testing/actions/runs/38165025450), including unit tests, a real-browser insertion/preview/viewport test, and existing editor-form, command and native-template regression suites.
- **Current QA state:** the 26-item catalogue and targeted browser interactions are implemented. The full test suite, integration workflow, native browser workflow (including the 9-template browser pass), and E2E contract passed on QA commit `7c5b1e38769fc877fd4c170b2723acadf775ed6b`. The production release branch has not yet been updated or deployed. Custom-section visual parity across every template, live export verification, and post-deployment smoke tests remain required.

Implementation sequence status:
1. Specification and source audit — complete.
2. P1 schema/registry and catalogue UI — complete.
3. Generic template-preview fallback and field management — complete.
4. Targeted unit/browser and editor regressions — passing; full QA branch CI passed on commit `7c5b1e38769fc877fd4c170b2723acadf775ed6b`.
5. Release merge, Hostinger deployment, custom-section visual parity across all templates, live export matrix and post-deployment smoke — pending.

## 12. Explicit non-goals and safety boundaries

- No changes to production V1 or its visual baseline.
- No automatic generation of user career facts.
- No framework/language/database/hosting/provider selection as part of the Section Library.
- Do not claim every preset has a custom-designed native layout in every template; the generic fallback is used where no native anchor exists.
- Do not deploy or declare overall V2 release acceptance complete until the outstanding release gates pass.

## 13. Research references


- Novorésumé: https://novoresume.com/career-blog/cv-sections
- Teal: https://www.tealhq.com/tools/resume-builder
- Zety: https://zety.com/blog/cv-format
- Tabhar: https://tabhar.com/
- Canva: https://www.canva.com/resumes/
- Texas A&M University Career Center CV guidance: https://careercenter.tamu.edu/resources/curriculum-vitae.html
- Existing V2 competitive research: `docs/02-v2-product/V2_COMPETITIVE_RESEARCH_AND_PRODUCT_RECOMMENDATIONS.md`

Links above are research starting points, not guarantees that a third-party product still exposes every described capability. Revalidate current product documentation before launch.
