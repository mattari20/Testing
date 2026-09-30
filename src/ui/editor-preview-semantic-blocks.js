export const EDITOR_PREVIEW_SEMANTIC_BLOCKS_VERSION='1.1.0';

const KIND_MAP=Object.freeze({
 header:'document-header',section:'section-heading',experience:'experience-entry',
 education:'education-entry',project:'project-entry',skills:'skill-group',
 image:'image',spacer:'spacer','page-break':'page-break'
});

export function createSemanticLayoutBlocks(blocks=[]){
 return (Array.isArray(blocks)?blocks:[]).map((block,index)=>({
   id:String(block.id||`block-${index+1}`),
   kind:KIND_MAP[block.element?.getAttribute?.('data-v2-block-type')]||block.kind||'custom',
   order:Number.isFinite(block.order)?block.order:index,
   measuredHeight:Math.max(0,Number(block.measuredHeight)||0),
   minHeight:Math.max(0,Number(block.minHeight)||Number(block.measuredHeight)||0),
   preferredHeight:Math.max(0,Number(block.preferredHeight)||Number(block.measuredHeight)||0),
   splittable:block.splittable===true,
   splitAt:Array.isArray(block.splitAt)?block.splitAt:[],
   keepTogether:block.keepTogether!==false,
   keepWithNext:block.keepWithNext===true,
   metadata:{source:'browser-dom',elementId:block.id}
 }));
}
