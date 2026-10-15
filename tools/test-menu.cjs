const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const menu = JSON.parse(fs.readFileSync(path.join(root, 'data/menu.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'html/menu.html'), 'utf8');
function element(dataset = {}) {
  return { dataset, hidden: false, value: '', listeners: {}, attrs: {},
    addEventListener(type, handler) { this.listeners[type] = handler; },
    setAttribute(key, value) { this.attrs[key] = value; },
    focus() {}, scrollIntoView() {}, getBoundingClientRect() { return { top: 200 }; },
  };
}
function boot(query = '') {
  const search = element(), count = element(), empty = element(), additives = element(), reset = element();
  const chips = [...html.matchAll(/data-menu-filter="([^"]+)"/g)].map(m => element({ menuFilter: m[1] }));
  const shortcuts = [...html.matchAll(/data-category-jump="([^"]+)"/g)].map(m => element({ categoryJump: m[1] }));
  const groups = menu.map(g => {
    const e = element({ menuGroup: g.filter });
    e.items = g.items.map(i => element({ search: i.name }));
    e.querySelectorAll = () => e.items;
    return e;
  });
  const one = { '#menu-search': search, '#menu-result-count': count, '.menu-empty': empty,
    '.menu-additives': additives, '[data-reset-menu]': reset, '.menu-content': element(), '.menu-search-bar': element() };
  const many = { '[data-menu-filter]': chips, '[data-menu-group]': groups, '[data-category-jump]': shortcuts };
  const location = { href: 'https://www.ersans-kebap.de/html/menu.html' + query };
  const context = { URL, URLSearchParams, Intl, Date, console, location,
    history: { replaceState(a, b, url) { location.href = new URL(url, location.href).href; } },
    window: { matchMedia: () => ({ matches: true }), addEventListener() {}, scrollY: 0 },
    document: { currentScript: { src: 'https://www.ersans-kebap.de/js/app.js?v=test' },
      baseURI: location.href, querySelector: s => one[s] || null,
      querySelectorAll: s => many[s] || [], addEventListener() {} }, module: { exports: {} } };
  vm.runInNewContext(source, context);
  return { search, count, empty, additives, reset, chips, shortcuts, groups, location };
}
const app = boot();
assert.match(app.count.textContent, /^64 /);
app.chips.find(x => x.dataset.menuFilter === 'pizza').listeners.click();
assert.equal(app.groups.filter(g => !g.hidden).length, menu.filter(g => g.filter === 'pizza').length);
assert(app.location.href.includes('kategorie=pizza'));
app.search.value = 'gibt-es-garantiert-nicht'; app.search.listeners.input();
assert.equal(app.empty.hidden, false); assert.equal(app.additives.hidden, true);
app.shortcuts.find(x => x.dataset.categoryJump === 'doener').listeners.click();
assert.equal(app.search.value, ''); assert.equal(app.empty.hidden, true);
assert(app.groups.filter(g => !g.hidden).every(g => g.dataset.menuGroup === 'doener'));
app.reset.listeners.click(); assert.match(app.count.textContent, /^64 /);
assert(!app.location.href.includes('kategorie='));
const direct = boot('?kategorie=getraenke');
assert(direct.groups.filter(g => !g.hidden).every(g => g.dataset.menuGroup === 'getraenke'));
console.log('PASS: real menu handler; 64 entries, category/query filtering, empty state, direct links and shortcut/reset behavior');
