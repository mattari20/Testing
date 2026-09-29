export const EXTRACTION_CONTRACT_VERSION = '1.0.0';

export const EXTRACTION_KIND = Object.freeze({
  PDF: 'pdf',
  DOCX: 'docx',
  STRUCTURED: 'structured'
});

export function createExtractionAdapter(input = {}) {
  if (!Object.values(EXTRACTION_KIND).includes(input.kind)) throw new Error('Unsupported extraction kind.');
  if (!input.extract || typeof input.extract !== 'function') throw new Error('Extraction function is required.');
  return Object.freeze({
    version: EXTRACTION_CONTRACT_VERSION,
    kind: input.kind,
    providerId: input.providerId ? String(input.providerId) : null,
    extract: input.extract
  });
}

export async function extractDocument(adapter, source) {
  if (!adapter?.extract) throw new Error('Extraction adapter is required.');
  const result = await adapter.extract(source);
  if (!result) throw new Error('Extraction adapter returned no result.');
  return Object.freeze({
    kind: adapter.kind,
    providerId: adapter.providerId,
    result
  });
}
