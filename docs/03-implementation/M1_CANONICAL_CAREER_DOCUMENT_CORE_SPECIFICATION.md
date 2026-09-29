# M1 — Canonical Career Document Core Specification

**Status:** Implementation-ready specification  
**Stage:** M1 — Canonical Career Document Core  
**Purpose:** Define the first V2 implementation boundary from the approved architecture contracts.

## 1. Objective

Build the V2 canonical document/data core that becomes the authoritative source for all later preview, template, pagination, export, migration, intelligence, and career-layer engines.

M1 establishes the data model and mutation boundaries. It does not implement presentation, export, ATS, Job Match, AI generation, public CVs, monetization, or broad UI redesign.

## 2. Source-of-Truth Hierarchy

M1 follows, in order:

1. V2 architecture contracts and implementation blueprint.
2. V1 Golden Baseline for preserved behavior and migration compatibility.
3. This M1 specification.
4. Implementation details only where they do not contradict the above.

V1 source code is a behavioral/reference baseline, not the V2 architecture.

## 3. Core Domain Objects

M1 establishes these conceptual objects:

### Master Career Profile
Authoritative career information owned by the user.

Contains structured career data, reusable sections, assets/references, and profile metadata.

### Targeted CV
A distinct document derived from the Master Career Profile.

A Targeted CV does not own a second incompatible copy of the user's career truth.

### Document Configuration
Defines how a Targeted CV selects, orders, hides, and presents information.

Includes:
- selected content;
- section order;
- field visibility;
- entry visibility;
- presentation variant selections;
- template reference;
- document-level presentation configuration.

### Section
A semantic group of related career information.

### Field
A named semantic value within a section.

### Repeatable Entry
An independently ordered item in a repeatable section such as education, experience, projects, skills, certifications, or publications.

### Custom Section / Custom Field
User-defined career information that cannot be represented by predefined structures.

Custom information must remain preserved even when a template cannot display it.

## 4. V1 Compatibility

M1 must accept the known V1 concepts:

- personal information;
- summary;
- photo;
- education;
- experience;
- projects;
- skills;
- languages;
- achievements;
- visibility settings;
- theme;
- template selection;
- repeatable ordering.

Known V1 storage keys and migration semantics remain governed by the approved Import and Migration Contract.

M1 must not directly reproduce the V1 fixed-schema implementation.

## 5. Visibility vs Deletion

Visibility is a presentation/document decision.

Deletion is a data mutation.

Hiding a field or section from a Targeted CV must never delete it from the Master Career Profile.

Removing an item from a targeted document must not silently destroy authoritative career data unless the user explicitly performs a destructive profile-level deletion.

## 6. Ordering

M1 supports independent ordering for:

- sections;
- repeatable entries;
- applicable fields.

Ordering belongs to document configuration where it affects presentation.

Master Profile source ordering and Targeted CV presentation ordering must not be conflated.

## 7. Custom Content

Custom sections and fields are first-class data.

They must support:
- semantic identity;
- user-entered value;
- ordering;
- visibility;
- repeatable entries where applicable;
- preservation across template changes;
- migration/import provenance where applicable.

No template may silently discard unsupported custom content.

## 8. Versioning Foundation

M1 establishes version-aware data boundaries so later lifecycle/version services can support:

- autosave/recovery;
- document revisions;
- migration;
- import review;
- rollback;
- export snapshots.

An export or analysis must operate against an identifiable document state rather than an uncontrolled live mutable state.

## 9. Mutation Rules

Authoritative career data may be changed only through explicit domain operations.

Presentation operations must not mutate authoritative profile data.

Template switching must not rewrite or delete career data.

Preview rendering must be read-oriented.

Analysis must be read-oriented unless an explicitly approved user action applies a suggestion.

AI suggestions remain separate from authoritative user data until user approval.

## 10. Invariants

M1 must enforce these invariants:

1. One canonical career-data source exists per user profile.
2. Targeted CVs may reuse Master Profile information without becoming incompatible duplicate truths.
3. Visibility never equals deletion.
4. Unsupported presentation never equals data loss.
5. Custom content is preserved.
6. Section and entry ordering is deterministic.
7. Every targeted document has identifiable configuration/state.
8. Future export/import/analysis can reference a stable document state.
9. V1 migration can map legacy data into the V2 model without silent loss.
10. No AI-generated value becomes authoritative without user approval.

## 11. Explicitly Out of Scope

M1 does not implement:

- ATS scoring/readiness;
- Job Match;
- AI generation;
- AI provider integration;
- PDF generation;
- DOCX generation;
- pagination/layout engine;
- public/online CV;
- cover letters;
- application tracking;
- payments/entitlements;
- ad system;
- final UI/CSS redesign.

These belong to later implementation stages in the approved blueprint.

## 12. M1 Acceptance Gate

M1 is complete only when:

- canonical profile/document structures exist;
- predefined and custom content can be represented;
- visibility and deletion semantics are separated;
- ordering is supported;
- targeted CV configuration is independent from Master Profile truth;
- V1 representative data can be represented without silent loss;
- document state can be identified/versioned sufficiently for downstream engines;
- automated/domain tests cover the M1 invariants;
- no later-stage engine is improperly coupled into the core.

## 13. M1 Implementation Sequence

1. Establish domain primitives.
2. Establish Master Career Profile.
3. Establish Targeted CV.
4. Establish Document Configuration.
5. Establish sections/fields/repeatable entries.
6. Establish custom sections/fields.
7. Establish visibility and ordering semantics.
8. Establish document-state/version foundation.
9. Add V1 compatibility fixtures.
10. Add invariant tests.
11. Review against all approved architecture contracts.
12. Only then expose the core to Stage 2 lifecycle/persistence work.

## 14. Change Control

Any request that changes the canonical domain model, ownership boundaries, lifecycle semantics, template/data separation, or V1 preservation behavior must be treated as an architecture change and reconciled against the approved contracts before implementation.

**M1 is the first controlled implementation milestone.**
