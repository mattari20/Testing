# V2 Document Lifecycle and State Contract

**Status:** Proposed for architecture approval  
**Scope:** Technology-neutral lifecycle/state contract  
**Implementation status:** Documentation only; no application code

## 1. Purpose

This document defines the lifecycle and state boundaries for major CV Builder V2 domain objects.

It answers:

- what states an object may conceptually occupy;
- which transitions are allowed;
- which transitions require user confirmation;
- which states are authoritative;
- how drafts, versions, recovery, publishing, analysis, and exports remain separate;
- how V1 behavior maps into the V2 lifecycle.

This is not a database workflow, API specification, framework design, or implementation recipe.

## 2. Core Lifecycle Principles

1. **Draft is normal.** Users may create incomplete documents without being forced into a publish/complete state.
2. **Authoritative data is explicit.** Imported or AI-generated information does not become authoritative merely because it exists.
3. **Configuration is separate from source data.** A Targeted CV can change without corrupting the Master Profile.
4. **Versioning is controlled.** Significant document/profile changes can be represented without silently rewriting historical artifacts.
5. **Recovery is first-class.** Autosave and recovery must protect user work.
6. **Export is an output operation.** Export does not mutate source career data.
7. **Analysis is a snapshot/result.** ATS and Job Match findings do not become career facts.
8. **Publishing is optional and controlled.** Public online CV functionality must not be assumed for ordinary private CV creation.
9. **Deletion is deliberate.** Destructive actions require explicit handling and must not be confused with hiding content.
10. **No silent loss.** Unsupported content remains preserved even when a selected template or state cannot display it.

## 3. Master Career Profile Lifecycle

The Master Profile is the authoritative reusable career record.

### Conceptual states

**New → Draft/Active → Archived → Deleted**

The normal working state is **Active**.

### State meanings

- **New:** Profile has been initialized but contains little or no user-approved career data.
- **Draft/Active:** Profile is available for editing and use as a source for documents.
- **Archived:** Profile is retained but no longer the active working profile.
- **Deleted:** Profile has been explicitly deleted under the product's retention/deletion rules.

### Rules

- A profile may be active even when incomplete.
- Analysis may inspect profile data but does not change its authoritative state.
- Import results must pass review before entering authoritative profile data.
- AI suggestions remain non-authoritative until accepted.
- Archiving a profile must not delete documents that were previously generated from it.
- Deleting a profile must follow explicit data-retention and artifact rules.

## 4. Targeted CV Lifecycle

A Targeted CV is a configured document derived from the Master Profile.

### Conceptual states

**Created → Draft → Ready → Archived → Deleted**

### State meanings

- **Created:** Configuration exists but has not necessarily been edited.
- **Draft:** User is actively editing/configuring the document.
- **Ready:** User has a coherent document configuration suitable for preview/export; this does not guarantee ATS performance or job suitability.
- **Archived:** Retained for reference but not part of the active working set.
- **Deleted:** Explicitly removed according to product rules.

### Important distinction

**Ready does not mean:**
- ATS guaranteed;
- error-free;
- job-match optimized;
- professionally reviewed;
- published online.

It only describes the document's lifecycle state.

## 5. Document Version Lifecycle

A document may have multiple versions.

### Conceptual states

**Working Version → Saved Version → Superseded Version → Retained/Archived**

A generated export can reference the exact document version used to produce it.

### Rules

- Autosave may update the working state without creating a user-visible version every time.
- A deliberate checkpoint may create a saved version.
- A later saved version may supersede an earlier version.
- Historical versions must remain logically distinct where version history is offered.
- Reverting to a prior version must not silently modify the Master Profile unless the user explicitly chooses to apply changes to it.

## 6. Section and Field Lifecycle

Section/field visibility and deletion are separate concepts.

### Visibility states

**Visible ↔ Hidden**

Hidden content remains in authoritative data.

### Content states

**Present → Edited → Replaced or Removed**

### Rules

- Hiding a field is not deletion.
- Removing an entry from a Targeted CV does not automatically delete it from the Master Profile.
- Deleting authoritative Master Profile data is a separate explicit operation.
- A template's inability to display a field is not equivalent to user deletion.
- Unsupported content must produce an explicit compatibility result where appropriate.

