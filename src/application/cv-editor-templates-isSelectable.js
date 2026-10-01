export const CV_EDITOR_TEMPLATES_ISSELECTABLE_VERSION='1.0.0';
export function isSelectable(value, options={}){
 return Boolean(value?.status!=='retired'&&value?.status!=='unsupported');
}