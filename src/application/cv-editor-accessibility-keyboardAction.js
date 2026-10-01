export const CV_EDITOR_ACCESSIBILITY_KEYBOARDACTION_VERSION='1.0.0';
export function keyboardAction(value, options={}){
 return String(value||options.action||'activate');
}