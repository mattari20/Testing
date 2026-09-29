import { SUGGESTION_STATE, createAISuggestion } from './intelligence-engine.js';

export const INTELLIGENCE_SAFETY_VERSION = '1.0.0';

const FORBIDDEN_CLAIMS = [
  'invented experience',
  'invented qualification',
  'invented employer',
  'invented credential',
  'fabricated achievement',
  'fabricated metric'
];

export function validateAISuggestionSafety(input = {}) {
  const text = String(input.text || '').toLowerCase();
  const violations = FORBIDDEN_CLAIMS.filter(term => text.includes(term));
  return {
    version: INTELLIGENCE_SAFETY_VERSION,
    safe: violations.length === 0,
    violations,
    requiresUserReview: true
  };
}

export function createSafeAISuggestion(input = {}) {
  const safety = validateAISuggestionSafety(input);
  if (!safety.safe) throw new Error('AI suggestion failed safety validation.');
  const suggestion = createAISuggestion(input);
  return {
    ...suggestion,
    safety,
    provenance: {
      ...(suggestion.source || {}),
      userApprovalRequired: true
    }
  };
}

export function validateAppliedSuggestion(suggestion) {
  return Boolean(
    suggestion &&
    suggestion.state === SUGGESTION_STATE.APPLIED &&
    suggestion.appliedTo &&
    suggestion.safety?.safe === true
  );
}
