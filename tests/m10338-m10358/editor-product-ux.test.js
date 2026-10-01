import test from 'node:test';
import assert from 'node:assert/strict';
import {createCVEditorPaneState} from '../../src/application/cv-editor-pane-state.js';
import {createCVEditorResponsiveLayout} from '../../src/application/cv-editor-responsive-layout.js';
import {createCVEditorSaveIndicator} from '../../src/application/cv-editor-save-indicator.js';

test('product UX contracts cover panes, responsive modes and save labels',()=>{
 const panes=createCVEditorPaneState();assert.equal(panes.get().form,true);assert.equal(panes.toggle('insights').insights,true);
 const modes=[];const responsive=createCVEditorResponsiveLayout({layout:{setMode:m=>{modes.push(m);return m;}}});
 responsive.apply(500);responsive.apply(800);responsive.apply(1200);assert.deepEqual(modes,['mobile','tablet','desktop']);
 const indicator=createCVEditorSaveIndicator({status:{getState:()=>({status:'unsaved'})}});assert.equal(indicator.label(),'Unsaved changes');
});
