import test from 'node:test';
import assert from 'node:assert/strict';
import {CV_EDITOR_DESIGN_TOKENS,CV_EDITOR_DESIGN_TOKENS_VERSION} from '../../src/application/cv-editor-design-tokens.js';
import {createCVEditorStyleSheet,CV_EDITOR_STYLE_SHEET_VERSION} from '../../src/application/cv-editor-style-sheet.js';

function fakeDocument(){
 const head={nodes:[],appendChild(node){this.nodes.push(node);},removeChild(node){this.nodes=this.nodes.filter(item=>item!==node);}};
 return {head,createElement(){return {attributes:{},setAttribute(k,v){this.attributes[k]=v;},remove(){},textContent:''};}};
}
test('editor CSS tokens define the production visual system',()=>{
 assert.equal(CV_EDITOR_DESIGN_TOKENS_VERSION,'2.0.0');
 assert.equal(CV_EDITOR_DESIGN_TOKENS.colors.accent,'#2457d6');
 assert.equal(CV_EDITOR_DESIGN_TOKENS.layout.pageWidth,'210mm');
 assert.ok(CV_EDITOR_DESIGN_TOKENS.spacing.xxl);
});
test('editor stylesheet mounts scoped responsive print CSS',()=>{
 const document=fakeDocument();const sheet=createCVEditorStyleSheet({document});
 assert.equal(CV_EDITOR_STYLE_SHEET_VERSION,'2.0.0');assert.equal(document.head.nodes.length,1);
 assert.equal(sheet.node.attributes['data-cv-editor-style'],'v2');
 assert.match(sheet.node.textContent,/data-cv-editor-main/);
 assert.match(sheet.node.textContent,/@media\(max-width:600px\)/);
 assert.match(sheet.node.textContent,/@media print/);
 sheet.destroy();
});

test('editor CSS contract covers core interactive selectors',()=>{
 const document=fakeDocument();const sheet=createCVEditorStyleSheet({document});
 assert.match(sheet.node.textContent,/data-editor-entry/);
 assert.match(sheet.node.textContent,/data-template-card/);
 assert.match(sheet.node.textContent,/focus-visible/);
 assert.match(sheet.node.textContent,/prefers-reduced-motion/);
 assert.match(sheet.node.textContent,/page-break-after/);
 sheet.destroy();
});
