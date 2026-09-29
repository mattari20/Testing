# V2 Testing, Golden Baseline and Release Governance Contract

**Status:** Proposed for architecture approval  
**Scope:** Functional testing, migration testing, visual regression, export validation, security testing, acceptance gates, release readiness, rollback, and governance  
**Implementation status:** Documentation only; no application code

## 1. Purpose

This contract defines how V2 is validated before implementation milestones and releases are accepted.

The governing principle is:

> **V2 is not accepted because it works in isolation; it is accepted when it satisfies the approved contracts, preserves required V1 behavior, and passes defined regression and quality gates.**

## 2. Testing Governance

Testing is part of the architecture lifecycle.

Every major V2 capability must have:
- defined expected behavior;
- acceptance criteria;
- regression coverage;
- failure-state expectations;
- preservation requirements where V1 behavior exists.

Testing must not be postponed until the end of the project.

## 3. V1 Golden Baseline

The V1 working system is the **Golden Baseline** for behavior and presentation where preservation has been required.

The Golden Baseline includes:
- functional behavior;
- canonical user-visible data behavior;
- supported sections and fields;
- visibility behavior;
- template rendering;
- themes;
- responsive preview;
- mobile/desktop behavior;
- PDF/export behavior;
- existing user flows;
- relevant import/migration behavior.

The Golden Baseline does not require preservation of V1 implementation architecture.

## 4. Golden Baseline Evidence

Golden Baseline validation should be based on controlled evidence such as:
- known V1 source behavior;
- representative data fixtures;
- screenshots;
- rendered documents;
- exported PDFs;
- supported template outputs;
- documented interaction flows;
- migration fixtures.

Evidence should be versioned or otherwise identifiable so that later comparisons remain meaningful.

## 5. No-Silent-Loss Rule

The primary preservation rule is:

> **No user data, supported capability, or required behavior may disappear silently during V2 migration or reconstruction.**

Any intentional difference must be:
- documented;
- attributable to an approved V2 requirement;
- tested;
- communicated where user-visible.

## 6. Test Layers

V2 testing should conceptually cover:

1. domain/data validation;
2. state/lifecycle validation;
3. migration/import validation;
4. template compatibility;
5. layout/pagination;
6. preview;
7. PDF;
8. DOCX;
9. print;
10. intelligence;
11. AI safety;
12. online CV/distribution;
13. security/privacy;
14. accessibility;
15. analytics;
16. entitlement/commercial behavior;
17. performance/reliability;
18. SEO/public presentation where applicable.

## 7. Domain/Data Tests

Validate:
- Master Profile;
- Targeted CV;
- Document Configuration;
- sections;
- fields;
- repeatable entries;
- custom sections;
- custom fields;
- visibility;
- ordering;
- presentation variants;
- assets;
- versions;
- provenance.

Tests must verify canonical data remains independent from presentation.

## 8. Lifecycle Tests

Validate state transitions for:
- draft;
- active;
- archived;
- deleted;
- imported;
- under review;
- AI suggested;
- user approved;
- analysis current;
- analysis stale;
- exported;
- published;
- unpublished;
- entitlement changes.

Invalid transitions must be rejected or handled explicitly.

## 9. V1 Migration Tests

Representative V1 fixtures must cover:
- `cvData`;
- `cv_estudent_v2_final`;
- `window.cv`;
- `window.cvVisibility`;
- theme data;
- repeatable arrays;
- template selection;
- migration version;
- legacy/default values;
- incomplete records.

Migration tests must confirm:
- correct mapping;
- visibility preservation;
- template mapping;
- theme preservation;
- repeatable-entry preservation;
- unsupported data handling;
- idempotency;
- recovery behavior.

## 10. Migration Zero-Loss Testing

For every supported V1 fixture:

**V1 Source → V2 Migration → V2 Data → Rendered Output**

must be compared against expected baseline behavior.

The test must identify:
- preserved;
- transformed;
- unsupported but preserved;
- intentionally changed;
- lost.

Any unexpected loss blocks acceptance.

## 11. Import Testing

PDF/DOCX import testing should include:
- clean documents;
- complex documents;
- multiple sections;
- tables;
- columns;
- images;
- ambiguous extraction;
- incomplete extraction;
- unusual formatting;
- multilingual content where supported.

Tests must verify extraction confidence and review requirements.

## 12. Template Compatibility Testing

Every V1 template must have an explicit status.

Tests should cover:
- supported fields;
- supported sections;
- visibility;
- themes;
- presentation variants;
- photo;
- columns;
- page model;
- PDF;
- DOCX where supported;
- Web Presentation where supported;
- unsupported-content behavior.

A template must not silently drop unsupported content.

## 13. Template Visual Regression

For V1 templates, compare V2 output against the Golden Baseline.

