export const CV_EDITOR_TEMPLATES_TEMPLATESTATUS_VERSION='1.0.0';
export function templateStatus(value, options={}){
 return String(value?.status||'unknown');
}