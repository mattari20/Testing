# CV Builder V2 — Presentation Variant and View System

## Purpose
Define the requirement that the same canonical CV data can be displayed in multiple approved visual styles, with user-selectable variants in the preview and independent choices across targeted CVs.

## Core rule
**One data model → many presentation variants.**

Content must not be duplicated merely because a user wants a different visual representation. A language, education entry, experience entry, skill, certification or other record remains the same canonical data while its presentation can change.

## Example: Languages
A language record may contain canonical information such as name and proficiency. Supported presentations can include:
- Name only
- Proficiency label
- Percentage/progress bar
- Star/rating representation
- Compact percentage/label
- Template-specific compatible representation

The user can choose a presentation without changing the underlying language data.

## General examples
### Education
The same education data may be rendered as a timeline, compact list, two-column arrangement, cards, or another supported presentation.

### Experience
The same experience data may be rendered as a traditional chronological list, timeline, compact role block, or another compatible representation.

### Skills
The same skills may be rendered as a text list, grouped list, tags/chips, proficiency bars, levels, or another supported representation, subject to template and accessibility rules.

### Certifications / achievements / projects
These may similarly have multiple approved arrangements and visual treatments.

## Variant levels
Presentation variants may operate at:
1. Field level
2. Entry level
3. Section level
4. Document level

A document-level style may coordinate several section variants to maintain visual consistency.

## Preview experience
Preview editing is a first-class V2 capability. When a selected field or section supports multiple variants, the contextual preview controls should expose a clear action such as **Change Style**, **View**, or **Variant**.

The interaction should allow the user to:
- see available compatible variants;
- preview alternatives;
- select one;
- cancel without changing the current choice;
- undo a change where undo/redo is enabled.

The exact UI can evolve during the later UI/CSS phase; the capability itself is architectural and must be preserved.

## Per-CV independence
A Master Profile owns canonical career data. Each targeted CV can choose its own presentation variants.

For example, the same language data could be:
- text-only on an academic CV;
- a proficiency bar on a corporate CV;
- stars on a design-oriented CV.

Changing the presentation of one CV must not silently alter another CV or the Master Profile data.

## Template compatibility
Every variant must declare or inherit compatibility requirements such as:
- supported field types;
- supported section types;
- available space/layout model;
- page behavior;
- accessibility requirements;
- export support;
- theme dependencies.

The preview should show only compatible choices by default. If a saved choice becomes incompatible after a template change, the system should preserve the data and select/recommend a compatible presentation with an explicit explanation.

## Relationship to custom fields
Custom fields and custom sections must be able to use compatible presentation variants. A new field should not require a new core renderer implementation merely to support a different approved visual representation.

The system should distinguish:
- **data type** — what the value is;
- **semantic meaning** — what the field represents;
- **presentation type** — how it is shown;
- **template styling** — how the presentation is visually themed.

## Persistence
Variant choices are presentation configuration, not canonical content. They should be versioned/migrated as part of the CV document configuration and remain independent across targeted CVs.

## Safety and quality rules
- Never convert a visual rating into a factual claim that is not supported by the user's data.
- Do not invent proficiency values merely to fill a visual component.
- Percentage, stars and similar ratings should be used only when the underlying data supports that representation or the user explicitly supplies the value.
- Accessibility must be considered for every visual variant; color-only indicators are insufficient.
- Exported PDF/DOCX output should use the selected compatible variant where the export format supports it.
- The system must not silently alter canonical content when a user changes presentation.

## Acceptance criteria
1. One canonical data record can be rendered in multiple approved variants.
2. Variant selection is independent from canonical content.
3. Different CVs can select different variants for the same source data.
4. Preview provides a usable variant-selection path.
5. Unsupported variants are filtered or explicitly handled.
6. Variant choices survive save/load and migration.
7. Variant changes can participate in undo/history where those capabilities are enabled.
8. PDF/export behavior is validated for selected variants.
9. Custom fields/sections can participate where a compatible presentation exists.
10. V1 Golden Baseline visuals remain unchanged during the core migration until the controlled UI/CSS modernization phase.
