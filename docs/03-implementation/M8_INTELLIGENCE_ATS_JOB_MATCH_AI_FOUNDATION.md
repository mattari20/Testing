# M8 — Intelligence, ATS, Job Match and AI Foundation

**Status:** Implementation foundation complete; production analysis/adapters pending.

## 1. Objective

M8 establishes separate, traceable intelligence boundaries for ATS Readiness, Resume Health-adjacent analysis, Job Match, Skill Evidence, and AI suggestions.

## 2. Implemented

Added:

- `src/intelligence/intelligence-engine.js`
- `tests/m8/intelligence-engine.test.js`

The foundation provides:

- snapshot-bound analysis requests;
- separate ATS Readiness and Job Match analysis types;
- explainable findings using issue/reason/evidence/recommendation;
- job-description requirement extraction boundary;
- matched versus missing requirement classification;
- Skill Evidence findings;
- explicit uncertainty language for missing evidence;
- analysis provenance;
- analysis freshness/stale detection;
- AI suggestion lifecycle;
- AI provenance;
- user-edit tracking;
- no automatic application of AI suggestions.

## 3. Safety Rules

The engine does not treat missing evidence as proof that a user lacks a skill. It also does not authorize invented skills, metrics, employers, qualifications, dates, or achievements.

AI suggestions remain separate from authoritative career data until an explicit user-controlled application step exists.

## 4. Important Boundary

This milestone does **not** claim a production ATS model, semantic NLP system, AI provider, or external job-description service.

The job-description and keyword analysis here is a deterministic foundation. Future intelligence adapters may improve extraction and semantic relationships behind the same contract.

## 5. Historical Analysis

Results are tied to:

- Master Profile revision;
- Targeted CV revision;
- Job Description fingerprint where applicable;
- analysis type/version.

Results can therefore be marked stale when the source document changes.

## 6. Acceptance Gate

M8 foundation is complete when:

- ATS and Job Match are separate;
- findings are explainable;
- evidence is explicit;
- missing evidence is not treated as missing ability;
- AI suggestions have separate lifecycle/provenance;
- stale analysis is detectable;
- no AI/provider technology is hard-coded into the intelligence boundary.
