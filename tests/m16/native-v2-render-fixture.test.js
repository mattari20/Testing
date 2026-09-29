import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createNativeRenderDefinition, renderNativeTemplateSource } from '../../src/render/native-v2-template-renderer.js';

const html = `<div data-v2-template-root data-v2-template-id="fixture" data-v2-template-version="2.0.0">
  <h1 data-v2-value="identity.fullName" data-v2-visible-when="identity.fullName"></h1>
  <div data-v2-section="experience" data-v2-visible-when="section:experience">
    <article data-v2-repeat="experience:entries">
      <span data-v2-entry-value="company"></span>
      <span data-v2-entry-value="title"></span>
    </article>
  </div>
  <div data-v2-section="skills" data-v2-visible-when="section:skills">
    <span data-v2-repeat="skills:values"><b data-v2-item-value="value"></b></span>
  </div>
</div>`;

const snapshot = {
  careerData: {
    identity: { name: 'Ali Akbar' },
    sections: [
      { id:'exp', type:'experience', visibility:true, entries:[
        {id:'e1',visibility:true,values:{company:'ABC',title:'Engineer'}},
        {id:'e2',visibility:false,values:{company:'Hidden',title:'Hidden'}}
      ]},
      { id:'skills', type:'skills', visibility:true, entries:[
        {id:'s1',visibility:true,values:{value:'JavaScript'}},
        {id:'s2',visibility:true,values:{value:'Architecture'}}
      ]}
    ],
    assets:[]
  },
  configuration:{hiddenSections:[],hiddenEntries:[]}
};

const dom = new JSDOM('<!doctype html><body></body>');
const definition=createNativeRenderDefinition({id:'fixture',sourceHtml:html});
const result=renderNativeTemplateSource(definition,snapshot,dom.window.document);

assert.equal(result.state,'ready');
assert.equal(result.root.querySelector('h1')?.textContent,'Ali Akbar');
assert.equal(result.root.querySelectorAll('[data-v2-entry-value="company"]').length,1);
assert.equal(result.root.querySelector('[data-v2-entry-value="company"]')?.textContent,'ABC');
assert.equal(result.root.querySelectorAll('[data-v2-item-value="value"]').length,2);
assert.equal(result.root.textContent.includes('Hidden'),false);
assert.equal(result.root.textContent.includes('undefined'),false);

console.log('Native V2 browser-style render fixture passed.');
