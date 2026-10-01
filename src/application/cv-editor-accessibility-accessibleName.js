export const CV_EDITOR_ACCESSIBILITY_ACCESSIBLENAME_VERSION='1.0.0';
export function accessibleName(value, options={}){
 return String(value?.ariaLabel||value?.label||'');
}