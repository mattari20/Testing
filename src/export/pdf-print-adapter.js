import { createPdfPrintRuntimeRequest, finalizePdfPrintRuntimeRequest } from './pdf-print-runtime.js';

export const PDF_PRINT_ADAPTER_VERSION = '1.0.0';

export function createPdfPrintAdapterRequest(input = {}) {
  const runtime = createPdfPrintRuntimeRequest(input);
  return Object.freeze({
    adapterVersion: PDF_PRINT_ADAPTER_VERSION,
    runtime,
    adapter: {
      kind: runtime.mode === 'pdf' ? 'pdf-binary' : 'print',
      provider: null,
      implementationRequired: true
    }
  });
}

export function attachPdfPrintArtifact(request, artifact, provider = null) {
  if (!artifact) throw new Error('PDF/Print artifact is required.');
  return finalizePdfPrintRuntimeRequest(request.runtime, { artifact, provider });
}
