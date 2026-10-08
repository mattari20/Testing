export const SKILLS_LANGUAGES_PRESENTATION_VERSION = '1.0.0';

const PROFICIENCY_BY_LIST_STYLE = Object.freeze({
  tags: Object.freeze(['off']),
  pills: Object.freeze(['off']),
  compact: Object.freeze(['off']),
  inline: Object.freeze(['off']),
  bullets: Object.freeze(['off','text','stars','bars','dots']),
  stacked: Object.freeze(['off','text','stars','bars','dots'])
});

const makeSection = (defaultStyle, supported, proficiency, proficiencyDefault) => Object.freeze({
  default: defaultStyle,
  supported: Object.freeze(supported),
  proficiency: Object.freeze(proficiency),
  proficiencyDefault,
  proficiencyByListStyle: PROFICIENCY_BY_LIST_STYLE
});

const make = (skillsDefault, languagesDefault, skills, languages, skillProficiency=['off','text','stars','bars','dots'], languageProficiency=['off','text','stars','bars','dots'], skillProficiencyDefault='off', languageProficiencyDefault='off') => Object.freeze({
  skills: makeSection(skillsDefault, skills, skillProficiency, skillProficiencyDefault),
  languages: makeSection(languagesDefault, languages, languageProficiency, languageProficiencyDefault)
});

export function getAllowedProficiencyForListStyle(sectionContract, listStyle) {
  if (!sectionContract) return ['off'];
  if (sectionContract.proficiency.length === 1 && sectionContract.proficiency[0] === 'off') return ['off'];
  const configured = sectionContract.proficiencyByListStyle?.[String(listStyle)];
  return configured || sectionContract.proficiency;
}

export const SKILLS_LANGUAGES_TEMPLATE_CONTRACTS = Object.freeze({
  't01-modern-minimalist-cv-design_ats': make('compact','compact',['compact','inline'],['compact','inline'],['off'],['off']),
  't01-modern-minimalist-cv-design_simple': make('tags','pills',['tags','compact','inline'],['pills','compact','inline']),
  't01-modern-minimalist-cv-design_modern': make('tags','pills',['tags','compact','bullets'],['pills','stacked','compact','inline']),
  't02-professional-cv-design_modern': make('tags','stacked',['tags','compact','bullets'],['stacked','compact','inline']),
  't03-professional-cv-design_modern': make('tags','stacked',['tags','compact','bullets'],['stacked','compact','inline']),
  't04-modern-blue-corporate_modern': make('tags','stacked',['tags','compact','bullets'],['stacked','compact','inline'],['off','text','stars','bars','dots'],['off','text','bars','dots'], 'off', 'bars'),
  't05-simple-cv-graphic-web-designer_modern': make('tags','pills',['tags','compact','inline'],['pills','stacked','compact','inline']),
  't06-professional-cv-graphic-designer_modern': make('tags','stacked',['tags','compact','bullets'],['stacked','compact','inline']),
  't07-professional-cv-store-manager-incharge_modern': make('compact','stacked',['tags','compact','inline'],['stacked','compact','inline'])
});

export const DEFAULT_SKILLS_LANGUAGES_CONTRACT = make('tags','stacked',['tags','inline','bullets','compact'],['stacked','inline','pills','compact']);

export function getSkillsLanguagesPresentationContract(templateId) {
  return SKILLS_LANGUAGES_TEMPLATE_CONTRACTS[String(templateId)] || DEFAULT_SKILLS_LANGUAGES_CONTRACT;
}

export function resolveSkillsLanguagesPresentation(templateId, presentation={}) {
  const contract = getSkillsLanguagesPresentationContract(templateId);
  const current = presentation && typeof presentation === 'object' ? presentation : {};
  const listStyles = { ...(current.listStyles || {}) };
  const ratings = { ...(current.ratings || {}) };
  for (const type of ['skills','languages']) {
    const sectionContract = contract[type];
    if (!sectionContract.supported.includes(String(listStyles[type] || ''))) listStyles[type] = sectionContract.default;
    const configured = String(ratings[type]?.style || 'off');
    const allowed = getAllowedProficiencyForListStyle(sectionContract, listStyles[type]);
    const style = allowed.includes(configured)
      ? configured
      : (allowed.includes(sectionContract.proficiencyDefault) ? sectionContract.proficiencyDefault : 'off');
    ratings[type] = { ...(ratings[type] || {}), style, values: {} };
  }
  return { ...current, listStyles, ratings };
}
