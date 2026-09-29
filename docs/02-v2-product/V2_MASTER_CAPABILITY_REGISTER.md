# CV Builder V2 — Master Capability Register

## Purpose
This is the central capability baseline for CV Builder V2. It combines the audited V1 functional baseline with approved V2 upgrades, new international-grade capabilities, monetization, and the future Student Career Wallet ecosystem.

> V1 code is not the V2 architectural base. V1 system behavior, functionality, data, visual output, and edge cases are the baseline that V2 must preserve or explicitly replace.

No capability may be silently removed.

## Status legend
- PRESERVE — V1 capability that must remain available.
- UPGRADE — V1 capability that remains but needs a stronger, more extensible implementation.
- NEW — capability not meaningfully present in V1 and planned for V2.
- FUTURE — architecture boundary should be reserved now; implementation can follow later.
- EVALUATE — requires product or technical validation before commitment.

## 1. Core document capabilities
| Capability | V1 | V2 |
|---|---|---|
| CV creation/editing | Present | PRESERVE |
| Structured CV data | Present | UPGRADE |
| Personal information | Present | UPGRADE |
| Summary/profile | Present | UPGRADE |
| Education | Present | UPGRADE |
| Experience | Present | UPGRADE |
| Projects | Present | UPGRADE |
| Skills | Present | UPGRADE |
| Languages | Present | UPGRADE |
| Achievements | Present | UPGRADE |
| Profile photo | Present | UPGRADE |
| Certifications | Limited/partial | UPGRADE |
| Awards | Not general | NEW |
| Publications | Not general | NEW |
| Volunteer experience | Not general | NEW |
| Internships | Can be represented | UPGRADE |
| Training/courses | Not general | NEW |
| Licenses | Not general | NEW |
| Professional memberships | Not general | NEW |
| References | Not general | NEW |
| Interests/hobbies | Not general | NEW |
| Leadership | Not general | NEW |
| Conferences | Not general | NEW |
| Research | Not general | NEW |
| Custom sections | Fixed-section model | NEW |
| Custom fields | Fixed-field model | NEW |
| Repeatable custom items | Limited by fixed arrays | UPGRADE |
| Section reorder | Limited/fixed | NEW |
| Field reorder | Limited/fixed | NEW |
| Section visibility | Present | UPGRADE |
| Field visibility | Present | UPGRADE |
| Duplicate/clone CV | Not formal | NEW |
| Undo/redo | Not formal | NEW |
| Autosave | Present | UPGRADE |
| Draft/recovery state | Limited | UPGRADE |

## 2. Personal and regional information
V1 includes name, job title, email, phone, WhatsApp, address, date of birth, CNIC, LinkedIn, website and religion.

V2 retains these where appropriate while making the field system configurable and international.

Potential V2 fields include country, city/region, international phone, WhatsApp, LinkedIn, GitHub, portfolio, Behance, Dribbble, ORCID, Google Scholar, ResearchGate, custom professional URLs and custom contact fields.

Regional fields such as CNIC or religion remain optional rather than universal CV requirements.

## 3. Preview and editing
| Capability | V1 | V2 |
|---|---|---|
| Live preview | Present | PRESERVE/UPGRADE |
| Responsive preview | Present | UPGRADE |
| Mobile preview | Present | UPGRADE |
| Desktop preview | Present | UPGRADE |
| Preview-side editing | Not present | NEW |
| Click-to-edit | Not present | NEW |
| Page navigation | Limited | NEW |
| Page thumbnails | Not present | NEW |
| Zoom controls | Limited | NEW |
| Shared canonical data model | Partial | UPGRADE |

## 4. Template system
V1 has a template registry and multiple templates/variants.

V2 introduces formal template metadata: template ID, name, version, career level, industry, style, supported sections, supported field types, photo support, column model, page model, theme support, ATS suitability, accessibility expectations and publication status.

Template lifecycle: draft, testing, published, deprecated.

Adding a template must not require rewriting the core document engine.


## 4A. Template Library and Distribution System
The Template Engine is complemented by a dedicated Template Library/product-distribution layer. The library is responsible for template discovery, filtering, full preview, template metadata, Build Online entry, Try with My Data, Sample PDF, blank Word-template availability, DOCX export availability, free/premium presentation, entitlement checks, SEO landing pages, comparison and future template recommendation.

The separation is:
**Master Profile → Targeted CV → Selected Sections/Fields → Presentation Variants → Template → Preview → PDF/DOCX/Online CV.**

