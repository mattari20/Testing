import { createDocxRuntimeRequest, finalizeDocxRuntimeRequest } from './docx-runtime.js';

export const DOCX_ADAPTER_VERSION = '1.0.0';

export function createDocxAdapterRequest(input = {}) {
  const runtime = createDocxRuntimeRequest(input);
  return Object.freeze({
    adapterVersion: DOCX_ADAPTER_VERSION,
    runtime,
    adapter: {
      kind: runtime.blank ? 'blank-docx' : 'generated-docx',
      provider: null,
      implementationRequired: true
    }
  });
}

export function attachDocxArtifact(request, artifact, provider = null) {
  if (!artifact) throw new Error('DOCX artifact is required.');
  return finalizeDocxRuntimeRequest(request.runtime, { artifact, provider });
}
