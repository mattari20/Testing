export const CV_EDITOR_TEMPLATES_TEMPLATEID_VERSION='1.0.0';
export function templateId(value, options={}){
 return String(value?.id||value||'');
}