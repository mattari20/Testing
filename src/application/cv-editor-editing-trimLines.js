export const CV_EDITOR_EDITING_TRIMLINES_VERSION='1.0.0';
export function trimLines(value, options={}){
 return String(value??'').split(/\\r?\\n/).map(line=>line.trim()).filter(Boolean).join('\\n');
}