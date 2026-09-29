# V2 Security, Privacy, Account and Data Governance Contract

**Status:** Proposed for architecture approval  
**Scope:** Identity, authorization, privacy, career-data governance, account lifecycle, deletion, recovery, consent, secrets, uploads, AI/data processing, analytics, and security boundaries  
**Implementation status:** Documentation only; no application code

## 1. Purpose

This contract defines the security, privacy, account, and data-governance boundaries for V2.

It covers:
- account and identity;
- authorization;
- ownership;
- career-data privacy;
- local-first and optional account/cloud operation;
- data export and deletion;
- recovery;
- uploaded documents/assets;
- AI and external processing;
- analytics;
- public CV access;
- commercial/entitlement boundaries;
- auditability;
- incident and security response.

The governing principle is:

> **The user controls their career data, and every system capability must respect explicit ownership, authorization, purpose, and privacy boundaries.**

## 2. Security-by-Design

Security and privacy are architectural requirements, not later implementation features.

V2 must consider:
- least privilege;
- data minimization;
- purpose limitation;
- explicit authorization;
- secure defaults;
- separation of private and public data;
- controlled access;
- secure lifecycle transitions;
- recoverability;
- auditability;
- safe failure.

Implementation technologies are intentionally outside this contract.

## 3. Identity Boundary

An account identity, where accounts are enabled, represents the person or organization authorized to access the associated data.

Identity must be distinguished from:
- Master Career Profile;
- individual CVs;
- public CV identities;
- purchased entitlements;
- analytics identifiers.

A single identity may own multiple career documents.

## 4. Local-First Operation

V2 may support local-first use without requiring an account for core document creation where product requirements permit.

Local-only data must remain local unless the user explicitly initiates an operation that requires transfer.

Examples:
- cloud backup;
- account synchronization;
- AI processing;
- public CV publishing;
- analytics where applicable;
- external document processing.

## 5. Optional Cloud/Account Boundary

If account/cloud functionality is enabled:

**Local Career Data → Explicit User Action → Authorized Cloud Operation**

Cloud synchronization must not silently activate merely because an account exists.

The product must make the relevant data-transfer behavior understandable.

## 6. Ownership Model

The architecture should distinguish:

- account owner;
- Master Profile owner;
- Targeted CV owner;
- cover-letter owner;
- uploaded asset owner;
- public CV publisher;
- entitlement owner.

Ownership determines who may:
- view;
- edit;
- export;
- publish;
- share;
- delete;
- revoke;
- transfer where supported.

## 7. Authorization

Authorization must be evaluated for every protected operation.

Examples:
- reading a private CV;
- modifying a Master Profile;
- exporting a private document;
- publishing an online CV;
- viewing restricted artifacts;
- changing sharing settings;
- deleting career data;
- accessing paid capabilities.

Authentication alone does not imply authorization.

## 8. Private vs Public Data

V2 must clearly distinguish:

**Private Career Data**
from
**Published Career Presentation**

A public CV is a controlled projection of selected information.

Publishing a CV must not expose every field in the Master Profile.

## 9. Sensitive and Optional Fields

Potentially sensitive fields may include:
- national identifiers;
- date of birth;
- religion;
- personal address;
- personal phone;
- private email;
- photographs;
- other region-specific personal information.

Their presence in the Master Profile must not automatically make them public.

Public presentation requires explicit field-level/document-level selection.

## 10. Data Minimization

Only data necessary for a specific operation should be processed.

Examples:

### ATS Analysis
Needs the selected CV content and relevant document context.

### Job Match
Needs the selected CV and selected Job Description.

### AI Summary
Needs relevant authorized career content.

### Analytics
Usually needs feature/event metadata rather than full career content.

Unrelated Master Profile data should not be included merely because it exists.

## 11. Purpose Limitation

Data collected for one purpose must not automatically be reused for another unrelated purpose.

For example:
- CV creation does not automatically authorize public publication;
- AI processing does not automatically authorize analytics use;
- analytics events do not automatically authorize marketing use;
- Job Match input does not automatically become public career content.

## 12. Data Classification

V2 should conceptually classify data into categories such as:

1. public product/catalog data;
2. account/identity data;
3. private career data;
4. sensitive personal career data;
5. uploaded source documents;
6. generated artifacts;
7. analysis findings;
8. AI suggestions;
9. entitlement/commercial records;
10. analytics data;
11. security/audit records.

Each category may have different access and retention requirements.

## 13. Master Profile Protection

The Master Profile is the authoritative reusable career-data source.

Protected operations include:
- editing;
- bulk updates;
- import application;
- AI-assisted changes;
- deletion;
- export;
- synchronization.

