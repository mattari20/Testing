import test from 'node:test';
import assert from 'node:assert/strict';
import { VISIBILITY } from '../../src/security/security-privacy-engine.js';
import { createOnlineCVPublication, revokeOnlineCVPublication } from '../../src/publishing/online-cv-boundary.js';
const snapshot={masterProfileId:'p1',targetedCVId:'cv1',targetedCVRevision:'2'};
test('publishes a link-only CV projection',()=>{const p=createOnlineCVPublication({documentSnapshot:snapshot,policy:{visibility:VISIBILITY.LINK_ONLY,publicFields:['name']},publicProfile:{name:'Ali',email:'private'}});assert.equal(p.state,'published');assert.equal(p.publicProjection.name,'Ali');assert.equal(p.publicProjection.email,undefined);});
test('revokes publication and removes public projection',()=>{const p=createOnlineCVPublication({documentSnapshot:snapshot,policy:{visibility:VISIBILITY.PUBLIC},publicProfile:{name:'Ali'}});const r=revokeOnlineCVPublication(p);assert.equal(r.state,'revoked');assert.deepEqual(r.publicProjection,{});});
