export const PRE_DESIGNED_SECTION_LIBRARY_VERSION = '1.0.0';

const entry = (title, type, category, fields) => Object.freeze({
  title, type, category, repeatable: true,
  fields: Object.freeze(fields.map(([key, label]) => Object.freeze({ key, label })))
});

export const PRE_DESIGNED_SECTION_GROUPS = Object.freeze([
  Object.freeze({ title: 'Achievements & Qualifications', sections: Object.freeze([
    entry('Awards & Honors','awards','Achievements & Qualifications',[['award','Award or honor'],['issuer','Issuing organization'],['date','Date'],['details','Details']]),
    entry('Key Achievements','key-achievements','Achievements & Qualifications',[['achievement','Achievement'],['context','Context'],['result','Result or impact']]),
    entry('Scholarships & Fellowships','scholarships','Achievements & Qualifications',[['name','Scholarship or fellowship'],['provider','Provider'],['date','Date'],['details','Details']]),
    entry('Licenses & Professional Certifications','certifications','Achievements & Qualifications',[['name','License or certification'],['issuer','Issuing organization'],['date','Issue date'],['expiry','Expiry date or status']]),
    entry('Courses & Professional Training','training','Achievements & Qualifications',[['course','Course or training'],['provider','Provider'],['date','Completion date'],['details','Skills or topics covered']])
  ])}),
  Object.freeze({ title: 'Academic & Research', sections: Object.freeze([
    entry('Research Experience','research','Academic & Research',[['role','Research role'],['institution','Institution or lab'],['dates','Dates'],['description','Research and outcomes']]),
    entry('Publications','publications','Academic & Research',[['title','Publication title'],['authors','Authors'],['venue','Journal or publisher'],['date','Publication date'],['link','DOI or URL']]),
    entry('Conferences & Presentations','conferences','Academic & Research',[['title','Presentation or event'],['event','Conference or organization'],['date','Date'],['details','Contribution or topic']]),
    entry('Research Grants & Funding','grants','Academic & Research',[['name','Grant or funding title'],['funder','Funding organization'],['date','Date or period'],['details','Role or amount']]),
    entry('Thesis & Dissertation','thesis','Academic & Research',[['title','Thesis or dissertation title'],['institution','Institution'],['date','Date'],['supervisor','Supervisor'],['summary','Research summary']])
  ])}),
  Object.freeze({ title: 'Technical & Professional Work', sections: Object.freeze([
    entry('Patents & Intellectual Property','patents','Technical & Professional Work',[['title','Patent or IP title'],['inventors','Inventors'],['status','Patent number or status'],['date','Date'],['details','Details']]),
    entry('Teaching Experience','teaching','Technical & Professional Work',[['role','Teaching role'],['institution','Institution'],['dates','Dates'],['subjects','Subjects or courses'],['description','Responsibilities']]),
    entry('Projects & Portfolio','project-portfolio','Technical & Professional Work',[['name','Project name'],['role','Your role'],['dates','Dates'],['description','Project summary'],['link','Portfolio or project URL']]),
    entry('Open-Source Contributions','open-source','Technical & Professional Work',[['project','Project or repository'],['role','Contribution'],['date','Date or period'],['link','Repository URL'],['details','Impact or details']]),
    entry('Selected Work / Case Studies','case-studies','Technical & Professional Work',[['title','Work or case study'],['role','Your role'],['date','Date'],['challenge','Challenge'],['outcome','Outcome']])
  ])}),
  Object.freeze({ title: 'Experience & Involvement', sections: Object.freeze([
    entry('Technical & Laboratory Experience','laboratory','Experience & Involvement',[['role','Role'],['institution','Lab or organization'],['dates','Dates'],['techniques','Equipment or techniques'],['description','Experience details']]),
    entry('Volunteer & Community Service','volunteering','Experience & Involvement',[['role','Volunteer role'],['organization','Organization'],['dates','Dates'],['description','Contribution or impact']]),
    entry('Leadership & Extracurricular Activities','leadership','Experience & Involvement',[['role','Role or activity'],['organization','Organization'],['dates','Dates'],['description','Leadership or contribution']]),
    entry('Professional Memberships & Affiliations','memberships','Experience & Involvement',[['organization','Association or organization'],['membership','Membership type'],['dates','Dates'],['details','Details']]),
    entry('Professional Service & Mentoring','service-mentoring','Experience & Involvement',[['role','Role'],['organization','Organization'],['dates','Dates'],['description','Service or mentoring details']])
  ])}),
  Object.freeze({ title: 'Additional CV Sections', sections: Object.freeze([
    entry('Languages','language-profiles','Additional CV Sections',[['language','Language'],['proficiency','Proficiency level'],['evidence','Certificate or details']]),
    entry('Media & Public Appearances','media','Additional CV Sections',[['title','Appearance or feature'],['outlet','Media outlet'],['date','Date'],['link','Link or details']]),
    entry('Guest Lectures & Speaking Engagements','speaking','Additional CV Sections',[['title','Talk or lecture'],['event','Event or host'],['date','Date'],['details','Topic or audience']]),
    entry('Interests & Hobbies','interests','Additional CV Sections',[['interest','Interest or hobby'],['details','Relevant detail']]),
    entry('References','references','Additional CV Sections',[['name','Reference name'],['role','Role or title'],['organization','Organization'],['email','Email'],['phone','Phone']]),
    entry('Additional Information','additional-information','Additional CV Sections',[['information','Additional information'],['details','Supporting details']])
  ])})
]);

export const PRE_DESIGNED_SECTION_CATALOG = Object.freeze(
  PRE_DESIGNED_SECTION_GROUPS.flatMap(group => group.sections)
);

export function createPreDesignedSection(sectionType) {
  const definition = PRE_DESIGNED_SECTION_CATALOG.find(section => section.type === String(sectionType));
  if (!definition) throw new Error('Unknown pre-designed section: ' + sectionType);
  const fields = definition.fields.map(field => ({
    id: field.key,
    type: 'text',
    label: field.label,
    value: ''
  }));
  const values = Object.fromEntries(definition.fields.map(field => [field.key, '']));
  return {
    type: definition.type,
    title: definition.title,
    repeatable: true,
    fields: [],
    entries: [{ values, visibility: true, order: 0 }],
    metadata: {
      source: 'pre-designed-section-library',
      libraryVersion: PRE_DESIGNED_SECTION_LIBRARY_VERSION,
      category: definition.category,
      fieldDefinitions: fields
    }
  };
}

export function renderPreDesignedSectionLibrary(escapeAttribute) {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const attr = value => escapeAttribute ? escapeAttribute(value) : esc(JSON.stringify(value));
  const groups = PRE_DESIGNED_SECTION_GROUPS.map(group =>
    '<details data-v2-section-library-group><summary>'+esc(group.title)+' ('+group.sections.length+')</summary><div data-v2-section-library-grid>'+
    group.sections.map(section => {
      const payload = createPreDesignedSection(section.type);
      return '<button type="button" data-v2-editor-command="add-section" data-v2-section-library-item="'+esc(section.type)+'" data-v2-target="'+attr({})+'" data-v2-payload="'+attr(payload)+'">'+
        '<span>'+esc(section.title)+'</span><small>Add section</small></button>';
    }).join('')+'</div></details>'
  ).join('');
  return '<section data-v2-pre-designed-section-library><h3>Pre-designed Sections</h3><p>Choose a ready-made section to add it to your CV. You can edit its entries and move or hide it afterward.</p>'+groups+'</section>';
}
