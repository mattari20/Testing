import test from 'node:test';
import assert from 'node:assert/strict';
import {createCVEditorEventBus} from '../../src/application/cv-editor-event-bus.js';
import {createCVEditorStateBridge} from '../../src/application/cv-editor-state-bridge.js';
import {createCVEditorRenderScheduler} from '../../src/application/cv-editor-render-scheduler.js';
import {createCVEditorCommandRouter} from '../../src/application/cv-editor-command-router.js';
import {createCVEditorErrorBoundary} from '../../src/application/cv-editor-error-boundary.js';
import {createCVEditorLifecycle} from '../../src/application/cv-editor-lifecycle.js';
import {createCVEditorIntegration} from '../../src/application/cv-editor-integration.js';
import {createCVEditorBrowserComposition} from '../../src/application/cv-editor-browser-composition.js';

test('M5528-M7127 browser integration foundations compose safely',async()=>{
 const bus=createCVEditorEventBus();let seen=0;bus.on('state:changed',()=>seen++);
 let state={value:'a'};const adapter={getState:()=>state,edit:(id,patch)=>{state={...state,...patch};return state;}};
 const bridge=createCVEditorStateBridge({adapter,bus});bridge.edit('x',{value:'b'});assert.equal(seen,1);assert.equal(bridge.getLastState().value,'b');
 let rendered=0;const scheduler=createCVEditorRenderScheduler({render:()=>rendered++});scheduler.request('test');await new Promise(r=>setTimeout(r,0));assert.equal(rendered,1);
 const router=createCVEditorCommandRouter();router.register('save',()=>42);assert.equal(router.execute('save'),42);
 let captured;const boundary=createCVEditorErrorBoundary({onError:e=>captured=e});assert.equal(boundary.run(()=>{throw new Error('x')}),null);assert.equal(captured.message,'x');
 let starts=0,stops=0;const lifecycle=createCVEditorLifecycle({start:()=>starts++,stop:()=>stops++});assert.equal(lifecycle.boot(),'running');assert.equal(lifecycle.shutdown(),'stopped');assert.equal(starts,1);assert.equal(stops,1);
 const integration=createCVEditorIntegration({adapter,render:()=>{}});integration.sync();integration.edit('x',{value:'c'});assert.equal(integration.bridge.getLastState().value,'c');
 const app={start:()=>{},stop:()=>{}};const composition=createCVEditorBrowserComposition({application:app,adapter});assert.equal(composition.start(),'running');composition.stop();assert.equal(composition.lifecycle.getState(),'stopped');
 scheduler.destroy();bridge.destroy();router.destroy();boundary.destroy();integration.destroy();bus.destroy();
});