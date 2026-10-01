import { getSection } from '../core/career-document-core.js';

export const CV_SECTION_FIELD_PROJECTION_VERSION = '1.0.0';
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const list = value => Array.isArray(value) ? value.map(String) : [];

function ordered(items, order) {
  const index = new Map(list(order).map((id, i) => [id, i]));
  return [...items].sort((a, b) => {
    const ai = index.has(a.id) ? index.get(a.id) : Number.MAX_SAFE_INTEGER;
    const bi = index.has(b.id) ? index.get(b.id) : Number.MAX_SAFE_INTEGER;
    return ai === bi ? (Number(a.order) || 0) - (Number(b.order) || 0) : ai - bi;
  });
}

export function projectCVContent(masterProfile, targetedCV) {
  if (!masterProfile?.id || !targetedCV?.id) throw new Error('Master profile and targeted CV are required.');
  if (targetedCV.masterProfileId !== masterProfile.id) throw new Error('Targeted CV ownership is invalid.');

  const hiddenSections = new Set(list(targetedCV.configuration?.hiddenSections));
  const hiddenFields = new Set(list(targetedCV.configuration?.hiddenFields));
  const hiddenEntries = new Set(list(targetedCV.configuration?.hiddenEntries));
  const sections = ordered(masterProfile.careerData?.sections || [], targetedCV.configuration?.sectionOrder)
    .filter(section => section.visibility !== false && !hiddenSections.has(section.id))
    .map(section => ({
      id: section.id,
      type: section.type,
      title: section.title,
      repeatable: section.repeatable === true,
      fields: ordered(section.fields || [], targetedCV.configuration?.fieldOrder?.[section.id])
        .filter(field => field.visibility !== false && !hiddenFields.has(section.id + ':' + field.id))
        .map(field => ({ id: field.id, type: field.type, label: field.label, value: clone(field.value), metadata: clone(field.metadata) })),
      entries: ordered(section.entries || [], targetedCV.configuration?.entryOrder?.[section.id])
        .filter(entry => entry.visibility !== false && !hiddenEntries.has(section.id + ':' + entry.id))
        .map(entry => ({ id: entry.id, values: clone(entry.values), metadata: clone(entry.metadata) }))
    }));

  return Object.freeze({
    version: CV_SECTION_FIELD_PROJECTION_VERSION,
    masterProfileId: masterProfile.id,
    targetedCVId: targetedCV.id,
    masterProfileRevision: masterProfile.revision,
    targetedCVRevision: targetedCV.revision,
    sections
  });
}

export function findProjectedField(projection, sectionId, fieldId) {
  const section = projection?.sections?.find(item => item.id === String(sectionId));
  return section?.fields?.find(item => item.id === String(fieldId)) || null;
}

export function projectionDiagnostics(projection) {
  const sections = projection?.sections || [];
  const fields = sections.reduce((n, s) => n + s.fields.length, 0);
  const entries = sections.reduce((n, s) => n + s.entries.length, 0);
  return Object.freeze({
    version: CV_SECTION_FIELD_PROJECTION_VERSION,
    sectionCount: sections.length,
    fieldCount: fields,
    entryCount: entries,
    emptySectionCount: sections.filter(s => s.fields.length === 0 && s.entries.length === 0).length
  });
}
