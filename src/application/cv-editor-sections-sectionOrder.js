export const CV_EDITOR_SECTIONS_SECTIONORDER_VERSION='1.0.0';
export function sectionOrder(value, options={}){
 return Array.isArray(value)?value.map((item,index)=>({...item,order:index})):[];
}