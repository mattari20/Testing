import assert from 'node:assert/strict';
import { createMasterProfile, createTargetedCV, addSection, addField } from '../../src/core/career-document-core.js';
import { createTemplateDefinition, createTemplateRegistry, CAPABILITY } from '../../src/templates/template-engine.js';
import { createPresentationVariant, createVariantRegistry, VARIANT_LEVEL } from '../../src/templates/presentation-variant-engine.js';
import { createAssemblyRequest, assembleDocument, ASSEMBLY_STATE } from '../../src/assembly/document-assembly-engine.js';

const profile = createMasterProfile();
const summary = addSection(profile, { id:'summary', type:'summary', title:'Summary' });
addField(profile, summary.id, { id:'summary_text', type:'summary', label:'Summary', value:'Experienced professional.' });

const template = createTemplateDefinition({
  id:'modern',
  name:'Modern',
  version:'1.0.0',
  capabilities:{ summary:CAPABILITY.SUPPORTED },
  outputs:{ pdf:true, print:true, docx:true, blankDocx:true }
});
const templates = createTemplateRegistry([template]);

const variant = createPresentationVariant({
  id:'summary-text',
  level:VARIANT_LEVEL.FIELD,
  sections:['summary'],
  fieldTypes:['summary'],
  compatibleTemplates:['modern'],
  semanticType:'summary'
});
const variants = createVariantRegistry([variant]);

const cv = createTargetedCV({
  masterProfileId:profile.id,
  configuration:{
    sectionOrder:['summary'],
    presentation:{variants:{field:{summary_text:'summary-text'}}},
    template:{id:'modern'}
  }
});

let request = createAssemblyRequest({
  profile,targetedCV:cv,templateRegistry:templates,variantRegistry:variants,
  layoutBlocks:[{id:'header',kind:'document-header',measuredHeight:100},{id:'summary',kind:'content',measuredHeight:200}],
  pageModel:{width:794,height:1123,margins:{top:20,right:20,bottom:20,left:20}}
});
let result = assembleDocument(request);
assert.equal(result.state, ASSEMBLY_STATE.READY);
assert.equal(result.snapshot.masterProfileId, profile.id);
assert.equal(result.template.id, 'modern');
assert.equal(result.layout.pageCount, 1);
assert.equal(result.preview.source.templateId, 'modern');
assert.equal(result.variants.resolved[0].selectedVariantId, 'summary-text');
assert.equal(result.exports.pdf.validation.valid, true);
assert.equal(result.exports.docx.validation.valid, true);

const incompatibleTemplate = createTemplateDefinition({
  id:'limited',
  name:'Limited',
  version:'1.0.0',
  capabilities:{ summary:CAPABILITY.PRESERVED },
  outputs:{ pdf:true }
});
const limitedTemplates = createTemplateRegistry([incompatibleTemplate]);
const blocked = assembleDocument({
  ...request,
  templateRegistry:limitedTemplates,
  templateId:'limited'
});
assert.equal(blocked.state, ASSEMBLY_STATE.BLOCKED);
assert.ok(blocked.errors.includes('TEMPLATE_CONTENT_COMPATIBILITY_BLOCKED'));

const overflow = assembleDocument({
  ...request,
  layoutBlocks:[{id:'huge',kind:'content',measuredHeight:2000}]
});
assert.equal(overflow.state, ASSEMBLY_STATE.BLOCKED);
assert.ok(overflow.errors.includes('LAYOUT_OVERFLOW'));

console.log('M11 document assembly tests passed.');
