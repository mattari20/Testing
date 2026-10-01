export const CV_EDITOR_TEMPLATES_TEMPLATELABEL_VERSION='1.0.0';
export function templateLabel(value, options={}){
 return String(value?.label||value?.name||'Template');
}