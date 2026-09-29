# M27 — Generic V1 Browser Template Adapter

## Purpose

M27 establishes a source-driven adapter for the recovered V1 templates so their original HTML/CSS can be rendered in the same browser evidence environment as Native V2.

## Source basis

The adapter uses the actual recovered V1 source syntax found in the repository. It does not recreate the seven designs and does not modify the immutable V1 source files.

The observed common V1 concepts are mapped as follows:
- identity scalar tokens to canonical identity fields;
- SUMMARY to the canonical summary text field;
- PHOTO to the canonical photo asset;
- EXPERIENCE_LIST to experience entries;
- EDUCATION_LIST to education entries;
- PROJECTS_LIST to project entries;
- SKILLS_LIST and LANGUAGES_LIST to primitive value entries;
- ACHIEVEMENTS_LIST to achievement content;
- toggle visibility tokens to canonical section visibility.

## Important limitation

This adapter is a browser comparison bridge, not a new V1 template language. Template-specific unsupported constructs remain diagnostics/evidence gaps rather than being silently guessed.

## Preservation rule

V1 source remains immutable. The adapter changes only how V1 data is supplied for browser evidence; it does not alter V1 HTML/CSS or its visual design.

## Future behavior

This adapter is for V1-derived templates. New native V2 templates do not require a V1 adapter unless they intentionally have a V1 predecessor.
