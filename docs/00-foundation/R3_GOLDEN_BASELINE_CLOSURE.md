# R3 — Golden Baseline Closure

**Status:** Conditional  
**Scope:** Golden Baseline fixture and evidence gate for V1 → V2 release acceptance

## 1. Objective

Establish the sanitized Golden Baseline input set and identify which output/runtime evidence is still required before V2 can be declared equivalent to the approved V1 behavior.

## 2. Existing baseline input coverage

The repository already contains:

`tests/fixtures/golden-baseline/synthetic-fixture-set.json`

It provides the nine required fixture categories:

- A — Minimal CV
- B — Complete CV
- C — Long CV
- D — Visibility Matrix
- E — Theme Matrix
- F — Template Matrix
- G — Mobile Preview
- H — Desktop Preview
- I — Export

The fixture is explicitly synthetic/sanitized and contains no production personal data.

## 3. Template baseline coverage

Seven authoritative V1 HTML template sources are currently available:

- T01 Modern
- T02 Modern
- T03 Modern
- T04 Modern
- T05 Modern
- T06 Modern
- T07 Modern

Two historical V1 variants remain unavailable:

- T01 ATS
- T01 Simple

Therefore the complete historical template-output baseline cannot yet be closed.

## 4. Evidence required

For the available seven templates, Golden Baseline evidence must eventually include:

- V1 rendered output;
- V2 rendered output;
- browser dimensions/geometry;
- visual comparison evidence;
- pagination evidence;
- visibility behavior;
- theme behavior;
- photo behavior;
- mobile/desktop behavior where applicable;
- PDF/print evidence;
- DOCX evidence where applicable.

Repository test definitions are not themselves proof that these runtime artifacts were produced.

## 5. Current state

### Confirmed
- sanitized fixture set exists;
- fixture coverage matches the documented A–I baseline;
- seven V1 source templates are stored;
- seven Native V2 templates are stored;
- browser evidence harnesses exist;
- paired V1/V2 browser comparison infrastructure exists.

### Still open
- authoritative V1 runtime output package;
- final paired evidence package for the seven templates;
- T01 ATS source/output;
- T01 Simple source/output;
- final export artifacts where runtime evidence is still pending;
- observed CI artifacts from the configured workflow.

## 6. Governance rule

A test definition, fixture, source file, or configured CI workflow is not treated as runtime evidence until the corresponding execution/artifact is actually observed.

No visual equivalence claim is made from source inspection alone.

## 7. R3 result

**Golden Baseline input readiness: PASS**

**Golden Baseline evidence readiness: CONDITIONAL**

The input fixture foundation is present. Final Golden Baseline closure remains dependent on authoritative V1 runtime/output evidence and observed browser execution.

## 8. Next action

Proceed to the configured browser/CI execution gate and collect actual artifacts. Missing historical T01 sources remain a separate source gate and must not be silently substituted.
