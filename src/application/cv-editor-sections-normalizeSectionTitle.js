export const CV_EDITOR_SECTIONS_NORMALIZESECTIONTITLE_VERSION='1.0.0';
export function normalizeSectionTitle(value, options={}){
 return String(value??'').trim();
}