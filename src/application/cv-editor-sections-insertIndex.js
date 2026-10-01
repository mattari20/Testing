export const CV_EDITOR_SECTIONS_INSERTINDEX_VERSION='1.0.0';
export function insertIndex(value, options={}){
 return Math.max(0,Math.min(Number(options.max)||0,Number(value)||0));
}