No intelligence feature should silently overwrite authoritative profile data.

## 14. Targeted CV Protection

A Targeted CV may contain a selected subset and presentation of Master Profile information.

Changes to a Targeted CV must not silently modify the Master Profile unless the user explicitly applies a supported change to the source profile.

## 15. Version and Recovery

V2 should preserve recoverability for meaningful destructive or high-impact operations.

Potential recovery mechanisms include:
- autosave;
- draft state;
- document version history;
- backup/export;
- restore;
- archived state.

The exact retention policy is a later product/operational decision.

## 16. Deletion Semantics

Deletion must distinguish:

- hide;
- remove from a Targeted CV;
- archive;
- unpublish;
- revoke sharing;
- delete a generated artifact;
- delete a source asset;
- delete a Targeted CV;
- delete Master Profile data;
- delete account.

These actions must not be treated as interchangeable.

## 17. Account Deletion

Account deletion should have an explicit lifecycle.

Before destructive completion, the user should understand what may be deleted, such as:
- account data;
- cloud-synchronized career data;
- documents;
- uploaded assets;
- generated artifacts;
- public CVs;
- entitlements;
- associated application data where applicable.

Retention required for legitimate operational/security obligations should be separately governed and minimized.

## 18. Public CV Unpublishing

Unpublishing should revoke the configured public presentation.

It must not delete:
- the Master Profile;
- the Targeted CV;
- private drafts;
- private exports;

unless separately requested.

Search-engine removal, cached copies, or third-party copies may require separate processes and must not be represented as instantly controllable by the application.

## 19. Link Revocation

Revoking a link should prevent future access through that link according to the product's access model.

Previously downloaded or copied files cannot be recalled by the application.

The user interface should distinguish access revocation from physical deletion of already-distributed files.

## 20. Generated Artifact Privacy

Generated PDF/DOCX files may contain substantial personal information.

Artifacts should therefore inherit appropriate access controls from their source context.

Publicly downloadable artifacts must be explicitly authorized.

Temporary processing artifacts should not be retained longer than necessary.

## 21. Upload Security

Uploaded files may include:
- PDF;
- DOCX;
- images;
- other supported document types.

Upload handling must conceptually include:
- type validation;
- size limits;
- content validation;
- safe processing;
- isolation where required;
- malware/security scanning where appropriate;
- controlled retention;
- secure deletion.

The exact implementation mechanism is intentionally not selected here.

## 22. Imported Document Privacy

Imported PDF/DOCX data may contain information the user did not intend to retain.

The import workflow should therefore:
- show extracted information for review;
- identify uncertain extraction where practical;
- avoid silently promoting extracted data to authoritative profile data;
- allow rejection or correction;
- preserve provenance.

## 23. AI Processing Privacy

Before sending career content to an AI processing service, the system must establish:
- purpose;
- authorized input;
- processing context;
- applicable user consent/authorization;
- retention expectations;
- provider/data-boundary requirements.

AI provider selection is outside this contract.

## 24. AI Data Minimization

AI operations should receive only the context needed to perform the requested task.

Examples:
- summary generation should not require unrelated private fields;
- bullet rewriting should receive the relevant bullet and supporting context;
- Job Match assistance should receive the selected CV/JD context;
- cover-letter generation should use only authorized source documents.

## 25. AI Output Privacy

AI-generated suggestions may contain career information.

They must inherit appropriate privacy controls and must not be published automatically.

AI output must remain within the user's authorized document workflow unless explicitly distributed.

## 26. External Service Boundary

Any external processing service must be treated as a distinct trust boundary.

The architecture must later define, for each integration:
- data sent;
- purpose;
- authorization;
- retention;
- response handling;
- failure behavior;
- deletion implications.

No provider is selected by this contract.

## 27. Analytics Privacy

Analytics should be designed around event minimization.

Appropriate events may include:
- export requested/completed;
- template selected;
- ATS analysis requested;
- Job Match requested;
- AI suggestion accepted/rejected;
- public CV published/unpublished.

Analytics should avoid collecting:
- full CV text;
- full Job Description text;
- raw private contact details;
- national identifiers;
- unnecessary AI-generated content.

## 28. Consent and User Choice

Where a processing activity requires consent or explicit user choice, the product must provide an understandable choice.

Examples may include:
- public CV publishing;
- external AI processing;
- optional analytics;
- cloud synchronization;
- external integrations.

Consent must not be bundled unnecessarily with unrelated functionality.

## 29. Consent State

Where consent is relevant, the architecture should preserve:
- purpose;
- consent state;
- time/context;
- withdrawal state;
- applicable policy/version context.

