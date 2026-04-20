const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function loadSiteContent() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read('data/site-content.js'), sandbox, { filename: 'data/site-content.js' });
  return sandbox.window.DMU_SITE_CONTENT;
}

function checkSiteContent() {
  const data = loadSiteContent();
  if (!data) {
    fail('data/site-content.js did not define window.DMU_SITE_CONTENT');
    return;
  }

  const defaultNav = data.site?.navigation?.default || [];
  const footerColumns = data.site?.footer?.columns || [];
  const footerSocials = data.site?.footer?.socials || [];
  if (!defaultNav.length) fail('Missing shared default navigation data');
  if (footerColumns.length !== 3) fail(`Expected 3 shared footer link columns, found ${footerColumns.length}`);
  if (footerSocials.length < 4) fail('Expected shared footer social links');

  const sponsors = data.sponsors || [];
  if (sponsors.length < 6) fail(`Expected at least 6 sponsors, found ${sponsors.length}`);
  sponsors.forEach(sponsor => {
    if (!sponsor.name || !sponsor.website || !sponsor.logo || !sponsor.description) {
      fail(`Sponsor record is incomplete: ${sponsor.name || '(unnamed)'}`);
    }
  });

  const resourceGroups = data.resources || {};
  ['platforms', 'tools', 'learning', 'certs'].forEach(group => {
    if (!resourceGroups[group]?.length) fail(`Missing resources group: ${group}`);
  });

  const categories = data.p2p?.categories || [];
  const categoryTotal = categories.reduce((sum, category) => sum + Number(category.count || 0), 0);
  if (categories.length !== 12) fail(`Expected 12 Pwn2Play categories, found ${categories.length}`);
  if (categoryTotal !== 50) fail(`Expected 50 Pwn2Play challenges, found ${categoryTotal}`);

  const prizes = data.p2p?.prizes;
  if (!prizes?.placements || prizes.placements.length !== 3) fail('Expected 3 Pwn2Play prize placements');
  if (!/in-person/i.test(prizes?.subtitle || '')) fail('Pwn2Play prize subtitle should mention in-person scope');

  const aiRule = (data.p2p?.rules || []).find(rule => /AI Usage Policy/i.test(rule.title || ''));
  if (!aiRule) fail('Missing Pwn2Play AI Usage Policy rule');
  if (aiRule && !aiRule.critical) fail('AI Usage Policy should be marked critical');

  const currentMembers = data.committee?.currentMembers || [];
  const timeline = data.committee?.timeline || [];
  if (!currentMembers.length) fail('Missing current committee members');
  if (!timeline.length) fail('Missing committee timeline entries');

  const results = data.p2p?.results?.events || [];
  if (!results.length) fail('Missing Pwn2Play results data');

  if (!data.p2p?.links?.ics) fail('Missing Pwn2Play ICS link');
  if (!data.p2p?.venues?.length) fail('Missing Pwn2Play venue data');
  if (!data.p2p?.scoreboardTracks?.length) fail('Missing Pwn2Play scoreboard track data');
  if (!data.p2p?.lastUpdated) fail('Missing Pwn2Play lastUpdated date');
}

function checkHtmlIdsAndLocalRefs() {
  const htmlFiles = fs.readdirSync(root).filter(file => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const content = read(file);

    const ids = [...content.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
    const seen = new Map();
    ids.forEach(id => seen.set(id, (seen.get(id) || 0) + 1));
    for (const [id, count] of seen.entries()) {
      if (count > 1) fail(`${file} has duplicate id "${id}"`);
    }

    for (const match of content.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const value = match[1];
      if (/^(https?:|mailto:|tel:|#|data:|javascript:)/.test(value)) continue;
      const localPath = value.split(/[?#]/)[0];
      if (!localPath || localPath.startsWith('#')) continue;
      if (!fs.existsSync(path.join(root, localPath))) {
        fail(`${file} references missing local path: ${localPath}`);
      }
    }

    for (const match of content.matchAll(/<img\b([^>]*)>/g)) {
      if (!/\balt=/.test(match[1])) fail(`${file} has image without alt text`);
    }

    for (const match of content.matchAll(/<iframe\b([^>]*)>/g)) {
      if (!/\btitle=/.test(match[1])) fail(`${file} has iframe without title`);
    }

    for (const match of content.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      const attrs = match[1];
      const body = match[2].replace(/<[^>]*>/g, '').trim();
      const hasAria = /\baria-label=/.test(attrs);
      const hasImageAlt = /<img\b[^>]*\balt="[^"]+"/.test(match[2]);
      if (!body && !hasAria && !hasImageAlt) fail(`${file} has link without accessible text`);
    }

    for (const match of content.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
      const attrs = match[1];
      const body = match[2].replace(/<[^>]*>/g, '').trim();
      if (!body && !/\baria-label=/.test(attrs)) fail(`${file} has button without accessible text`);
    }

    for (const match of content.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)) {
      if (!match[2].replace(/<[^>]*>/g, '').trim()) fail(`${file} has empty heading`);
    }
  }
}

checkSiteContent();
checkHtmlIdsAndLocalRefs();

if (failures.length) {
  console.error('Site checks failed:');
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Site checks passed.');
