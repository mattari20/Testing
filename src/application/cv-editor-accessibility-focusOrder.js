export const CV_EDITOR_ACCESSIBILITY_FOCUSORDER_VERSION='1.0.0';
export function focusOrder(value, options={}){
 return Math.max(0,Number(value)||0);
}