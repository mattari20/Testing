# V2 Layout and Pagination Contract

**Status:** Proposed for architecture approval  
**Scope:** Technology-neutral semantic layout and pagination contract  
**Implementation status:** Documentation only; no application code

## 1. Purpose

This contract defines how CV Builder V2 should conceptually transform a structured Targeted CV into stable, readable pages.

The objective is to replace V1's primarily rendered-image/page-slicing behavior with a semantic pagination model while preserving the V1 visual baseline where required.

> **Pagination is a semantic document-layout responsibility, not an after-the-fact image slicing operation.**

## 2. Layout Pipeline

The conceptual pipeline is:

**Career Data → Document Configuration → Template → Presentation Variants → Semantic Layout Blocks → Measurement → Page Flow → Paginated Document → Preview / PDF / Print / DOCX**

Each stage has a distinct responsibility.

- Career Data provides authoritative information.
- Document Configuration determines selected, visible, ordered, and configured content.
- Template defines presentation constraints and visual structure.
- Presentation Variants define representation of supported semantic content.
- Semantic Layout Blocks convert document content into meaningful units that can be measured and placed.
- Measurement determines space required by blocks.
- Page Flow places blocks across pages according to pagination rules.
- Paginated Document becomes the shared structural basis for preview and supported export paths.

## 3. Semantic Layout Blocks

V2 should reason about meaningful blocks rather than a single large rendered surface.

Examples:
- document header;
- profile/contact block;
- section heading;
- summary paragraph;
- experience entry;
- education entry;
- project entry;
- skill group;
- language entry;
- certification entry;
- publication entry;
- custom section entry;
- controlled spacer;
- page-break marker.

A block may contain nested sub-blocks.

Example:

**Experience Entry → employer/header → dates/location → role/title → description → achievement bullets**

The system must be able to keep semantically dependent content together where required.

## 4. Block Classification

Each block should conceptually declare:
- semantic type;
- parent section;
- ordering;
- minimum required space;
- preferred space;
- whether it may split;
- whether it should remain with related blocks;
- whether it may begin a page;
- whether it may end a page;
- priority when space is constrained.

The exact implementation is intentionally unspecified.

## 5. Keep-Together Rules

The pagination model must support semantic grouping.

Examples:
- section heading should remain with the first meaningful section content;
- experience role heading should remain with its associated content;
- education institution/degree should not be orphaned from its entry;
- bullet groups should avoid undesirable isolated bullets;
- image and directly associated identity information should remain compatible;
- custom blocks may declare their own grouping behavior.

Keep-together rules are constraints, not permission to create excessive whitespace indefinitely.

## 6. Splittable Content

Some content may legitimately span pages.

Examples:
- long summary;
- long experience description;
- long project description;
- long custom text.

The model must distinguish between:
- content that may split naturally;
- content that should remain intact;
- content that may split only at approved boundaries.

A long block should not automatically be shrunk into unreadable text merely to force it onto one page.

## 7. Orphan and Widow Prevention

The pagination system should prevent undesirable fragments such as:
- section heading alone at the bottom of a page;
- role heading without meaningful following content;
- one isolated bullet from a larger bullet group;
- education heading separated from its core entry;
- very small trailing fragments when a semantic alternative exists.

Where constraints conflict, the system should choose the least disruptive valid layout rather than silently dropping information.

## 8. Page Break Rules

The system should support:

### Automatic page breaks
Generated from available space and semantic constraints.

### Controlled/manual page breaks
Explicit document or presentation instructions where supported.

### Section-level page preferences
A section may prefer:
- start on a new page;
- avoid a new page;
- stay with the next block;
- remain compact.

### Template-level rules
Templates may define layout constraints that affect page flow.

Manual or template page-break preferences must not cause data deletion.

## 9. Page Model

Each page is conceptually defined by:
- page format;
- page dimensions;
- margins;
- usable content area;
- header/footer constraints where supported;
- placed semantic blocks;
- page-level decorations;
- overflow state.

A4 remains the primary V1-compatible page format.

Future formats may be supported without changing the semantic career model.

## 10. Margins and Safe Areas

The layout model must distinguish:
- physical page boundary;
- safe content area;
- template-defined margins;
- optional header/footer regions;
- content region.

