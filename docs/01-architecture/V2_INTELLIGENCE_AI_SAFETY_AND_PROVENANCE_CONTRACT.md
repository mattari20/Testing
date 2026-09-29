# V2 Intelligence, AI Safety and Provenance Contract

**Status:** Proposed for architecture approval  
**Scope:** Technology-neutral ATS, Job Match, AI assistance, evidence, provenance, confidence, and explainability contract  
**Implementation status:** Documentation only; no application code

## 1. Purpose

This contract defines the boundaries for V2 intelligence features.

It covers:
- ATS Readiness;
- Resume Health;
- Job Matching;
- keyword and skill analysis;
- evidence detection;
- AI assistance;
- AI suggestion states;
- provenance;
- confidence;
- explainability;
- user approval;
- anti-fabrication;
- privacy boundaries.

The governing principle is:

> **Intelligence may analyze and suggest; the user remains the authority over career facts.**

## 2. Intelligence Domains

V2 must keep these domains conceptually separate:

1. **ATS Readiness / Resume Health** — evaluates the document itself.
2. **Job Match** — compares a selected CV against a target job description.
3. **Skill/Evidence Intelligence** — identifies supported, weak, missing, or insufficiently evidenced career claims.
4. **AI Assistance** — generates or transforms suggestions based on authorized information.

These domains may share underlying analysis infrastructure conceptually, but their findings must remain distinguishable.

## 3. ATS Readiness Contract

ATS Readiness evaluates machine-readable career-document characteristics.

It may inspect:
- structure;
- headings;
- contact information;
- chronology;
- formatting risks;
- parsing-sensitive structures;
- standard section recognition;
- keyword coverage;
- skills evidence;
- consistency;
- potential readability issues.

ATS Readiness must not claim that a document will pass every external ATS.

### Finding model

A meaningful finding should conceptually contain:

**Issue → Reason → Evidence → Recommended Fix**

A numerical score may summarize findings, but it is not a guarantee.

## 4. Resume Health

Resume Health is the broader document-quality layer around ATS-oriented checks.

It may include:
- completeness;
- consistency;
- clarity;
- structure;
- chronology;
- evidence quality;
- presentation risks;
- missing conventional information.

Resume Health must remain distinguishable from Job Match.

## 5. Job Match Contract

Job Match compares:

**Targeted CV + Job Description**

The Job Description may contain:
- role/title;
- skills;
- keywords;
- qualifications;
- tools/technologies;
- responsibilities;
- experience requirements;
- education requirements;
- other explicit requirements.

The analysis may classify findings as:
- matched;
- missing;
- weakly evidenced;
- related/adjacent;
- unclear;
- not applicable where appropriate.

The exact classification vocabulary may evolve, but uncertainty must remain explicit.

## 6. Keyword Intelligence

Keyword analysis must distinguish at least conceptually between:

- exact term match;
- related term;
- semantic/functional relationship;
- absent term;
- ambiguous term.

The system must not encourage meaningless keyword stuffing.

Keyword suggestions should be grounded in:
- the Job Description;
- the user's actual career data;
- relevant evidence already present.

A missing keyword is not automatically a missing skill.

## 7. Skill Intelligence

Skill analysis should distinguish:

- explicitly stated skill;
- skill evidenced by experience/project/education;
- related skill;
- weak evidence;
- missing evidence;
- unsupported claim.

A skill must not be treated as possessed merely because an AI system predicts that it would be useful.

## 8. Skill Evidence Engine

The Skill Evidence Engine connects skills to supporting career evidence.

Examples:

**Python**
→ project evidence  
→ experience evidence  
→ education/course evidence

**Project Management**
→ role responsibility  
→ achievement  
→ certification

The purpose is to help the user identify evidence gaps without inventing evidence.

## 9. Missing-Evidence Detection

The system may identify:

> “This skill appears in the CV, but supporting evidence is not clearly visible.”

This is different from:

> “The user does not possess this skill.”

The system must preserve that distinction.

## 10. Achievement Discovery

Intelligence may identify bullets or entries that appear descriptive rather than outcome-oriented and ask the user for missing context.

Examples of useful prompts:
- What changed because of your work?
- How many users/customers were affected?
- How much time was saved?
- What process improved?
- What measurable result occurred?

The system must not invent the answer.

## 11. AI Assistance Boundary

AI may assist with:
- summary drafting;
- bullet rewriting;
- clarity;
- grammar;
- achievement framing;
- skill suggestions;
- job-specific tailoring;
- issue explanations;
- cover-letter drafting;
- structured improvement suggestions.

AI must not become the authoritative career-data layer.

## 12. AI Input Authorization

AI processing should use only information that is authorized for the specific operation.

