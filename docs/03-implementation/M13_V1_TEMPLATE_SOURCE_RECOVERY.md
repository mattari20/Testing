# M13 — V1 Template Source Recovery

**Status:** Seven V1 HTML sources recovered from user uploads; compatibility validation remains pending.

The seven uploaded HTML files are now treated as authoritative V1 template source inputs for future reconciliation work. The source registry records their logical template IDs, filenames, origin, and recovery state.

## Evidence-backed source language

The recovered templates use the established V1 syntax:

- scalar tokens such as `{{NAME}}`, `{{JOB}}`, `{{SUMMARY}}`, and `{{PHOTO}}`;
- conditional field blocks such as `{{#PHONE}}...{{/PHONE}}`;
- visibility blocks such as `{{#toggle_exp_visible}}...{{/toggle_exp_visible}}`;
- repeatable object loops such as `{{EXPERIENCE_LIST}}...{{/EXPERIENCE_LIST}}`;
- primitive loops such as `{{SKILLS_LIST}}` and `{{LANGUAGES_LIST}}`.

They also contain template-specific CSS/layout rules and A4 dimensions. For example, T01 declares 210mm width and 297mm minimum height, while T06 declares 210mm × 297mm and a 35/65 background-column structure. These are preserved presentation contracts, not material to be simplified.

## Compatibility gate

Source recovery does **not** mean V2 compatibility.

A template is not promoted to V2-Compatible until:

1. the real source is rendered through the V2 pipeline;
2. bindings are mapped through the M10 adapter;
3. browser measurement feeds M4;
4. preview/export output is validated;
5. visual regression evidence demonstrates preservation of the V1 Golden Baseline.

## Preservation rule

The uploaded HTML is the source of truth. Do not recreate it from screenshots or rewrite its CSS merely to make integration easier.

## Next step

Proceed with the first real adapter/render integration using T01.
