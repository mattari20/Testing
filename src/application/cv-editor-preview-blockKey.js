export const CV_EDITOR_PREVIEW_BLOCKKEY_VERSION='1.0.0';
export function blockKey(value, options={}){
 return 'block:'+String(value||'');
}