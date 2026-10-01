export const CV_EDITOR_ENTRIES_ENTRYPOSITION_VERSION='1.0.0';
export function entryPosition(value, options={}){
 return Math.max(0,Number(value)||0);
}