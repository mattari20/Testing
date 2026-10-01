import { createCVWorkspace } from './cv-workspace.js';
import { projectCVContent } from './cv-section-field-projection.js';
import { createPaginationRuntime } from './cv-pagination-runtime.js';
import { createPreviewEditSession } from './cv-preview-editing.js';
import { createEditorCommandHistory } from './cv-editor-command-history.js';

export const CV_EDITOR_RUNTIME_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));

export function createCVEditorRuntime(input={}) {
  const workspace=input.workspace||createCVWorkspace(input);
  const pagination=createPaginationRuntime();
  const previewEditing=createPreviewEditSession();
  let destroyed=false;
  let projection=null;
  let layoutResult=null;
  let currentProfile=workspace.getState().masterProfile;
  let currentDocument=workspace.getActiveDocument();
  const history=createEditorCommandHistory({
    getSnapshot:()=>({masterProfile:currentProfile,document:currentDocument}),
    restoreSnapshot:s=>{currentProfile=clone(s.masterProfile);currentDocument=clone(s.document);}
  });
  function refresh(){currentProfile=workspace.getState().masterProfile;currentDocument=workspace.getActiveDocument();projection=projectCVContent(currentProfile,currentDocument);layoutResult=pagination.paginate(projection,input.pagination||{});return state();}
  function state(){return Object.freeze({version:CV_EDITOR_RUNTIME_VERSION,activeDocumentId:currentDocument?.id||null,projection:clone(projection),layout:clone(layoutResult),history:history.getState()});}
  return Object.freeze({
    version:CV_EDITOR_RUNTIME_VERSION,
    getState:state,
    refresh(){if(destroyed)return null;return refresh();},
    edit(blockId,patch={}){if(destroyed)return null;const before=clone({masterProfile:currentProfile,document:currentDocument});previewEditing.apply(currentProfile,blockId,patch);history.execute({label:'Preview edit',do:()=>{}});const after=clone({masterProfile:currentProfile,document:currentDocument});void before;void after;return refresh();},
    undo(){if(destroyed)return null;history.undo();return refresh();},
    redo(){if(destroyed)return null;history.redo();return refresh();},
    getWorkspace(){return workspace;},
    destroy(){if(destroyed)return;destroyed=true;history.destroy();previewEditing.destroy();pagination.destroy();}
  });
}
