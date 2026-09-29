# V2 Import and Migration Contract

**Status:** Proposed for architecture approval  
**Scope:** Technology-neutral import, migration, normalization, review, and data-preservation contract  
**Implementation status:** Documentation only; no application code

## 1. Purpose

This contract defines how CV Builder V2 receives existing V1 data, external CV documents, and future structured sources without silently losing or fabricating career information.

It covers:

- V1-to-V2 migration;
- legacy storage recovery;
- structured data import;
- PDF/DOCX import;
- normalization;
- provenance;
- confidence;
- review and acceptance;
- migration versioning;
- rollback/recovery;
- unsupported content;
- asset handling;
- zero-silent-loss validation.

The governing principle is:

> **Import and migration transform representation; they do not redefine what the user's career data means.**

## 2. Source Categories

V2 must distinguish among at least these source categories:

### 2.1 V1 Native Data
Data produced by the existing CV Builder V1 system.

Examples include:
- legacy `cvData`;
- current V1 canonical local storage;
- V1 visibility state;
- V1 theme configuration;
- V1-supported repeatable arrays;
- V1 migration metadata.

### 2.2 Structured External Data
Data already represented in a known structured format.

Examples:
- approved structured CV files;
- future profile exports;
- structured career records.

### 2.3 Document Imports
Unstructured or semi-structured career documents such as:
- PDF;
- DOCX;
- future supported document formats.

### 2.4 External Profile Sources
Future integrations may import information from authorized external career/profile sources.

External-source support must remain explicitly authorized and source-aware.

## 3. Migration versus Import

Migration and import are related but different.

### Migration
Transforms an existing supported V1/V2 representation into the current canonical V2 representation while preserving known semantics.

### Import
Extracts or receives career information from an external source and prepares it for user review before authoritative acceptance.

Migration generally has higher semantic confidence when the source is a known V1 canonical structure.

Import generally has greater uncertainty, especially for PDF/DOCX extraction.

## 4. V1-to-V2 Migration Pipeline

The conceptual flow is:

**V1 Source → Source Validation → Version Detection → Mapping → Normalization → Compatibility Review → V2 Canonical Data → Validation → Activation**

Migration must not directly overwrite authoritative V2 data without the defined safeguards.

## 5. V1 Source Inventory

The V2 migration contract must preserve the known V1 sources:

- legacy storage key `cvData`;
- canonical V1 storage key `cv_estudent_v2_final`;
- V1 `window.cv` structure;
- V1 `window.cvVisibility` structure;
- V1 theme state;
- V1 repeatable arrays;
- V1 template selection;
- relevant migration version information.

The known V1 model includes personal information, summary, photo, education, experience, projects, skills, languages, and achievements, together with visibility state.

## 6. V1 Mapping Rules

Conceptual mapping:

| V1 source | V2 destination |
|---|---|
| `window.cv` | Master Profile / Career Data |
| `window.cvVisibility` | Targeted CV / Document Configuration |
| V1 personal fields | Canonical profile/contact fields |
| V1 education array | Education repeatable entries |
| V1 experience array | Experience repeatable entries |
| V1 projects array | Project repeatable entries |
| V1 skills array | Skills collection/entries |
| V1 languages array | Language entries |
| V1 achievements array | Achievement entries |
| V1 photo | Profile/media asset |
| V1 theme color | Presentation/theme configuration |
| V1 selected template | Template reference after compatibility resolution |
| V1 migration version | Source/migration provenance |

The exact storage representation is intentionally outside this contract.

## 7. V1 Visibility Mapping

V1 visibility information must not be confused with deletion.

V1 section visibility maps conceptually to Targeted CV/document visibility.

V1 field visibility maps conceptually to document field visibility.

If a V1 field was hidden, its underlying career value must remain available unless the user explicitly deletes it.

## 8. V1 Template Migration

V1 template selection must be resolved against the V2 Template Compatibility Contract.

Possible outcomes:
- compatible template selected automatically;
- adapter required;
- template asset reconciliation required;
- template unavailable and alternative selection required;
- user must explicitly choose another presentation.

Migration must not delete career content merely because a selected V1 template is not yet V2-compatible.

## 9. Legacy Storage Detection

Where multiple V1 representations exist, the migration process should:

1. detect available source representations;
2. identify their schema/version;
3. determine which source is authoritative for that V1 state;
4. validate the source;
5. preserve source provenance;
6. map into V2;
7. report conflicts rather than silently choosing uncertain data.

A migration must not assume that a key name alone proves source validity.

## 10. Conflict Resolution

If multiple sources contain conflicting values, the migration process must not silently overwrite one with another.

