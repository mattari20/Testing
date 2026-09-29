import assert from 'node:assert/strict';
import { createPlaywrightPageAdapter } from '../../src/render/playwright-page-adapter.js';

const calls=[];
const page={
 setContent:async()=>calls.push('setContent'),
 addScriptTag:async()=>calls.push('addScriptTag'),
 evaluate:async()=>({renderStatus:'ready',renderDiagnostics:[],blocks:[{id:'x',kind:'content',measuredHeight:100,measuredWidth:700}]}),
 close:async()=>calls.push('close')
};
const adapter=createPlaywrightPageAdapter(page,{rendererSource:'function renderNativeTemplateSource(){}'});
const result=await adapter.renderAndMeasure({template:{id:'t-test',version:'2.0.0'},sourceHtml:'<div data-v2-template-root></div>',snapshot:{}});
assert.equal(result.renderStatus,'ready');
assert.equal(result.blocks.length,1);
assert.deepEqual(calls,['setContent','addScriptTag']);
await adapter.close();
assert.equal(calls.at(-1),'close');
console.log('M25 Playwright adapter tests passed.');