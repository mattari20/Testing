export const CV_EDITOR_TEMPLATE_DOM_CONTROL_VERSION='1.0.0';
export function createCVEditorTemplateDOMControl(options={}) {
 const document=options.document,adapter=options.adapter,page=options.page;if(!document||!adapter||!page)throw new Error('Template DOM control requires document, adapter and page.');
 let destroyed=false;const select=document.createElement('select');select.setAttribute('data-template-selector','');
 for(const item of adapter.listTemplates?.()||[]){const option=document.createElement('option');option.value=item.id;option.textContent=item.name||item.id;select.appendChild(option);}
 select.addEventListener('change',()=>{if(!destroyed){adapter.selectTemplate(select.value);page.render();}});
 page.shell.toolbar.appendChild(select);
 return Object.freeze({version:CV_EDITOR_TEMPLATE_DOM_CONTROL_VERSION,select,destroy(){destroyed=true;}});
}