Relevant comparison dimensions include:
- typography;
- colors;
- spacing;
- section hierarchy;
- columns;
- photo treatment;
- icons;
- borders/backgrounds;
- page structure;
- overall visual composition.

Differences should be classified as:
- identical/within tolerance;
- intentional V2 improvement;
- compatibility adaptation;
- regression.

## 14. Layout and Pagination Tests

Test:
- one-page CV;
- multi-page CV;
- long summary;
- long experience;
- long education;
- many skills;
- many languages;
- custom sections;
- images;
- two-column templates;
- manual page breaks;
- keep-together rules;
- orphan/widow prevention;
- overflow;
- dynamic page count.

Tests must verify preview/export consistency.

## 15. Preview Tests

Validate:
- desktop;
- mobile;
- responsive scaling;
- page navigation;
- zoom;
- live updates;
- theme changes;
- visibility changes;
- variant changes;
- document edits;
- recovery after refresh.

Preview must reflect the canonical document state.

## 16. PDF Tests

Validate:
- A4 dimensions;
- page count;
- page breaks;
- typography;
- images;
- links where supported;
- clipping;
- overflow;
- blank pages;
- file integrity;
- metadata where applicable.

PDF output must be compared with preview and Golden Baseline where preservation applies.

## 17. DOCX Tests

Validate:
- valid editable DOCX;
- text editability;
- section hierarchy;
- lists;
- tables/columns where supported;
- images;
- links;
- document structure;
- template-specific compatibility.

A screenshot embedded into DOCX must not be accepted as a substitute for an editable document.

## 18. Print Tests

Validate:
- print page size;
- margins;
- page breaks;
- headers/footers where applicable;
- no accidental clipping;
- no unwanted browser artifacts;
- consistency with supported layout behavior.

## 19. Intelligence Tests

ATS Readiness tests should verify:
- structural findings;
- parsing-risk findings;
- evidence references;
- explainability;
- uncertainty;
- no guarantee language.

Job Match tests should verify:
- Job Description extraction;
- exact matches;
- related matches;
- missing terms;
- weak evidence;
- qualification/experience requirements;
- evidence references.

## 20. AI Safety Tests

AI testing must verify:
- no invented employers;
- no invented dates;
- no invented degrees;
- no invented certifications;
- no invented achievements;
- no invented metrics;
- no invented skills;
- no silent Master Profile modification;
- user approval before application;
- provenance;
- appropriate uncertainty;
- authorized context only.

Known adversarial inputs should be included in testing.

## 21. Export and Distribution Tests

Validate:
- PDF;
- DOCX;
- print;
- online CV;
- public/private states;
- link-only states;
- download permissions;
- unpublishing;
- link revocation;
- artifact provenance;
- artifact immutability.

## 22. Security Tests

Security validation should include:
- authorization;
- ownership;
- private/public separation;
- sensitive-field protection;
- upload handling;
- import handling;
- secret scanning;
- credential handling;
- session/access boundaries;
- deletion;
- artifact access;
- entitlement protection;
- abuse/rate controls.

The security test suite must explicitly verify that V1 exposed credentials are not carried into V2.

## 23. Privacy Tests

Validate:
- private-by-default behavior;
- public field selection;
- AI data minimization;
- analytics minimization;
- cloud-sync authorization;
- consent/choice;
- unpublishing;
- account deletion;
- structured data export;
- retention behavior.

## 24. Accessibility Tests

Validate:
- keyboard operation;
- focus visibility;
- semantic structure;
- labels;
- error messaging;
- accessible controls;
- non-color-only communication;
- readable typography;
- public CV accessibility where applicable.

## 25. Analytics Tests

Validate that analytics:
- record intended events;
- do not require raw CV content;
- do not expose sensitive fields;
- distinguish analytics from audit records;
- respect applicable user choices.

## 26. Entitlement Tests

Validate:
- free/premium boundaries;
- template entitlement;
- AI entitlement;
- ATS/Job Match entitlement;
- storage limits where applicable;
- entitlement expiration;
- entitlement restoration;
- refund/revocation behavior where applicable.

Loss of entitlement must never corrupt career data.

## 27. Performance and Reliability

Performance testing should cover:
- large CVs;
- many repeatable entries;
- many custom fields;
- long documents;
- large images;
- complex templates;
- PDF generation;
- DOCX generation;
- repeated analysis;
- import processing.

The system should fail safely when resource limits are exceeded.

## 28. Cross-Output Consistency

Where the same document is represented in multiple outputs, compare:
- content;
- section ordering;
- visibility;
- template intent;
- page structure where applicable.

Differences that are inherent to the output format must be documented rather than treated as accidental.

## 29. Regression Matrix

The release regression matrix should include at minimum:

