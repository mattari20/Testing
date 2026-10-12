# Pre-designed Section Library — CV Builder V2

## Purpose

Expose a curated, grouped library of ready-to-insert CV sections directly inside the Edit tab. A selected item is inserted into the existing CV document model and remains editable through the current editor, preview, visibility, ordering, persistence, and export workflows.

## Approved catalogue

The catalogue contains 26 section types across five groups:

### Achievements & Qualifications
1. Awards & Honors
2. Key Achievements
3. Scholarships & Fellowships
4. Licenses & Professional Certifications
5. Courses & Professional Training

### Academic & Research
6. Research Experience
7. Publications
8. Conferences & Presentations
9. Research Grants & Funding
10. Thesis & Dissertation

### Technical & Professional Work
11. Patents & Intellectual Property
12. Teaching Experience
13. Projects & Portfolio
14. Open-Source Contributions
15. Selected Work / Case Studies

### Experience & Involvement
16. Technical & Laboratory Experience
17. Volunteer & Community Service
18. Leadership & Extracurricular Activities
19. Professional Memberships & Affiliations
20. Professional Service & Mentoring

### Additional CV Sections
21. Languages
22. Media & Public Appearances
23. Guest Lectures & Speaking Engagements
24. Interests & Hobbies
25. References
26. Additional Information

## User experience

- The library appears in the Edit tab as a dedicated "Pre-designed Sections" panel.
- Section types are grouped by category using collapsible groups.
- Each item is a direct insert action; it does not navigate away from the editor.
- A new section receives a unique ID from the existing document core, a section type and title, and an editable starter entry with appropriate fields.
- Field labels are stored as metadata so the editor and generic preview can show human-readable labels without changing canonical entry keys.
- Added sections use the existing add-section command and are therefore part of the existing undo/history, persistence, and editor lifecycle paths.
- Repeatable sections support adding additional entries using the starter entry's field keys.
- Existing section hide/show, remove, and ordering commands remain the source of truth.

## Preview compatibility

Native templates may have dedicated bindings for standard sections only. The native renderer therefore preserves dedicated template rendering for bound sections and adds a generic template-compatible fallback block for unbound, visible sections. The fallback uses the active template's main content region when available, respects section visibility, exposes entry values to the existing inline preview-editing controller, and does not alter the canonical section data.

This fallback is intentionally conservative. It is not a replacement for future template-specific visual variants. Every native template still needs browser regression verification before release.

## Security and data integrity

- Section titles and entry values are written through DOM text APIs, not interpolated as HTML.
- Library actions dispatch the existing editor commands.
- The section library does not add a backend, account requirement, or new persistence provider.
- Removing a section from the targeted CV must not silently erase unrelated master-profile data.
- Hidden content remains in the document model and can be restored.

## Acceptance criteria

1. Exactly 26 unique section types appear in five groups.
2. Every item inserts a uniquely identified section with a usable starter entry.
3. Starter entries expose human-readable field labels and allow additional entries with the same keys.
4. The editor supports edit, hide/show, remove, reorder, save/recovery, and undo/redo through existing commands.
5. A section absent from a template's declarative bindings still appears in live preview using the generic fallback.
6. Inline preview editing updates the same canonical entry values as the editor.
7. Hiding a section removes it from preview without deleting its data.
8. Browser and regression tests pass for insertion, preview update, visibility, and existing template workflows.
9. Production deployment is verified separately; repository commits and CI alone do not prove Hostinger deployment.

## Implementation record

- Source catalogue: `src/ui/pre-designed-section-library.js`
- Edit-tab integration: `src/ui/editor-form-renderer.js`
- Generic preview fallback: `src/render/native-v2-template-renderer.js`
- Responsive presentation: `index.html`
- Unit acceptance tests: `tests/m496-m505/pre-designed-section-library.test.js`
- Browser acceptance tests: `tests/m496-m505/pre-designed-section-browser.test.js`

Current state: implementation committed to the Testing repository; CI and browser results must be observed before marking the task validated. Hostinger deployment remains a separate gate.
