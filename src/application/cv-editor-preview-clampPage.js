export const CV_EDITOR_PREVIEW_CLAMPPAGE_VERSION='1.0.0';
export function clampPage(value, options={}){
 const max=Math.max(1,Number(options.max)||1); return Math.min(max,Math.max(1,Number(value)||1));
}