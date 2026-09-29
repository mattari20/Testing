import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { updateEntryThroughEditor, removeEntryThroughEditor } from '../../src/ui/section-editor-controller.js';

test('section editor exposes entry mutation commands',()=>{
 const surface=createEditorSurface({profileData:{sections:[{id:'exp',type:'experience',repeatable:true,entries:[{id:'e1',values:{company:'Old'}}]}]}});
 updateEntryThroughEditor(surface,'exp','e1',{company:'New'});
 assert.equal(surface.getState().session.application.masterProfile.careerData.sections[0].entries[0].values.company,'New');
 removeEntryThroughEditor(surface,'exp','e1');
 assert.equal(surface.getState().session.application.masterProfile.careerData.sections[0].entries.length,0);
});
