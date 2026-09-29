export const V1_ASSET_MANIFEST_VERSION = '1.0.0';

export const V1_ASSET_STATE = Object.freeze({
  ARCHIVE_CONFIRMED: 'archive-confirmed',
  EXTRACTION_PENDING: 'extraction-pending',
  RECONCILIATION_REQUIRED: 'reconciliation-required',
  VALIDATED: 'validated',
  MISSING: 'missing',
  RETIRED: 'retired'
});

const clone = value => JSON.parse(JSON.stringify(value));

const entries = [
  {
    templateId: 't01-modern-minimalist-cv-design_modern',
    sourceHtml: 'cv-template/t01-modern-minimalist-cv-design_modern.html',
    docx: 'cv-template/t01-modern-minimalist-cv-design_modern.docx',
    preview: 'cv-template/t01-modern-minimalist-cv-design_modern_by_eStudent.pk.webp',
    state: V1_ASSET_STATE.EXTRACTION_PENDING,
    note: 'Source filename confirmed in supplied V1 archive; binary/source extraction still requires a RAR-capable runtime.'
  },
  {
    templateId: 't02-professional-cv-design_modern',
    sourceHtml: 'cv-template/t02-professional-cv-design_modern.html',
    docx: 'cv-template/t02-professional-cv-design_modern.docx',
    preview: 'cv-template/t02-Professional-CV-design_Modern_by_eStudent.pk.webp',
    state: V1_ASSET_STATE.EXTRACTION_PENDING
  },
  {
    templateId: 't03-professional-cv-design_modern',
    sourceHtml: 'cv-template/t03-professional-cv-design_modern.html',
    docx: 'cv-template/t03-professional-cv-design_modern.docx',
    preview: 'cv-template/t03-professional-cv-design_modern_by_eStudent.pk.webp',
    state: V1_ASSET_STATE.EXTRACTION_PENDING
  },
  {
    templateId: 't04-modern-blue-corporate_modern',
    sourceHtml: 'cv-template/t04-modern-blue-corporate_modern.html',
    docx: 'cv-template/t04-modern-blue-corporate_modern.docx',
    preview: 'cv-template/t04-modern-blue-corporate_modern_by_eStudent.pk.webp',
    state: V1_ASSET_STATE.EXTRACTION_PENDING
  },
  {
    templateId: 't05-simple-cv-graphic-web-designer_modern',
    sourceHtml: 'cv-template/t05-simple-cv-graphic-web-designer_modern.html',
    docx: 'cv-template/t05-simple-cv-graphic-web-designer_modern.docx',
    preview: 'cv-template/t05-simple-cv-graphic-web-designer_modern_by_eStudent.pk.webp',
    state: V1_ASSET_STATE.EXTRACTION_PENDING
  },
  {
    templateId: 't06-professional-cv-graphic-designer_modern',
    sourceHtml: 'cv-template/t06-professional-cv-graphic-designer_modern.html',
    docx: 'cv-template/t06-professional-cv-graphic-designer_modern.docx',
    preview: 'cv-template/t06-professional-cv-graphic-designer_modern_by_eStudent.pk.webp',
    state: V1_ASSET_STATE.EXTRACTION_PENDING
  },
  {
    templateId: 't07-professional-cv-store-manager-incharge_modern',
    sourceHtml: 'cv-template/t07-professional-cv-store-manager-incharge_modern.html',
    docx: 'cv-template/t07-professional-cv-store-manager-incharge_modern.docx',
    preview: 'cv-template/t07-professional-cv-store-manager-incharge_modern_by_eStudent.pk.webp',
    state: V1_ASSET_STATE.EXTRACTION_PENDING
  }
];

export function listV1AssetManifest() {
  return clone(entries);
}

export function getV1AssetManifestEntry(templateId) {
  return clone(entries.find(entry => entry.templateId === String(templateId)) || null);
}

export function createV1IngestionRecord(input = {}) {
  const entry = getV1AssetManifestEntry(input.templateId);
  if (!entry) throw new Error('Unknown V1 template asset: ' + input.templateId);

  return {
    version: V1_ASSET_MANIFEST_VERSION,
    templateId: entry.templateId,
    sourceArchive: String(input.sourceArchive || 'v1-golden-baseline'),
    sourceHtml: entry.sourceHtml,
    docx: entry.docx,
    preview: entry.preview,
    sourceAvailable: input.sourceAvailable === true,
    extracted: input.extracted === true,
    reconciled: input.reconciled === true,
    state: input.state || (input.extracted ? V1_ASSET_STATE.RECONCILIATION_REQUIRED : entry.state),
    evidence: clone(input.evidence || []),
    diagnostics: clone(input.diagnostics || []),
    createdAt: input.createdAt || new Date().toISOString()
  };
}

export function evaluateV1Ingestion(record) {
  const diagnostics = [];
  if (!record?.templateId) diagnostics.push('TEMPLATE_ID_REQUIRED');
  if (record?.sourceAvailable !== true) diagnostics.push('SOURCE_NOT_EXTRACTED');
  if (record?.extracted !== true) diagnostics.push('SOURCE_EXTRACTION_PENDING');
  if (record?.reconciled !== true) diagnostics.push('ASSET_RECONCILIATION_PENDING');

  return {
    readyForAdapter: diagnostics.length === 0,
    diagnostics
  };
}
