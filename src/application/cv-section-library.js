export const CV_SECTION_LIBRARY_VERSION = '1.0.0';

const field = (key, label, type = 'text', placeholder = '') => Object.freeze({
  key, label, type, placeholder: placeholder || label, required: key === 'title' || key === 'name'
});

const preset = (id, title, singular, category, priority, description, fields) => Object.freeze({
  id, title, singular, category, priority, description,
  version: '1.0.0',
  repeatable: true,
  fields: Object.freeze(fields.map(item => Object.freeze(item))),
  createSection() {
    const values = Object.fromEntries(fields.map(item => [item.key, '']));
    return {
      type: id,
      title,
      visibility: true,
      repeatable: true,
      fields: fields.map(item => ({ id:item.key, type:item.type, label:item.label, value:'', visibility:true, order:fields.indexOf(item), metadata:{ placeholder:item.placeholder, required:item.required, sectionLibraryField:true } })),
      entries: [{ values, visibility: true }],
      metadata: {
        sectionLibrary: {
          presetId: id, definitionVersion: '1.0.0', entryLabel: singular,
          category, priority, fields: fields.map(item => ({ ...item }))
        }
      }
    };
  }
});

const definitions = [
  preset('awards-honors','Awards & Honors','Award','Achievements','P1','Recognitions, distinctions, and honors.',[
    field('title','Award / Honor'),field('issuer','Issuing Organization'),field('date','Date','date'),field('level','Level / Type'),field('reason','Reason / Description','textarea'),field('url','Evidence URL','url')
  ]),
  preset('key-achievements','Key Achievements','Achievement','Achievements','P1','Specific outcomes and contributions; use truthful, verifiable results.',[
    field('title','Achievement'),field('context','Context / Challenge'),field('action','Action Taken','textarea'),field('result','Result / Impact','textarea'),field('date','Date','date'),field('url','Evidence URL','url')
  ]),
  preset('projects-portfolio','Projects & Portfolio','Project','Projects & Portfolio','P1','Selected projects, your contribution, tools, outcomes, and links.',[
    field('title','Project Name'),field('role','Your Role'),field('startDate','Start Date','date'),field('endDate','End Date','date'),field('description','Description','textarea'),field('technologies','Tools / Technologies'),field('outcome','Outcome / Impact','textarea'),field('url','Project / Demo URL','url'),field('repositoryUrl','Repository URL','url')
  ]),
  preset('certifications-licenses','Certifications & Licenses','Credential','Credentials & Training','P1','Professional certifications, licenses, and verification details.',[
    field('title','Certification / License'),field('issuer','Issuing Organization'),field('issueDate','Issue Date','date'),field('expiryDate','Expiry Date','date'),field('credentialId','Credential ID'),field('url','Verification URL','url'),field('status','Status')
  ]),
  preset('courses-training','Courses & Training','Course','Credentials & Training','P1','Relevant courses, workshops, and completed training.',[
    field('title','Course / Training'),field('provider','Provider'),field('completionDate','Completion Date','date'),field('duration','Duration'),field('description','Learning / Outcome','textarea'),field('url','Certificate / Course URL','url')
  ]),
  preset('volunteer-service','Volunteer & Community Service','Volunteer Role','Leadership & Community','P1','Community service and volunteer contributions.',[
    field('organization','Organization'),field('role','Role'),field('startDate','Start Date','date'),field('endDate','End Date','date'),field('responsibilities','Responsibilities','textarea'),field('outcomes','Outcomes / Impact','textarea'),field('url','Organization / Project URL','url')
  ]),
  preset('leadership-activities','Leadership & Extracurricular Activities','Activity','Leadership & Community','P1','Leadership roles, clubs, student bodies, and extracurricular activities.',[
    field('organization','Organization / Club'),field('role','Position / Role'),field('startDate','Start Date','date'),field('endDate','End Date','date'),field('responsibilities','Responsibilities','textarea'),field('achievements','Achievements','textarea'),field('url','Related URL','url')
  ]),
  preset('research-experience','Research Experience','Research Role','Academic & Research','P1','Research projects, methods, supervision, and outcomes.',[
    field('title','Research Title / Topic'),field('institution','Institution / Lab'),field('role','Research Role'),field('supervisor','Supervisor'),field('startDate','Start Date','date'),field('endDate','End Date','date'),field('methods','Methods / Tools'),field('description','Research Description','textarea'),field('outcomes','Findings / Outcomes','textarea'),field('url','Research URL','url')
  ]),
  preset('publications','Publications','Publication','Academic & Research','P1','Academic and professional publications with accurate publication status.',[
    field('title','Publication Title'),field('authors','Authors'),field('publicationType','Publication Type'),field('venue','Journal / Publisher / Venue'),field('date','Publication Date','date'),field('volume','Volume / Issue / Pages'),field('doi','DOI'),field('url','Publication URL','url'),field('status','Status (Published / Accepted / Under Review / Submitted)')
  ]),
  preset('conferences-presentations','Conferences & Presentations','Presentation','Academic & Research','P1','Conference contributions, posters, talks, and presentations.',[
    field('title','Talk / Presentation Title'),field('event','Conference / Event'),field('presentationType','Presentation Type'),field('authors','Authors / Presenters'),field('location','Location'),field('date','Date','date'),field('url','Event / Presentation URL','url')
  ]),
  preset('professional-memberships','Professional Memberships & Affiliations','Membership','Professional','P1','Professional associations and memberships.',[
    field('organization','Association / Organization'),field('membershipType','Membership Type'),field('startDate','Start Date','date'),field('endDate','End Date','date'),field('membershipId','Membership ID (Optional)'),field('url','Official URL','url')
  ]),
  preset('additional-information','Additional Information','Item','Other','P1','Additional relevant information that does not fit another section.',[
    field('title','Item / Topic'),field('details','Details','textarea'),field('url','Related URL','url')
  ]),
  preset('scholarships-fellowships','Scholarships & Fellowships','Scholarship','Academic & Research','P2','Scholarships, fellowships, and academic funding awards.',[
    field('title','Scholarship / Fellowship'),field('awarder','Awarding Body'),field('program','Program'),field('startDate','Start Date','date'),field('endDate','End Date','date'),field('fundingType','Funding Type'),field('description','Description','textarea')
  ]),
  preset('research-grants','Research Grants & Funding','Grant','Academic & Research','P2','Research grants and funded projects; amounts are optional and user-supplied.',[
    field('title','Grant / Project Title'),field('fundingBody','Funding Body'),field('role','Your Role / PI Status'),field('amount','Amount (Optional)'),field('currency','Currency (if amount supplied)'),field('startDate','Start Date','date'),field('endDate','End Date','date'),field('purpose','Purpose / Outcomes','textarea'),field('status','Status')
  ]),
  preset('thesis-dissertation','Thesis & Dissertation','Thesis','Academic & Research','P2','Thesis, dissertation, and capstone research.',[
    field('title','Thesis / Dissertation Title'),field('degree','Degree'),field('institution','Institution'),field('supervisor','Supervisor'),field('date','Completion Date','date'),field('abstract','Abstract / Summary','textarea'),field('methods','Methods / Tools'),field('url','Repository URL','url')
  ]),
  preset('patents-ip','Patents & Intellectual Property','Patent','Academic & Research','P2','Patents and registered intellectual property.',[
    field('title','Patent / IP Title'),field('number','Patent / Registration Number'),field('inventors','Inventors'),field('authority','Authority / Jurisdiction'),field('filingDate','Filing Date','date'),field('grantDate','Grant Date','date'),field('status','Status'),field('url','Official Record URL','url')
  ]),
  preset('teaching-experience','Teaching Experience','Teaching Role','Academic & Research','P2','Teaching, tutoring, course delivery, and academic supervision.',[
    field('course','Course / Subject'),field('institution','Institution'),field('role','Teaching Role'),field('startDate','Start Date','date'),field('endDate','End Date','date'),field('level','Student Level'),field('responsibilities','Responsibilities','textarea'),field('url','Related URL','url')
  ]),
  preset('professional-service-mentoring','Professional Service & Mentoring','Service Role','Professional','P2','Peer review, judging, mentoring, committees, and professional service.',[
    field('organization','Organization'),field('role','Service / Mentoring Role'),field('startDate','Start Date','date'),field('endDate','End Date','date'),field('details','Details','textarea'),field('url','Related URL','url')
  ]),
  preset('open-source-contributions','Open-Source Contributions','Contribution','Projects & Portfolio','P2','Open-source projects and contributions with links.',[
    field('project','Project / Repository'),field('role','Role'),field('contribution','Contribution','textarea'),field('technologies','Technologies'),field('date','Date','date'),field('url','Repository URL','url')
  ]),
  preset('technical-lab-experience','Technical & Laboratory Experience','Technical Experience','Professional','P2','Relevant equipment, lab methods, software, and technical practice.',[
    field('title','Technology / Equipment / Method'),field('context','Employer / Lab / Project'),field('level','Experience Level'),field('description','Use / Context','textarea'),field('date','Date (Optional)','date'),field('url','Evidence URL','url')
  ]),
  preset('case-studies','Selected Work / Case Studies','Case Study','Projects & Portfolio','P2','Show the problem, your approach, and a truthful result.',[
    field('title','Case Study Title'),field('problem','Problem / Need','textarea'),field('approach','Approach','textarea'),field('result','Result','textarea'),field('date','Date','date'),field('url','Case Study URL','url')
  ]),
  preset('media-appearances','Media & Public Appearances','Appearance','Professional','P3','Relevant interviews, media coverage, and public appearances.',[
    field('outlet','Outlet / Event'),field('role','Role'),field('topic','Topic'),field('date','Date','date'),field('url','Media URL','url')
  ]),
  preset('speaking-engagements','Guest Lectures & Speaking Engagements','Speaking Engagement','Professional','P3','Guest lectures, invited talks, and speaking engagements.',[
    field('title','Talk Title'),field('event','Event / Organization'),field('role','Role'),field('date','Date','date'),field('audience','Topic / Audience'),field('url','Event URL','url')
  ]),
  preset('interests-hobbies','Interests & Hobbies','Interest','Other','P3','Optional interests relevant to the role or professional profile.',[
    field('title','Interest'),field('details','Short Description','textarea')
  ]),
  preset('references','References','Reference','Other','P3','Optional referees. Obtain their permission before sharing contact details.',[
    field('name','Reference Name'),field('designation','Designation'),field('organization','Organization'),field('relationship','Professional Relationship'),field('email','Email','email'),field('phone','Phone'),field('consent','Permission Confirmed')
  ])
];

