export const CV_DOCUMENT_SWITCHING_VERSION='1.0.0';
export function createCVDocumentSwitchingController(options={}) {
 const runtime=options.runtime; const workspace=options.workspace||runtime?.getWorkspace();
 if(!runtime||!workspace) throw new Error('Document switching requires runtime and workspace.');
 let dirty=false; let destroyed=false;
 const list=()=>workspace.getState().documents.map(d=>Object.freeze({id:d.id,title:d.title||'',status:d.status||'draft',active:d.id===workspace.getState().activeDocumentId}));
 return Object.freeze({
  version:CV_DOCUMENT_SWITCHING_VERSION,
  getState:()=>Object.freeze({version:CV_DOCUMENT_SWITCHING_VERSION,activeDocumentId:workspace.getState().activeDocumentId,dirty,documents:list()}),
  setDirty(value){if(destroyed)return null;dirty=Boolean(value);return this.getState();},
  canSwitch(){return !destroyed&&!dirty;},
  switchTo(documentId,options={}){if(destroyed)return null;const id=String(documentId);if(dirty&&!options.confirm)throw new Error('Unsaved CV changes require confirmation before switching.');workspace.setActiveDocument(id);dirty=false;return runtime.refresh();},
  activate(documentId){return this.switchTo(documentId,{confirm:true});},
  destroy(){destroyed=true;dirty=false;}
 });
}