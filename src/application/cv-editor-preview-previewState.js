export const CV_EDITOR_PREVIEW_PREVIEWSTATE_VERSION='1.0.0';
export function previewState(value, options={}){
 return Object.freeze({page:Number(value)||1,zoom:Number(options.zoom)||1,block:options.block||null});
}