Possible resolution outcomes:
- deterministic V1 precedence where formally known;
- user review;
- retain both values with provenance;
- unresolved conflict.

The system should explain which source supplied the value when that information is available.

## 11. Migration Versioning

Every migration must be associated conceptually with:

- source type;
- source schema/version;
- migration contract/version;
- target canonical version;
- migration timestamp/context;
- validation outcome.

A future migration must be able to identify whether a source has already been transformed.

## 12. Migration Idempotency

A migration should be designed so that repeating the same migration against the same unchanged source does not progressively corrupt or duplicate authoritative data.

Repeated migration must not:
- duplicate education entries;
- duplicate experience entries;
- duplicate skills;
- repeatedly transform values;
- destroy user edits;
- create uncontrolled template duplication.

If a migration is intentionally non-idempotent, that behavior must be explicit and controlled.

## 13. Import Pipeline

The conceptual external-import flow is:

**Source → Intake → Validation → Extraction/Parsing → Normalization → Confidence/Provenance → Review → Acceptance/Rejection → Canonical Data**

Import does not bypass review merely because extraction appears successful.

## 14. PDF/DOCX Import

PDF/DOCX import should support extraction of common career information where reliably identifiable, including:

- identity/contact information;
- summary;
- experience;
- education;
- skills;
- projects;
- certifications;
- achievements;
- publications;
- other recognized supported sections.

Extraction quality varies by document structure.

The system must not imply that every PDF/DOCX can be perfectly reconstructed.

## 15. Import Confidence

Where the extraction process can provide confidence, it may be associated with:

- field;
- repeatable entry;
- section;
- source region;
- extraction result.

Confidence should help prioritize review.

Confidence is not permission to bypass review.

## 16. Import Provenance

Imported information should retain provenance where practical.

Provenance may identify:
- source document;
- source type;
- source location/region;
- extraction method/context;
- import session;
- review state.

Provenance exists to support review, correction, and transparency.

## 17. Review and Acceptance

Imported information must be distinguishable from authoritative career information until accepted.

Conceptual review states:

**Imported → Needs Review → Accepted / Rejected / Partially Accepted / Unresolved**

Acceptance may occur at:
- field level;
- entry level;
- section level;
- import batch level where safe.

A batch-level acceptance action must not prevent selective review where uncertainty exists.

## 18. Partial Acceptance

The system must support accepting some extracted information while rejecting other information.

Example:

- accept name;
- accept email;
- accept education;
- reject an incorrectly extracted employer;
- manually correct a date.

Partial acceptance must not require accepting the entire imported document.

## 19. User Correction

Users must be able to correct imported information before or during acceptance.

A corrected value becomes user-controlled content.

Where useful, the original extracted value and provenance may remain available for audit/review purposes.

## 20. Unsupported or Unrecognized Content

If imported content cannot be mapped confidently:

- preserve the source document where retention permits;
- mark the content unresolved;
- provide a review path;
- allow manual entry where appropriate;
- never silently discard potentially meaningful career information.

The system may preserve an unstructured source note or equivalent review representation without treating it as authoritative structured data.

## 21. Asset Migration and Import

Assets require separate handling.

Examples:
- profile photo;
- embedded document images;
- source PDF;
- source DOCX;
- template assets.

Rules:
- source assets remain distinguishable from generated assets;
- private user assets remain private unless explicitly published;
- failed extraction must not delete the original source;
- migrated profile photos retain their association with the relevant profile/document where supported.

## 22. Schema Evolution

The V2 canonical model will evolve.

Schema/data evolution must use explicit migration definitions.

A future canonical version must not reinterpret old data silently.

Each migration should conceptually define:
- source version;
- target version;
- supported transformations;
- deprecated fields;
- new fields;
- compatibility behavior;
- validation rules;
- rollback/recovery strategy.

## 23. Unknown and Deprecated Fields

If an older source contains a field no longer directly supported:

- preserve its value where possible;
- map it to an equivalent semantic field if formally defined;
- retain it as custom data where appropriate;
- mark it unresolved if semantic meaning is uncertain.

Deprecated fields must not simply disappear during migration.

## 24. Data Loss Classification

Migration/import validation should classify outcomes as:

### No Loss
All source information has an accepted canonical representation.

### Representational Change
Information remains semantically intact but its presentation/storage representation changes.

### Explicit User Rejection
User intentionally rejected imported information.

### Unsupported but Preserved
Information cannot currently be represented in the active structured model but remains preserved for future review/recovery.

### Unresolved
The system cannot confidently determine the semantic mapping.

### Loss/Error
Information was unintentionally lost or corrupted.

