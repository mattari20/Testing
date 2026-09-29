import assert from 'node:assert/strict';
import {
  createRenderDefinition,
  createBindingPlan,
  resolveBindingValue,
  buildSemanticLayoutBlocks
} from '../../src/render/template-render-engine.js';

const definition = createRenderDefinition({
  id: 'test-template',
  templateVersion: '1.0.0',
  sourceHtml: '<div data-v2-template-root><span class="name"></span></div>',
  bindingPlan: createBindingPlan({
    '.name': 'identity.fullName'
  })
});

assert.equal(definition.id, 'test-template');
assert.equal(definition.bindingPlan['.name'].path, 'identity.fullName');
assert.equal(resolveBindingValue({ identity: { fullName: 'Ali' } }, 'identity.fullName'), 'Ali');
assert.equal(resolveBindingValue({ identity: { fullName: 'Ali' } }, 'identity.missing'), undefined);

const blocks = buildSemanticLayoutBlocks({
  blocks: [
    { id: 'summary', kind: 'content', measuredHeight: 120.5, measuredWidth: 700 },
    { id: 'experience', kind: 'experience-entry', measuredHeight: 340 }
  ]
});
assert.equal(blocks.length, 2);
assert.equal(blocks[0].measuredHeight, 120.5);
assert.equal(blocks[1].kind, 'experience-entry');

assert.throws(
  () => createRenderDefinition({ id: 'missing-source' }),
  /sourceHtml is required/
);

console.log('M12 template rendering foundation tests passed.');
