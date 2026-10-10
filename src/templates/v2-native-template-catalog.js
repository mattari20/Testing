import { SKILLS_LANGUAGES_TEMPLATE_CONTRACTS } from './skills-languages-presentation-contract.js';
import { TEMPLATE_STATUS, createTemplateDefinition } from './template-engine.js';

export const V2_NATIVE_TEMPLATE_STATUS = Object.freeze({
  SOURCE_CONVERTED: 'source-converted',
  VALIDATION_PENDING: 'pending-browser-validation',
  COMPATIBLE: 'v2-compatible'
});

const COMMON = {
  status: TEMPLATE_STATUS.PUBLISHED,
  compatibility: V2_NATIVE_TEMPLATE_STATUS.COMPATIBLE,
  outputs: { web: true, pdf: true, print: true, docx: true, onlineCV: true, samplePdf: false },
  photo: { supported: false },
  commercial: { access: 'free' },
  accessibility: { semanticStructure: true, keyboardSafe: true },
  responsive: { editor: true, preview: true },
  discovery: { searchable: true },
  demo: { available: true }
};

const nativeTemplates = [
  {
    ...COMMON,
    id: 't01-modern-minimalist-cv-design_ats',
    skillsLanguagesPresentation: SKILLS_LANGUAGES_TEMPLATE_CONTRACTS['t01-modern-minimalist-cv-design_ats'],
    name: 'T01 Modern Minimalist CV — ATS V2',
    version: '2.2.0',
    sourcePath: 'src/templates/assets/v2/t01-modern-minimalist-cv-design_ats.html?v=20261010.1',
    supportedSections: ['summary','experience','education','skills','languages','achievements'],
    careerLevel: ['Student','Fresh Graduate','Professional'],
    industry: ['General','IT / Software','Business','Engineering'],
    style: ['ATS','Minimal','Professional'],
    outputs: { ...COMMON.outputs, docx: false, blankDocx: false },
    photo: { supported: false },
    ats: { profile: 'ATS-oriented', machineReadable: true },
    capabilities: { nativeContract: true, v1VisualEquivalence: 'not-applicable', browserMeasurement: 'pending-after-layout-update', paginationEvidence: 'pending-after-layout-update', exportEvidence: 'pending' },
    discovery: { searchable: true, tags: ['ats','minimal','clean','professional'] }
  },
  {
    ...COMMON,
    id: 't01-modern-minimalist-cv-design_simple',
    skillsLanguagesPresentation: SKILLS_LANGUAGES_TEMPLATE_CONTRACTS['t01-modern-minimalist-cv-design_simple'],
    name: 'T01 Modern Minimalist CV — Simple V2',
    version: '2.1.0',
    sourcePath: 'src/templates/assets/v2/t01-modern-minimalist-cv-design_simple.html',
    supportedSections: ['photo','contact','skills','languages','summary','experience','education'],
    careerLevel: ['Student','Fresh Graduate','Professional'],
    industry: ['General','Business','IT / Software'],
    style: ['Simple','Minimal','Clean'],
    outputs: { ...COMMON.outputs, docx: false, blankDocx: false },
    photo: { supported: true, shape: 'circle' },
    ats: { profile: 'Standard', machineReadable: true },
    capabilities: { nativeContract: true, v1VisualEquivalence: 'not-applicable', browserMeasurement: 'passed', paginationEvidence: 'passed', exportEvidence: 'pending' },
    discovery: { searchable: true, tags: ['simple','minimal','clean'] }
  },
  {
    ...COMMON,
    id: 't01-modern-minimalist-cv-design_modern',
    skillsLanguagesPresentation: SKILLS_LANGUAGES_TEMPLATE_CONTRACTS['t01-modern-minimalist-cv-design_modern'],
    name: 'T01 Modern Minimalist CV — Native V2',
    version: '2.0.0',
    v1BaselineId: 't01-modern-minimalist-cv-design_modern',
    sourcePath: 'src/templates/assets/v2/t01-modern-minimalist-cv-design_modern.html',
    supportedSections: ['photo','contact','summary','experience','education','skills','languages'],
    careerLevel: ['Student','Fresh Graduate','Professional'],
    industry: ['General','Business','IT / Software'],
    style: ['Modern','Minimal'],
    photo: { supported: true },
    ats: { profile: 'Standard', machineReadable: true },
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'passed', paginationEvidence: 'passed', exportEvidence: 'pending' },
    discovery: { searchable: true, tags: ['modern','minimal','classic'] }
  },
  {
    ...COMMON,
    id: 't02-professional-cv-design_modern',
    skillsLanguagesPresentation: SKILLS_LANGUAGES_TEMPLATE_CONTRACTS['t02-professional-cv-design_modern'],
    name: 'T02 Professional CV — Native V2',
    version: '2.0.0',
    v1BaselineId: 't02-professional-cv-design_modern',
    sourcePath: 'src/templates/assets/v2/t02-professional-cv-design_modern.html',
    supportedSections: ['photo','skills','languages','summary','experience','education','achievements','projects'],
    careerLevel: ['Fresh Graduate','Professional','Senior Professional'],
    industry: ['General','Business','IT / Software','Engineering'],
    style: ['Professional','Modern'],
    photo: { supported: true },
    ats: { profile: 'Standard', machineReadable: true },
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'passed', paginationEvidence: 'passed', exportEvidence: 'pending' },
    discovery: { searchable: true, tags: ['professional','modern','versatile'] }
  },
  {
    ...COMMON,
    id: 't03-professional-cv-design_modern',
    skillsLanguagesPresentation: SKILLS_LANGUAGES_TEMPLATE_CONTRACTS['t03-professional-cv-design_modern'],
    name: 'T03 Professional CV — Native V2',
    version: '2.0.0',
    v1BaselineId: 't03-professional-cv-design_modern',
    sourcePath: 'src/templates/assets/v2/t03-professional-cv-design_modern.html',
    supportedSections: ['photo','summary','education','experience','projects','skills','languages','achievements'],
    careerLevel: ['Fresh Graduate','Professional','Senior Professional'],
    industry: ['General','Business','IT / Software','Engineering','Academic'],
    style: ['Professional','Structured'],
    photo: { supported: true, shape: 'circle' },
    ats: { profile: 'Standard', machineReadable: true },
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'passed', paginationEvidence: 'passed', exportEvidence: 'pending' },
    discovery: { searchable: true, tags: ['professional','structured','detailed'] }
  },
  {
    ...COMMON,
    id: 't04-modern-blue-corporate_modern',
    skillsLanguagesPresentation: SKILLS_LANGUAGES_TEMPLATE_CONTRACTS['t04-modern-blue-corporate_modern'],
    name: 'T04 Modern Blue Corporate — Native V2',
    version: '2.0.0',
    v1BaselineId: 't04-modern-blue-corporate_modern',
    sourcePath: 'src/templates/assets/v2/t04-modern-blue-corporate_modern.html',
    supportedSections: ['summary','photo','experience','education','projects','skills','languages','achievements'],
    careerLevel: ['Fresh Graduate','Professional','Senior Professional'],
    industry: ['Business','Finance','Engineering','IT / Software','General'],
    style: ['Corporate','Modern','Blue'],
    photo: { supported: true },
    ats: { profile: 'Standard', machineReadable: true },
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'passed', paginationEvidence: 'passed', exportEvidence: 'pending' },
    discovery: { searchable: true, tags: ['corporate','blue','business'] }
  },
  {
    ...COMMON,
    id: 't05-simple-cv-graphic-web-designer_modern',
    skillsLanguagesPresentation: SKILLS_LANGUAGES_TEMPLATE_CONTRACTS['t05-simple-cv-graphic-web-designer_modern'],
    name: 'T05 Simple CV Graphic Web Designer — Native V2',
    version: '2.0.0',
    v1BaselineId: 't05-simple-cv-graphic-web-designer_modern',
    sourcePath: 'src/templates/assets/v2/t05-simple-cv-graphic-web-designer_modern.html',
    supportedSections: ['photo','summary','skills','languages','education','experience','projects'],
    careerLevel: ['Student','Fresh Graduate','Professional'],
    industry: ['Design','IT / Software','Media','Creative'],
    style: ['Creative','Designer','Modern'],
    photo: { supported: true },
    ats: { profile: 'Standard', machineReadable: true },
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'passed', paginationEvidence: 'passed', exportEvidence: 'pending' },
    discovery: { searchable: true, tags: ['designer','creative','portfolio'] }
  },
  {
    ...COMMON,
    id: 't06-professional-cv-graphic-designer_modern',
    skillsLanguagesPresentation: SKILLS_LANGUAGES_TEMPLATE_CONTRACTS['t06-professional-cv-graphic-designer_modern'],
    name: 'T06 Professional CV Graphic Designer — Native V2',
    version: '2.0.0',
    v1BaselineId: 't06-professional-cv-graphic-designer_modern',
    sourcePath: 'src/templates/assets/v2/t06-professional-cv-graphic-designer_modern.html',
    supportedSections: ['photo','skills','achievements','languages','summary','education','experience'],
    careerLevel: ['Student','Fresh Graduate','Professional'],
    industry: ['Design','Creative','Media'],
    style: ['Designer','Creative','Modern'],
    photo: { supported: true },
    ats: { profile: 'Standard', machineReadable: true },
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'passed', paginationEvidence: 'passed', exportEvidence: 'pending' },
    discovery: { searchable: true, tags: ['graphic-design','creative','professional'] }
  },
  {
    ...COMMON,
    id: 't07-professional-cv-store-manager-incharge_modern',
    skillsLanguagesPresentation: SKILLS_LANGUAGES_TEMPLATE_CONTRACTS['t07-professional-cv-store-manager-incharge_modern'],
    name: 'T07 Professional CV Store Manager/Incharge — Native V2',
    version: '2.0.0',
    v1BaselineId: 't07-professional-cv-store-manager-incharge_modern',
    sourcePath: 'src/templates/assets/v2/t07-professional-cv-store-manager-incharge_modern.html',
    supportedSections: ['photo','summary','experience','education','skills','languages'],
    careerLevel: ['Fresh Graduate','Professional','Senior Professional'],
    industry: ['Retail','Sales','Business','General'],
    style: ['Professional','Managerial','Modern'],
    photo: { supported: true },
    ats: { profile: 'Standard', machineReadable: true },
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'passed', paginationEvidence: 'passed', exportEvidence: 'pending' },
    discovery: { searchable: true, tags: ['retail','manager','sales'] }
  }
];

export function createV2NativeTemplateCatalog() {
  return nativeTemplates.map(template => createTemplateDefinition(template));
}

export function listNativeV2Templates() {
  return nativeTemplates.map(template => createTemplateDefinition(template));
}

export function getNativeV2Template(id) {
  const found = nativeTemplates.find(template => template.id === String(id));
  return found ? createTemplateDefinition(found) : null;
}

export const V2_NATIVE_TEMPLATE_IDS = Object.freeze(nativeTemplates.map(template => template.id));
