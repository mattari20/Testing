# CV Builder V2 — Competitive Research and Product Recommendations

## Purpose
This document records the final pre-architecture competitive research pass for CV Builder V2. It is not a ranking of competitors. It identifies documented capabilities in major CV/resume products, extracts reusable product patterns, and defines what CV Builder V2 should adopt, improve, defer, or deliberately avoid.

Research was cross-checked against current public product pages and help documentation available in September 2026. Product capabilities can change, so implementation decisions must be revalidated before release.

## 1. Research scope
The review focused on major products and adjacent career platforms including Rezi, Teal, Enhancv, Kickresume, VisualCV, Cake, Huntr and Canva. The review covered resume/CV creation, templates, customization, multiple versions, importing, ATS analysis, job matching, keyword intelligence, AI assistance, cover letters, online CV/portfolio, privacy, analytics and broader career workflows.

## 2. Current market patterns
### 2.1 Resume creation is becoming a connected workflow
Modern products increasingly connect resume creation with job descriptions, ATS analysis, tailoring, cover letters, interview preparation, job search and application workflows. Rezi's current AI Resume Agent combines resume tailoring, scoring, keyword optimization, summary/bullet assistance and job search. Kickresume similarly connects AI resume creation with job-specific tailoring, cover letters and interview preparation. citeturn0search12turn0search13turn0search18

### 2.2 Job-specific tailoring is a major workflow
Rezi's keyword scanner compares a resume with a supplied job description and surfaces missing/relevant terms. Teal's Job Matcher can work from saved jobs, job search or a manually supplied job description. Enhancv also provides job-tailoring and keyword-oriented workflows. citeturn0search0turn0search10turn0search6

### 2.3 ATS analysis is moving beyond a single score
Rezi provides ATS/readiness checks and content analysis. Enhancv documents a broader scanner with parsability, content, skills/keywords and actionable findings. Enhancv's current ATS resource hub describes separate ATS essentials and recruiter-oriented checks with a reason and fix for findings. citeturn0search5turn0search8turn0search9

### 2.4 AI is increasingly contextual rather than generic
Current products use AI for job-specific tailoring, bullet rewriting, summaries, wording, keyword integration and feedback. Enhancv explicitly describes suggestions that remain user-controlled and uses placeholders where a number cannot be known rather than inventing it. This supports our requirement that AI assist but must not fabricate career facts. citeturn0search9turn0search12

### 2.5 Multiple CV versions are a core career workflow
VisualCV explicitly supports multiple customized CV versions for different applications. This reinforces the V2 Master Profile + targeted CV architecture. citeturn0search16turn0search17

### 2.6 Online CV and portfolio are converging
VisualCV supports shareable online resumes and downloadable PDFs. Kickresume provides personal website building. Cake supports linking resumes with portfolios and featuring resumes/portfolios on a profile. citeturn0search16turn0search11turn0search3turn0search7

### 2.7 Privacy controls matter for public career documents
Cake currently provides multiple resume visibility modes and separate search-engine visibility controls. This supports explicit public, link-only and private visibility states for a future eStudent Online CV. citeturn0search1turn0search14

### 2.8 Visual design and ATS requirements need controlled coexistence
Canva demonstrates the value of user-controlled visual design, while current ATS-focused products emphasize parsability and job relevance. V2 should therefore provide controlled design freedom rather than unlimited styling that can undermine document structure. Enhancv's current ATS research also emphasizes that ATS compatibility must be evaluated on actual parsing/readability rather than simplistic design rules. citeturn0search4turn0search9

## 3. Recommended V2 capabilities
### Priority A — Core architecture
1. Master Career Profile.
2. Multiple targeted CV documents sharing source career data.
3. Dynamic sections and custom fields.
4. Section, entry and field ordering.
5. Hide versus delete semantics.
6. First-class preview-side editing.
7. Presentation Variant Engine: one canonical data model rendered through multiple compatible views.
8. Template capability metadata and compatibility validation.
9. Semantic pagination and layout intelligence.
10. Local-first storage, backup/restore, migration and recovery.
11. PDF and formal DOCX export contracts.
12. Accessibility requirements built into the document/presentation model.

### Priority B — Career intelligence
1. In-builder ATS readiness analysis.
2. Standalone CV checker using the same analysis framework.
3. Job-description matching.
4. Separate Resume Health/Readiness and Job Match analysis.
5. Explainable findings: issue, reason, evidence, suggested fix.
6. Keyword and skill-gap analysis.
7. Skill Evidence Engine.
8. Consistency and chronology checks.
9. Achievement Discovery prompts that help users quantify real impact without inventing facts.
10. Template Recommendation based on profile/content and compatibility.

### Priority C — Controlled AI
1. Summary generation.
2. Bullet rewriting.
3. Clarity/grammar improvement.
4. Achievement framing.
5. Job-specific tailoring.
6. CV review and issue explanation.
7. Cover-letter generation.
8. AI Suggested versus User Approved state.
9. Explicit anti-fabrication rules.
10. Replaceable AI-provider boundary.