A template controls presentation and never owns canonical career data. Template metadata must include identity/version, career level, industry, style, supported sections/field types/variants, photo support, columns, page model, themes, ATS/accessibility profile, lifecycle status, Web/PDF/DOCX/blank-DOCX capabilities, preview/demo assets and commercial references where applicable.

The library must distinguish **Blank Word Template** from **User-data DOCX Export**. A blank Word file is a reusable editable product asset; DOCX export is generated from the user's structured document. A PDF screenshot must never be treated as an editable Word template.

Template compatibility must prevent silent data loss. Unsupported content remains in the Master Profile and the user receives an explicit choice to hide it for that CV, choose another template, or use a compatible presentation variant. Template switching must preserve canonical content and document configuration.

Template lifecycle: Draft → Testing → Published → Deprecated → Retired. Free/premium access is controlled through the entitlement layer rather than payment logic embedded in rendering.

## 5. Theme and presentation
V1 has theme colors and template-controlled presentation.
V2 upgrades theme tokens, typography, spacing, template-specific themes and accessibility contrast checks.
The current V1 UI/CSS remains the Golden Baseline during core migration. Visual modernization is a later controlled phase.


## 5A. Presentation Variants and Component View Engine
A single canonical data set must be renderable through multiple visual representations without duplicating or corrupting the underlying data. This is a core V2 requirement, not a template-only feature.

Examples include Languages rendered as:
- name only;
- proficiency text such as Beginner, Intermediate, Advanced or Native;
- percentage/proficiency bar;
- star/rating representation;
- compact percentage or label treatment;
- another template-supported representation appropriate to the same underlying language record.

The same principle applies broadly to sections and fields such as education, experience, skills, certifications, achievements, projects and other repeatable content. For example, education may be shown as a timeline, compact list, two-column block, card-like entries or another approved presentation variant while retaining the same canonical education data.

### Required behavior
- Separate **content/data** from **presentation variant**.
- Each supported field/section may expose a set of approved presentation variants.
- A CV may select a presentation variant independently from the underlying Master Profile data.
- Different targeted CVs may use different variants for the same source data without duplicating the source data.
- The preview must expose an understandable way to switch between compatible variants.
- Where appropriate, preview-side controls may offer actions such as **Change Style / View / Variant**, followed by available alternatives.
- A user should be able to preview multiple variants before selecting one.
- The selected variant must persist as part of the relevant CV/document presentation configuration.
- Variant selection must not mutate the canonical content values.
- Variants must respect template capabilities, page model, supported field types, accessibility requirements and export behavior.
- Unsupported combinations must be blocked or replaced by an explicit compatible fallback with a clear notice; silent visual degradation is not acceptable.
- Variants must work with hide/show, reorder, duplicate, custom fields, custom sections and preview-side editing.
- The system should support default variants, template-recommended variants and user-selected variants.
- If a user changes template, the system should preserve the selected variant where compatible and otherwise recommend a compatible alternative.
- Variant changes should be undoable and included in change history where change history is enabled.

### Architectural principle
**One data model → many presentation variants.**
The document engine owns canonical content; the presentation/variant layer decides how that content is visually represented. Templates consume compatible variants rather than redefining the underlying data model.

### Scope
Presentation variants can exist at multiple levels:
1. Field level — e.g. language proficiency as text, bar, stars or percentage.
2. Entry level — e.g. one education/experience entry rendered in different approved structures.
3. Section level — e.g. education timeline versus compact list.
4. Document level — coordinated presentation rules across a CV.

This capability must be designed alongside Dynamic Document Customization so custom fields can use suitable presentation types without requiring core-code changes for every new visual treatment.

## 6. Layout, A4 and pagination
V1 supports A4, desktop print, mobile PDF and multi-page output.
V2 must introduce a semantic layout model with dynamic page count, semantic blocks, keep-together rules, orphan prevention, controlled/manual page breaks, configurable margins and spacing, overflow detection and preview/export consistency.
The system must not solve overflow by shrinking text to impractical sizes.

## 7. Export
| Capability | V1 | V2 |
|---|---|---|
| PDF export | Present | UPGRADE |
| Desktop print/PDF | Present | UPGRADE |
| Mobile PDF | Present | UPGRADE |
| A4 PDF | Present | UPGRADE |
| Multi-page PDF | Present | UPGRADE |
| Editable DOCX | Assets/related capability present | FORMALIZE/UPGRADE |
| Export validation | Not formal | NEW |
| Export metadata | Limited | NEW |

