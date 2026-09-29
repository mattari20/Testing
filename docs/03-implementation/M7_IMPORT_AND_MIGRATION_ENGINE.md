# M7 — Import and Migration Engine

**Status:** Implementation foundation complete; external document extraction adapters pending.

## 1. Objective

M7 establishes the V2 import/migration boundary for V1 native migration, structured import, and future PDF/DOCX extraction. It enforces the zero-silent-loss principle and keeps imported information separate from authoritative career data until acceptance.

## 2. Implemented

Added:

- `src/import/import-migration-engine.js`
- `tests/m7/import-migration.test.js`

The engine provides:

- source-category detection;
- V1 source normalization;
- V1 → V2 canonical migration;
- V1 visibility preservation;
- V1 theme/template reference preservation;
- migration provenance and fingerprinting;
- migration validation/reporting;
- idempotency detection;
- PDF/DOCX/structured import candidate boundary;
- review states;
- acceptance and partial acceptance;
- loss classification.

## 3. V1 Preservation

The migration maps the known V1 categories:

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
- selected template reference.

V1 hidden fields remain in the canonical data and are represented as targeted-CV configuration. They are not deleted.

## 4. External Import Boundary

PDF and DOCX are represented as import source categories, but this milestone does **not** claim that a PDF/DOCX parser has been implemented.

External extracted data remains an import candidate with:

**Imported → Needs Review → Accepted / Rejected / Partially Accepted / Unresolved**

User acceptance is required before imported information becomes authoritative career data.

## 5. Zero-Silent-Loss Rules

M7 blocks the architecture from treating “application loaded” as proof of successful migration.

Migration reports retain:

- source type/version;
- source fingerprint;
- mapped sections;
- entry counts;
- validation;
- unresolved items;
- loss classification.

Loss/Error is never represented as successful migration.

## 6. Important Boundary

No PDF/DOCX extraction technology is selected here. Parser/extractor adapters will be integrated later behind this boundary.

V1 asset reconciliation and Golden Baseline migration comparison remain open gates.

## 7. Acceptance Gate

M7 foundation is complete when:

- V1 migration maps known V1 categories;
- visibility is preserved as configuration;
- template references remain traceable;
- migration has validation/provenance;
- repeated migration can be detected;
- external import requires review;
- partial acceptance is supported;
- unsupported/unresolved data can be classified;
- no parser technology is hard-coded into the core.
