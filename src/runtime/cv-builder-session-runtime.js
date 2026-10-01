import {createCVBuilderLocalStore} from './cv-builder-local-store.js';
export const CV_BUILDER_SESSION_RUNTIME_VERSION='1.0.0';
export function createCVBuilderSessionRuntime(options={}){
 const adapter=options.adapter;if(!adapter)throw new Error('Session runtime requires adapter.');
 const store=options.store||createCVBuilderLocalStore({storage:options.storage,prefix:options.prefix});
 const sessionKey=options.sessionKey||'active-session';
 function snapshot(){return {savedAt:new Date().toISOString(),state:adapter.getState?.()??null};}
 function save(){return store.write(sessionKey,snapshot());}
 function restore(){const item=store.read(sessionKey);if(!item?.state)return {restored:false,reason:'empty'};adapter.replaceState?.(item.state);return {restored:true,savedAt:item.savedAt};}
 function clear(){store.remove(sessionKey);}
 return Object.freeze({version:CV_BUILDER_SESSION_RUNTIME_VERSION,store,snapshot,save,restore,clear});
}