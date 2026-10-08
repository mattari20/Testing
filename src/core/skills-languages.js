import { getSkillsLanguagesPresentationContract, resolveSkillsLanguagesPresentation } from '../templates/skills-languages-presentation-contract.js';

export const SKILLS_LANGUAGES_SCHEMA_VERSION = '1.0.0';

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const clone = value => JSON.parse(JSON.stringify(value));
const makeId = prefix => prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);

export const PROFICIENCY_LABELS = Object.freeze({
  skills: Object.freeze(['','Beginner','Intermediate','Proficient','Advanced','Expert']),
  languages: Object.freeze(['','Basic','Conversational','Proficient','Fluent','Native / Bilingual'])
});

function splitLegacyValue(value) {
  return String(value ?? '').split(/[,\n]+/).map(item => item.trim()).filter(Boolean);
}

function normalizeEntry(sectionType, entry, legacyRatings={}) {
  const values = isObject(entry?.values) ? clone(entry.values) : {};
  const key = sectionType === 'skills' ? 'skill' : 'language';
  const value = String(values[key] ?? values.value ?? entry?.value ?? '').trim();
  if (!value) return null;
  const legacy = Number(legacyRatings[value] || 0);
  const proficiency = Math.max(0, Math.min(5, Number(values.proficiency ?? values.level ?? legacy) || 0));
  return {
    id: String(entry?.id || makeId(sectionType === 'skills' ? 'skill' : 'language')),
    values: { ...values, [key]: value, proficiency },
    visibility: entry?.visibility !== false,
    order: Number.isFinite(entry?.order) ? entry.order : 0,
    metadata: isObject(entry?.metadata) ? clone(entry.metadata) : {}
  };
}

export function migrateSkillsLanguagesSection(section, legacyRatings={}) {
  if (!isObject(section) || !['skills','languages'].includes(String(section.type))) return section;
  const type = String(section.type);
  const key = type === 'skills' ? 'skill' : 'language';
  const sourceEntries = Array.isArray(section.entries) ? section.entries : [];
  const normalizedEntries = sourceEntries.map(entry => normalizeEntry(type, entry, legacyRatings)).filter(Boolean);
  if (!normalizedEntries.length) {
    const fields = Array.isArray(section.fields) ? section.fields : [];
    for (const field of fields) {
      if (field?.visibility === false) continue;
      for (const value of splitLegacyValue(field?.value)) {
        const rating = Math.max(0, Math.min(5, Number(legacyRatings[value] || 0)));
        normalizedEntries.push({
          id: makeId(type === 'skills' ? 'skill' : 'language'),
          values: { [key]: value, proficiency: rating },
          visibility: field?.visibility !== false,
          order: normalizedEntries.length,
          metadata: { migratedFromFieldId: String(field?.id || '') }
        });
      }
    }
  }
  normalizedEntries.forEach((entry,index) => { entry.order = index; });
  return {
    ...clone(section),
    fields: [],
    entries: normalizedEntries,
    repeatable: true,
    metadata: {
      ...(isObject(section.metadata) ? clone(section.metadata) : {}),
      skillsLanguagesSchema: SKILLS_LANGUAGES_SCHEMA_VERSION,
      migratedAt: new Date().toISOString()
    }
  };
}

export function migrateSkillsLanguagesProfile(profile) {
  if (!isObject(profile)) return profile;
  const next = clone(profile);
  const sections = Array.isArray(next?.careerData?.sections) ? next.careerData.sections : [];
  const legacyRatings = next?.__legacyPresentation?.ratings || {};
  next.careerData.sections = sections.map(section => {
    const type = String(section?.type || '');
    return ['skills','languages'].includes(type)
      ? migrateSkillsLanguagesSection(section, legacyRatings[type]?.values || {})
      : section;
  });
  delete next.__legacyPresentation;
  return next;
}

export function migrateSkillsLanguagesTargetedCV(targetedCV, profile) {
  if (!isObject(targetedCV)) return targetedCV;
  const next = clone(targetedCV);
  const templateId = next?.configuration?.template?.id || '';
  const presentation = next?.configuration?.presentation || {};
  const legacyRatings = presentation?.ratings || {};
  const migratedProfile = migrateSkillsLanguagesProfile(profile);
  for (const type of ['skills','languages']) {
    const section = migratedProfile?.careerData?.sections?.find(item => String(item?.type) === type);
    const values = legacyRatings[type]?.values || {};
    if (section && Object.keys(values).length) {
      for (const entry of section.entries || []) {
        const key = type === 'skills' ? 'skill' : 'language';
        const name = String(entry?.values?.[key] || '').trim();
        if (name && !Number(entry.values.proficiency)) entry.values.proficiency = Math.max(0, Math.min(5, Number(values[name]) || 0));
      }
    }
  }
  next.configuration = {
    ...next.configuration,
    presentation: resolveSkillsLanguagesPresentation(templateId, presentation)
  };
  for (const type of ['skills','languages']) {
    next.configuration.presentation.ratings[type] = {
      ...next.configuration.presentation.ratings[type],
      values: {}
    };
  }
  return next;
}

export function getSkillOrLanguageEntry(section, entryId) {
  if (!section || !['skills','languages'].includes(String(section.type))) return null;
  return (section.entries || []).find(entry => String(entry.id) === String(entryId)) || null;
}

export function getSkillOrLanguageValue(sectionType, entry) {
  const key = String(sectionType) === 'skills' ? 'skill' : 'language';
  return String(entry?.values?.[key] ?? '').trim();
}

export function getSkillOrLanguageProficiency(entry) {
  return Math.max(0, Math.min(5, Number(entry?.values?.proficiency) || 0));
}
