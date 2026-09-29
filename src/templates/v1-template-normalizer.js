export const V1_TEMPLATE_NORMALIZER_VERSION = '1.0.0';

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export const V1_TOKEN_KIND = Object.freeze({
  SCALAR: 'scalar',
  FIELD_CONDITION: 'field-condition',
  VISIBILITY_CONDITION: 'visibility-condition',
  OBJECT_LOOP: 'object-loop',
  PRIMITIVE_LOOP: 'primitive-loop'
});

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  const text = String(value ?? '');
  if (/^javascript:/i.test(text.trim()) || /^data:text\/html/i.test(text.trim())) return '';
  return escapeHtml(text);
}

function collectMatches(source, regex, kind, keyIndex = 1) {
  const out = [];
  let match;
  while ((match = regex.exec(source))) {
    out.push({ kind, key: String(match[keyIndex]), start: match.index, end: regex.lastIndex });
  }
  return out;
}

export function analyzeV1TemplateSource(sourceHtml) {
  const source = String(sourceHtml || '');
  const tokens = [
    ...collectMatches(source, /{{#([A-Za-z0-9_]+)}}/g, V1_TOKEN_KIND.FIELD_CONDITION),
    ...collectMatches(source, /{{#(toggle_[A-Za-z0-9_]+)}}/g, V1_TOKEN_KIND.VISIBILITY_CONDITION),
    ...collectMatches(source, /{{([A-Z][A-Z0-9_]*)}}/g, V1_TOKEN_KIND.SCALAR),
    ...collectMatches(source, /{{([A-Z][A-Z0-9_]*)_LIST}}/g, V1_TOKEN_KIND.OBJECT_LOOP)
  ];

  const objectLoops = [];
  const loopRegex = /{{([A-Z][A-Z0-9_]*)_LIST}}([\s\S]*?){{\/\1_LIST}}/g;
  let loop;
  while ((loop = loopRegex.exec(source))) {
    const innerTokens = [...loop[2].matchAll(/{{([a-z][A-Za-z0-9_]*)}}/g)].map(m => m[1]);
    objectLoops.push({ name: loop[1] + '_LIST', innerTokens: [...new Set(innerTokens)] });
  }

  const visibilityNames = [...source.matchAll(/{{#(toggle_[A-Za-z0-9_]+)}}/g)].map(m => m[1]);
  const fieldConditions = [...source.matchAll(/{{#([A-Z][A-Z0-9_]*)}}/g)].map(m => m[1]);

  return {
    version: V1_TEMPLATE_NORMALIZER_VERSION,
    sourceLength: source.length,
    tokens: [...new Set(tokens.map(t => t.key))],
    fieldConditions: [...new Set(fieldConditions)],
    visibilityConditions: [...new Set(visibilityNames)],
    objectLoops,
    primitiveLoops: [],
    diagnostics: []
  };
}

function resolvePath(source, path) {
  if (!path) return undefined;
  const text = String(path);
  if (text.startsWith('section:')) {
    const [, sectionType, field] = text.split(':');
    const section = findSection(source, sectionType);
    if (!section) return undefined;
    if (!field) return section;
    const direct = section[field];
    if (direct !== undefined) return direct;
    return section.fields?.find(item => item.id === field || item.label === field)?.value;
  }
  return text.split('.').reduce((value, key) => value == null ? undefined : value[key], source);
}

function findSection(snapshot, sectionType) {
  return (snapshot?.careerData?.sections || []).find(section => section.type === sectionType) || null;
}

function resolveSectionEntries(snapshot, sectionType) {
  return findSection(snapshot, sectionType)?.entries || [];
}

function buildContext(snapshot, adapter) {
  const context = {};
  for (const [token, binding] of Object.entries(adapter?.bindings || {})) {
    const path = typeof binding === 'string' ? binding : binding?.target;
    context[token] = resolvePath(snapshot, path);
  }
  return context;
}

function buildLoopEntries(snapshot, loopDefinition) {
  const sectionType = loopDefinition?.sectionType;
  const entries = sectionType ? resolveSectionEntries(snapshot, sectionType) : [];
  const fields = isObject(loopDefinition?.fields) ? loopDefinition.fields : {};
  return entries.map(entry => {
    const values = {};
    for (const [legacyKey, sourceKey] of Object.entries(fields)) {
      values[legacyKey] = entry?.values?.[sourceKey];
    }
    return values;
  });
}

function applyVisibilityBlocks(source, visibility, diagnostics) {
  return source.replace(/{{#(toggle_[A-Za-z0-9_]+)}}([\s\S]*?){{\/\1}}/g, (full, name, body) => {
    const visible = visibility?.[name] !== false;
    if (!visible) return '';
    return body;
  });
}

function applyFieldConditionBlocks(source, context) {
  return source.replace(/{{#([A-Z][A-Z0-9_]*)}}([\s\S]*?){{\/\1}}/g, (full, token, body) => {
    return context[token] == null || context[token] === '' ? '' : body;
  });
}

function applyLoops(source, snapshot, adapter) {
  return source.replace(/{{([A-Z][A-Z0-9_]*)_LIST}}([\s\S]*?){{\/\1_LIST}}/g, (full, name, body) => {
    const definition = adapter?.loops?.object?.[name + '_LIST'] || adapter?.loops?.object?.[name] || null;
    const entries = buildLoopEntries(snapshot, definition);
    return entries.map(entry => body.replace(/{{([a-z][A-Za-z0-9_]*)}}/g, (_, key) => escapeHtml(entry[key]))).join('');
  });
}

function applyScalars(source, context) {
  return source.replace(/{{([A-Z][A-Z0-9_]*)}}/g, (full, token) => {
    const value = context[token];
    return token === 'PHOTO' ? escapeAttribute(value) : escapeHtml(value);
  });
}

export function compileV1TemplateSource(sourceHtml, snapshot, adapter, options = {}) {
  const diagnostics = [];
  const source = String(sourceHtml || '');
  const context = buildContext(snapshot, adapter);
  const visibility = options.visibility || {};

  let compiled = source;
  compiled = applyVisibilityBlocks(compiled, visibility, diagnostics);
  compiled = applyFieldConditionBlocks(compiled, context);
  compiled = applyLoops(compiled, snapshot, adapter);
  compiled = applyScalars(compiled, context);

  const unresolved = [...compiled.matchAll(/{{[^{}]+}}/g)].map(m => m[0]);
  if (unresolved.length) {
    diagnostics.push({ code: 'UNRESOLVED_V1_TOKEN', tokens: [...new Set(unresolved)] });
  }

  return {
    version: V1_TEMPLATE_NORMALIZER_VERSION,
    templateId: adapter?.templateId || null,
    html: compiled,
    diagnostics,
    analysis: analyzeV1TemplateSource(source)
  };
}

export function createT01ModernAdapter() {
  const bindings = {
    NAME: 'identity.fullName',
    JOB: 'identity.jobTitle',
    EMAIL: 'identity.email',
    PHONE: 'identity.phone',
    WHATSAPP: 'identity.whatsapp',
    ADDRESS: 'identity.address',
    DOB: 'identity.dateOfBirth',
    CNIC: 'identity.cnic',
    RELIGION: 'identity.religion',
    LINKEDIN: 'identity.linkedin',
    WEBSITE: 'identity.website',
    SUMMARY: 'section:summary:text'
  };

  return {
    version: V1_TEMPLATE_NORMALIZER_VERSION,
    templateId: 't01-modern-minimalist-cv-design_modern',
    bindings,
    loops: {
      object: {
        EXPERIENCE_LIST: {
          sectionType: 'experience',
          fields: { company: 'company', duration: 'duration', title: 'title', desc: 'description' }
        },
        EDUCATION_LIST: {
          sectionType: 'education',
          fields: { institute: 'institute', year: 'year', degree: 'degree', grade: 'grade' }
        },
        SKILLS_LIST: {
          sectionType: 'skills',
          fields: { skill: 'skill' }
        },
        LANGUAGES_LIST: {
          sectionType: 'languages',
          fields: { language: 'language' }
        }
      }
    }
  };
}

export function createT01Visibility(configuration = {}) {
  const hidden = new Set([
    ...(configuration.hiddenSections || []),
    ...(configuration.hiddenFields || [])
  ]);
  return {
    toggle_pho_visible: !hidden.has('photo'),
    toggle_sum_visible: !hidden.has('summary'),
    toggle_exp_visible: !hidden.has('experience'),
    toggle_edu_visible: !hidden.has('education'),
    toggle_ski_visible: !hidden.has('skills'),
    toggle_lan_visible: !hidden.has('languages')
  };
}