## 7. Imported Data Lifecycle

Imported content requires stronger provenance than ordinary user-entered data.

### Conceptual states

**Discovered → Parsed → Needs Review → Accepted / Rejected / Partially Accepted → Authoritative or Discarded**

### Rules

- Parsed data is not authoritative.
- Low-confidence extraction should remain reviewable.
- Partial acceptance must be possible where practical.
- Acceptance transfers selected information into the authoritative career model.
- Rejection must not delete the original source artifact unless the user explicitly chooses deletion.
- Imported provenance should remain available where needed to explain or correct an accepted value.

## 8. AI Suggestion Lifecycle

AI output is explicitly non-authoritative until user acceptance.

### Conceptual states

**Requested → Generated → Presented → Accepted / Rejected / Edited → Applied**

### Rules

- Generated content must be distinguishable from user-authored content.
- User editing of a suggestion creates user-controlled content.
- Acceptance requires an explicit or clearly user-initiated action.
- AI output must not silently overwrite authoritative content.
- Rejected suggestions must not later reappear as authoritative content.
- AI provenance should remain available where necessary for transparency.
- Anti-fabrication rules from the domain contract remain mandatory.

## 9. ATS Analysis Lifecycle

ATS analysis is an analytical result, not a document state.

### Conceptual states

**Requested → Processing → Completed / Failed / Superseded**

### Rules

- Analysis is associated with a particular document version/configuration.
- A new document version may require a new analysis.
- Older results may remain available as historical snapshots.
- An analysis result must not silently update CV content.
- Findings may recommend changes, but user action is required before authoritative content changes.

## 10. Job Match Lifecycle

Job matching is also a separate analytical process.

### Conceptual states

**Created → Analyzing → Completed / Failed / Superseded**

A Job Match result should reference the relevant:
- Targeted CV/document version;
- Job Description snapshot;
- analysis version/context.

A later edit to the CV or Job Description must not silently rewrite a historical match result.

## 11. Cover Letter Lifecycle

### Conceptual states

**Draft → Ready → Archived → Deleted**

Cover letters may have multiple saved versions.

AI-generated cover-letter content follows the same suggestion/approval rules as other AI assistance.

A cover letter may be associated with a Targeted CV and Job Description without becoming part of the CV's authoritative career data.

## 12. Template Lifecycle

Templates have a controlled publishing lifecycle.

### Conceptual states

**Draft → Testing → Published → Deprecated → Retired**

### Rules

- Draft templates are not generally available as normal production choices.
- Testing templates require compatibility validation.
- Published templates are eligible for supported product use.
- Deprecated templates may remain available to existing documents while new selection is controlled.
- Retired templates must remain traceable for existing documents where historical reproduction requires them.
- Template retirement must not delete user career data.

## 13. Template Compatibility Lifecycle

A template can also have a compatibility assessment relative to V2.

### Conceptual outcomes

- V2-Compatible
- Adapter Required
- Asset Reconciliation Required
- Not Yet Compatible
- Retired by Explicit Decision

These outcomes describe compatibility, not template quality.

Existing V1 templates must pass the defined compatibility/visual regression process before being treated as stable V2 template assets.

## 14. Export Lifecycle

### Conceptual states

**Requested → Preparing → Rendering → Validating → Completed / Failed**

An export may also be cancelled where the product supports cancellation.

### Rules

- Export references a specific document configuration/version and template version.
- Export validation must not mutate the source document.
- A failed export does not imply that the CV data is invalid or lost.
- Completed artifacts may be retained independently from later document edits.
- Re-exporting after document changes creates a new artifact context.

## 15. Online CV / Public Profile Lifecycle

Online/public CV is separate from ordinary document editing.

### Conceptual states

**Private → Link-Only / Controlled Sharing → Public → Unpublished / Archived → Deleted**

Exact availability may depend on product capabilities.

### Rules

