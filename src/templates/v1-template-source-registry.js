export const V1_TEMPLATE_SOURCE_REGISTRY_VERSION = '1.0.0';

const clone = value => JSON.parse(JSON.stringify(value));

const registry = [
  { id:'t01-modern-minimalist-cv-design_modern', file:'t01-modern-minimalist-cv-design_modern.html', source:'user-uploaded', status:'source-recovered' },
  { id:'t02-professional-cv-design_modern', file:'t02-professional-cv-design_modern.html', source:'user-uploaded', status:'source-recovered' },
  { id:'t03-professional-cv-design_modern', file:'t03-professional-cv-design_modern.html', source:'user-uploaded', status:'source-recovered' },
  { id:'t04-modern-blue-corporate_modern', file:'t04-modern-blue-corporate_modern.html', source:'user-uploaded', status:'source-recovered' },
  { id:'t05-simple-cv-graphic-web-designer_modern', file:'t05-simple-cv-graphic-web-designer_modern.html', source:'user-uploaded', status:'source-recovered' },
  { id:'t06-professional-cv-graphic-designer_modern', file:'t06-professional-cv-graphic-designer_modern.html', source:'user-uploaded', status:'source-recovered' },
  { id:'t07-professional-cv-store-manager-incharge_modern', file:'t07-professional-cv-store-manager-incharge_modern.html', source:'user-uploaded', status:'source-recovered' }
];

export function listV1TemplateSources(){ return clone(registry); }
export function getV1TemplateSource(id){ return clone(registry.find(x => x.id === String(id)) || null); }
