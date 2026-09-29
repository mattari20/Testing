import test from 'node:test';
import assert from 'node:assert/strict';
import { createLocalFirstSession, createStorageAdapter } from '../../src/storage/local-first-session.js';
test('creates local-first session',()=>{const s=createLocalFirstSession({masterProfileId:'p1'});assert.equal(s.masterProfileId,'p1');});
test('persists and loads through storage adapter',()=>{const map=new Map();const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};const a=createStorageAdapter(storage);a.save(createLocalFirstSession({targetedCVId:'cv1'}));assert.equal(a.load().targetedCVId,'cv1');a.clear();assert.equal(a.load(),null);});
