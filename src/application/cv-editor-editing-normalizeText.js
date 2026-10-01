export const CV_EDITOR_EDITING_NORMALIZETEXT_VERSION='1.0.0';
export function normalizeText(value, options={}){
 return String(value??'').trim().replace(/\\s+/g,' ');
}