**Loss/Error is a migration failure and must block a successful migration result.**

## 25. Zero-Silent-Loss Rule

A migration/import is not considered successful merely because the application loads afterward.

Success requires evidence that:

1. source data was identified;
2. source version was recognized;
3. fields/entries were mapped;
4. unsupported data was accounted for;
5. assets were accounted for;
6. visibility was preserved;
7. template references were resolved;
8. validation completed;
9. no unintended loss occurred.

## 26. Migration Validation

Validation should compare source and target conceptually across:

- scalar values;
- repeatable entry counts;
- repeatable entry identity;
- field values;
- visibility;
- ordering where semantically required;
- assets;
- template/theme configuration;
- custom/unknown data;
- provenance;
- version metadata.

Validation should identify:
- missing values;
- duplicated values;
- changed values;
- reordered values;
- unsupported values;
- unresolved values.

## 27. Rollback and Recovery

Migration must be recoverable.

Before a destructive transformation, the system should maintain a recoverable source state or equivalent reversible representation.

If validation fails:
- do not mark migration successful;
- preserve the source;
- report the failure;
- allow retry after correction;
- avoid partial activation as authoritative state unless explicitly designed and controlled.

## 28. V1 Golden Baseline Migration Tests

Known V1 test data should be migrated and compared against the V1 Golden Baseline for:

- personal information;
- summary;
- education;
- experience;
- projects;
- skills;
- languages;
- achievements;
- photo;
- visibility;
- theme;
- template selection;
- preview;
- PDF/print behavior where applicable.

The migration must preserve behavior even though V2 internal architecture is different.

## 29. Import Quality Boundaries

PDF/DOCX import must not claim perfect extraction.

The product should communicate that:
- document structure varies;
- extraction confidence can differ by field;
- complex layouts may require manual correction;
- tables, columns, icons, images, and unusual typography can affect extraction;
- user review remains authoritative.

## 30. Security and Privacy Boundaries

Imported files may contain sensitive career and personal information.

The import contract therefore requires:
- controlled file handling;
- appropriate validation;
- access control;
- privacy-aware retention;
- secure processing boundaries;
- safe error handling;
- no unnecessary inclusion of imported content in analytics.

Implementation-specific security controls belong to later specifications.

## 31. V1-to-V2 Migration Acceptance Criteria

V1 migration is accepted only when:

1. supported V1 source versions are detected;
2. canonical V1 data maps to V2;
3. visibility is preserved;
4. repeatable entries are preserved;
5. photo/assets are accounted for;
6. theme is preserved where supported;
7. template compatibility is resolved;
8. unknown/deprecated fields are preserved or explicitly classified;
9. source provenance is retained where required;
10. validation finds no unintended loss;
11. recovery remains possible;
12. Golden Baseline regression checks pass.

## 32. Import Acceptance Criteria

An external import is accepted only when:

1. the source is validated;
2. extraction results are distinguishable from authoritative data;
3. confidence/provenance are retained where available;
4. user review is available;
5. partial acceptance is supported;
6. corrections can be made;
7. unsupported information is preserved;
8. the original source is not silently destroyed;
9. accepted information enters the canonical model correctly.

## 33. Domain Invariants

1. Migration preserves semantics.
2. Import does not automatically create authoritative career facts.
3. V1 visibility is not deletion.
4. Unsupported fields are preserved or explicitly classified.
5. Unknown mappings are not silently guessed as fact.
6. Conflicts are not silently overwritten.
7. Repeated migration must not duplicate data.
8. User corrections become user-controlled content.
9. Original import sources remain recoverable according to retention rules.
10. Failed validation cannot be presented as successful migration.
11. V1 templates are resolved through the Template Compatibility Contract.
12. Migration never requires reuse of V1 architecture.
13. PDF/DOCX extraction confidence is not certainty.
14. Imported data must not be used as analytics payload merely because it is available.
15. No implementation technology is selected by this contract.

## 34. Approval Gate

Review this contract with:
- V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md
- V2_DOMAIN_AND_DATA_CONTRACT_SPECIFICATION.md
- V2_DOCUMENT_LIFECYCLE_AND_STATE_CONTRACT.md
- V2_TEMPLATE_COMPATIBILITY_AND_CAPABILITY_CONTRACT.md
- V2_LAYOUT_AND_PAGINATION_CONTRACT.md
- V1_FUNCTIONALITY_PRESERVATION_INVENTORY.md
- SOURCE_BASELINE_AND_SECURITY.md

After approval, continue with the **V2 Intelligence, AI Safety and Provenance Contract**.

**No application code is introduced by this milestone.**
