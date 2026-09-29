import test from 'node:test';
import assert from 'node:assert/strict';
import { createArtifactLifecycle, revokeArtifact, markArtifactExpired } from '../../src/export/artifact-lifecycle.js';
const artifact={artifactId:'a1',outputType:'pdf',source:{templateId:'t1',templateVersion:'2.0.0'},generation:{requestId:'r1',engineVersion:'1.0.0'},validation:{valid:true}};
test('creates downloadable artifact lifecycle',()=>{const l=createArtifactLifecycle({artifact,filename:'cv.pdf',contentType:'application/pdf'});assert.equal(l.download.available,true);});
test('revokes download',()=>{const l=createArtifactLifecycle({artifact});const r=revokeArtifact(l);assert.equal(r.download.available,false);});
test('expires download',()=>{const l=createArtifactLifecycle({artifact});const r=markArtifactExpired(l);assert.equal(r.state,'expired');});