Content must not be positioned merely according to raw screen dimensions.

The V1 794px/A4 assumptions are treated as compatibility references, not as the fundamental V2 domain model.

## 11. Measurement

Pagination requires measurement under the selected:
- template;
- typography;
- font metrics;
- presentation variant;
- page dimensions;
- margins;
- spacing;
- content length;
- image dimensions.

Measurement should occur before final page assignment wherever practical.

Measurement must not mutate authoritative career data.

## 12. Overflow Detection

The layout system must explicitly detect:
- block overflow;
- page overflow;
- container overflow;
- image overflow;
- unsupported content;
- impossible layout constraints.

Overflow must produce a known outcome.

It must not silently clip or delete content.

## 13. Overflow Resolution Order

Where space is insufficient, resolution should conceptually proceed through controlled layout options:

1. use available page space;
2. move a semantic block to the next page;
3. split only where the block permits splitting;
4. use a compatible presentation variant;
5. apply approved spacing adjustments;
6. apply approved template/layout alternatives;
7. expose a compatibility/layout warning if constraints remain unresolved.

The system must not use arbitrary text shrinking as the default solution.

## 14. Text Scaling Rule

V2 must avoid aggressive text reduction as a general pagination strategy.

If a template cannot fit content within reasonable presentation constraints, prefer:
- additional pages;
- semantic reflow;
- compatible variant;
- layout adjustment;
- template change;
- explicit user-visible warning.

Text must remain readable.

## 15. Image and Photo Handling

Images should have explicit layout constraints:
- intrinsic aspect ratio;
- maximum dimensions;
- minimum usable dimensions;
- crop/fit behavior;
- keep-with-content behavior;
- overflow behavior.

A profile photo that does not fit a particular template must not be deleted from the user's profile.

## 16. Multi-Column Layout

Templates may use:
- single column;
- two columns;
- other explicitly supported structures.

The pagination contract must define content flow for each supported structure.

Column layout must not imply that content ownership is divided.

If a two-column template cannot safely represent certain content, the compatibility system must surface the limitation.

## 17. Section Flow

A section is conceptually composed of:

**Section Identity → Section Heading → Section Content Blocks**

The layout engine should preserve this relationship.

When a section spans multiple pages, the system should support appropriate continuation behavior where the template provides it.

## 18. Repeated Page Elements

Templates may define repeated elements such as:
- page headers;
- page footers;
- page numbers;
- controlled branding elements.

Repeated elements must not consume content space unpredictably.

Their dimensions must be included in usable-page-area calculations.

## 19. Preview and Export Consistency

The same semantic pagination result should drive, or remain contractually aligned with:
- on-screen preview;
- PDF export;
- desktop print;
- supported DOCX export.

A preview that shows one page while PDF silently produces materially different page flow is considered a regression unless explicitly caused by an export-specific capability limitation.

## 20. Responsive Preview

Responsive preview is a presentation scaling problem, not a document-model problem.

The semantic page remains based on its document format.

**A4 page → responsive viewport scaling**

not:

**viewport width → redefine CV page dimensions**

This preserves predictable export behavior.

## 21. Mobile and Desktop Compatibility

V1's separate mobile and desktop rendering mechanisms may be replaced internally by a shared V2 semantic layout contract.

The V2 target is:

**One canonical document model + shared semantic pagination + platform-specific presentation/export adapters**

rather than two independent sources of truth.

## 22. Page Navigation

Where multi-page preview is available, the conceptual system should support:
- current page;
- total pages;
- page navigation;
- page thumbnails where useful;
- zoom;
- page-level visual inspection.

Navigation state must not modify document content.

## 23. Manual Page Breaks

Manual page breaks may be supported as document configuration.

They should be represented semantically rather than as arbitrary pixel offsets.

Manual page breaks must remain editable and must not become destructive layout hacks.

## 24. Pagination Stability

Minor content changes should produce predictable layout changes.

The system should avoid unnecessary page reshuffling when a small edit does not materially affect earlier content.

Where exact stability cannot be guaranteed, behavior should remain deterministic for the same document/template/version inputs.

## 25. Determinism

Given the same:
- document version;
- template version;
- presentation configuration;
- content;
- layout rules;
- font/resource set;

the pagination result should be reproducible within the defined rendering tolerance.

