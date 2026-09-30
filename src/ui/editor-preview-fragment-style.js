export const EDITOR_PREVIEW_FRAGMENT_STYLE_VERSION='1.1.0';
export function applyFragmentSlice(element,fragment={}){
 if(!element) throw new Error('Fragment element is required.');
 const height=Math.max(0,Number(fragment.geometry?.height??fragment.height)||0);
 const offset=Math.max(0,Number(fragment.geometry?.top??fragment.offset)||0);
 element.style.overflow='hidden';
 element.style.height=`${height}px`;
 element.style.boxSizing='border-box';
 element.style.position=element.style.position||'relative';
 element.style.transform=offset>0?`translateY(-${offset}px`):'';
 element.dataset.v2FragmentPart=String(fragment.part||1);
 element.dataset.v2FragmentOffset=String(offset);
 return element;
}