import test from 'node:test';
import assert from 'node:assert/strict';
import {createCVEditorPaneState} from '../../src/application/cv-editor-pane-state.js';
import {createCVEditorSaveIndicator} from '../../src/application/cv-editor-save-indicator.js';
import {createCVEditorExportPanel} from '../../src/application/cv-editor-export-panel.js';
import {createCVEditorATSPanel} from '../../src/application/cv-editor-ats-panel.js';
import {createCVEditorJobMatchPanel} from '../../src/application/cv-editor-job-match-panel.js';
import {createCVEditorAIPanel} from '../../src/application/cv-editor-ai-panel.js';
import {createCVEditorResponsiveLayout} from '../../src/application/cv-editor-responsive-layout.js';
import {createCVEditorUXAcceptance} from '../../src/application/cv-editor-ux-acceptance.js';

test('editor UX state and panels expose stable contracts',()=>{
 const panes=createCVEditorPaneState(); assert.equal(panes.get().preview,true); assert.equal(panes.toggle('preview').preview,false);
 const status={getState:()=>({status:'saved'})}; const indicator=createCVEditorSaveIndicator({status}); assert.equal(indicator.label(),'Saved');
 const exportPanel=createCVEditorExportPanel({controller:{prepare:f=>({format:f,status:'ready'})}}); assert.equal(exportPanel.prepare('pdf').status,'ready');
 const ats=createCVEditorATSPanel({analyzer:{analyze:x=>({score:x.score||0})}}); assert.equal(ats.analyze({score:80}).score,80);
 const match=createCVEditorJobMatchPanel({matcher:{match:()=>({score:70})}}); assert.equal(match.match({},{}).score,70);
 const ai=createCVEditorAIPanel({review:{getState:()=>({pending:[]}),accept:i=>i,reject:i=>i}}); assert.deepEqual(ai.state(),{pending:[]});
 const modes=[]; const responsive=createCVEditorResponsiveLayout({layout:{setMode:m=>{modes.push(m);return m;}}}); responsive.apply(600); responsive.apply(900); responsive.apply(1200); assert.deepEqual(modes,['mobile','tablet','desktop']);
});
test('UX acceptance reports complete browser composition surface',()=>{
 const acceptance=createCVEditorUXAcceptance({application:{page:{shell:{root:{}}},model:{},composition:{readiness:{}}}});
 assert.equal(acceptance.ready(),true);
});