## 8. Storage, migration and portability
V1 uses browser local storage and has a migration mechanism.
V2: local-first creation, autosave, backup/export, restore/import, schema versioning, migration engine, recovery, optional account, optional cloud sync, multiple CV documents and version history.
Account and cloud storage remain optional to preserve the no-login path.

## 9. Master profile and multiple CVs
NEW V2 foundation: a Master Career Profile stores the complete source profile. Multiple targeted CV documents select different content from it.
Examples: Software Engineer CV, Internship CV, Data Analyst CV, Academic CV and International CV.
The master profile is also a future integration boundary for the Student Career Wallet.

## 10. Import
V2 should support PDF CV import, DOCX CV import and structured data import. Future external profile import can be evaluated.
Imported information must be shown for user review before becoming authoritative profile data.
LinkedIn import remains EVALUATE/FUTURE and must comply with applicable platform rules and user authorization.

## 11. ATS intelligence
V2 needs two workflows: in-builder ATS readiness and a standalone CV checker.
Analysis should cover structure, recognizable sections, contact information, formatting, readability, keyword coverage, skills, experience content and consistency.
ATS analysis is readiness/compatibility analysis, not a guarantee of acceptance by every employer system.

## 12. Job description matching
NEW: job description input, requirement extraction, skills/keywords/title/qualification/tool/technology/responsibility/experience extraction, matched items, missing/relevant items, weak areas, improvement suggestions and match analysis/score.
ATS readiness and job match remain conceptually separate.


## 12A. Career Intelligence Quality Layer
V2 should not stop at a single ATS or match number. Intelligence findings must be explainable and actionable.

Required capabilities include:
- separate Resume Health/ATS Readiness and Job Match analyses;
- issue → reason → evidence → recommended fix structure;
- keyword and skill gap analysis;
- exact, related and missing requirement distinctions where confidence permits;
- Skill Evidence Engine linking claimed skills to supporting CV evidence;
- missing-evidence detection for skills or claims;
- chronology and consistency checks;
- achievement-discovery prompts that ask for real metrics rather than inventing them;
- template recommendations based on content and compatibility.

Scores are summaries of analysis, not guarantees of ATS acceptance, interviews or employment outcomes.

## 14A. Controlled AI Assistance
AI assistance should be contextual, modular and user-controlled.

Recommended actions include summary generation, bullet rewriting, clarity/grammar improvement, achievement framing, job-specific tailoring, CV review, issue explanation and cover-letter generation.

AI output must have a clear suggested state before replacing authoritative user content. The product should support an **AI Suggested → User Approved** distinction where practical.

AI must never invent experience, qualifications, dates, employers, achievements, skills, metrics or credentials. When a required metric is unknown, the system should ask the user or use an explicit placeholder rather than fabricate a value.

## 16A. Online CV, Privacy and Portfolio
Future public career documents should support explicit visibility modes such as public, link-only and private. Search-engine indexing should be separately controllable where public publishing is implemented.

Online CVs should be able to connect to a portfolio without duplicating career source data. Future analytics such as views/downloads must be privacy-controlled and must not expose sensitive career data.

## 17A. Student, Fresh Graduate and Academic Modes
V2 should support specialized document guidance without creating separate incompatible data models.

Student/fresh-graduate capabilities include education-first layouts, projects, coursework, internships, certifications, extracurricular activities, volunteer work, academic achievements and final-year projects.

Academic capabilities include research, publications, thesis, conferences, presentations, teaching, grants, memberships and research interests.

Both modes must remain compatible with the Master Profile and presentation-variant architecture.

## 23A. Application Workspace and Career Continuity
Future application workflows should connect a job description with its selected CV version, cover letter, match analysis, application status, interview information, notes and follow-up history.

This remains separate from the Document Core but should consume the same authorized career data and document versions.

## 13. Keyword and skill gap
NEW: keyword coverage, relevant missing keywords, skill alignment, relevant skill gaps and terminology alignment.
The system must not encourage users to claim skills they do not actually possess.

## 14. AI intelligence
V1 has limited summary suggestion behavior.
V2 AI layer: professional summary generation, bullet rewriting, clarity improvement, achievement framing, content review, skills suggestions, job-specific tailoring, issue explanation, cover letter generation and future conversational assistance.
AI is not a hard dependency of the document renderer. The AI provider must remain replaceable. User approval is required before replacing user content. AI must not invent experience, qualifications, achievements or credentials.