Withdrawal should affect future processing according to the relevant policy.

## 30. Security and Audit Records

Security-sensitive operations may require audit records, such as:
- authentication events;
- authorization changes;
- public publication;
- sharing changes;
- deletion;
- account changes;
- entitlement changes;
- security events.

Audit data must itself be protected and minimized.

## 31. Audit vs Analytics

Security/audit records and product analytics are separate domains.

**Audit:** accountability/security.

**Analytics:** product measurement.

Analytics must not be used as a substitute for security auditability.

## 32. Secrets and Credentials

No production secret, password, API credential, database credential, private key, or token may be committed into source code or documentation.

Secrets must be managed through an appropriate secure configuration boundary.

Previously exposed credentials from V1 must be considered compromised until appropriately rotated/revoked.

## 33. V1 Security Reconciliation

The V1 audit identified plaintext database credentials in:
- `api/track-event.php`;
- `api/report.php`.

Before any V1 source is reused or migrated into V2:
1. exposed credentials must be rotated/revoked as appropriate;
2. secrets must be removed from source;
3. secure configuration must be established;
4. repository/history must be checked for remaining secrets;
5. tracking/reporting must be revalidated.

No secret from V1 may become a V2 source artifact.

## 34. Repository and Source Security

Source repositories must not contain:
- production credentials;
- private tokens;
- user CV data;
- uploaded personal documents;
- private generated artifacts;
- unnecessary personal information.

Golden Baseline assets should be sanitized before publication to shared development environments.

## 35. Access to Career Data

Internal access, where required for operations, should follow least privilege.

The system should conceptually distinguish:
- user access;
- support access;
- administrative access;
- automated service access.

Support/administrative access should not imply unrestricted access to private career content.

## 36. Data Export

Users should be able to retrieve their important career data in a usable form where product requirements support it.

Export/retrieval should cover, as appropriate:
- Master Profile;
- Targeted CVs;
- cover letters;
- relevant assets;
- document history;
- structured career data.

Generated PDF/DOCX artifacts are not necessarily sufficient as a structured-data backup.

## 37. Data Portability

A structured export should preserve enough information to support future restoration or migration.

Where possible, portability should distinguish:
- canonical career data;
- document configuration;
- template reference;
- presentation configuration;
- assets;
- provenance.

## 38. Backup and Recovery

If cloud storage is supported, backup/recovery policies must define:
- what is backed up;
- how versions are identified;
- how restoration works;
- what happens after deletion;
- how recovery interacts with account deletion.

No backup should silently resurrect data after a user-requested deletion unless retention rules explicitly require it and are disclosed.

## 39. Commercial and Entitlement Security

Entitlement state may control access to:
- premium templates;
- AI features;
- advanced ATS/Job Match features;
- additional storage;
- online CV capabilities;
- other paid functionality.

Entitlement records must be protected from unauthorized modification.

Loss of entitlement must not corrupt or delete the user's underlying career data.

## 40. Payment Boundary

Payment credentials and sensitive payment processing should remain within an appropriate payment boundary.

V2 career-data architecture should not store unnecessary payment secrets.

Commercial records should retain only what is necessary for entitlement/accountability.

## 41. Public CV Abuse Controls

Public CV functionality should consider:
- automated scraping;
- spam;
- unwanted downloads;
- abusive access;
- excessive requests;
- malicious uploads;
- impersonation.

Protective controls may be applied without compromising legitimate user access.

## 42. Rate and Abuse Protection

Security-sensitive or resource-intensive operations may require controls against:
- automated abuse;
- excessive AI requests;
- repeated exports;
- malicious uploads;
- repeated authentication attempts;
- public CV scraping.

Exact thresholds and mechanisms are implementation/operations decisions.

## 43. Secure Failure

When a security-sensitive operation fails, the system should fail without exposing:
- secrets;
- private career data;
- internal credentials;
- unnecessary implementation details.

Error reporting should provide users enough information to understand the outcome without leaking protected information.

## 44. Incident Response Boundary

A future operational security specification should define:
- detection;
- containment;
- investigation;
- notification;
- credential rotation;
- affected-data assessment;
- recovery;
- post-incident review.

This architecture contract establishes the requirement but does not define operational runbooks.

## 45. Privacy and Public Distribution Relationship

Public CV publishing is an explicit distribution action.

The system should make clear:
- what will become public;
- which fields will be displayed;
- whether downloads are allowed;
- whether search indexing is enabled;
- how to unpublish;
- what cannot be recalled after external copying.

## 46. Career Wallet Relationship

Future Career Wallet functionality may aggregate:
- Master Profile;
- CVs;
- cover letters;
- portfolio;
- certifications;
- applications;
- interview information;
- career documents.

