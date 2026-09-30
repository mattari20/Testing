import { createEditorSession } from './editor-session.js';
import { createEditorCommand } from './editor-command-contract.js';
import { executeEditorCommand } from './editor-command-executor.js';
import { createEditorPreview } from './editor-preview-controller.js';

export const EDITOR_SURFACE_VERSION = '1.1.0';

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function historyEntry(before, after, command) {
  return Object.freeze({ before: clone(before), after: clone(after), command: clone(command) });
}

export function createEditorSurface(input={}) {
  let state=Object.freeze({
    session:createEditorSession(input),
    preview:null,
    history:{past:[],future:[]}
  });

  return Object.freeze({
    version:EDITOR_SURFACE_VERSION,
    getState:()=>state,
    canUndo:()=>state.history.past.length>0,
    canRedo:()=>state.history.future.length>0,
    dispatch(commandInput){
      const command=createEditorCommand(commandInput);

      if(command.type==='undo'){
        const past=[...state.history.past];
        const entry=past.pop();
        if(!entry) return state;
        const future=[entry,...state.history.future];
        state=Object.freeze({
          ...state,
          session:Object.freeze({...clone(entry.before),dirty:true,lastCommand:'undo'}),
          preview:null,
          history:{past,future}
        });
        return state;
      }

      if(command.type==='redo'){
        const future=[...state.history.future];
        const entry=future.shift();
        if(!entry) return state;
        const past=[...state.history.past,entry];
        state=Object.freeze({
          ...state,
          session:Object.freeze({...clone(entry.after),dirty:true,lastCommand:'redo'}),
          preview:null,
          history:{past,future}
        });
        return state;
      }

      const before=clone(state.session);
      const nextSession=executeEditorCommand(state.session,command);
      const after=clone(nextSession);
      const past=[...state.history.past,historyEntry(before,after,command)];
      state=Object.freeze({
        session:nextSession,
        preview:null,
        history:{past,future:[]}
      });
      return state;
    },
    preview(options={}){
      state=Object.freeze({...state,preview:createEditorPreview(state.session,options)});
      return state.preview;
    }
  });
}
