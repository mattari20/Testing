export const CV_EDITOR_SURFACE_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function createCVEditorSurface(options={}) {
 const runtime=options.runtime; if(!runtime)throw new Error('Editor surface requires a runtime.');
 let destroyed=false;
 const state=()=>{const s=runtime.getState();return Object.freeze({version:CV_EDITOR_SURFACE_VERSION,activeDocumentId:s.activeDocumentId,projection:clone(s.projection),layout:clone(s.layout),history:clone(s.history),workspace:clone(s.workspace)});};
 return Object.freeze({version:CV_EDITOR_SURFACE_VERSION,getState:state,refresh(){return destroyed?null:runtime.refresh();},edit(blockId,patch){return destroyed?null:runtime.edit(blockId,patch);},undo(){return destroyed?null:runtime.undo();},redo(){return destroyed?null:runtime.redo();},destroy(){destroyed=true;}});
}