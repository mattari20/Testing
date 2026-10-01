export const CV_EDITOR_SECTIONS_SECTIONKEYFROMID_VERSION='1.0.0';
export function sectionKeyFromId(value, options={}){
 return 'section:'+String(value||'');
}