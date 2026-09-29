export const UI_MODERNIZATION_VERSION = '1.0.0';

export const UI_PHASE = Object.freeze({
  FROZEN: 'frozen',
  MODERNIZATION: 'modernization',
  VALIDATION: 'validation',
  RELEASE: 'release'
});

export const UI_RULE = Object.freeze({
  CORE_DATA_UNCHANGED: 'core-data-unchanged',
  TEMPLATE_BEHAVIOR_PRESERVED: 'template-behavior-preserved',
  A4_OUTPUT_PROTECTED: 'a4-output-protected',
  ACCESSIBILITY_REQUIRED: 'accessibility-required',
  RESPONSIVE_REQUIRED: 'responsive-required',
  VISUAL_REGRESSION_REQUIRED: 'visual-regression-required'
});

export function createUIModernizationContract(input = {}) {
  const rules = Object.values(UI_RULE).map(rule => ({
    rule,
    status: input.rules?.[rule] || 'pending',
    evidence: input.evidence?.[rule] || null
  }));
  const blockers = rules.filter(r => r.status !== 'passed');
  return Object.freeze({
    version: UI_MODERNIZATION_VERSION,
    phase: input.phase || UI_PHASE.FROZEN,
    status: blockers.length ? 'blocked' : 'ready',
    rules,
    blockers: blockers.map(r => r.rule)
  });
}
