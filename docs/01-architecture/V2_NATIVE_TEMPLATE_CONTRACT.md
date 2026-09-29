# Native V2 Template Contract

## Purpose

Native V2 templates are the active presentation contract for the V2 architecture. Recovered V1 HTML remains an immutable Golden Baseline and compatibility/migration source.

The project will adopt a newer method when it provides a materially better architectural result. Legacy syntax is not preserved merely for historical reasons.

## Native semantic vocabulary

- `data-v2-template-root` — identifies the native template root.
- `data-v2-template-id` / `data-v2-template-version` — immutable template identity/version metadata.
- `data-v2-value="path"` — safe text binding.
- `data-v2-visible-when="path"` — conditional element visibility.
- `data-v2-section="type"` — semantic section identity.
- `data-v2-bind-src="asset:key"` — safe image/asset source binding.
- `data-v2-repeat="section:entries"` — repeat canonical section entries.
- `data-v2-repeat="section:values"` — repeat primitive/value-style entries.
- `data-v2-entry-value="key"` — current repeat-entry value.
- `data-v2-item-value="key"` — current primitive/value-item property.

## Data binding

Absolute bindings resolve against the V2 document snapshot.

Identity aliases are allowed at the renderer boundary where the canonical model evolves:
- `identity.fullName` may fall back to `identity.name`.
- `identity.jobTitle` may fall back to `identity.job`.
- `identity.dateOfBirth` may fall back to `identity.dob`.

This is a compatibility boundary, not permission to duplicate canonical data.

## Section and visibility semantics

A semantic section is visible only when:
1. the canonical section exists;
2. its canonical visibility is true;
3. its ID/type is not hidden by the targeted-CV configuration.

Entries additionally respect entry visibility and targeted-CV hidden-entry configuration.

## Repeat semantics

`section:entries` repeats canonical section entries and provides `data-v2-entry-value` context.

`section:values` repeats entry values for value-oriented sections such as skills/languages and provides `data-v2-item-value` context.

Templates must not silently discard unsupported content.

## Security

User data is inserted through DOM-safe text/attribute operations. URL/image bindings reject executable schemes. Native templates are trusted presentation assets and require source/asset reconciliation before publication.

## Layout

Templates may mark semantic regions for measurement using the existing `data-v2-layout-*` contract. Rendering does not implement pagination; M4 remains authoritative for layout/pagination.

## Compatibility gate

Native source conversion alone does not equal compatibility. A template becomes V2-compatible only after browser rendering, real DOM measurement, M4 pagination, Golden Baseline visual/output comparison, accessibility/security checks, and supported export validation.

## V1 preservation

The seven recovered V1 HTML sources under `src/templates/assets/v1/` remain unchanged. Native V2 templates are derived assets.

