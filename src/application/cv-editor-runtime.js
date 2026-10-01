import { createCVWorkspace } from './cv-workspace.js';
import { projectCVContent } from './cv-section-field-projection.js';
import { createPaginationRuntime } from './cv-pagination-runtime.js';
import { createPreviewEditSession } from './cv-preview-editing.js';
import { createEditorCommandHistory } from './cv-editor-command-history.js';
export const CV_EDITOR_RUNTIME_VERSION='1.1.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function createCVEditorRuntime(input={}) {
 const workspace=input.workspace||createCVWorkspace(input); const pagination=createPaginationRuntime(); const previewEditing=createPreviewEditSession();
 let destroyed=false, projection=null, layoutResult=null;
 let currentProfile=clone(workspace.getState().masterProfile); let currentDocument=clone(workspace.getActiveDocument());
 const runtimeSnapshot=()=>({masterProfile:clone(currentProfile),document:clone(currentDocument)});
 const commitRuntimeState=(type='editor-edit')=>workspace.replaceState({...workspace.getState(),masterProfile:currentProfile,documents:workspace.getState().documents.map(d=>d.id===currentDocument.id?currentDocument:d)},{type});
 const history=createEditorCommandHistory({getSnapshot:runtimeSnapshot,restoreSnapshot:s=>{currentProfile=clone(s.masterProfile);currentDocument=clone(s.document);commitRuntimeState('editor-history-restore');}});
 function refresh(){if(destroyed)return null;const ws=workspace.getState();currentProfile=clone(ws.masterProfile);currentDocument=clone(workspace.getActiveDocument());projection=projectCVContent(currentProfile,currentDocument);layoutResult=pagination.paginate(projection,input.pagination||{});return state();}
 function state(){return Object.freeze({version:CV_EDITOR_RUNTIME_VERSION,activeDocumentId:currentDocument?.id||null,projection:clone(projection),layout:clone(layoutResult),history:history.getState(),workspace:workspace.getDiagnostics()});}
 return Object.freeze({version:CV_EDITOR_RUNTIME_VERSION,getState:state,refresh,edit(blockId,patch={}){if(destroyed)return null;history.execute({label:'Preview edit',do:()=>{previewEditing.apply(currentProfile,blockId,patch);commitRuntimeState('editor-edit');}});return refresh();},undo(){if(destroyed)return null;history.undo();return refresh();},redo(){if(destroyed)return null;history.redo();return refresh();},getWorkspace(){return workspace;},destroy(){if(destroyed)return;destroyed=true;history.destroy();previewEditing.destroy();pagination.destroy();}});
}