Potential inputs may include:
- selected CV content;
- Master Profile content;
- selected Job Description;
- selected cover letter;
- user-provided instructions;
- relevant template/presentation context.

The system should not automatically expose unrelated private career data merely because it exists in the account/profile.

## 13. AI Suggestion Lifecycle

The conceptual lifecycle is:

**Requested → Generated → Presented → Accepted / Rejected / Edited → Applied**

Generated output is not authoritative.

User acceptance must be explicit or clearly user-initiated.

## 14. AI Provenance

Where practical, AI-generated suggestions should retain provenance indicating:
- that AI generated the suggestion;
- relevant source/context;
- generation time/context;
- suggestion category;
- whether the user edited it;
- whether it was accepted.

Provenance exists to support transparency and debugging.

## 15. User-Approved Content

When a user accepts or edits an AI suggestion, the resulting content becomes user-controlled content.

The system should preserve the distinction between:
- original user content;
- AI suggestion;
- user-edited result;
- final accepted content.

The final accepted content is authoritative only because the user accepted/edited it, not because AI generated it.

## 16. Anti-Fabrication Contract

AI must not invent or falsely imply:

- employers;
- job titles;
- qualifications;
- degrees;
- certifications;
- dates;
- projects;
- responsibilities;
- achievements;
- metrics;
- clients;
- technologies used;
- skills;
- awards;
- publications;
- memberships;
- professional credentials.

If a useful result requires an unknown fact, the system should:
1. ask the user for it;
2. provide an explicit placeholder;
3. offer a non-factual rewrite that does not introduce the missing claim.

## 17. Metrics and Achievement Safety

AI may improve the wording of a known metric.

It must not invent a metric.

For example:
- user-provided “reduced processing time by 20%” may be rewritten;
- missing percentage must not be fabricated merely to make a bullet stronger.

The system may ask for the actual value or suggest what type of evidence would improve the bullet.

## 18. Confidence

Where intelligence produces uncertain results, confidence may be represented conceptually.

Confidence must:
- describe analysis uncertainty;
- not be presented as factual truth;
- not substitute for user confirmation;
- remain distinguishable from an objective measurement.

Confidence should be especially cautious for:
- inferred skills;
- semantic keyword relationships;
- extracted PDF/DOCX information;
- ambiguous dates;
- inferred achievements;
- role equivalence.

## 19. Evidence

Intelligence findings should identify supporting evidence where possible.

Evidence may point to:
- a CV field;
- a repeatable entry;
- a specific bullet;
- education;
- project;
- certification;
- Job Description text;
- imported source region.

A finding without understandable evidence should be treated as lower-explainability output.

## 20. Explainability

A user should be able to understand why an intelligence finding exists.

Preferred conceptual structure:

**Finding → Evidence → Reasoning Category → Suggested Action**

The system does not need to expose proprietary internal model reasoning. It does need to expose useful, verifiable evidence and the practical basis for the recommendation.

## 21. Recommendation Safety

Recommendations should be grounded in available data.

Examples:
- “Add a measurable outcome if you have one.”
- “The job description explicitly mentions SQL, but SQL is not currently visible in this CV.”
- “Your project description contains evidence related to data analysis.”

Avoid unsupported conclusions such as:
- “You definitely have this skill.”
- “This employer requires this exact phrase” when the source does not show it.
- “This CV will pass the ATS.”

## 22. User Control

The user must be able to:
- accept suggestions;
- reject suggestions;
- edit suggestions;
- ignore findings;
- review evidence;
- choose whether a suggested change is applied;
- preserve original content where desired.

AI must not silently replace user-authored career facts.

## 23. AI and Master Profile Boundary

AI should not directly rewrite the Master Profile as an invisible side effect.

A controlled workflow is:

**Analyze/Suggest → User Review → Explicit Apply → Master Profile or Targeted CV**

The destination must be clear.

## 24. AI and Targeted CV Boundary

Job-specific tailoring may modify a Targeted CV configuration or produce suggested content without automatically changing the Master Profile.

This supports multiple targeted CVs without contaminating the reusable source profile.

## 25. ATS and AI Separation

ATS findings and AI suggestions must remain separate concepts.

Example:

**ATS Finding:** “This section has a structural parsing risk.”

**AI Suggestion:** “Consider restructuring the section using a standard heading.”

The AI suggestion does not replace the underlying analysis record.

## 26. Job Match and AI Separation

Job Match determines analytical relationships.

AI may explain or help act on those findings.

Example:

**Job Match:** “SQL appears in the job description but is not currently visible in the selected CV.”

**AI Suggestion:** “If you have genuine SQL experience, consider adding the relevant project or experience evidence.”

