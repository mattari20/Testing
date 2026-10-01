export const CV_EDITOR_PREVIEW_PAGEKEY_VERSION='1.0.0';
export function pageKey(value, options={}){
 return 'page:'+String(value||1);
}