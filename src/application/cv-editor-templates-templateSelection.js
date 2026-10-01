export const CV_EDITOR_TEMPLATES_TEMPLATESELECTION_VERSION='1.0.0';
export function templateSelection(value, options={}){
 return Object.freeze({id:value?.id||null,selected:Boolean(options.selected)});
}