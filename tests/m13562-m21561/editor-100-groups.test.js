import test from 'node:test';
import assert from 'node:assert/strict';
import {CV_EDITOR_100_GROUPS,getCVEditorGroup,listCVEditorGroups} from '../../src/application/cv-editor-100-group-registry.js';
test('editor workstream registers exactly 100 groups',()=>{assert.equal(CV_EDITOR_100_GROUPS.length,100);assert.equal(listCVEditorGroups().length,100);assert.equal(getCVEditorGroup(1).domain,'editing');assert.equal(getCVEditorGroup(100).domain,'production');});
