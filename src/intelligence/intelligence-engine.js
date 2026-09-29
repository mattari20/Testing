export const INTELLIGENCE_ENGINE_VERSION = '1.0.0';

export const ANALYSIS_TYPE = Object.freeze({
  ATS_READINESS: 'ats-readiness',
  RESUME_HEALTH: 'resume-health',
  JOB_MATCH: 'job-match',
  SKILL_EVIDENCE: 'skill-evidence'
});

export const ANALYSIS_STATE = Object.freeze({
  CURRENT: 'current',
  STALE: 'stale',
  SUPERSEDED: 'superseded',
  UNAVAILABLE: 'unavailable',
  PARTIAL: 'partial'
});

export const FINDING_TYPE = Object.freeze({
  ISSUE: 'issue',
  MATCHED: 'matched',
  MISSING: 'missing',
  WEAK: 'weak',
  RELATED: 'related',
  UNCLEAR: 'unclear',
  EVIDENCE_GAP: 'evidence-gap'
});

export const SUGGESTION_STATE = Object.freeze({
  REQUESTED: 'requested',
  GENERATED: 'generated',
  PRESENTED: 'presented',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EDITED: 'edited',
  APPLIED: 'applied'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const arr = value => Array.isArray(value) ? value : [];
const normalize = value => String(value || '').trim().toLowerCase();
const tokenize = value => normalize(value).split(/[^a-z0-9+#.-]+/i).filter(Boolean);

function collectCareerText(snapshot) {
  const chunks = [];
  const data = snapshot?.careerData || snapshot?.data || {};
  const add = value => { if (typeof value === 'string' && value.trim()) chunks.push(value); };
  add(data.identity?.name); add(data.identity?.job);
  for (const section of arr(data.sections)) {
    add(section.title);
    for (const field of arr(section.fields)) add(field.value);
    for (const entry of arr(section.entries)) {
      for (const value of Object.values(entry.values || {})) add(value);
    }
  }
  return chunks.join(' ');
}

function unique(values) {
  return [...new Set(values.map(normalize).filter(Boolean))];
}

export function createAnalysisRequest(input = {}) {
  if (!input.documentSnapshot) throw new Error('Intelligence analysis requires a document snapshot.');
  if (!Object.values(ANALYSIS_TYPE).includes(input.analysisType)) throw new Error('Unsupported analysis type.');
  return Object.freeze({
    version: INTELLIGENCE_ENGINE_VERSION,
    requestId: String(input.requestId || 'analysis_' + Date.now().toString(36)),
    analysisType: input.analysisType,
    documentSnapshot: clone(input.documentSnapshot),
    jobDescription: input.jobDescription ? String(input.jobDescription) : null,
    requestedAt: input.requestedAt || new Date().toISOString(),
    context: isObject(input.context) ? clone(input.context) : {}
  });
}

export function extractJobRequirements(jobDescription = '') {
  const text = String(jobDescription || '');
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const keywordSet = unique(tokenize(text).filter(token => token.length >= 3));
  const likelySkills = unique(
    lines.filter(line => /skills?|requirements?|technologies|tools|qualifications/i.test(line))
      .flatMap(line => line.split(/[:,;•|-]/).slice(1))
      .flatMap(tokenize)
  );
  return {
    title: lines.find(line => /^(senior|junior|lead|principal|staff|intern|manager|developer|engineer|analyst|designer|scientist|consultant)/i.test(line)) || null,
    keywords: keywordSet,
    skills: likelySkills,
    rawText: text
  };
}

export function analyzeATSReadiness(request) {
  const text = collectCareerText(request.documentSnapshot);
  const sections = arr(request.documentSnapshot?.careerData?.sections);
  const headings = unique(sections.map(s => s.title));
  const findings = [];
  const standard = ['summary','education','experience','skills'];
  for (const name of standard) {
    if (!headings.some(h => normalize(h) === name)) {
      findings.push({
        type: FINDING_TYPE.ISSUE,
        code: 'SECTION_NOT_VISIBLE',
        issue: name,
        reason: 'A conventional section was not detected in the selected document.',
        evidence: { section: name },
        recommendation: 'Include the section if it is relevant to the role.'
      });
    }
  }
  if (!text.trim()) findings.push({
    type: FINDING_TYPE.ISSUE,
    code: 'INSUFFICIENT_CONTENT',
    issue: 'Document has little analyzable text.',
    reason: 'The selected document snapshot contains insufficient career text.',
    evidence: {},
    recommendation: 'Add relevant career information before analysis.'
  });
  return createAnalysisResult(request, {
    findings,
    metrics: { sectionCount: sections.length, textTokenCount: tokenize(text).length },
    state: findings.some(f => f.code === 'INSUFFICIENT_CONTENT') ? ANALYSIS_STATE.PARTIAL : ANALYSIS_STATE.CURRENT
  });
}

export function analyzeJobMatch(request) {
  const requirements = extractJobRequirements(request.jobDescription || '');
  const cvTokens = new Set(tokenize(collectCareerText(request.documentSnapshot)));
  const findings = [];
  for (const keyword of requirements.keywords.slice(0, 100)) {
    const matched = cvTokens.has(keyword);
    findings.push({
      type: matched ? FINDING_TYPE.MATCHED : FINDING_TYPE.MISSING,
      code: matched ? 'KEYWORD_MATCH' : 'KEYWORD_NOT_VISIBLE',
      issue: keyword,
      reason: matched ? 'The term appears in the selected CV content.' : 'The term appears in the job description but is not visible in the selected CV.',
      evidence: { jobDescriptionTerm: keyword, cvVisible: matched },
      recommendation: matched ? null : 'Add the term only if it accurately reflects the user’s real experience or evidence.'
    });
  }
  return createAnalysisResult(request, {
    findings,
    requirements,
    metrics: { requirementCount: requirements.keywords.length, matchedCount: findings.filter(f => f.type === FINDING_TYPE.MATCHED).length },
    state: ANALYSIS_STATE.CURRENT
  });
}

export function analyzeSkillEvidence(request, skills = []) {
  const text = collectCareerText(request.documentSnapshot);
  const lower = normalize(text);
  const findings = arr(skills).map(skill => {
    const term = normalize(skill);
    const visible = Boolean(term && lower.includes(term));
    return {
      type: visible ? FINDING_TYPE.MATCHED : FINDING_TYPE.EVIDENCE_GAP,
      code: visible ? 'SKILL_VISIBLE' : 'SKILL_EVIDENCE_NOT_VISIBLE',
      issue: skill,
      reason: visible ? 'The skill is explicitly visible in selected career content.' : 'The skill is not clearly visible in the selected career content.',
      evidence: { skill, visible },
      recommendation: visible ? null : 'Add genuine supporting evidence if the user has it; do not invent experience.'
    };
  });
  return createAnalysisResult(request, { findings, state: ANALYSIS_STATE.CURRENT });
}

export function createAnalysisResult(request, input = {}) {
  return {
    version: INTELLIGENCE_ENGINE_VERSION,
    analysisId: String(input.analysisId || 'analysis_result_' + Date.now().toString(36)),
    analysisType: request.analysisType,
    state: input.state || ANALYSIS_STATE.CURRENT,
    source: {
      masterProfileId: request.documentSnapshot.masterProfileId || null,
      targetedCVId: request.documentSnapshot.targetedCVId || null,
      masterProfileRevision: request.documentSnapshot.masterProfileRevision || null,
      targetedCVRevision: request.documentSnapshot.targetedCVRevision || null,
      jobDescriptionFingerprint: request.jobDescription ? fingerprint(request.jobDescription) : null
    },
    findings: arr(input.findings),
    metrics: isObject(input.metrics) ? clone(input.metrics) : {},
    requirements: isObject(input.requirements) ? clone(input.requirements) : null,
    generatedAt: new Date().toISOString()
  };
}

export function createAISuggestion(input = {}) {
  if (!input.text) throw new Error('AI suggestion text is required.');
  return {
    id: String(input.id || 'suggestion_' + Date.now().toString(36)),
    state: SUGGESTION_STATE.GENERATED,
    category: String(input.category || 'general'),
    text: String(input.text),
    source: {
      type: 'ai',
      context: isObject(input.context) ? clone(input.context) : {},
      generatedAt: new Date().toISOString()
    },
    userEdits: [],
    appliedTo: null
  };
}

export function transitionAISuggestion(suggestion, state, details = {}) {
  if (!Object.values(SUGGESTION_STATE).includes(state)) throw new Error('Unknown AI suggestion state.');
  const next = clone(suggestion);
  next.state = state;
  if (details.editedText != null) {
    next.userEdits.push({ text: String(details.editedText), at: new Date().toISOString() });
    next.text = String(details.editedText);
  }
  if (details.appliedTo) next.appliedTo = String(details.appliedTo);
  return next;
}

export function fingerprint(value) {
  const normalized = typeof value === 'string' ? value.trim() : JSON.stringify(value);
  let hash = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

export function markAnalysisStale(result, currentRevisions = {}) {
  const stale = result?.source?.masterProfileRevision !== currentRevisions.masterProfileRevision ||
    result?.source?.targetedCVRevision !== currentRevisions.targetedCVRevision;
  return { ...clone(result), state: stale ? ANALYSIS_STATE.STALE : result.state };
}
