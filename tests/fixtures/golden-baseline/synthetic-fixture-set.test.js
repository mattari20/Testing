import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('sanitized Golden Baseline fixture set has all required fixture categories', async () => {
  const raw = await readFile(new URL('./synthetic-fixture-set.json', import.meta.url), 'utf8');
  const fixtureSet = JSON.parse(raw);
  assert.equal(fixtureSet.source, 'synthetic-sanitized-golden-baseline-input');
  assert.equal(fixtureSet.privacy, 'no-production-personal-data');
  assert.equal(fixtureSet.fixtures.length, 9);
  assert.deepEqual(
    fixtureSet.fixtures.map(item => item.id),
    ['A-minimal-cv','B-complete-cv','C-long-cv','D-visibility-matrix','E-theme-matrix','F-template-matrix','G-mobile-preview','H-desktop-preview','I-export']
  );
});
