# M0 — V1 Baseline, Asset and Security Reconciliation

**Status:** Controlled pre-implementation gate  
**Purpose:** Establish the minimum verified V1 baseline required before M1 coding  
**Implementation status:** No application code introduced

## 1. Gate Objective

M0 establishes that V2 has a trustworthy V1 reference and that known V1 security and asset issues are not carried into implementation.

M0 does not redesign V1 and does not begin V2 application coding.

## 2. Verified V1 Baseline Inventory

The audited V1 source baseline identified the principal source assets:

- bridge.php
- builder.html
- builder.js
- builder-mobile-engine.js
- builder-desktop-engine.js
- builder-ui-styles.css
- index.php
- icons/builder-icons.js
- icons/builder-icons.css
- api/track-event.php
- api/report.php
- sitemap.xml
- V1 template assets
- DOCX/template assets
- preview/demo assets

The V1 preservation inventory and source-baseline documentation remain the authoritative audit references.

## 3. V1 Functional Baseline

The baseline includes, at minimum:

- canonical CV data;
- visibility state;
- repeatable sections;
- template registry;
- template compiler behavior;
- field visibility;
- section visibility;
- themes;
- photo handling;
- live preview;
- mobile preview;
- desktop preview;
- A4 behavior;
- PDF generation;
- print/PDF behavior;
- existing tracking/reporting behavior;
- local persistence and migration behavior.

## 4. Canonical V1 Data Fixture

A sanitized representative fixture must contain:

### Personal
- name;
- job title;
- email;
- phone;
- WhatsApp;
- address;
- date of birth;
- CNIC;
- religion;
- LinkedIn;
- website.

### Content
- summary;
- education;
- experience;
- projects;
- skills;
- languages;
- achievements.

### Configuration
- section visibility;
- field visibility;
- theme;
- selected template;
- migration/version metadata.

No production personal data should be used.

## 5. Golden Baseline Fixture Set

The baseline fixture set should contain at least:

- Fixture A — Minimal CV
- Fixture B — Complete CV
- Fixture C — Long CV
- Fixture D — Visibility Matrix
- Fixture E — Theme Matrix
- Fixture F — Template Matrix
- Fixture G — Mobile Preview
- Fixture H — Desktop Preview
- Fixture I — Export

## 6. Template Reconciliation

The V1 audit identified source/archive gaps that must be explicitly resolved before those templates are marked fully reproducible:

- T01 ATS template source;
- T01 Simple template source;
- ATS preview asset;
- demo profile image asset/extension mismatch.

For each gap, the disposition must be one of:

1. recovered from the original V1 source;
2. recovered from another authoritative V1 copy;
3. formally replaced by an approved compatibility asset;
4. explicitly retired by governance decision.

No silent recreation is permitted.

## 7. Template Compatibility Record

Every preserved V1 template must have:

- template ID;
- source location;
- recovery status;
- V2 compatibility status;
- supported V1 fields;
- supported V1 sections;
- visibility behavior;
- theme behavior;
- photo behavior;
- page model;
- PDF capability;
- print capability;
- DOCX capability where applicable;
- known limitations;
- Golden Baseline evidence.

## 8. Security Reconciliation

The V1 audit identified plaintext database credentials in:

- api/track-event.php
- api/report.php

These credentials must be treated as exposed.

Required actions before source reuse:

1. rotate/revoke affected production credentials;
2. remove secrets from source;
3. establish secure configuration;
4. inspect repository history for exposed credentials;
5. confirm no secret is copied into V2;
6. revalidate tracking/reporting using non-secret test configuration.

## 9. Repository Safety Gate

Before M1 source implementation:

- no production credentials in source;
- no private CV data in repository fixtures;
- no real account passwords/tokens;
- no unnecessary personal information;
- required V1 assets are sanitized;
- test fixtures are synthetic or sanitized.

## 10. Migration Baseline

M0 must preserve the known V1 storage inputs:

- legacy cvData;
- canonical cv_estudent_v2_final;
- window.cv;
- window.cvVisibility;
- theme data;
- repeatable arrays;
- template selection;
- migration version.

The original source data must remain recoverable until migration success is established.

## 11. M0 Validation Matrix

| Area | Required evidence | Gate |
|---|---|---|
| V1 source inventory | Audited inventory | Required |
| V1 data model | Fixture | Required |
| Visibility | Fixture matrix | Required |
| Templates | Template inventory | Required |
| Missing assets | Disposition record | Required |
| Themes | Theme fixture | Required |
| Mobile | Baseline evidence | Required |
| Desktop | Baseline evidence | Required |
| PDF | Baseline artifact | Required |
| Migration inputs | Legacy fixtures | Required |
| Secrets | Security scan/reconciliation | Required |
| Repository safety | Clean baseline | Required |

## 12. M0 Completion Rule

M0 is complete only when all required evidence exists.

Known asset gaps or credential exposure cannot be marked complete merely because implementation can proceed around them.

## 13. Current M0 Status

### Confirmed
- V1 source inventory has been audited.
- V1 functional preservation inventory exists.
- V1 UI/CSS preservation contract exists.
- V1 source/security audit exists.
- V1 data model has been recovered.
- V1 template registry has been recovered.
- V1 export behavior has been documented.
- V2 architecture and implementation blueprint are complete.

### Still requiring external/source verification
- recovery/disposition of the four identified missing V1 assets;
- actual production credential rotation/revocation;
- repository-history secret verification;
- creation of the final Golden Baseline fixture/evidence package.

These items require access to the original V1 files/environment or an authoritative V1 copy and must not be fabricated.

## 14. M0 Gate Decision

**M0 Architecture/Planning Readiness: PASS**

**M0 Source/Security/Golden-Baseline Readiness: CONDITIONAL**

Reason: the architecture is ready, but the known V1 asset and security evidence gaps cannot be truthfully marked resolved without the authoritative source/environment.

Therefore:

> **M1 implementation should begin only after the conditional M0 items are explicitly closed.**

## 15. M1 Entry Criteria

Before the first V2 application-code commit:

- [ ] Missing V1 assets reconciled
- [ ] Production credentials rotated/revoked
- [ ] V2 source confirmed secret-free
- [ ] Golden Baseline fixtures created
- [ ] Template compatibility inventory completed
- [ ] Representative baseline outputs captured
- [ ] Migration fixtures prepared

## 16. M1 Scope Reminder

Once M0 is closed, M1 begins with:

**Canonical Career Document Core**

including:
- Master Profile;
- Targeted CV;
- Document Configuration;
- sections/fields;
- repeatable entries;
- custom sections/fields;
- visibility;
- ordering;
- presentation configuration;
- versioning foundation.

M1 does not begin with:
- ATS;
- Job Match;
- AI generation;
- public CV;
- monetization;
- broad UI redesign.

## 17. Governance Rule

No one should mark M0 complete by assumption.

If an item cannot be verified, it must remain explicitly **unverified/conditional**.

This protects the V2 project from creating a false baseline and discovering the same V1 gaps later during implementation.

**No application code is introduced by this milestone.**
