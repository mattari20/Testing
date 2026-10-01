# R3 — Golden Baseline Closure

**Status:** Conditional  
**Scope:** Golden Baseline fixture and evidence gate for V1 → V2 release acceptance

## 1. Objective

Establish the sanitized Golden Baseline input set and identify the runtime/output evidence required for V2 release acceptance, while keeping historical V1 provenance separate from new V2-native replacements.

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

Two historical V1 variants remain unavailable as original V1 source artifacts:

- T01 ATS
- T01 Simple

These are **not silently recreated**. They now have explicit V2-native replacement templates in `src/templates/assets/v2/`. The historical V1 baseline for those two variants therefore remains unrecoverable, while the V2-native product baseline may proceed independently.

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
- authoritative V1 runtime output package for the seven recovered historical templates;
- final paired V1/V2 evidence package for the seven recovered templates;
- observed runtime/output evidence for the two new V2-native T01 ATS/Simple replacements;
- final export artifacts where runtime evidence is still pending;
- authoritative historical V1 source/output for T01 ATS/Simple remains unavailable and is tracked as provenance, not as a silent reconstruction target.

## 6. Governance rule

A test definition, fixture, source file, or configured CI workflow is not treated as runtime evidence until the corresponding execution/artifact is actually observed.

No visual equivalence claim is made from source inspection alone. New V2-native replacement templates are accepted on their own V2 contracts and are not represented as historically equivalent V1 artifacts.

## 7. R3 result

**Golden Baseline input readiness: PASS**

**Golden Baseline evidence readiness: CONDITIONAL — browser execution PASS observed.**

The input fixture foundation is present. Final Golden Baseline closure remains dependent on authoritative V1 runtime/output evidence and observed browser execution.

## 8. Next action

Browser/CI execution remains an evidence gate for release-affecting changes. Proceed with observed V2-native runtime evidence for all current templates and paired historical evidence for the seven recovered V1 templates. Missing historical T01 sources remain documented as unrecovered provenance and must not be silently substituted.
