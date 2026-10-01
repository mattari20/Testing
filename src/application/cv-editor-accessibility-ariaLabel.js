export const CV_EDITOR_ACCESSIBILITY_ARIALABEL_VERSION='1.0.0';
export function ariaLabel(value, options={}){
 return String(value||options.label||'Control');
}