| Area | V1 Baseline | V2 Contract | Required Gate |
|---|---|---|---|
| Core data | Required | Domain/Data | Pass |
| Visibility | Required | Domain/Lifecycle | Pass |
| Templates | Required | Template Contract | Pass |
| Themes | Required | Template Contract | Pass |
| Preview | Required | Layout/Preview | Pass |
| Mobile | Required | Layout | Pass |
| Desktop | Required | Layout/Export | Pass |
| PDF | Required | Export | Pass |
| DOCX | New/extended | Export | Pass where supported |
| Migration | Required | Import/Migration | Pass |
| ATS | New/extended | Intelligence | Pass |
| Job Match | New | Intelligence | Pass |
| AI safety | New/extended | AI Contract | Pass |
| Online CV | New | Distribution | Pass where released |
| Security | Required | Security | Pass |
| Privacy | Required | Security | Pass |
| Accessibility | Required | Product/Architecture | Pass |
| Entitlements | New/extended | Commercial | Pass |
| Analytics | Required | Privacy/Analytics | Pass |

## 30. Test Data Governance

Test data must be controlled.

Where possible:
- use synthetic data;
- use sanitized V1 fixtures;
- avoid real personal CVs;
- avoid production secrets;
- avoid real credentials;
- avoid unnecessary personally identifiable information.

Golden Baseline fixtures must be reproducible.

## 31. Environment Separation

Testing must distinguish:
- development;
- test/staging;
- production.

Production career data must not be copied into test environments without an approved privacy/security process.

## 32. Release Gates

A V2 milestone should pass, as applicable:

### Gate A — Contract Compliance
Approved architecture contracts are implemented as specified.

### Gate B — Functional Correctness
Core workflows operate as defined.

### Gate C — Golden Baseline Preservation
Required V1 behavior/output remains within accepted tolerance.

### Gate D — Data Safety
Migration/import has no unexpected data loss.

### Gate E — Security & Privacy
Security/privacy gates pass.

### Gate F — Export Integrity
Supported outputs validate correctly.

### Gate G — Accessibility
Required accessibility checks pass.

### Gate H — Release Readiness
Known defects and deviations are documented and accepted.

## 33. Blocking Defects

A defect should block release when it causes, for example:
- silent data loss;
- unauthorized private-data exposure;
- credential/secret exposure;
- corrupted career data;
- broken migration;
- materially incorrect export;
- unsafe AI fabrication;
- unauthorized public publication;
- severe security bypass.

Minor visual differences do not automatically block release if they are documented, intentional, and within approved tolerance.

## 34. Deviation Management

Any intentional deviation from:
- V1 Golden Baseline;
- approved architecture contract;
- approved product requirement;

must be documented with:
- reason;
- affected capability;
- user impact;
- migration impact;
- test coverage;
- approval status.

No deviation should be introduced silently.

## 35. Release Candidate

A release candidate should be created only after:
- implementation scope is frozen;
- known blockers are resolved;
- required regression tests pass;
- migration is validated;
- security/privacy checks pass;
- export checks pass;
- Golden Baseline comparison is complete.

## 36. Rollback and Recovery

Every production release should have a defined recovery strategy.

Recovery may include:
- reverting application behavior;
- restoring a previous compatible version;
- preserving user data;
- restoring document versions;
- disabling a faulty feature;
- preventing new migration until a fix is available.

Rollback must not create data corruption or silent loss.

## 37. Migration Release Safety

A migration release should be staged where practical.

The system should:
- detect eligible legacy data;
- validate migration;
- preserve original data until migration success is established;
- support recovery;
- avoid repeated destructive transformations.

Migration must be idempotent.

## 38. Feature Flags and Controlled Release

New high-risk capabilities may be introduced through controlled availability.

Examples:
- AI;
- Job Match;
- public CV;
- DOCX export;
- new template families;
- cloud synchronization.

A disabled feature must not corrupt documents that do not use it.

## 39. Documentation Gate

A capability is not considered architecture-complete until:
- contract exists;
- dependencies are identified;
- acceptance criteria exist;
- known risks are recorded;
- preservation impact is documented.

## 40. Source and Repository Governance

Before release:
- secrets must be scanned;
- unnecessary private data must be removed;
- source/assets must be reconciled;
- required documentation must be current;
- version identifiers must be consistent;
- migration/version information must be documented.

## 41. V1 Asset Reconciliation

Before declaring V1 template preservation complete, missing archive assets identified during the V1 audit must be reconciled.

Known examples include:
- missing T01 ATS template source;
- missing T01 simple template source;
- missing ATS preview asset;
- missing/extension-mismatched demo image asset.

A template should not be marked fully reproducible until its required source assets are recovered, replaced through an explicitly approved compatibility decision, or formally retired by decision.

