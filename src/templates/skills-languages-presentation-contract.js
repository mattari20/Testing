export const SKILLS_LANGUAGES_PRESENTATION_VERSION = '2.0.0';

/**
 * Universal Skills/Languages presentation vocabulary.
 *
 * Every current native template and every future template gets the same
 * semantic style set. A template may still choose a different default, but
 * the renderer/editor do not need a new implementation for each template.
 */
export const UNIVERSAL_SKILLS_LANGUAGES_LIST_STYLES = Object.freeze([
  'tags',
  'pills',
  'compact',
  'inline',
  'bullets',
  'stacked'
]);

export const UNIVERSAL_SKILLS_LANGUAGES_PROFICIENCY_STYLES = Object.freeze([
  'off',
  'text',
  'stars',
  'bars',
  'dots'
]);

const PROFICIENCY_BY_LIST_STYLE = Object.freeze({
  tags: Object.freeze(['off']),
  pills: Object.freeze(['off']),
  compact: Object.freeze(['off']),
  inline: Object.freeze(['off']),
  bullets: Object.freeze(['off','text','stars','bars','dots']),
  stacked: Object.freeze(['off','text','stars','bars','dots'])
});

const makeSection = (defaultStyle, proficiencyDefault='off') => Object.freeze({
  default: UNIVERSAL_SKILLS_LANGUAGES_LIST_STYLES.includes(defaultStyle)
    ? defaultStyle
    : 'tags',
  supported: UNIVERSAL_SKILLS_LANGUAGES_LIST_STYLES,
  proficiency: UNIVERSAL_SKILLS_LANGUAGES_PROFICIENCY_STYLES,
  proficiencyDefault: UNIVERSAL_SKILLS_LANGUAGES_PROFICIENCY_STYLES.includes(proficiencyDefault)
    ? proficiencyDefault
    : 'off',
  proficiencyByListStyle: PROFICIENCY_BY_LIST_STYLE
});

const make = (
  skillsDefault='tags',
  languagesDefault='stacked',
  skillProficiencyDefault='off',
  languageProficiencyDefault='off'
) => Object.freeze({
  skills: makeSection(skillsDefault, skillProficiencyDefault),
  languages: makeSection(languagesDefault, languageProficiencyDefault)
});

export function getAllowedProficiencyForListStyle(sectionContract, listStyle) {
  if (!sectionContract) return ['off'];
  if (sectionContract.proficiency.length === 1 && sectionContract.proficiency[0] === 'off') return ['off'];
  const configured = sectionContract.proficiencyByListStyle?.[String(listStyle)];
  return configured || sectionContract.proficiency;
}

/**
 * Current template defaults only. Presentation capabilities are universal.
 * This is intentionally data-only so future templates inherit the same
 * style/rating system automatically unless they explicitly choose a default.
 */
export const SKILLS_LANGUAGES_TEMPLATE_CONTRACTS = Object.freeze({
  't01-modern-minimalist-cv-design_ats': make('compact','compact'),
  't01-modern-minimalist-cv-design_simple': make('tags','pills'),
  't01-modern-minimalist-cv-design_modern': make('tags','pills'),
  't02-professional-cv-design_modern': make('tags','stacked'),
  't03-professional-cv-design_modern': make('tags','stacked'),
  't04-modern-blue-corporate_modern': make('tags','stacked','off','bars'),
  't05-simple-cv-graphic-web-designer_modern': make('tags','pills'),
  't06-professional-cv-graphic-designer_modern': make('tags','stacked'),
  't07-professional-cv-store-manager-incharge_modern': make('compact','stacked')
});

export const DEFAULT_SKILLS_LANGUAGES_CONTRACT = make('tags','stacked');

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
    if (!sectionContract.supported.includes(String(listStyles[type] || ''))) {
      listStyles[type] = sectionContract.default;
    }

    const configured = String(ratings[type]?.style || 'off');
    const allowed = getAllowedProficiencyForListStyle(sectionContract, listStyles[type]);
    const style = allowed.includes(configured)
      ? configured
      : (allowed.includes(sectionContract.proficiencyDefault) ? sectionContract.proficiencyDefault : 'off');

    ratings[type] = { ...(ratings[type] || {}), style, values: {} };
  }

  return { ...current, listStyles, ratings };
}
