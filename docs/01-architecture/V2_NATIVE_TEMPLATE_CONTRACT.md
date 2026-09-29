# V2 Native Template Contract

## Purpose

Native V2 templates are presentation assets authored for the V2 document model. They are not required to use the legacy V1 token language.

The V1 template source remains immutable as the Golden Baseline. V1 adapters remain available for migration and regression compatibility, but new V2 template work must target this native contract.

## Governing rule

When a newer, cleaner, safer, or more extensible V2 mechanism supersedes a legacy mechanism, new implementation must use the V2 mechanism. Legacy mechanisms are retained only where required for compatibility, migration, or regression evidence.

## Separation of concerns

1. Career data is authoritative.
2. Document configuration controls document-specific visibility/order/presentation.
3. A native V2 template declares presentation structure and semantic bindings.
4. Layout/pagination determines physical page flow.
5. Preview/export consume the same assembled document and layout result.

A template must not become a second source of truth for career data.

## Native binding vocabulary

Native V2 templates use declarative `data-v2-*` attributes rather than V1 `{{...}}` tokens.

### Scalar value

`data-v2-value="PATH"`

The renderer resolves PATH and writes the value through DOM APIs.

Examples:

- `identity.fullName`
- `identity.jobTitle`
- `identity.email`
- `section:summary:text`

### Attribute binding

`data-v2-bind-src="PATH"`

Binds a resolved value to the element's `src` attribute.

Equivalent attribute forms may be introduced by the renderer contract without changing the canonical data model.

### Conditional visibility

`data-v2-visible-when="PATH"`

The element is visible only when the resolved semantic value/visibility state is eligible for presentation.

Visibility is presentation behavior; it must not delete or mutate canonical data.

### Semantic section

`data-v2-section="SECTION_TYPE"`

Declares the semantic section represented by the template block.

Examples:

- `summary`
- `experience`
- `education`
- `skills`
- `languages`

### Repeatable content

`data-v2-repeat="SOURCE"`

Declares a repeatable presentation region. The renderer will materialize one presentation item per eligible canonical entry/value.

The repeated prototype must remain semantically identifiable through `data-v2-item`.

### Repeated-entry value

Inside a repeat prototype:

`data-v2-entry-value="FIELD"`

Examples:

- `company`
- `duration`
- `title`
- `desc`
- `institute`
- `year`
- `degree`
- `grade`

### Repeated primitive value

Inside a primitive repeat prototype:

`data-v2-item-value="value"`

This is used for skills, languages, and similar primitive collections.

## Visibility and ordering

Templates must never hard-code assumptions that canonical data is always present.

The renderer resolves:

- section visibility
- field visibility
- entry visibility
- targeted-CV hidden sections/fields/entries
- configured section/field/entry order

The template supplies presentation; the document configuration supplies user-specific document choices.

## Security

User values must be inserted through DOM APIs or an equivalent safe rendering boundary.

Native templates must not require string concatenation of user data into HTML.

URLs and other executable-capable attributes require explicit attribute allowlisting and validation.

## V1 relationship

V1 source files under `src/templates/assets/v1/` are immutable source/baseline assets.

Native V2 templates are derived from those sources where visual preservation is required:

V1 source → V2 semantic conversion → browser render/measurement → Golden Baseline comparison → compatibility evidence.

Do not modify the V1 source to make it V2-compatible.

## Compatibility status

Creating a native V2 template does not automatically make it compatible.

A template remains pending until:

1. binding contract validation succeeds;
2. browser rendering succeeds;
3. real DOM measurement is available;
4. M4 pagination consumes measured semantic blocks;
5. visual comparison against the V1 Golden Baseline is performed;
6. preview/export parity is verified;
7. regression evidence is recorded.

## Future evolution

The native contract is intentionally semantic. Additional capabilities may be introduced without returning to V1 token syntax, including:

- reusable semantic components
- presentation variants
- accessibility metadata
- internationalization
- template-level constraints
- richer repeatable layouts
- page headers/footers
- controlled conditional regions

Any future contract revision must preserve the separation between authoritative career data, document configuration, presentation, and layout.
