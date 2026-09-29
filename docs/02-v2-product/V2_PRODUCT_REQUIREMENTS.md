# CV Builder V2 Product Requirements — Initial Baseline

## 1. Product objective

Evolve the existing eStudent CV Builder into an extensible career-document platform while preserving the current visual identity and no-login local-first experience.

V2 must improve the underlying system substantially without requiring a visual redesign of the existing builder.

## 2. Production V1 preservation

- V1 remains live and frozen.
- V2 development must not directly modify production V1.
- Existing visual design language should be preserved unless a future documented decision explicitly changes it.
- Existing user-created local CV data must not be unnecessarily invalidated.

## 3. Local-first and optional account model

### Anonymous mode

A user must be able to:

- open the builder;
- create/edit a CV;
- store working data locally;
- switch templates;
- export the CV;
- continue without an account.

### Optional account mode

A user may:

- create/sign into an eStudent account;
- save CV documents to cloud storage;
- restore CVs on another device;
- maintain multiple CV versions;
- maintain a master profile;
- manage backups.

### Backup

The system should provide a user-controlled backup/restore path independent of mandatory account creation.

### Google

Google authentication and Google Drive backup are future-compatible requirements, but authentication and storage must remain conceptually separate.

## 4. Extensible document model

V2 must support:

- standard sections;
- optional sections;
- custom sections;
- standard fields;
- custom fields;
- field types;
- section ordering;
- field ordering;
- visibility;
- repeatable items;
- template compatibility.

Adding a new section should not require rewriting the core builder.

## 5. Preview-side editing

The preview should eventually support:

- selecting a section;
- selecting a field;
- adding a section;
- adding a field;
- editing field values;
- hiding/showing content;
- reordering supported content;
- opening the corresponding structured editor.

Preview interactions must write to the same canonical CV document model used by the form editor.

## 6. Template system

A template must be treated as a versioned presentation definition, not as the owner of CV data.

Each template should have metadata describing:

- identity;
- name;
- category;
- career level;
- industry suitability;
- style;
- supported sections;
- supported field types;
- photo support;
- column behavior;
- page model;
- theme support;
- ATS suitability;
- accessibility expectations;
- version;
- status.

Adding a template should be a repeatable documented process rather than a core-code rewrite.

## 7. Pagination and page setup

V2 must support documents longer than one page.

Requirements include:

- A4 as a first-class paper model;
- optional additional paper sizes later;
- dynamic page count;
- automatic overflow to page 2, 3, 4 and beyond;
- semantic content blocks;
- safe page-break rules;
- keep-together behavior for headings and related content;
- configurable margins;
- configurable spacing;
- readable typography;
- export/preview consistency.

The system must not force long CVs into one page by shrinking text to an impractical size.

## 8. ATS analysis

Two user-facing modes are required.

### Mode A — In-builder analysis

While editing a CV, show an ATS readiness analysis based on the current CV.

The result should be broken into understandable categories rather than being only a single number.

Potential categories:

- structure;
- section recognition;
- contact information;
- formatting;
- readability;
- keyword coverage;
- skills;
- experience content;
- consistency;
- job match when a job description is supplied.

### Mode B — Standalone ATS checker

Provide a separate workflow where a user can:

1. upload a CV;
2. support PDF and DOCX at minimum;
3. parse/normalize the content;
4. analyze structure and content;
5. return an ATS readiness report;
6. show actionable issues;
7. optionally transfer/import the CV into the builder.

The standalone checker and in-builder analysis should share a common analysis framework.

## 9. Job-description matching

Users should be able to provide a job description.

The system should identify, where reliably possible:

- skills;
- keywords;
- role/title;
- qualifications;
- tools/technologies;
- responsibilities;
- experience requirements.

It should compare the job requirements with the CV and surface:

- matched items;
- missing items;
- weak/unclear areas;
- suggested improvements.

AI must not invent experience, qualifications or achievements that the user has not supplied.

## 10. AI assistance

