export const CV_EDITOR_TEMPLATES_TEMPLATEFAMILY_VERSION='1.0.0';
export function templateFamily(value, options={}){
 return String(value?.family||'default');
}