AI must not convert the first statement into an invented claim of SQL experience.

## 27. Historical Analysis

ATS and Job Match results should be associated with the relevant:
- document version/configuration;
- Job Description snapshot where applicable;
- analysis version/context.

A later edit must not silently rewrite an earlier result.

Historical findings may be superseded by new analysis.

## 28. Analysis Freshness

Analysis may become stale when:
- CV content changes;
- Job Description changes;
- relevant template changes;
- document configuration changes;
- analysis rules change.

The system should distinguish:
- current;
- stale;
- superseded;
- unavailable.

Stale results must not be presented as current without indication.

## 29. Job Description Provenance

For Job Match, the system should preserve enough context to identify what was analyzed.

Where permitted, this may include:
- source;
- captured Job Description text;
- extraction version/context;
- analysis timestamp;
- target role;
- user edits to the Job Description.

## 30. Privacy Boundary

Career intelligence may process sensitive personal/professional information.

The architecture must therefore maintain:
- purpose limitation;
- user authorization;
- data minimization;
- access control;
- privacy-aware retention;
- secure processing;
- separation between analytics and raw career content.

AI/analysis providers are implementation choices for later specifications; this contract does not select one.

## 31. Analytics Boundary

Analytics may record:
- ATS analysis requested/completed;
- Job Match requested/completed;
- AI suggestion generated;
- AI suggestion accepted/rejected;
- issue category;
- feature usage.

Analytics should not transmit full CV text, Job Description text, or AI content merely to measure feature usage.

## 32. Intelligence Failure States

The system should distinguish:
- successful analysis;
- partial analysis;
- insufficient input;
- ambiguous input;
- unsupported format;
- processing failure;
- stale result;
- unavailable result.

Failure must not be converted into a confident recommendation.

## 33. Safety for Unsupported Claims

If the system cannot verify a claim, it should use language appropriate to uncertainty.

Examples:
- “not currently evidenced” rather than “you do not have”;
- “appears related” rather than “is equivalent”;
- “consider adding if accurate” rather than “add this skill.”

This protects the user's factual career record.

## 34. Intelligence and Accessibility

Findings and suggestions must be presented in a way that remains understandable without relying only on color, icons, or visual score indicators.

Meaningful findings should have textual explanations and accessible states.

## 35. V1 Compatibility

V1 currently has AI summary assistance and existing CV analysis/rendering behavior that must be accounted for during migration.

V2 should preserve the user-visible intent of these capabilities while moving them into the new intelligence boundaries.

V1 behavior does not require preserving V1 implementation mechanisms.

## 36. Intelligence Acceptance Criteria

The intelligence layer is considered contractually complete when:

1. ATS Readiness is separate from Job Match;
2. findings are explainable;
3. evidence can be identified where applicable;
4. AI suggestions are distinguishable from authoritative content;
5. user approval controls application of AI output;
6. anti-fabrication rules are enforced conceptually;
7. confidence does not masquerade as fact;
8. historical analysis is traceable;
9. stale analysis can be identified;
10. Job Description context is preserved where needed;
11. analytics do not require raw career content;
12. failure states remain explicit;
13. Master Profile cannot be silently rewritten by intelligence features;
14. V1 intelligence-related behavior is covered by preservation requirements.

## 37. Domain Invariants

1. The user remains authoritative over career facts.
2. AI suggestions are not facts.
3. Inferred skills are not automatically possessed skills.
4. Missing evidence is not proof of missing ability.
5. ATS analysis is not an external ATS guarantee.
6. Job Match is not a hiring prediction.
7. AI cannot invent career facts.
8. Metrics cannot be fabricated.
9. Findings should identify evidence where practical.
10. Confidence is not certainty.
11. Historical analysis remains traceable.
12. Stale analysis is not silently presented as current.
13. Intelligence must not silently rewrite the Master Profile.
14. Analytics must not require raw CV content.
15. No implementation technology is selected by this contract.

## 38. Approval Gate

Review this contract with:
- V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md
- V2_DOMAIN_AND_DATA_CONTRACT_SPECIFICATION.md
- V2_DOCUMENT_LIFECYCLE_AND_STATE_CONTRACT.md
- V2_IMPORT_AND_MIGRATION_CONTRACT.md
- V2_TEMPLATE_COMPATIBILITY_AND_CAPABILITY_CONTRACT.md
- V2_LAYOUT_AND_PAGINATION_CONTRACT.md
- V2_MASTER_CAPABILITY_REGISTER.md
- V2_PRODUCT_REQUIREMENTS.md

After approval, continue with the **V2 Export and Distribution Contract**.

**No application code is introduced by this milestone.**
