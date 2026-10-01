export const CV_EDITOR_RELEASE_CHECKLIST_VERSION='1.0.0';
export const CV_EDITOR_RELEASE_CHECKLIST=Object.freeze([
 'V1 runtime and assets remain untouched',
 'Local-first editor remains usable without mandatory login',
 'Master profile and targeted CV identity remain distinct',
 'Field, entry and section edits are reversible',
 'Preview reflects current document state',
 'Pagination and overflow diagnostics are preserved',
 'Template selection preserves document content',
 'Save and autosave preserve revision identity',
 'Recovery does not silently overwrite newer state',
 'Export requests retain template and revision provenance',
 'ATS and job matching remain deterministic at baseline',
 'AI remains provider-neutral until explicitly integrated',
 'Accessibility controls remain available',
 'Security boundaries reject credential leakage',
 'Browser acceptance evidence is collected before release',
 'CI results are observed rather than inferred',
 'Deployment verification is required before production release'
]);
