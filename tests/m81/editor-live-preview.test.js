import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorLivePreview } from '../../src/ui/editor-live-preview.js';

test('live preview ignores stale refreshes',async()=>{
 const calls=[];
 let resolveFirst;
 const first=new Promise(r=>{resolveFirst=r;});
 let n=0;
 const live=createEditorLivePreview({getState:()=>({session:{}})},async()=>{n++;if(n===1)return first;return {id:2};},p=>calls.push(p));
 const a=live.refresh(); const b=live.refresh(); resolveFirst({id:1});
 await Promise.all([a,b]);
 assert.deepEqual(calls,[{id:2}]);
});
