# Current Architecture Recovery

## Logical architecture

```
PHP landing / bridge
        |
        v
Builder HTML shell
        |
        v
builder.js
  |       |        |
  |       |        +--> Local persistence
  |       |
  |       +-----------> Input binding / visibility
  |
  +-------------------> Template registry
                          |
                          v
                    Fetch template HTML
                          |
                          v
                    Token compiler
                          |
                          v
                    Preview DOM
                     /          \
                    /            \
          Mobile Engine      Desktop Engine
              |                    |
          scaling/PDF         print/PDF
```

## State boundary

The current implementation has a useful conceptual boundary:

```
Canonical state
    |
    +-- CV data
    |
    +-- visibility state
    |
    +-- selected/theme state
```

Templates should remain consumers of state rather than owners of user data.

## Current template contract

A template is effectively a document fragment with:

- CSS/layout
- scalar placeholders
- repeatable-section loop placeholders
- conditional visibility blocks
- optional scripts
- theme variables

This contract should be formalized rather than discarded.

## Current rendering pipeline

```
URL tid
  -> resolve registry key
  -> fetch template
  -> compile scalar tokens
  -> compile object arrays
  -> compile primitive arrays
  -> apply visibility
  -> inject preview
  -> execute template scripts
  -> apply theme
  -> refresh mobile scaling
```

## Current export pipeline

### Mobile

```
Preview
 -> export clone
 -> fonts/images/layout ready
 -> html2canvas
 -> canvas validation
 -> canvas optimization
 -> tall image
 -> A4 PDF
 -> vertical slicing by page
```

### Desktop

```
Preview
 -> isolated print iframe
 -> inject HTML/CSS
 -> browser print
```

## V2 architectural direction

The current renderer should evolve toward:

```
CV Document Model
       |
       +--> Editor Model
       |
       +--> Preview Renderer
       |
       +--> Semantic Pagination Engine
       |
       +--> Template Renderer
       |
       +--> ATS/Intelligence Layer
       |
       +--> Export Adapters
```

This preserves the existing visual design while separating the underlying document semantics from presentation.

## Non-negotiable V2 principle

**The CV data model must not depend on a particular template.**

A single CV document should be renderable through multiple compatible templates without rewriting the underlying user data.
