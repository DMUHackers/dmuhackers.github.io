const path = require('path');

process.env.NODE_PATH = process.env.NODE_PATH || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
require('module').Module._initPaths();

const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const pages = [
  {
    file: 'index.html',
    checks: () => ({
      currentCommittee: document.querySelectorAll('[data-committee-current] .member').length
    })
  },
  {
    file: 'committee.html',
    checks: () => ({
      timelineEntries: document.querySelectorAll('[data-committee-timeline] .timeline__entry').length
    })
  },
  {
    file: 'P2P.html',
    checks: () => ({
      pulse: document.querySelectorAll('[data-p2p-pulse] .p2p-pulse__tile').length,
      categories: document.querySelectorAll('[data-p2p-categories] .p2p-cat-card').length,
      breakdown: document.querySelectorAll('[data-p2p-breakdown] .p2p-breakdown-card').length,
      prizes: document.querySelectorAll('[data-p2p-prizes] .prize-podium__place').length,
      rules: document.querySelectorAll('[data-p2p-rules] .rule').length,
      scoreboards: document.querySelectorAll('[data-p2p-scoreboards] .scoreboard-track').length,
      podium: document.querySelectorAll('#podiumContainer .podium__place').length
    }),
    lightChecks: [
      '.p2p-event-tile--headline .hero-countdown__unit',
      '.p2p-pulse__tile',
      '.p2p-breakdown-card',
      '.prize-podium__place',
      '.scoreboard-track',
      '.sponsor-recruitment',
      '.rule--critical .rule__body'
    ]
  },
  {
    file: 'sponsors.html',
    checks: () => ({
      sponsors: document.querySelectorAll('[data-sponsors-list] .sponsor-card').length
    })
  },
  {
    file: 'resources.html',
    checks: () => ({
      platforms: document.querySelectorAll('[data-resource-group="platforms"] .resource-card').length,
      tools: document.querySelectorAll('[data-resource-group="tools"] .tool-card').length,
      learning: document.querySelectorAll('[data-resource-group="learning"] .resource-card').length,
      certs: document.querySelectorAll('[data-resource-group="certs"] .resource-card').length
    })
  }
];

const revealSelectors = [
  '.section__header',
  '.card',
  '.member:not(.timeline .member)',
  '.info-bar',
  '.p2p-split__img',
  '.p2p-split__content',
  '.step',
  '.faq',
  '.getting-started__cta',
  '.section-cta',
  '.rule',
  '.timeline__entry',
  '.flow__step',
  '.flow__split',
  '.flow__merge',
  '.flow__branch',
  '.venue',
  '.map-overview'
].join(',');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const failures = [];
  for (const spec of pages) {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      await page.goto('file:///' + path.join(root, spec.file).replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);
      const result = await page.evaluate(checksSource => {
        const checks = Function('return (' + checksSource + ')')();
        return {
          checks: checks(),
          navLinks: document.querySelectorAll('#navLinks .nav__link').length,
          footerCols: document.querySelectorAll('.footer__top .footer__col').length,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1
        };
      }, spec.checks.toString());
      if (result.overflow) failures.push(`${spec.file} overflows at ${viewport.width}px`);
      if (!result.navLinks) failures.push(`${spec.file} rendered no nav links`);
      if (result.footerCols && result.footerCols !== 4) failures.push(`${spec.file} rendered ${result.footerCols} footer columns`);
      for (const [key, value] of Object.entries(result.checks)) {
        if (!value) failures.push(`${spec.file} rendered ${key}=0 at ${viewport.width}px`);
      }
      if (spec.file === 'P2P.html' && viewport.width <= 480) {
        const prizeOrder = await page.evaluate(() => [...document.querySelectorAll('[data-p2p-prizes] .prize-podium__place')]
          .map(node => ({
            rank: node.querySelector('.prize-podium__rank')?.textContent?.trim(),
            top: node.getBoundingClientRect().top,
            left: node.getBoundingClientRect().left
          }))
          .sort((a, b) => a.top - b.top || a.left - b.left)
          .map(item => item.rank)
          .join(','));

        if (prizeOrder !== '1st,2nd,3rd') {
          failures.push(`P2P.html mobile prize order is ${prizeOrder || 'empty'}, expected 1st,2nd,3rd`);
        }
      }
      if (viewport.width <= 480) {
        const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
        const samples = [
          0,
          Math.round(viewport.height * 0.35),
          Math.round(viewport.height * 0.65),
          Math.round(viewport.height),
          Math.round(maxScroll * 0.5),
          maxScroll
        ].filter((value, index, values) => value >= 0 && values.indexOf(value) === index);

        for (const y of samples) {
          await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
          await page.waitForTimeout(160);
          const hiddenVisible = await page.evaluate(selectors => {
            const navBottom = document.getElementById('navbar')?.getBoundingClientRect().bottom || 0;
            const viewportBottom = window.innerHeight;
            const nodes = [...document.querySelectorAll(selectors)];
            const failures = [];

            const hero = document.querySelector('.hero__content');
            if (hero) nodes.push(hero);

            for (const node of nodes) {
              const rect = node.getBoundingClientRect();
              const overlap = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, navBottom);
              if (overlap < 48) continue;

              const style = getComputedStyle(node);
              if (Number(style.opacity) < 0.6) {
                failures.push({
                  selector: node.className || node.tagName.toLowerCase(),
                  opacity: style.opacity,
                  top: Math.round(rect.top),
                  bottom: Math.round(rect.bottom)
                });
              }
            }

            return failures;
          }, revealSelectors);

          if (hiddenVisible.length) {
            failures.push(`${spec.file} has visible content faded out at ${viewport.width}px scrollY=${y}: ${JSON.stringify(hiddenVisible.slice(0, 3))}`);
          }
        }
      }
      if (spec.lightChecks) {
        const lightResult = await page.evaluate(selectors => {
          document.documentElement.classList.add('light');
          const luminance = color => {
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!match) return 255;
            const [, r, g, b] = match.map(Number);
            return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
          };
          return selectors.map(selector => {
            const node = document.querySelector(selector);
            return {
              selector,
              exists: Boolean(node),
              background: node ? getComputedStyle(node).backgroundColor : '',
              luminance: node ? luminance(getComputedStyle(node).backgroundColor) : 0
            };
          });
        }, spec.lightChecks);
        for (const item of lightResult) {
          if (!item.exists) failures.push(`${spec.file} missing light check selector ${item.selector}`);
          if (item.exists && item.luminance < 180) {
            failures.push(`${spec.file} ${item.selector} remains dark in light mode (${item.background})`);
          }
        }
      }
      await page.close();
    }
  }
  await browser.close();

  if (failures.length) {
    console.error('Render checks failed:');
    failures.forEach(failure => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log('Render checks passed.');
})();
