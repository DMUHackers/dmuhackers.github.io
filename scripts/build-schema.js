const fs = require('fs');
const path = require('path');
const { loadSiteContent } = require('./load-site-content');

const root = path.resolve(__dirname, '..');
const data = loadSiteContent(root);
const p2p = data.p2p;
const venue = p2p.venues[0];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: p2p.event.name,
  description: "DMU Hackers' flagship student Capture The Flag competition, designed to validate practical cyber skills and give participants visibility with industry sponsors.",
  startDate: p2p.event.start,
  endDate: p2p.event.end,
  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  location: {
    '@type': 'Place',
    name: venue.shortTitle,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.addressLines.join(', '),
      addressLocality: 'Leicester',
      postalCode: 'LE1 9BH',
      addressCountry: 'GB'
    }
  },
  virtualLocation: {
    '@type': 'VirtualLocation',
    url: p2p.links.biterra
  },
  organizer: {
    '@type': 'Organization',
    name: 'DMU Hackers',
    url: 'https://dmuhackers.com',
    sameAs: data.site.footer.socials.map(social => social.href)
  },
  offers: {
    '@type': 'Offer',
    url: p2p.links.luma,
    price: '0',
    priceCurrency: 'GBP',
    availability: 'https://schema.org/InStock'
  },
  isAccessibleForFree: true
};

const htmlPath = path.join(root, 'P2P.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const rendered = JSON.stringify(schema, null, 2).replace(/^/gm, '  ');
const schemaPattern = /<script\b(?=[^>]*\bid="p2p-event-schema")(?=[^>]*\btype="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/;

if (!schemaPattern.test(html)) {
  throw new Error('Could not find p2p-event-schema script in P2P.html');
}

const next = html.replace(
  schemaPattern,
  `<script id="p2p-event-schema" type="application/ld+json">\n${rendered}\n  </script>`
);

if (next !== html) {
  fs.writeFileSync(htmlPath, next);
  console.log('Updated P2P.html schema');
} else {
  console.log('P2P.html schema already up to date');
}
