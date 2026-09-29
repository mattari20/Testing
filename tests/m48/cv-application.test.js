import test from 'node:test';
import assert from 'node:assert/strict';
import { createCVApplication, createApplicationSnapshot } from '../../src/application/cv-application.js';
test('creates application with master profile and targeted CV',()=>{const a=createCVApplication({profileData:{careerData:{identity:{name:'Ali'}}},cvData:{title:'Engineer CV'}});assert.ok(a.masterProfile.id);assert.equal(a.targetedCV.masterProfileId,a.masterProfile.id);assert.ok(a.lifecycle);});
test('creates snapshot from application state',()=>{const a=createCVApplication({profileData:{careerData:{identity:{name:'Ali'}}}});const s=createApplicationSnapshot(a);assert.equal(s.masterProfileId,a.masterProfile.id);assert.equal(s.targetedCVId,a.targetedCV.id);});
