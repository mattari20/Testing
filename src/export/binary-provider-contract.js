export const BINARY_PROVIDER_CONTRACT_VERSION = '1.0.0';

export const PROVIDER_KIND = Object.freeze({
  PDF: 'pdf',
  PRINT: 'print',
  DOCX: 'docx',
  BLANK_DOCX: 'blank-docx'
});

export function createBinaryProviderContract(input = {}) {
  if (!input.kind || !Object.values(PROVIDER_KIND).includes(input.kind)) {
    throw new Error('A supported binary provider kind is required.');
  }
  if (!input.generate || typeof input.generate !== 'function') {
    throw new Error('A binary provider generate function is required.');
  }
  return Object.freeze({
    version: BINARY_PROVIDER_CONTRACT_VERSION,
    kind: input.kind,
    providerId: input.providerId ? String(input.providerId) : null,
    generate: input.generate
  });
}

export async function generateWithBinaryProvider(contract, request) {
  if (!contract?.generate) throw new Error('Binary provider contract is required.');
  const artifact = await contract.generate(request);
  if (!artifact) throw new Error('Binary provider returned no artifact.');
  return Object.freeze({
    providerId: contract.providerId,
    kind: contract.kind,
    artifact
  });
}
