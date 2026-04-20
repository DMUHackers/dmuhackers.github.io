const fs = require('fs');
const path = require('path');
const { loadSiteContent } = require('./load-site-content');

const root = path.resolve(__dirname, '..');
const data = loadSiteContent(root);
const p2p = data.p2p;

function compactUtc(dateString) {
  return new Date(dateString).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcs(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

const venue = p2p.venues[0];
const now = compactUtc(new Date().toISOString());
const lines = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//DMU Hackers//Pwn2Play//EN',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'BEGIN:VEVENT',
  `UID:p2p-core-incursion-2026@dmuhackers.com`,
  `DTSTAMP:${now}`,
  `DTSTART:${compactUtc(p2p.event.start)}`,
  `DTEND:${compactUtc(p2p.event.end)}`,
  `SUMMARY:${escapeIcs(p2p.event.name + ' - DMU Hackers CTF')}`,
  `DESCRIPTION:${escapeIcs('DMU Hackers flagship Capture The Flag competition. Register: ' + p2p.links.luma)}`,
  `LOCATION:${escapeIcs(venue.addressLines.join(', '))}`,
  'END:VEVENT',
  'END:VCALENDAR',
  ''
];

const outPath = path.join(root, p2p.links.ics);
fs.writeFileSync(outPath, lines.join('\r\n'));
console.log(`Wrote ${path.relative(root, outPath)}`);
