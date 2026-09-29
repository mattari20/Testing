import { createEditorSession } from './editor-session.js';
import { createEditorCommand } from './editor-command-contract.js';
import { executeEditorCommand } from './editor-command-executor.js';
import { createEditorPreview } from './editor-preview-controller.js';

export const EDITOR_SURFACE_VERSION = '1.0.0';

export function createEditorSurface(input={}) {
  let state=Object.freeze({session:createEditorSession(input),preview:null});
  return Object.freeze({
    version:EDITOR_SURFACE_VERSION,
    getState:()=>state,
    dispatch(commandInput){
      const command=createEditorCommand(commandInput);
      state=Object.freeze({...state,session:executeEditorCommand(state.session,command)});
      return state;
    },
    preview(options={}){
      state=Object.freeze({...state,preview:createEditorPreview(state.session,options)});
      return state.preview;
    }
  });
}
