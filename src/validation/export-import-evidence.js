export const EXPORT_IMPORT_EVIDENCE_VERSION = '1.0.0';

export function createExportEvidence(input = {}) {
  return Object.freeze({
    version: EXPORT_IMPORT_EVIDENCE_VERSION,
    outputType: input.outputType || null,
    artifactId: input.artifactId || null,
    generationStatus: input.generationStatus || 'pending',
    validationStatus: input.validationStatus || 'pending',
    provenanceStatus: input.provenanceStatus || 'pending',
    artifact: input.artifact || null
  });
}

export function createImportEvidence(input = {}) {
  return Object.freeze({
    version: EXPORT_IMPORT_EVIDENCE_VERSION,
    sourceType: input.sourceType || null,
    extractionStatus: input.extractionStatus || 'pending',
    reviewStatus: input.reviewStatus || 'pending',
    acceptanceStatus: input.acceptanceStatus || 'pending',
    provenanceStatus: input.provenanceStatus || 'pending',
    lossClassification: input.lossClassification || null
  });
}

export function validateExportEvidence(evidence) {
  const errors=[];
  if (!evidence?.outputType) errors.push('OUTPUT_TYPE_REQUIRED');
  if (!evidence?.generationStatus || evidence.generationStatus !== 'passed') errors.push('GENERATION_NOT_PASSED');
  if (evidence?.validationStatus !== 'passed') errors.push('VALIDATION_NOT_PASSED');
  if (evidence?.provenanceStatus !== 'passed') errors.push('PROVENANCE_NOT_PASSED');
  if (!evidence?.artifact) errors.push('ARTIFACT_REQUIRED');
  return {valid:errors.length===0,errors};
}

export function validateImportEvidence(evidence) {
  const errors=[];
  if (!evidence?.sourceType) errors.push('SOURCE_TYPE_REQUIRED');
  if (evidence?.extractionStatus !== 'passed') errors.push('EXTRACTION_NOT_PASSED');
  if (evidence?.reviewStatus !== 'passed') errors.push('REVIEW_NOT_PASSED');
  if (evidence?.acceptanceStatus !== 'passed') errors.push('ACCEPTANCE_NOT_PASSED');
  if (evidence?.provenanceStatus !== 'passed') errors.push('PROVENANCE_NOT_PASSED');
  return {valid:errors.length===0,errors};
}
