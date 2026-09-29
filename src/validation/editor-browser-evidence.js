export const EDITOR_BROWSER_EVIDENCE_VERSION = '1.0.0';

export function createEditorBrowserEvidence(input = {}) {
  const checks = {
    mount: input.mount === 'passed',
    fields: input.fields === 'passed',
    mutation: input.mutation === 'passed',
    preview: input.preview === 'passed',
    templateSwitch: input.templateSwitch === 'passed'
  };
  const passed = Object.values(checks).every(Boolean);
  return Object.freeze({
    version: EDITOR_BROWSER_EVIDENCE_VERSION,
    status: passed ? 'passed' : 'incomplete',
    checks,
    evidence: input.evidence || {}
  });
}
