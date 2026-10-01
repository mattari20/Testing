export const CV_EDITOR_TOOLBAR_CONTROLLER_VERSION='1.0.0';
export function createCVEditorToolbarController(options={}) {
 const document=options.document,adapter=options.adapter,shell=options.shell;if(!document||!adapter||!shell)throw new Error('Toolbar controller requires document, adapter and shell.');
 let destroyed=false;
 const button=(label,action,key)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('data-editor-action',key);b.addEventListener('click',()=>{if(!destroyed)action();});shell.toolbar.appendChild(b);return b;};
 const undo=button('Undo',()=>{adapter.undo();options.onChange?.()},'undo');
 const redo=button('Redo',()=>{adapter.redo();options.onChange?.()},'redo');
 const refresh=button('Refresh',()=>{adapter.getState();options.onChange?.()},'refresh');
 function destroy(){if(destroyed)return;destroyed=true;for(const b of [undo,redo,refresh])b.remove?.();}
 return Object.freeze({version:CV_EDITOR_TOOLBAR_CONTROLLER_VERSION,undo,redo,refresh,destroy});
}