This is important for:
- visual regression;
- export validation;
- debugging;
- historical document reproduction.

## 26. Template Compatibility Boundary

The Layout/Pagination Engine consumes template capabilities but does not silently override them.

Examples:
- a template may prohibit a certain variant;
- a template may require a specific column structure;
- a template may provide a fixed photo area;
- a template may define minimum spacing.

When constraints cannot be satisfied, the system should produce a compatibility result rather than silently corrupting content.

## 27. Presentation Variant Interaction

A presentation variant can materially affect page flow.

Therefore pagination must occur after the effective variant configuration is known.

Changing:

**Skills: text → progress representation**

may alter height and therefore page count.

Changing variants must not alter the underlying skill facts.

## 28. Page Count

Page count is an output property of:

**Content + Template + Variants + Layout Rules + Page Format**

It is not a fixed property of the CV itself.

The system must allow dynamic page counts.

No universal rule such as “every CV must be exactly one page” should override semantic content preservation.

## 29. Dense and Sparse Documents

The layout model must support both:
- short CVs with intentional whitespace;
- long CVs requiring multiple pages.

It should avoid artificial compression of sparse documents and aggressive compression of dense documents.

## 30. Accessibility Considerations

Semantic layout should support:
- logical reading order;
- meaningful headings;
- accessible text;
- sufficient contrast;
- non-destructive visual hierarchy;
- accessible exported structure where supported.

Visual placement must not become the only representation of semantic relationships.

## 31. V1 Golden Baseline Compatibility

During core V2 migration, existing V1 templates should retain their visual structure where compatible.

Validation should compare:
- page dimensions;
- margins;
- typography;
- spacing;
- section positions;
- columns;
- photo treatment;
- colors;
- page breaks;
- PDF output.

Intentional V2 improvements must be explicitly classified.

The V1 baseline remains the compatibility reference until the controlled final UI/CSS modernization phase.

## 32. V1-to-V2 Pagination Mapping

| V1 mechanism | V2 contract |
|---|---|
| CSS A4 dimensions | Page format + page geometry |
| @page rules | Export/page-format contract |
| browser print pagination | Semantic pagination + export adapter |
| mobile canvas slicing | Shared semantic pagination + PDF export |
| 794px design width | Compatibility/rendering reference |
| 1123px design height | Compatibility/rendering reference |
| page-break CSS rules | Semantic block/page-break constraints |
| overflow detection | Explicit layout/overflow state |
| page count by rendered height | Dynamic semantic page count |
| iframe print | Export/print presentation adapter |

## 33. Layout Failure States

The system should distinguish:
- no overflow;
- recoverable overflow;
- variant incompatibility;
- template incompatibility;
- unsupported content;
- impossible constraint combination;
- rendering/resource failure.

Failure states must be diagnosable.

They must not result in silent content loss.

## 34. Layout Invariants

1. Career data is independent of pagination.
2. Pagination does not delete content.
3. Semantic blocks are the primary pagination units.
4. Keep-together rules are explicit.
5. Splitting is allowed only at approved semantic boundaries.
6. Orphan/widow prevention is supported.
7. Overflow is detected rather than silently clipped.
8. Text shrinking is not the default overflow solution.
9. Page count is dynamic.
10. A4 remains V1-compatible.
11. Preview/export pagination remains contractually aligned.
12. Responsive scaling does not redefine the semantic document page.
13. Template constraints are respected.
14. Presentation variants may change page flow but not semantic facts.
15. Deterministic inputs should produce reproducible pagination.
16. Manual page breaks are semantic configuration, not pixel hacks.
17. V1 visual compatibility remains protected during core migration.
18. No implementation technology is selected by this contract.

## 35. Approval Gate

Review this contract with:
- V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md
- V2_DOMAIN_AND_DATA_CONTRACT_SPECIFICATION.md
- V2_DOCUMENT_LIFECYCLE_AND_STATE_CONTRACT.md
- V2_TEMPLATE_COMPATIBILITY_AND_CAPABILITY_CONTRACT.md
- V1_FUNCTIONALITY_PRESERVATION_INVENTORY.md
- V1_UI_CSS_PRESERVATION_CONTRACT.md

After approval, continue with the V2 Import and Migration Contract.

**No application code is introduced by this milestone.**
