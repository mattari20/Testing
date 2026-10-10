const ICONS = Object.freeze({
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.9L7.2 10a16 16 0 0 0 6 6l1.6-1.8a2 2 0 0 1 1.9-.6l2.8.5a2 2 0 0 1 1.5 1.8Z"/>',
  whatsapp: '<path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7a8.5 8.5 0 1 1 16.3-3.8Z"/><path d="M8.5 8.5c.5 3 2.2 4.7 5.2 5.7l1.3-1.2 2 .9c-.2 1.4-1.3 2.2-2.7 2.1-3.5-.5-6.7-3.7-7.2-7.2-.1-1.4.7-2.5 2.1-2.7l.9 2Z"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  address: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7h.01M11 17v-7h3v1a3 3 0 0 1 4 3v3"/>',
  website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  birthday: '<rect x="3" y="10" width="18" height="11" rx="2"/><path d="M7 10V7a2 2 0 0 1 4 0v3M13 10V5a2 2 0 0 1 4 0v5M3 15h18M8 3v1M16 3v1"/>',
  id: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="10" r="2"/><path d="M5.5 16a3 3 0 0 1 6 0M14 9h4M14 13h4M14 16h3"/>',
  gender: '<circle cx="10" cy="14" r="5"/><path d="m14 10 6-6M15 4h5v5M10 19v3M7 21h6"/>',
  nationality: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  religion: '<path d="M12 3v18M5 8h14M7 8l5-5 5 5M7 21h10"/>',
  summary: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  experience: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/>',
  education: '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c4 3 8 3 12 0v-5M22 9v6"/>',
  award: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v5M8 21h8M9 18h6"/>',
  projects: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6M7 16h8"/>',
  default: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>'
  default: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>'
});
const ICON_ALIASES = Object.freeze({
  'fa-briefcase':'experience','fa-graduation-cap':'education','fa-phone':'phone','fa-phone-alt':'phone','fa-whatsapp':'whatsapp','fa-envelope':'email',
  'fa-map-marker-alt':'address','fa-location-dot':'address','fa-linkedin-in':'linkedin',
  'fa-linkedin':'linkedin','fa-globe':'website','fa-cake-candles':'birthday','fa-birthday-cake':'birthday',
  'fa-id-card':'id','fa-id-card-alt':'id','fa-venus-mars':'gender','fa-mars':'gender','fa-venus':'gender',
  'fa-flag':'nationality','fa-star-and-crescent':'religion'
});
export function applyReusableCvIcons(root) {
  if (!root?.querySelectorAll || !root.ownerDocument) return;
  const createIcon = (key) => {
    const svg = root.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', 'cv-icon cv-icon-' + key);
    svg.style.cssText = 'width:1em;height:1em;display:inline-block;flex:0 0 1em;vertical-align:-0.16em;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;color:inherit;';
    svg.innerHTML = ICONS[key] || ICONS.default;
    return svg;
  };
  root.querySelectorAll('.section-title,.section-label,.sidebar-title').forEach(heading => {
    if (heading.querySelector('.cv-icon')) return;
    const label = (heading.textContent || '').trim().toLowerCase().replace(/[^a-z ]/g, '');
    const key = /experience|work history/.test(label) ? 'experience'
      : /education|qualification/.test(label) ? 'education'
      : /award|achievement|honou?r/.test(label) ? 'award'
      : /summary|profile|about/.test(label) ? 'summary'
      : /project/.test(label) ? 'projects' : null;
    if (!key) return;
    const icon = createIcon(key);
    icon.style.marginRight = '0.45em';
    icon.style.verticalAlign = '-0.12em';
    heading.prepend(icon);
  });
  root.querySelectorAll('i[class]').forEach(oldIcon => {
    const classes = [...oldIcon.classList];
    const key = classes.map(name => ICON_ALIASES[name]).find(Boolean);
    if (!key && !classes.some(name => /^(fa|fas|far|fab|fa-solid|fa-regular|fa-brands)$/.test(name))) return;
    oldIcon.replaceWith(createIcon(key || 'default'));
  });
}
