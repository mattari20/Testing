import { createDocxGenerationPlan, DOCX_MODE } from './docx-generator.js';

export const DOCX_RUNTIME_VERSION = '1.0.0';

export function createDocxRuntimeRequest(input = {}) {
  const plan = createDocxGenerationPlan(input);
  return Object.freeze({
    runtimeVersion: DOCX_RUNTIME_VERSION,
    mode: plan.mode,
    status: 'provider-required',
    editable: plan.generation.editable,
    blank: plan.generation.blank,
    renderContract: {
      source: plan.documentSnapshot || null,
      template: plan.template,
      layout: plan.layoutResult,
      presentation: input.presentation || {}
    },
    providerBoundary: { required: true, provider: null }
  });
}

export function finalizeDocxRuntimeRequest(runtimeRequest, result = {}) {
  if (!runtimeRequest?.providerBoundary?.required) throw new Error('Invalid DOCX runtime request.');
  if (!result.artifact) throw new Error('A generated DOCX artifact is required.');
  return Object.freeze({
    ...runtimeRequest,
    status: 'generated',
    providerBoundary: { ...runtimeRequest.providerBoundary, provider: result.provider || null },
    artifact: result.artifact,
    generatedAt: result.generatedAt || new Date().toISOString()
  });
}
