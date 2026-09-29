import assert from 'node:assert/strict';
import {
  V1_ASSET_STATE,
  listV1AssetManifest,
  getV1AssetManifestEntry,
  createV1IngestionRecord,
  evaluateV1Ingestion
} from '../../src/templates/v1-asset-manifest.js';

const manifest = listV1AssetManifest();
assert.equal(manifest.length, 7);
assert.ok(manifest.every(item => item.sourceHtml.endsWith('.html')));
assert.ok(manifest.every(item => item.state === V1_ASSET_STATE.RECONCILIATION_REQUIRED));

const t01 = getV1AssetManifestEntry('t01-modern-minimalist-cv-design_modern');
assert.equal(t01.sourceHtml, 'cv-template/t01-modern-minimalist-cv-design_modern.html');
assert.equal(t01.docx.endsWith('.docx'), true);
assert.equal(t01.preview.endsWith('.webp'), true);

const pending = createV1IngestionRecord({ templateId: t01.templateId });
assert.equal(evaluateV1Ingestion(pending).readyForAdapter, false);
assert.ok(evaluateV1Ingestion(pending).diagnostics.includes('SOURCE_EXTRACTION_PENDING'));

const reconciled = createV1IngestionRecord({
  templateId: t01.templateId,
  sourceAvailable: true,
  extracted: true,
  reconciled: true,
  state: V1_ASSET_STATE.VALIDATED,
  evidence: ['source-html-recovered', 'visual-baseline-captured']
});
assert.equal(evaluateV1Ingestion(reconciled).readyForAdapter, true);

console.log('M13 V1 asset manifest tests passed.');
