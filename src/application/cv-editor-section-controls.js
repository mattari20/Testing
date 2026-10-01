export const CV_EDITOR_SECTION_CONTROLS_VERSION='1.0.0';
export function createCVEditorSectionControls(options={}) {
 const document=options.document,adapter=options.adapter,page=options.page;if(!document||!adapter||!page)throw new Error('Section controls require document, adapter and page.');
 let destroyed=false;
 function add(label,action,key){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('data-section-action',key);b.addEventListener('click',()=>{if(!destroyed)action();});page.shell.toolbar.appendChild(b);return b;}
 const toggle=add('Toggle sections',()=>{const state=adapter.getState();const sections=state.form?.sections||[];if(sections[0]){adapter.edit(sections[0].id,{visibility:!sections[0].visibility});page.render();}},'toggle-visibility');
 return Object.freeze({version:CV_EDITOR_SECTION_CONTROLS_VERSION,toggle,destroy(){destroyed=true;}});
}