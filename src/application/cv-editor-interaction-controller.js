export const CV_EDITOR_INTERACTION_CONTROLLER_VERSION='1.0.0';
export function createCVEditorInteractionController(options={}) {
 const document=options.document,adapter=options.adapter,page=options.page;if(!document||!adapter||!page)throw new Error('Interaction controller requires document, adapter and page.');
 let destroyed=false;
 function onInput(event){if(destroyed)return;const t=event.target;if(!t?.getAttribute)return;const id=t.getAttribute('data-block-id');if(!id)return;adapter.edit(id,{value:t.value});page.render();}
 function onClick(event){if(destroyed)return;const t=event.target;if(!t?.getAttribute)return;const id=t.getAttribute('data-preview-block-id');if(!id)return;page.shell.setStatus('Selected: '+id,'info');}
 page.shell.form.addEventListener?.('input',onInput);page.shell.preview.addEventListener?.('click',onClick);
 return Object.freeze({version:CV_EDITOR_INTERACTION_CONTROLLER_VERSION,destroy(){destroyed=true;}});
}