## 42. Security Baseline Reconciliation

Before V2 implementation uses V1 source assets:
- exposed V1 credentials must be rotated/revoked as appropriate;
- secrets must be removed from source;
- repository history must be reviewed;
- secure configuration must be established;
- tracking/reporting behavior must be revalidated.

## 43. Release Evidence Package

A release should have an evidence package containing, as applicable:
- test results;
- migration results;
- Golden Baseline comparisons;
- export validation;
- security/privacy results;
- accessibility results;
- known deviations;
- release notes;
- rollback/recovery information.

## 44. Acceptance Sign-Off

A milestone is accepted only when the responsible project governance process confirms:
- contracts are satisfied;
- tests pass;
- deviations are approved;
- blockers are resolved;
- preservation requirements are met.

A passing automated test alone does not override an architectural contract.

## 45. Post-Release Validation

After release, validate:
- core document creation;
- migration;
- preview;
- export;
- public/private controls;
- critical intelligence features;
- security monitoring;
- error rates.

Post-release observations may generate corrective work without silently changing the contract.

## 46. V1 Preservation Principle

V1 preservation is not “copy every line of V1 code.”

It means preserving the approved:
- behavior;
- data meaning;
- user workflows;
- visual baseline;
- supported outputs;
- important edge cases.

V2 may replace:
- fixed schema implementation;
- rendering helpers;
- pagination mechanism;
- storage mechanism;
- AI implementation;
- export implementation;

provided the resulting behavior satisfies the approved contracts.

## 47. Architecture Freeze Relationship

Once the architecture contracts are approved, implementation should proceed against the contracts rather than continuously changing architecture in response to individual coding difficulties.

Changes should follow controlled change governance.

## 48. Change Control

A material architecture change should record:
- requested change;
- affected contracts;
- affected capabilities;
- migration implications;
- regression implications;
- security/privacy implications;
- decision;
- approval.

This prevents implementation convenience from silently redefining the product.

## 49. Release Acceptance Criteria

The V2 release governance system is contractually complete when:

1. V1 Golden Baseline is explicitly defined;
2. evidence for baseline comparison exists;
3. no-silent-loss is enforceable;
4. testing spans all major architecture domains;
5. migration is regression-tested;
6. templates are visually and functionally tested;
7. pagination is tested;
8. PDF/DOCX/print are tested;
9. AI safety is tested;
10. ATS/Job Match findings are tested;
11. security/privacy are tested;
12. accessibility is tested;
13. analytics/entitlements are tested;
14. release gates are defined;
15. blocking defects are defined;
16. deviations require approval;
17. rollback/recovery is defined;
18. V1 asset reconciliation is tracked;
19. V1 security reconciliation is tracked;
20. release evidence is retained;
21. architecture changes are governed;
22. post-release validation exists.

## 50. Domain Invariants

1. Passing a test does not override an architecture contract.
2. V1 Golden Baseline is a preservation reference, not a V2 implementation blueprint.
3. No-silent-loss is mandatory.
4. Intentional deviations require documentation and approval.
5. Security/privacy blockers cannot be waived as ordinary defects.
6. Migration must be recoverable and idempotent.
7. Generated outputs must be validated.
8. AI must be tested for anti-fabrication.
9. Public distribution must be tested separately from private document behavior.
10. Real personal data should not be used unnecessarily in testing.
11. Production data must not be casually copied into test environments.
12. Release rollback must preserve user data.
13. Architecture changes require controlled governance.
14. V1 source-code reuse is not required for behavioral preservation.
15. No implementation technology is selected by this contract.

## 51. Approval Gate

Review this contract with:
- V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md
- V2_DOMAIN_AND_DATA_CONTRACT_SPECIFICATION.md
- V2_DOCUMENT_LIFECYCLE_AND_STATE_CONTRACT.md
- V2_TEMPLATE_COMPATIBILITY_AND_CAPABILITY_CONTRACT.md
- V2_LAYOUT_AND_PAGINATION_CONTRACT.md
- V2_IMPORT_AND_MIGRATION_CONTRACT.md
- V2_INTELLIGENCE_AI_SAFETY_AND_PROVENANCE_CONTRACT.md
- V2_EXPORT_AND_DISTRIBUTION_CONTRACT.md
- V2_SECURITY_PRIVACY_ACCOUNT_AND_DATA_GOVERNANCE_CONTRACT.md
- V1_FUNCTIONALITY_PRESERVATION_INVENTORY.md
- V1_UI_CSS_PRESERVATION_CONTRACT.md
- V1_SOURCE_BASELINE_AND_SECURITY.md

After approval, the project should enter **Architecture Consolidation and Implementation-Readiness Review** before application code begins.

**No application code is introduced by this milestone.**
