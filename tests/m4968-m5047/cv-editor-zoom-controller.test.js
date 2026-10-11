import test from 'node:test';import assert from 'node:assert/strict';import {createCVEditorZoomController} from '../../src/application/cv-editor-zoom-controller.js';class N{setAttribute(){}}test('clamps zoom',()=>{const z=createCVEditorZoomController({container:new N()});assert.equal(z.set(3),2);assert.equal(z.set(.1),.5);});

test('applies user zoom on top of responsive fit scale',()=>{
 const page={offsetHeight:1000,style:{}};
 const stage={dataset:{previewScale:'0.5'},style:{},querySelector:()=>page};
 const attrs={};
 const container={setAttribute:(k,v)=>attrs[k]=v,querySelector:()=>stage};
 const z=createCVEditorZoomController({container});
 assert.equal(z.set(1.2),1.2);
 assert.equal(attrs['data-preview-zoom'],'1.2');
 assert.equal(page.style.transform,'scale(0.6)');
 assert.equal(stage.style.height,'600px');
 z.reset();
 assert.equal(page.style.transform,'scale(0.5)');
 assert.equal(stage.style.height,'500px');
});
