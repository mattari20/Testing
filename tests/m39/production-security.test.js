import test from 'node:test';
import assert from 'node:assert/strict';
import { OPERATION, VISIBILITY } from '../../src/security/security-privacy-engine.js';
import { authorizeOperation, createPrivacySafeProcessingRequest } from '../../src/security/production-security.js';
const owner={ownerId:'u1',objectType:'cv',objectId:'cv1'};
test('allows owner edit',()=>assert.equal(authorizeOperation({ownership:owner,actorId:'u1',operation:OPERATION.EDIT}).allowed,true));
test('blocks non-owner edit',()=>assert.equal(authorizeOperation({ownership:owner,actorId:'u2',operation:OPERATION.EDIT}).allowed,false));
test('blocks publish while private',()=>assert.equal(authorizeOperation({ownership:owner,actorId:'u1',operation:OPERATION.PUBLISH,policy:{visibility:VISIBILITY.PRIVATE}}).allowed,false));
test('external processing requires policy permission',()=>{const r=createPrivacySafeProcessingRequest({externalProcessing:true,policy:{allowExternalProcessing:false},fields:['name','email']});assert.equal(r.externalProcessingAllowed,false);assert.deepEqual(r.dataMinimization,['name','email']);});

test('blocks export when downloads are disabled',()=>assert.equal(authorizeOperation({ownership:owner,actorId:'u1',operation:OPERATION.EXPORT,policy:{downloadable:false}}).allowed,false));
test('blocks sharing while private',()=>assert.equal(authorizeOperation({ownership:owner,actorId:'u1',operation:OPERATION.SHARE,policy:{visibility:VISIBILITY.PRIVATE}}).allowed,false));
test('allows export when downloads are enabled',()=>assert.equal(authorizeOperation({ownership:owner,actorId:'u1',operation:OPERATION.EXPORT,policy:{downloadable:true}}).allowed,true));