Aggregation must not weaken the privacy boundary of each underlying object.

The Career Wallet is an organizational layer, not automatic authorization to expose every item.

## 47. Application Workspace Relationship

Future Application Workspace data may connect:
- Job Description;
- selected CV;
- cover letter;
- match analysis;
- application status;
- notes;
- interview information.

These relationships must not make the underlying CV public or shareable without explicit authorization.

## 48. Data Retention

Each major data category should eventually have a documented retention policy.

At minimum, retention should be considered for:
- active career data;
- deleted data;
- uploaded files;
- generated artifacts;
- AI processing data;
- analytics;
- audit/security records;
- public CVs;
- backups.

Retention should be no longer than justified by product, legal, security, or operational requirements.

## 49. Privacy by Default

Default behavior should favor:
- private career data;
- minimal data processing;
- no public CV;
- no unnecessary external transfer;
- no unnecessary analytics content;
- no automatic AI application;
- explicit sharing.

Users may opt into broader distribution or processing.

## 50. V1 Compatibility

V1 uses local browser storage for core CV data and contains server-side tracking/reporting functionality.

V2 must preserve the user-visible ability to work with local data while establishing stronger boundaries around:
- server-side data;
- secrets;
- analytics;
- account/cloud functionality;
- imported files;
- AI processing.

V1 migration must not require uploading private local CV data merely to perform a local migration where local migration is supported.

## 51. Security Regression Requirements

Security validation should cover:
- V1 migration;
- local storage migration;
- authorization;
- public/private visibility;
- field-level privacy;
- upload handling;
- import handling;
- AI data boundaries;
- analytics minimization;
- artifact access;
- deletion;
- unpublishing;
- link revocation;
- entitlement changes;
- secret scanning;
- account deletion;
- recovery.

## 52. Acceptance Criteria

The security/privacy/account architecture is contractually complete when:

1. ownership is explicit;
2. authentication and authorization are distinct;
3. private and public career data are separated;
4. sensitive fields are not automatically public;
5. local-first operation has a defined boundary;
6. cloud synchronization requires explicit authorization;
7. data minimization and purpose limitation are defined;
8. deletion states are distinct;
9. account deletion is governed;
10. public CV unpublishing is distinct from source-data deletion;
11. generated artifacts have controlled access;
12. uploads have security requirements;
13. AI processing has an explicit trust boundary;
14. analytics are separated from raw career content;
15. consent/choice is defined where applicable;
16. audit and analytics are separate;
17. secrets are prohibited from source;
18. V1 exposed credentials are explicitly reconciled;
19. structured data portability is supported conceptually;
20. backup/recovery does not silently resurrect deleted data;
21. entitlement changes cannot destroy career data;
22. public CV abuse controls are considered;
23. secure failure is required;
24. privacy is private-by-default;
25. V1 migration preserves local-first behavior where supported.

## 53. Domain Invariants

1. The user owns and controls their career data within the product's documented ownership model.
2. Authentication does not equal authorization.
3. Private data is not public by default.
4. Presence in the Master Profile does not imply publication.
5. Public CVs are derived presentations.
6. Public sharing is explicit.
7. AI processing is a separate trust boundary.
8. Analytics does not require raw career content.
9. Security audit is separate from product analytics.
10. Secrets never belong in source code.
11. Entitlement loss never destroys career data.
12. Unpublishing never silently deletes the source profile.
13. Deleting a generated artifact does not imply deleting source data.
14. Deleting source data does not automatically imply deletion of unrelated audit records where retention is required.
15. Backup must not silently resurrect deleted user data.
16. External processing must be purpose-limited.
17. Sensitive fields require explicit distribution control.
18. No implementation technology is selected by this contract.

## 54. Approval Gate

Review this contract with:
- V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md
- V2_DOMAIN_AND_DATA_CONTRACT_SPECIFICATION.md
- V2_DOCUMENT_LIFECYCLE_AND_STATE_CONTRACT.md
- V2_IMPORT_AND_MIGRATION_CONTRACT.md
- V2_INTELLIGENCE_AI_SAFETY_AND_PROVENANCE_CONTRACT.md
- V2_EXPORT_AND_DISTRIBUTION_CONTRACT.md
- V2_TEMPLATE_COMPATIBILITY_AND_CAPABILITY_CONTRACT.md
- V2_MONETIZATION_AND_CAREER_ECOSYSTEM.md
- V1_SOURCE_BASELINE_AND_SECURITY.md

After approval, continue with the **V2 Testing, Golden Baseline and Release Governance Contract**.

**No application code is introduced by this milestone.**
