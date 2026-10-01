export const CV_EDITOR_TEMPLATES_TEMPLATEVERSION_VERSION='1.0.0';
export function templateVersion(value, options={}){
 return String(value?.version||'1.0.0');
}