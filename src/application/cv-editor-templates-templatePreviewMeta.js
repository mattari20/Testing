export const CV_EDITOR_TEMPLATES_TEMPLATEPREVIEWMETA_VERSION='1.0.0';
export function templatePreviewMeta(value, options={}){
 return Object.freeze({id:value?.id||null,label:value?.label||value?.name||'Template'});
}