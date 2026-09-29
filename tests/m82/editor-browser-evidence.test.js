import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorBrowserEvidence } from '../../src/validation/editor-browser-evidence.js';
test('editor evidence requires all browser checks',()=>{
 const e=createEditorBrowserEvidence({});
 assert.equal(e.status,'incomplete');
 const p=createEditorBrowserEvidence({mount:'passed',fields:'passed',mutation:'passed',preview:'passed',templateSwitch:'passed'});
 assert.equal(p.status,'passed');
});