export const CV_SECTION_LIBRARY = Object.freeze(definitions);
const byId = new Map(CV_SECTION_LIBRARY.map(item => [item.id, item]));

export function listSectionPresets(options = {}) {
  const query = String(options.query || '').trim().toLowerCase();
  const category = String(options.category || '').trim();
  const priority = String(options.priority || '').trim();
  return CV_SECTION_LIBRARY.filter(item =>
    (!query || [item.id,item.title,item.singular,item.category,item.description,...item.fields.map(f => f.label)].join(' ').toLowerCase().includes(query)) &&
    (!category || item.category === category) &&
    (!priority || item.priority === priority)
  );
}
export function getSectionPreset(id) {
  return byId.get(String(id || '')) || null;
}
export function createSectionFromPreset(id) {
  const item = getSectionPreset(id);
  if (!item) throw new Error('Unknown section preset: ' + String(id));
  return item.createSection();
}
export function validateSectionLibrary() {
  const errors = [];
  const ids = new Set();
  for (const item of CV_SECTION_LIBRARY) {
    if (!item.id || ids.has(item.id)) errors.push('Section preset ID is missing or duplicated: ' + item.id);
    ids.add(item.id);
    if (!item.title || !item.singular || !item.category) errors.push('Section preset metadata is incomplete: ' + item.id);
    if (!item.fields.length) errors.push('Section preset has no fields: ' + item.id);
    const keys = new Set();
    for (const f of item.fields) {
      if (!f.key || keys.has(f.key)) errors.push('Field key is missing or duplicated in ' + item.id + ': ' + f.key);
      keys.add(f.key);
      if (!['text','textarea','email','url','date','select','checkbox','richtext'].includes(f.type)) errors.push('Unsupported field type in ' + item.id + ': ' + f.type);
    }
  }
  return Object.freeze({valid: errors.length === 0, errors:Object.freeze(errors), count:CV_SECTION_LIBRARY.length});
}