AI should be a modular assistance layer, not a hard dependency of the core CV renderer.

Potential actions:

- generate professional summary;
- rewrite a bullet;
- improve clarity;
- strengthen achievement framing;
- suggest skills;
- tailor content to a supplied job description;
- review the CV;
- explain why an issue was flagged.

User approval must be required before AI-generated content replaces existing user content.

## 11. Multiple CV versions

A master profile should support multiple targeted CV documents.

Example:

- Master Profile
- Software Engineer CV
- Internship CV
- Data Analyst CV
- Academic CV

Versions should be able to share source information while allowing targeted content selection and editing.

## 12. Student Career Wallet compatibility

V2 must reserve a clean integration boundary for a future Student Career Wallet.

The wallet may eventually contain:

- profile;
- education;
- skills;
- certifications;
- projects;
- experience;
- achievements;
- CVs;
- cover letters;
- portfolio;
- applications.

The CV Builder should consume career-profile data without becoming the owner of the entire future career platform.

## 13. SEO requirements

SEO must be treated as a product architecture concern.

Requirements include:

- canonical URLs;
- indexable tool landing pages;
- useful ATS checker landing page;
- useful CV template/category pages;
- structured data where appropriate;
- internal linking;
- unique content per search intent;
- strong page titles/descriptions;
- Open Graph/social metadata;
- sitemap integration;
- performance/mobile usability;
- avoidance of thin programmatic pages.

SEO pages must provide genuine utility and must not exist only to repeat keywords.

## 14. Privacy and data ownership

The product must document:

- what is stored locally;
- what is stored in cloud;
- what is sent to AI services;
- retention;
- deletion;
- backup/export;
- account deletion;
- data ownership;
- analytics data.

## 15. Architecture rule

The V2 core must remain independent from any single AI provider, authentication provider, cloud storage provider, job provider or ATS vendor.

Implementation technologies will be selected only after architecture and requirements are approved.


## 16. Monetization and advertising

Monetization is a first-class product concern, but remains architecturally separate from the CV document engine.

### Advertising

V2 must reserve an advertising layer capable of supporting Google Ads/AdSense or another approved advertising provider. Requirements include controlled desktop/mobile placements, explicit ad inventory, privacy/consent handling where required, no sensitive CV content in advertising payloads, no advertising inside the generated professional CV document, ad-free behavior for eligible paid users, and no material obstruction of CV editing.

### Premium products

The future paid system should support premium CV templates, premium profile designs, template packs, advanced ATS/job intelligence, AI usage packages or subscriptions, premium cover-letter capabilities, online CV/profile customization, additional CV versions/storage, and ad-free access. The commercial model may support one-time purchases, subscriptions and credit/package models. Payment-provider selection is deferred.

### Entitlement architecture

Feature access must be controlled through an entitlement layer rather than payment logic embedded inside individual features. Conceptually: User → Entitlement → Capability/Product. The entitlement model should support activation, cancellation, refund, revocation, expiry, promotional grants and administrative grants.

## 17. Student Career Wallet and ecosystem

V2 must reserve a clean boundary for a future Student Career Wallet containing profile, education, skills, certifications, projects, experience, achievements, CVs, cover letters, portfolio, applications and career documents.

The CV Builder should consume authorized wallet/profile data without becoming the owner of the entire future career platform. Future integrations may include ATS Checker, Job Matcher, Cover Letter Builder, Online CV, Job Application Tracker, Interview Coach, education/student tools, certificates/credentials, cloud backup and external job services. Each integration requires a documented boundary and explicit user authorization.

## 18. Commercial and ecosystem privacy

The product must document advertising data flow, purchase and entitlement data, AI data flow, analytics, retention, export/delete, account deletion and premium access lifecycle. The commercial layer must not weaken the user's control over career data.

## 19. Updated architecture principle

The V2 platform should remain separable into Document Core, Career Data, Intelligence, Presentation, Monetization and Platform/Integrations. The document renderer must not depend directly on ads, payments, AI or a specific cloud provider.
