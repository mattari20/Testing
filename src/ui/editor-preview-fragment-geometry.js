export const EDITOR_PREVIEW_FRAGMENT_GEOMETRY_VERSION='1.0.0';
export function createFragmentGeometry(fragment={}){
 const height=Math.max(0,Number(fragment.height)||0);
 const offset=Math.max(0,Number(fragment.offset)||0);
 return Object.freeze({top:offset,height,bottom:offset+height,sourceHeight:Math.max(height,Number(fragment.sourceHeight)||height)});
}
