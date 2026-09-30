import test from 'node:test';
import assert from 'node:assert/strict';
import manifest from '../../docs/03-implementation/FINAL_WORD_TEMPLATE_ASSET_MANIFEST.json' with { type: 'json' };

test('final Word asset manifest contains exactly seven unique production assets', () => {
  assert.equal(manifest.assets.length, 7);
  assert.equal(new Set(manifest.assets.map(asset => asset.templateId)).size, 7);
  assert.equal(new Set(manifest.assets.map(asset => asset.fileName)).size, 7);
  for (const asset of manifest.assets) {
    assert.match(asset.fileName, /^T0[1-7]-.*\.docx$/);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    assert.ok(Number.isInteger(asset.sizeBytes) && asset.sizeBytes > 0);
  }
});

test('final Word asset manifest uses the public download base path', () => {
  assert.equal(manifest.productionBasePath, '/cv-builder/word-templates/');
});
