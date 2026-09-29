import { createPdfPrintGenerationPlan, GENERATION_MODE } from './pdf-print-generator.js';

export const PDF_PRINT_RUNTIME_VERSION = '1.0.0';

export function createPdfPrintRuntimeRequest(input = {}) {
  const plan = createPdfPrintGenerationPlan(input);
  return Object.freeze({
    runtimeVersion: PDF_PRINT_RUNTIME_VERSION,
    mode: plan.mode,
    status: 'provider-required',
    pageCount: plan.generation.pageCount,
    renderContract: {
      source: plan.documentSnapshot,
      template: plan.template,
      layout: plan.layoutResult,
      presentation: input.presentation || {}
    },
    providerBoundary: {
      required: true,
      binaryFormat: plan.mode === GENERATION_MODE.PDF ? 'application/pdf' : 'browser-print',
      provider: null
    }
  });
}

export function finalizePdfPrintRuntimeRequest(runtimeRequest, result = {}) {
  if (!runtimeRequest?.providerBoundary?.required) throw new Error('Invalid PDF/print runtime request.');
  if (!result.artifact) throw new Error('A generated artifact is required to finalize PDF/print output.');
  return Object.freeze({
    ...runtimeRequest,
    status: 'generated',
    providerBoundary: { ...runtimeRequest.providerBoundary, provider: result.provider || null },
    artifact: result.artifact,
    generatedAt: result.generatedAt || new Date().toISOString()
  });
}