### Priority D — Career ecosystem
1. Existing CV import from PDF/DOCX.
2. Import confidence and user review before authority.
3. Cover-letter/CV relationship.
4. Online CV and portfolio.
5. Public/link-only/private visibility.
6. Future CV view/download analytics with privacy controls.
7. Student/Fresh Graduate mode.
8. Academic CV mode.
9. Job application workspace.
10. Interview Coach integration.
11. Future Student Career Wallet.

## 4. Presentation Variant Engine — strategic recommendation
The competitive review strengthens the decision to treat presentation variants as a first-class architecture capability rather than a collection of template hacks.

### Core principle
**One data model → many presentation variants.**

Examples:
- Languages: name only / proficiency label / percentage / progress bar / stars.
- Skills: text / tags / grouped list / levels / bars.
- Education: timeline / compact list / two-column / cards.
- Experience: traditional chronology / timeline / compact role blocks.
- Projects: compact list / featured cards / technical detail layout.

The same canonical data can therefore be reused across targeted CVs while each CV selects an appropriate presentation. Variant choices must not mutate source data.

## 5. Features to deliberately avoid copying blindly
### 5.1 Do not make AI the renderer
AI should assist content and analysis. The core document engine must remain deterministic and usable without AI.

### 5.2 Do not promise universal ATS guarantees
ATS readiness is analysis, not a guarantee that every employer system will accept a CV.

### 5.3 Do not encourage keyword stuffing
Keyword suggestions must be evidence-based and naturally integrated. Users must never be encouraged to claim skills they do not possess. Rezi explicitly positions contextual matching as an alternative to stuffing; this principle should be preserved. citeturn0search0

### 5.4 Do not turn visual ratings into fabricated facts
A star or percentage presentation is allowed only when supported by user data or an explicitly supplied rating. A presentation variant must not create a new factual claim.

### 5.5 Do not make cloud/account mandatory
The no-login local-first path remains an important V1 preservation requirement.

### 5.6 Do not copy a single competitor's UI
V2 should learn from patterns, not reproduce another product's interface or proprietary implementation.

## 6. Product differentiation opportunities
The following combination is recommended as the distinctive V2 direction:

**Structured Career Data + Dynamic Document Customization + Presentation Variants + Semantic Layout + Explainable Career Intelligence + Controlled AI + Career Ecosystem.**

Particularly differentiated opportunities:
- field/section presentation variants independent of canonical data;
- preview-side editing tied to one canonical model;
- Master Profile with per-CV presentation and content configuration;
- skill evidence and missing-evidence analysis;
- import confidence and review workflow;
- achievement discovery without fabrication;
- template compatibility and intelligent recommendations;
- student + international + academic CV modes within one extensible model.

## 7. Recommended V2 capability priority
### Must be architectural from the beginning
- Canonical document model.
- Master Profile boundary.
- Multiple CV boundary.
- Dynamic section/field engine.
- Presentation Variant Engine.
- Template metadata/compatibility.
- Semantic layout/pagination.
- Preview editing boundary.
- Local-first storage/migration.
- Export boundary.
- AI abstraction boundary.
- Intelligence abstraction boundary.
- Entitlement/monetization boundary.
- Privacy/access-control boundary.

### V2 release candidates
- PDF/DOCX import.
- ATS checker.
- Job matcher.
- Keyword/skill intelligence.
- Controlled AI writing.
- Cover letters.
- Template recommendations.
- Student/fresh graduate mode.
- Academic CV capabilities.

### Future ecosystem
- Online CV/portfolio.
- Public profile analytics.
- Job application tracker.
- Interview Coach.
- Student Career Wallet.
- External job-service integrations.

## 8. Documentation reconciliation required before architecture freeze
Before final documentation approval, reconcile the research against:
- V2_MASTER_CAPABILITY_REGISTER.md
- V2_FEATURE_MATRIX.md
- V2_PRODUCT_REQUIREMENTS.md
- V2_PRESENTATION_VARIANT_SYSTEM.md
- V2_MONETIZATION_AND_CAREER_ECOSYSTEM.md
- V1_FUNCTIONALITY_PRESERVATION_INVENTORY.md
- V1_UI_CSS_PRESERVATION_CONTRACT.md

No implementation should begin until conflicting capability classifications are resolved and the resulting Master Capability Register is explicitly frozen.

## 9. Final research conclusion
The objective is not to build another basic CV maker. V2 should preserve the proven V1 document experience while introducing a reusable career-data model and a flexible presentation system that can power multiple CVs, job-specific tailoring, ATS intelligence, AI assistance and future eStudent career products.

The strongest architectural rule remains:

> **V1 System = behavioral/visual Golden Baseline.**
> **V2 = clean extensible architecture that preserves that baseline while adding the next-generation career-document capabilities.**