## 15. Cover letters
NEW: general cover letter, job-specific cover letter, CV-aware cover letter, job-description-aware cover letter, editable document and PDF/DOCX export.

## 16. Online CV and portfolio
NEW/FUTURE: public CV, private CV, shareable URL, downloadable CV, portfolio links and professional profile.
Public CV must have privacy controls.

## 17. Student mode
NEW: student CV, fresh graduate CV, education-first layouts, projects, internships, coursework, certifications, extracurricular activities, volunteer work and academic achievements.
The system must support Pakistani education terminology and international conventions.

## 18. Accessibility
NEW/UPGRADE: keyboard navigation, focus management, semantic controls, labels, contrast checks, readable typography and accessible interactive states.

## 19. Analytics and tracking
V1 has event tracking/reporting. V2 preserves useful analytics with privacy review, event taxonomy, consent/notice where required, secure configuration and no sensitive CV content in analytics payloads.

## 20. Monetization and advertising
Monetization is part of the V2 product architecture, but it must not compromise the free core experience.

### Advertising
Reserve an Advertising/Monetization Layer for Google Ads/AdSense or another approved advertising system.
Requirements: controlled desktop/mobile placements, explicit inventory definitions, usability safeguards, ad-free entitlement for eligible paid users, privacy/consent handling, secure configuration and no sensitive CV content sent to advertisers as ordinary ad behavior.
Ads must never be inserted into the generated CV itself unless a future product explicitly requires it.

### Paid/Premium
Future premium capabilities may include premium CV templates, premium profile designs, template packs, advanced customization, advanced ATS/job intelligence, AI usage packages, premium cover-letter capabilities, online CV customization, additional CV versions/storage and ad-free use.
Feature access must be controlled through entitlements rather than hard-coded payment checks.

### Premium profile marketplace
Future capability for professionally designed premium CV/profile packages.
Support catalog/product ID, template/package ID, version, price, currency, entitlement, purchase state, activation, refund/revocation state, availability and future regional/promotional pricing.
The architecture must not assume a specific payment provider.

### Commercial principle
Feature → Entitlement → Monetization.
A feature can be free, premium, promotional or temporarily granted without rewriting the feature itself.

## 21. Student Career Wallet
FUTURE platform boundary.
The wallet may eventually contain profile, education, skills, certifications, projects, experience, achievements, CVs, cover letters, portfolio, applications and career documents.
The CV Builder should consume authorized career-profile data without becoming the owner of the entire future career platform.

## 22. Future integrations
Reserve clean boundaries for Google authentication, Google Drive backup, job platforms, application tracking, portfolio publishing, education records, certificates/credentials, career services and future eStudent student tools.
No integration should become a hard dependency of the CV rendering core.

## 23. Future career/application layer
FUTURE: job application tracker, application status, interview tracking, career dashboard, saved jobs, follow-up reminders and career document history.
This remains separate from the core document engine.

## 24. SEO and growth
Support product-led SEO for CV builder, student CV, role-specific CVs, industry-specific CVs, CV templates, CV examples, ATS checker, job matching, cover letters and online CV.
Pages must provide genuine utility and avoid thin programmatic content.

## 25. Security and privacy
V2 must include secure secret management, upload validation, input sanitization, authorization, rate limiting where appropriate, secure API design, privacy controls, data export/delete, AI data transparency, secure analytics, payment-security delegation and auditability of important entitlement/account events.

## 26. Testing and regression
Every preserved capability must have a regression test across data, migration, sections/fields, visibility, templates, themes, preview, mobile, desktop, pagination, PDF, DOCX, import, ATS, job matching, AI constraints, monetization entitlements, ad behavior, account/cloud, public CV, privacy, accessibility and SEO.
The V1 Golden Baseline remains the reference for preserved behavior and visual output.

## 27. Final architecture principles
1. V1 system is the behavioral/visual baseline; V1 code is not the V2 architecture.
2. Core document rendering must not depend on AI, ads, payments or a cloud provider.
3. Monetization uses entitlement boundaries.
4. Advertising remains outside the professional CV document.
5. Student Career Wallet is a future reusable career-data boundary.
6. New integrations are replaceable.
7. New capabilities are documented before implementation.
8. UI/CSS modernization remains a controlled later phase.