- A private CV must not become public by default.
- Public visibility is an explicit user-controlled state.
- Search-engine visibility must be separately controllable where supported.
- Unpublishing must not delete the underlying Targeted CV.
- Public analytics must not expose private CV data through analytics events.

## 16. Product and Entitlement Lifecycle

### Product
Conceptually:

**Draft → Available → Unavailable / Retired**

### Entitlement
Conceptually:

**Pending → Active → Suspended / Revoked / Expired**

The exact commercial implementation is outside this contract.

Feature access must be evaluated through entitlement boundaries rather than hard-coded template or renderer assumptions.

## 17. Analytics Event Lifecycle

Analytics events are immutable observations once recorded, subject to privacy/retention rules.

Conceptually:

**Generated → Accepted for Processing → Retained / Expired**

An analytics event must not become a source of authoritative career data.

## 18. Deletion and Archival Rules

Deletion and archival are distinct.

### Archive
Retains the object for future reference but removes it from normal active workflows.

### Delete
Explicitly removes the object according to applicable retention and dependency rules.

### Dependency principles

Before destructive deletion, the system must account for dependent objects such as:
- exports;
- public CVs;
- cover letters;
- analysis results;
- imported source files;
- template references;
- historical versions.

A dependency may require:
- retaining a historical snapshot;
- removing a dependent public representation;
- warning the user;
- or blocking deletion until an explicit decision is made.

No destructive cascade may silently remove unrelated authoritative career data.

## 19. Recovery and Autosave

Autosave is a protection mechanism, not the same as user-visible version history.

The system should conceptually support:

**Editing → Autosaved Working State → Recovery Available**

Recovery should allow the user to restore recoverable work without silently replacing newer authoritative content.

A crash or interrupted session must not be interpreted as user deletion.

## 20. State Transition Governance

Every destructive or authority-changing transition must be explicit.

Particularly sensitive transitions include:
- imported → accepted;
- AI suggestion → applied;
- Master Profile deletion;
- Targeted CV deletion;
- public → private;
- private → public;
- entitlement activation/revocation;
- template retirement;
- applying a historical version.

The system must not infer these transitions from passive rendering or analysis.

## 21. V1 Compatibility Mapping

| V1 behavior | V2 lifecycle interpretation |
|---|---|
| localStorage autosave | Working/Autosaved State |
| resetData | Explicit user reset/deletion operation |
| visibility toggles | Hidden/Visible state |
| add/remove array items | Targeted document content editing |
| template switching | Presentation/template transition |
| theme switching | Presentation configuration transition |
| mobile/desktop preview | Non-authoritative presentation state |
| PDF generation | Export lifecycle |
| desktop print | Export/print lifecycle |
| migration from legacy key | Import/Migration lifecycle |
| tracking API | Analytics Event lifecycle |

V1 implementation details are not prescribed for V2.

## 22. Lifecycle Invariants

1. Draft and incomplete documents remain valid working states.
2. Ready is not an ATS or job-match guarantee.
3. Hidden content remains preserved unless explicitly deleted.
4. Targeted CV deletion does not imply Master Profile deletion.
5. Template switching does not delete unsupported career data.
6. AI-generated content is not authoritative until accepted.
7. Imported content is not authoritative until reviewed.
8. ATS and Job Match results are snapshots tied to their source context.
9. Export artifacts do not mutate source data.
10. Public visibility is never the implicit default for private documents.
11. Archiving does not equal deletion.
12. Destructive transitions must account for dependencies.
13. Recovery must not silently overwrite newer authoritative work.
14. Historical artifacts remain traceable to relevant document/template versions where required.
15. V1 behavior remains represented by the preservation contract.
16. No implementation technology is selected by this document.

## 23. Approval Gate

This contract should be reviewed with:
- V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md
- V2_DOMAIN_AND_DATA_CONTRACT_SPECIFICATION.md
- V1_TO_V2_MASTER_RECONCILIATION.md
- V1_FUNCTIONALITY_PRESERVATION_INVENTORY.md
- V1_UI_CSS_PRESERVATION_CONTRACT.md

After approval, continue with the Template Compatibility and Capability Contract.

**No application code is introduced by this milestone.**
