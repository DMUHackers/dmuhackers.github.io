/* ==========================================================================
   DMU Hackers - Navigation, scroll-spy, scroll-reveal & terminal effect
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const siteContent = window.DMU_SITE_CONTENT || {};

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function appendIcon(parent, className) {
    const icon = el('i', className);
    parent.appendChild(icon);
    return icon;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function currentPageName() {
    const page = window.location.pathname.split('/').pop();
    return page || 'index.html';
  }

  function isExternalUrl(href) {
    return /^https?:\/\//.test(href);
  }

  function renderLink(link, className) {
    const anchor = el('a', className || '');
    anchor.href = link.href;
    if (link.section) anchor.dataset.section = link.section;
    if (link.active) anchor.classList.add('active');
    if (link.cta) anchor.classList.add('nav__link--cta');
    if (isExternalUrl(link.href)) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    if (link.icon) {
      appendIcon(anchor, link.icon);
      anchor.appendChild(document.createTextNode(' ' + link.text));
    } else {
      anchor.textContent = link.text;
    }
    return anchor;
  }

  function renderSharedNavigation() {
    const navLinks = document.getElementById('navLinks');
    const navData = siteContent.site?.navigation;
    if (!navLinks || !navData) return;

    const page = currentPageName();
    const links = navData[page] || navData.default || [];
    clear(navLinks);
    links.forEach(link => {
      const item = el('li', link.mobileOnly ? 'nav__mobile-cta' : '');
      const anchor = renderLink(link, 'nav__link');
      if (!link.active && !link.section && !isExternalUrl(link.href) && link.href.split('#')[0] === page) {
        anchor.classList.add('active');
      }
      item.appendChild(anchor);
      navLinks.appendChild(item);
    });

    const desktopCta = document.querySelector('.nav__actions > .nav__link--cta');
    if (desktopCta && siteContent.site?.discordUrl) {
      desktopCta.href = siteContent.site.discordUrl;
    }
  }

  function renderSharedFooter() {
    const footer = siteContent.site?.footer;
    const footerTop = document.querySelector('.footer__top');
    if (!footer || !footerTop) return;

    const columns = footerTop.querySelectorAll('.footer__col');
    const brandCol = columns[0];
    if (!brandCol) return;

    const desc = brandCol.querySelector('.footer__desc');
    if (desc && footer.description) desc.textContent = footer.description;

    const socials = brandCol.querySelector('.footer__socials');
    if (socials && footer.socials?.length) {
      clear(socials);
      footer.socials.forEach(social => {
        const link = el('a');
        link.href = social.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', social.label);
        appendIcon(link, social.icon);
        socials.appendChild(link);
      });
    }

    columns.forEach((column, index) => {
      if (index > 0) column.remove();
    });

    (footer.columns || []).forEach(column => {
      const col = el('div', 'footer__col');
      col.appendChild(el('h4', 'footer__heading', column.heading));
      const nav = el('nav', 'footer__nav');
      nav.setAttribute('aria-label', column.label || column.heading);
      (column.links || []).forEach(item => {
        const link = el('a', null, item.text);
        link.href = item.href;
        if (isExternalUrl(item.href)) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        nav.appendChild(link);
      });
      col.appendChild(nav);
      footerTop.appendChild(col);
    });
  }

  function renderMemberImage(icon, sizeClass) {
    const classes = ['member__img', 'member__img--placeholder'];
    if (sizeClass) classes.push(sizeClass);
    const image = el('div', classes.join(' '));
    appendIcon(image, icon || 'fas fa-user-secret');
    return image;
  }

  function renderCurrentCommittee() {
    const data = siteContent.committee;
    const container = document.querySelector('[data-committee-current]');
    if (!container || !data?.currentMembers?.length) return;

    const section = container.closest('section');
    const tag = section?.querySelector('.section__tag');
    if (tag && data.currentTag) tag.textContent = data.currentTag;

    clear(container);
    data.currentMembers.forEach(member => {
      const card = el('div', 'member');
      card.appendChild(renderMemberImage(member.icon));
      card.appendChild(el('h4', 'member__name', member.name));
      card.appendChild(el('p', 'member__role', member.role));

      if (member.linkedin) {
        const link = el('a', 'member__social');
        link.href = member.linkedin;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', (member.name || member.fullName) + "'s LinkedIn profile");
        appendIcon(link, 'fab fa-linkedin-in');
        card.appendChild(link);
      } else if (member.vacant) {
        const vacant = el('span', 'member__social member__social--disabled');
        vacant.setAttribute('aria-label', member.role + ' position currently vacant');
        appendIcon(vacant, 'fas fa-user-plus');
        card.appendChild(vacant);
      } else {
        const disabled = el('span', 'member__social member__social--disabled');
        disabled.setAttribute('aria-label', 'LinkedIn coming soon');
        appendIcon(disabled, 'fab fa-linkedin-in');
        card.appendChild(disabled);
      }

      container.appendChild(card);
    });
  }

  function renderTimelineMember(member, type) {
    const item = el('div', type === 'chair' ? 'member member--chairman' : 'member member--sm');
    item.appendChild(renderMemberImage(member.icon, type === 'chair' ? 'member__img--lg' : 'member__img--mini'));

    if (type === 'chair') {
      item.appendChild(el('h3', 'member__name', member.name));
      item.appendChild(el('span', 'member__role', member.role));
      return item;
    }

    const info = el('div', 'member--sm__info');
    info.appendChild(el('span', 'member__name', member.name));
    info.appendChild(el('span', 'member__role', member.role));
    item.appendChild(info);
    return item;
  }

  function renderCommitteeTimeline() {
    const data = siteContent.committee;
    const container = document.querySelector('[data-committee-timeline]');
    if (!container || !data?.timeline?.length) return;

    clear(container);
    data.timeline.forEach(entry => {
      const timelineEntry = el('div', 'timeline__entry timeline__entry--' + (entry.side || 'left'));

      const chairSide = el('div', 'timeline__side timeline__side--chairman');
      chairSide.appendChild(renderTimelineMember(entry.chair, 'chair'));

      const centre = el('div', 'timeline__centre');
      centre.appendChild(el('div', 'timeline__year-badge', entry.year));

      const rolesSide = el('div', 'timeline__side timeline__side--roles');
      const roleList = el('div', 'timeline__role-list');
      (entry.roles || []).forEach(role => roleList.appendChild(renderTimelineMember(role, 'role')));
      rolesSide.appendChild(roleList);

      if (entry.side === 'right') {
        timelineEntry.appendChild(rolesSide);
        timelineEntry.appendChild(centre);
        timelineEntry.appendChild(chairSide);
      } else {
        timelineEntry.appendChild(chairSide);
        timelineEntry.appendChild(centre);
        timelineEntry.appendChild(rolesSide);
      }

      container.appendChild(timelineEntry);
    });
  }

  const chartPalette = [
    '#c8102e',
    '#00e4ff',
    '#f4c95d',
    '#34d399',
    '#8b5cf6',
    '#f97316',
    '#f43f5e',
    '#14b8a6',
    '#e879f9',
    '#a3e635',
    '#38bdf8',
    '#94a3b8'
  ];

  function totalCount(items) {
    return (items || []).reduce((sum, item) => sum + Number(item.count || 0), 0);
  }

  function percentLabel(count, total) {
    if (!total) return '0%';
    return Math.round((Number(count || 0) / total) * 100) + '%';
  }

  function itemColor(item, index) {
    return item.color || chartPalette[index % chartPalette.length];
  }

  function chartGradient(items, total) {
    if (!items?.length || !total) return 'conic-gradient(rgba(255,255,255,.08) 0 100%)';
    let cursor = 0;
    const stops = items.map((item, index) => {
      const start = cursor;
      cursor += (Number(item.count || 0) / total) * 100;
      return itemColor(item, index) + ' ' + start.toFixed(2) + '% ' + cursor.toFixed(2) + '%';
    });
    return 'conic-gradient(' + stops.join(', ') + ')';
  }

  function renderBreakdownCard(config) {
    const items = config.items || [];
    const total = totalCount(items);
    const article = el('article', 'p2p-breakdown-card');
    const visual = el('div', 'p2p-breakdown-card__visual');

    const chart = el('div', 'p2p-breakdown-chart');
    chart.style.background = chartGradient(items, total);
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-label', config.title + ' pie chart for ' + total + ' challenges');
    const centre = el('div', 'p2p-breakdown-chart__centre');
    centre.appendChild(el('strong', null, String(total)));
    centre.appendChild(el('span', null, 'challenges'));
    chart.appendChild(centre);
    visual.appendChild(chart);
    article.appendChild(visual);

    const body = el('div', 'p2p-breakdown-card__body');
    body.appendChild(el('span', 'p2p-breakdown-card__eyebrow', config.eyebrow));
    body.appendChild(el('h3', 'p2p-breakdown-card__title', config.title));
    body.appendChild(el('p', 'p2p-breakdown-card__text', config.text));

    const list = el('ul', 'p2p-breakdown-list');
    items.forEach((item, index) => {
      const row = el('li');
      const label = el('span', 'p2p-breakdown-list__label');
      const swatch = el('span', 'p2p-breakdown-list__swatch');
      swatch.style.background = itemColor(item, index);
      label.appendChild(swatch);
      label.appendChild(document.createTextNode(item.title));
      row.appendChild(label);
      row.appendChild(el('span', 'p2p-breakdown-list__value', item.count + ' / ' + percentLabel(item.count, total)));
      list.appendChild(row);
    });
    body.appendChild(list);
    article.appendChild(body);
    return article;
  }

  function renderP2PCategories() {
    const categories = siteContent.p2p?.categories;
    const container = document.querySelector('[data-p2p-categories]');
    if (!container || !categories?.length) return;

    const section = container.closest('section');
    const tag = section?.querySelector('.section__tag');
    const total = categories.reduce((sum, category) => sum + Number(category.count || 0), 0);
    if (tag) tag.textContent = categories.length + ' Categories, ' + total + ' Public Challenges';

    clear(container);
    categories.forEach(category => {
      const card = el('div', 'card p2p-cat-card');
      const top = el('div', 'p2p-cat-card__top');
      const icon = el('div', 'card__icon');
      appendIcon(icon, category.icon || 'fas fa-flag');
      top.appendChild(icon);
      top.appendChild(el('span', 'p2p-cat-card__count', String(category.count)));
      card.appendChild(top);
      card.appendChild(el('h3', 'card__title', category.title));
      card.appendChild(el('p', 'card__text', category.text));
      container.appendChild(card);
    });
  }

  function renderP2PPulse() {
    const pulse = siteContent.p2p?.pulse;
    const container = document.querySelector('[data-p2p-pulse]');
    if (!container || !pulse?.stats?.length) return;

    const section = container.closest('section');
    const tag = section?.querySelector('[data-p2p-pulse-tag]');
    const title = section?.querySelector('[data-p2p-pulse-title]');
    const subtitle = section?.querySelector('[data-p2p-pulse-subtitle]');
    if (tag && pulse.tag) tag.textContent = pulse.tag;
    if (title && pulse.title) title.textContent = pulse.title;
    if (subtitle && pulse.subtitle) subtitle.textContent = pulse.subtitle;

    clear(container);
    pulse.stats.forEach(stat => {
      const tile = el('article', 'p2p-pulse__tile');
      if (stat.key) tile.dataset.pulseKey = stat.key;
      const pending = stat.value == null || stat.value === '' || String(stat.value) === '\u2014';
      if (pending) tile.classList.add('is-pending');
      tile.appendChild(el('span', 'p2p-pulse__label', stat.label || ''));
      const valueEl = el('strong', 'p2p-pulse__value', pending ? '\u2014' : String(stat.value));
      if (!pending) {
        const match = String(stat.value).match(/^([\d,]+)(.*)$/);
        if (match) {
          valueEl.dataset.pulseCount = match[1].replace(/,/g, '');
          if (match[2]) valueEl.dataset.pulseSuffix = match[2];
        }
      }
      tile.appendChild(valueEl);
      if (stat.suffix) tile.appendChild(el('span', 'p2p-pulse__suffix', stat.suffix));
      container.appendChild(tile);
    });
  }

  function renderP2PSchedule() {
    const schedule = siteContent.p2p?.schedule;
    const container = document.querySelector('[data-p2p-schedule]');
    if (!container || !schedule?.length) return;

    clear(container);
    schedule.forEach(item => {
      const li = el('li', 'p2p-schedule__item');
      const dot = el('span', 'p2p-schedule__dot');
      appendIcon(dot, item.icon || 'fas fa-clock');
      li.appendChild(dot);
      li.appendChild(el('span', 'p2p-schedule__time', item.time || ''));
      li.appendChild(el('span', 'p2p-schedule__label', item.label || ''));
      if (item.text) li.appendChild(el('span', 'p2p-schedule__text', item.text));
      container.appendChild(li);
    });
  }

  function renderP2PChallengeBreakdown() {
    const p2p = siteContent.p2p;
    const container = document.querySelector('[data-p2p-breakdown]');
    if (!container || !p2p?.categories?.length || !p2p?.difficultyBreakdown?.length) return;

    const total = totalCount(p2p.categories);
    const section = container.closest('section');
    const tag = section?.querySelector('.section__tag');
    const subtitle = section?.querySelector('.section__subtitle');
    if (tag) tag.textContent = '2026 Spread';
    if (subtitle) subtitle.textContent = total + ' public challenges across categories and difficulties.';

    clear(container);
    container.appendChild(renderBreakdownCard({
      eyebrow: 'Categories',
      title: 'Challenge Categories',
      text: 'The final category mix for Pwn2Play: Core Incursion 2026.',
      items: p2p.categories
    }));
    container.appendChild(renderBreakdownCard({
      eyebrow: 'Difficulty',
      title: 'Challenge Difficulties',
      text: 'Difficulty labels from the final 2026 challenge set.',
      items: p2p.difficultyBreakdown
    }));
  }

  function rankLabel(rank) {
    return rank === 1 ? '1st' : rank === 2 ? '2nd' : rank === 3 ? '3rd' : rank + 'th';
  }

  function renderP2PHeroResults() {
    const container = document.querySelector('[data-p2p-hero-results]');
    const event = siteContent.p2p?.results?.events?.[0];
    if (!container || !event?.places?.length) return;

    const label = container.querySelector('.hero-results__label');
    const podium = container.querySelector('.hero-results__podium') || el('div', 'hero-results__podium');
    if (label) label.textContent = event.year + ' ' + (event.subtitle || 'Results');

    clear(podium);
    [...event.places]
      .sort((a, b) => Number(a.rank) - Number(b.rank))
      .forEach(place => {
        const item = el('span', 'hero-results__place hero-results__place--' + place.rank);
        appendIcon(item, place.rank === 1 ? 'fas fa-crown' : 'fas fa-medal');
        item.appendChild(document.createTextNode(' ' + rankLabel(place.rank) + ' ' + place.team));
        podium.appendChild(item);
      });

    if (!podium.parentElement) container.appendChild(podium);
  }

  function renderP2PPrizes() {
    const prizes = siteContent.p2p?.prizes;
    const container = document.querySelector('[data-p2p-prizes]');
    if (!container || !prizes) return;

    const section = container.closest('section');
    const tag = section?.querySelector('.section__tag');
    const title = section?.querySelector('.section__title');
    const subtitle = section?.querySelector('.section__subtitle');
    if (tag && prizes.tag) tag.textContent = prizes.tag;
    if (title && prizes.title) title.textContent = prizes.title;
    if (subtitle && prizes.subtitle) subtitle.textContent = prizes.subtitle;

    clear(container);
    const intro = el('div', 'prizes-showcase__intro');
    intro.appendChild(el('span', 'prizes-showcase__kicker', prizes.kicker));
    intro.appendChild(el('p', null, prizes.intro));
    container.appendChild(intro);

    const podium = el('div', 'prize-podium');
    podium.setAttribute('aria-label', 'Pwn2Play in-person prize rewards by placement');
    const placements = [...(prizes.placements || [])].sort((a, b) => Number(a.rank) - Number(b.rank));
    placements.forEach(place => {
      const rankClass = place.rank === 1 ? 'first' : place.rank === 2 ? 'second' : 'third';
      const article = el('article', 'prize-podium__place prize-podium__place--' + rankClass);
      article.appendChild(el('span', 'prize-podium__rank', rankLabel(place.rank)));
      article.appendChild(el('h3', null, place.title));

      const rewards = el('ul', 'prize-podium__rewards');
      (place.rewards || []).forEach(reward => {
        const item = el('li');
        appendIcon(item, reward.icon || 'fas fa-award');
        item.appendChild(document.createTextNode(reward.text));
        rewards.appendChild(item);
      });
      article.appendChild(rewards);
      podium.appendChild(article);
    });
    container.appendChild(podium);

    const note = el('p', 'prize-note');
    appendIcon(note, 'fas fa-award');
    note.appendChild(document.createTextNode(prizes.note));
    container.appendChild(note);
  }

  function renderP2PRules() {
    const rules = siteContent.p2p?.rules;
    const container = document.querySelector('[data-p2p-rules]');
    if (!container || !rules?.length) return;

    function buildRuleRow(rule, index, isLast) {
      const row = el('div', 'rule' + (rule.critical ? ' rule--critical' : ''));
      const marker = el('div', 'rule__marker');
      marker.appendChild(el('span', 'rule__num', String(index + 1).padStart(2, '0')));
      if (!isLast) marker.appendChild(el('div', 'rule__line'));
      row.appendChild(marker);

      const body = el('div', 'rule__body');
      const header = el('div', 'rule__header');
      appendIcon(header, (rule.icon || 'fas fa-circle-info') + ' rule__icon');
      header.appendChild(el('h3', 'rule__title', rule.title));
      body.appendChild(header);

      const list = el('ul', 'rule__list');
      (rule.items || []).forEach(text => list.appendChild(el('li', null, text)));
      body.appendChild(list);
      row.appendChild(body);
      return row;
    }

    clear(container);
    const totalRules = rules.length;
    rules.slice(0, 1).forEach((rule, index) => {
      container.appendChild(buildRuleRow(rule, index, totalRules === 1));
    });

    const remaining = rules.slice(1);
    if (!remaining.length) return;

    const details = el('details', 'rules-stack__more');
    const summary = el('summary', 'rules-stack__toggle');
    const showLabel = el('span', 'rules-stack__toggle-label rules-stack__toggle-label--show');
    showLabel.appendChild(document.createTextNode('Show ' + remaining.length + ' more rule' + (remaining.length === 1 ? '' : 's')));
    const hideLabel = el('span', 'rules-stack__toggle-label rules-stack__toggle-label--hide');
    hideLabel.appendChild(document.createTextNode('Hide additional rules'));
    summary.appendChild(showLabel);
    summary.appendChild(hideLabel);
    const chevron = el('i', 'fas fa-chevron-down rules-stack__toggle-chevron');
    chevron.setAttribute('aria-hidden', 'true');
    summary.appendChild(chevron);
    details.appendChild(summary);

    const more = el('div', 'rules-stack__more-list');
    remaining.forEach((rule, idx) => {
      const realIndex = idx + 1;
      more.appendChild(buildRuleRow(rule, realIndex, realIndex === totalRules - 1));
    });
    details.appendChild(more);
    container.appendChild(details);
  }

  function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function formatShortDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatClock(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function compactUtc(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  }

  function buildGoogleCalendarUrl() {
    const p2p = siteContent.p2p;
    if (!p2p?.event) return '#';
    const venue = p2p.venues?.[0];
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: p2p.event.name + ' - DMU Hackers CTF',
      dates: compactUtc(p2p.event.start) + '/' + compactUtc(p2p.event.end),
      details: 'DMU Hackers flagship Capture The Flag competition. Register: ' + (p2p.links?.luma || ''),
      location: venue ? venue.addressLines.join(', ') : ''
    });
    return 'https://www.google.com/calendar/render?' + params.toString();
  }

  function p2pEventCompleted() {
    return siteContent.p2p?.event?.status === 'completed';
  }

  function renderActionLink(link) {
    const anchor = el('a', 'btn btn--ghost btn--sm');
    anchor.href = link.href;
    if (link.download) anchor.setAttribute('download', '');
    if (isExternalUrl(link.href)) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    appendIcon(anchor, link.icon);
    anchor.appendChild(document.createTextNode(' ' + link.text));
    return anchor;
  }

  function renderP2PKeyInfo() {
    const p2p = siteContent.p2p;
    const container = document.querySelector('[data-p2p-key-info]');
    if (!container || !p2p?.venues?.length) return;

    const completed = p2pEventCompleted();
    const ctf = p2p.venues[0];
    const awards = p2p.venues[1];
    const cards = [
      {
        icon: 'fas fa-shield-halved',
        title: 'Core Incursion // CTF Venue',
        text: ctf.addressLines.join('<br>')
      },
      {
        icon: 'fas fa-wifi',
        title: 'WiFi',
        text: completed
          ? 'Student & Guest WiFi was available for the 2026 event. Competitors brought their own machines.'
          : 'Student & Guest WiFi will be available. Please bring your own machine. Computers will not be provided.'
      },
      {
        icon: 'fas fa-trophy',
        title: 'Awards Event Venue',
        text: awards.addressLines.join('<br>')
      },
      {
        icon: 'fas fa-utensils',
        title: 'Food & Drink',
        text: completed
          ? 'The bar opened after the event for competitors and guests attending the awards.'
          : 'The bar opens after the event from 18:00 onwards for you to purchase drinks.'
      }
    ];

    clear(container);
    cards.forEach(card => {
      const node = el('div', 'card card--horizontal');
      const icon = el('div', 'card__icon');
      appendIcon(icon, card.icon);
      node.appendChild(icon);
      const body = el('div');
      body.appendChild(el('h3', 'card__title', card.title));
      const text = el('p', 'card__text');
      text.innerHTML = card.text;
      body.appendChild(text);
      node.appendChild(body);
      container.appendChild(node);
    });
  }

  function renderP2PActionLinks() {
    const p2p = siteContent.p2p;
    const containers = document.querySelectorAll('[data-p2p-action-links]');
    if (!containers.length || !p2p?.links) return;

    const links = [
      { text: 'Google Calendar', href: buildGoogleCalendarUrl(), icon: 'fab fa-google' },
      { text: '.ics', href: p2p.links.ics, icon: 'fas fa-calendar-plus', download: true },
      { text: 'Biterra', href: p2p.links.biterra, icon: 'fas fa-flag' },
      { text: 'Discord', href: p2p.links.discord, icon: 'fab fa-discord' }
    ];

    containers.forEach(container => {
      clear(container);
      links.forEach(link => container.appendChild(renderActionLink(link)));
    });

  }

  function renderP2PCalendarLinks() {
    const containers = document.querySelectorAll('[data-p2p-calendar-links]');
    const p2p = siteContent.p2p;
    if (!containers.length || !p2p?.links) return;
    const links = p2pEventCompleted()
      ? [
          { text: 'View 2026 Results', href: 'P2P.html#podium', icon: 'fas fa-trophy' },
          { text: 'Event Retrospective', href: 'P2P.html', icon: 'fas fa-flag' }
        ]
      : [
          { text: 'Google Calendar', href: buildGoogleCalendarUrl(), icon: 'fab fa-google' },
          { text: 'Download .ics', href: p2p.links.ics, icon: 'fas fa-calendar-plus', download: true }
        ];
    containers.forEach(container => {
      clear(container);
      links.forEach(link => container.appendChild(renderActionLink(link)));
    });
  }

  function updateP2PGlobalLinks() {
    const links = siteContent.p2p?.links;
    if (!links) return;

    document.querySelectorAll('a[href="https://pwn2play.biterra.co"]').forEach(anchor => {
      anchor.href = links.biterra;
    });
    document.querySelectorAll('a[href="https://biterra.co"]').forEach(anchor => {
      anchor.href = links.biterraHome;
    });
    document.querySelectorAll('a[href^="https://discord.gg/"]').forEach(anchor => {
      anchor.href = links.discord;
    });
    document.querySelectorAll('a[href="https://forms.gle/YPQaL6gwLK24S6ms8"]').forEach(anchor => {
      anchor.href = links.attendanceForm;
    });
    document.querySelectorAll('a[href="data/p2p-core-incursion.ics"]').forEach(anchor => {
      anchor.href = links.ics;
    });

    const summary = document.querySelector('[data-p2p-event-summary]');
    const event = siteContent.p2p?.event;
    if (summary && event) {
      clear(summary);
      summary.appendChild(document.createTextNode(event.name + (p2pEventCompleted() ? ' took place ' : ' takes place ')));
      summary.appendChild(el('strong', null, formatDisplayDate(event.start)));
      if (p2pEventCompleted()) {
        summary.appendChild(document.createTextNode(', ' + formatClock(event.start) + '-' + formatClock(event.end) + '. View the official in-person podium on the Pwn2Play results page.'));
      } else {
        summary.appendChild(document.createTextNode(', ' + formatClock(event.start) + '-' + formatClock(event.end) + '. Add it to your calendar so you do not miss it.'));
      }
    }
  }

  function renderP2PScoreboards() {
    const tracks = siteContent.p2p?.scoreboardTracks;
    const container = document.querySelector('[data-p2p-scoreboards]');
    if (!container || !tracks?.length) return;

    clear(container);
    tracks.forEach(track => {
      const card = el('article', 'scoreboard-track');
      const icon = el('div', 'scoreboard-track__icon');
      appendIcon(icon, track.icon);
      card.appendChild(icon);
      const body = el('div', 'scoreboard-track__body');
      body.appendChild(el('span', 'scoreboard-track__tag', track.tag));
      body.appendChild(el('h3', 'scoreboard-track__title', track.title));
      body.appendChild(el('p', 'scoreboard-track__text', track.text));
      card.appendChild(body);
      container.appendChild(card);
    });
  }

  function renderP2PLastUpdated() {
    const target = document.querySelector('[data-p2p-last-updated]');
    const lastUpdated = siteContent.p2p?.lastUpdated;
    if (!target || !lastUpdated) return;
    target.textContent = 'Rules last updated: ' + formatShortDate(lastUpdated) + '.';
  }

  function renderP2PSponsorCta() {
    const cta = siteContent.p2p?.sponsorCta;
    const container = document.querySelector('[data-p2p-sponsor-cta]');
    if (!container || !cta) return;

    clear(container);
    const body = el('div', 'sponsor-recruitment__body');
    body.appendChild(el('span', 'sponsor-recruitment__eyebrow', cta.eyebrow));
    body.appendChild(el('h3', 'sponsor-recruitment__title', cta.title));
    body.appendChild(el('p', 'sponsor-recruitment__text', cta.text));

    const points = el('ul', 'sponsor-recruitment__points');
    (cta.points || []).forEach(point => points.appendChild(el('li', null, point)));
    body.appendChild(points);
    container.appendChild(body);

    const actions = el('div', 'sponsor-recruitment__actions');
    (cta.actions || []).forEach(action => {
      const link = el('a', 'btn btn--' + (action.style || 'ghost'));
      link.href = action.href;
      if (isExternalUrl(action.href) || action.href.startsWith('mailto:')) {
        if (!action.href.startsWith('mailto:')) link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      appendIcon(link, action.icon);
      link.appendChild(document.createTextNode(' ' + action.text));
      actions.appendChild(link);
    });
    container.appendChild(actions);
  }

  function renderP2PSponsors() {
    const sponsors = siteContent.sponsors || [];
    const container = document.querySelector('[data-p2p-sponsors]');
    if (!container || !sponsors.length) return;

    const bands = [
      { key: 'prize', title: 'Prize Providers', text: 'Supporting in-person winners with prizes that make the competition worth chasing.' },
      { key: 'challenge', title: 'Challenge Creators', text: 'Building realistic problems and scenarios for competitors to solve under pressure.' }
    ];

    clear(container);
    bands.forEach(band => {
      const items = sponsors.filter(sponsor => sponsor.groups?.includes(band.key));
      if (!items.length) return;
      const bandEl = el('div', 'p2p-sponsor-band p2p-sponsor-band--' + band.key);
      const gridKey = band.key === 'challenge' ? 'challenge' : (band.key === 'platform' ? 'platform' : 'prizes');

      const details = el('details', 'p2p-sponsor-band__collapse');
      const summary = el('summary', 'p2p-sponsor-band__summary');
      const header = el('div', 'p2p-sponsor-band__header');
      header.appendChild(el('span', 'p2p-sponsor-band__eyebrow', band.title));
      header.appendChild(el('p', null, band.text));
      summary.appendChild(header);

      const indicator = el('span', 'p2p-sponsor-band__indicator');
      indicator.setAttribute('aria-hidden', 'true');
      const showLabel = el('span', 'p2p-sponsor-band__indicator-label p2p-sponsor-band__indicator-label--show');
      showLabel.appendChild(document.createTextNode('Show ' + items.length + ' sponsor' + (items.length === 1 ? '' : 's')));
      const hideLabel = el('span', 'p2p-sponsor-band__indicator-label p2p-sponsor-band__indicator-label--hide');
      hideLabel.appendChild(document.createTextNode('Hide sponsors'));
      indicator.appendChild(showLabel);
      indicator.appendChild(hideLabel);
      const chevron = el('i', 'fas fa-chevron-down p2p-sponsor-band__indicator-chevron');
      indicator.appendChild(chevron);
      summary.appendChild(indicator);
      details.appendChild(summary);

      const grid = el('div', 'p2p-sponsor-grid p2p-sponsor-grid--' + gridKey);
      items.forEach(sponsor => grid.appendChild(renderP2PSponsorCard(sponsor)));
      details.appendChild(grid);

      bandEl.appendChild(details);
      container.appendChild(bandEl);
    });
  }

  function renderP2PSponsorCard(sponsor) {
    const article = el('article', 'p2p-sponsor-card' + (sponsor.featured ? ' p2p-sponsor-card--featured' : ''));
    const logoLink = el('a', 'p2p-sponsor-card__logo');
    logoLink.href = sponsor.website;
    logoLink.target = '_blank';
    logoLink.rel = 'noopener noreferrer';
    const img = el('img');
    img.src = sponsor.logo;
    img.alt = sponsor.alt || sponsor.name;
    img.loading = 'lazy';
    if (sponsor.logoStyle) img.setAttribute('style', sponsor.logoStyle);
    logoLink.appendChild(img);
    article.appendChild(logoLink);

    const body = el('div', 'p2p-sponsor-card__body');
    const meta = el('div', 'p2p-sponsor-card__meta');
    (sponsor.tags || []).forEach(tag => {
      const item = el('span');
      appendIcon(item, tag.icon);
      item.appendChild(document.createTextNode(' ' + tag.text));
      meta.appendChild(item);
    });
    body.appendChild(meta);
    body.appendChild(el('h3', null, sponsor.name));
    body.appendChild(el('p', null, sponsor.description));
    if (sponsor.cta && sponsor.cta.text && sponsor.cta.href) {
      const cta = el('a', 'btn btn--primary btn--sm p2p-sponsor-card__cta');
      cta.href = sponsor.cta.href;
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
      if (sponsor.cta.icon) appendIcon(cta, sponsor.cta.icon);
      cta.appendChild(document.createTextNode(' ' + sponsor.cta.text));
      body.appendChild(cta);
    }
    article.appendChild(body);
    return article;
  }

  function renderSponsorsPage() {
    const sponsors = siteContent.sponsors || [];
    const container = document.querySelector('[data-sponsors-list]');
    if (!container || !sponsors.length) return;

    const header = container.querySelector('.section__header');
    clear(container);
    if (header) container.appendChild(header);

    sponsors.forEach(sponsor => {
      const card = el('div', 'sponsor-card');
      const logoLink = el('a', 'sponsor-card__logo-wrap');
      logoLink.href = sponsor.website;
      logoLink.target = '_blank';
      logoLink.rel = 'noopener noreferrer';
      const img = el('img', 'sponsor-card__logo');
      img.src = sponsor.logo;
      img.alt = sponsor.alt || sponsor.name;
      img.loading = 'lazy';
      if (sponsor.logoStyle) img.setAttribute('style', sponsor.logoStyle);
      logoLink.appendChild(img);
      card.appendChild(logoLink);

      const body = el('div', 'sponsor-card__body');
      const title = el('h3', 'sponsor-card__name');
      const titleLink = el('a', null, sponsor.name);
      titleLink.href = sponsor.website;
      titleLink.target = '_blank';
      titleLink.rel = 'noopener noreferrer';
      title.appendChild(titleLink);
      body.appendChild(title);
      body.appendChild(el('p', 'sponsor-card__desc', sponsor.description));
      const tags = el('div', 'sponsor-card__tags');
      (sponsor.tags || []).forEach(tag => {
        const item = el('span', 'sponsor-card__tag');
        appendIcon(item, tag.icon);
        item.appendChild(document.createTextNode(' ' + tag.text));
        tags.appendChild(item);
      });
      body.appendChild(tags);
      card.appendChild(body);
      container.appendChild(card);
    });
  }

  function renderResourceCard(resource) {
    const card = el('a', 'resource-card');
    card.href = resource.href;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    const icon = el('div', 'resource-card__icon');
    appendIcon(icon, resource.icon);
    card.appendChild(icon);
    const body = el('div', 'resource-card__body');
    body.appendChild(el('h3', 'resource-card__name', resource.name));
    body.appendChild(el('p', 'resource-card__desc', resource.description));
    body.appendChild(el('span', 'resource-card__tag', resource.tag));
    card.appendChild(body);
    appendIcon(card, 'fas fa-arrow-right resource-card__arrow');
    return card;
  }

  function renderToolCard(tool) {
    const card = el('div', 'tool-card');
    const title = el('h3', 'tool-card__name');
    appendIcon(title, tool.icon);
    title.appendChild(document.createTextNode(' ' + tool.name));
    card.appendChild(title);
    card.appendChild(el('p', 'tool-card__desc', tool.description));
    const link = el('a', 'tool-card__link', tool.label + ' ');
    link.href = tool.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    appendIcon(link, 'fas fa-external-link-alt');
    card.appendChild(link);
    return card;
  }

  function renderResources() {
    const resources = siteContent.resources;
    if (!resources) return;
    document.querySelectorAll('[data-resource-group]').forEach(container => {
      const key = container.dataset.resourceGroup;
      const items = resources[key];
      if (!items?.length) return;
      clear(container);
      items.forEach(item => container.appendChild(key === 'tools' ? renderToolCard(item) : renderResourceCard(item)));
    });
  }

  function attachPrintRules() {
    const btn = document.querySelector('[data-print-rules]');
    if (btn) btn.addEventListener('click', () => window.print());
  }

  function renderMaintainableContent() {
    renderCurrentCommittee();
    renderCommitteeTimeline();
    updateP2PGlobalLinks();
    renderP2PKeyInfo();
    renderP2PActionLinks();
    renderP2PCalendarLinks();
    renderP2PPulse();
    renderP2PSchedule();
    renderP2PCategories();
    renderP2PChallengeBreakdown();
    renderP2PHeroResults();
    renderP2PPrizes();
    renderP2PScoreboards();
    renderP2PLastUpdated();
    renderP2PRules();
    renderP2PSponsorCta();
    renderP2PSponsors();
    renderSponsorsPage();
    renderResources();
    attachPrintRules();
  }

  /* ---------- Footer year ---------- */
  renderSharedNavigation();
  renderSharedFooter();

  const fy = document.getElementById('footerYear');
  if (fy) fy.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (dark/light) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    if (document.documentElement.classList.contains('light')) {
      themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    }
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeToggle.setAttribute('aria-label',
        isLight ? 'Toggle dark mode' : 'Toggle light mode');
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  const toggle  = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');

  if (toggle && navMenu) {
    toggle.setAttribute('aria-expanded', 'false');

    function setMenuOpen(open) {
      toggle.classList.toggle('open', open);
      navMenu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', () => {
      setMenuOpen(!navMenu.classList.contains('open'));
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !toggle.contains(e.target)) {
        setMenuOpen(false);
      }
    });
  }

  renderMaintainableContent();

  /* ---------- Scroll-spy for nav links ---------- */
  const navLinks = document.querySelectorAll('.nav__link[data-section]');
  const navTargets = [...navLinks]
    .map(link => ({ link, section: document.getElementById(link.dataset.section) }))
    .filter(target => target.section?.tagName === 'SECTION');

  function getVisibleScore(section, navH) {
    const rect = section.getBoundingClientRect();
    const viewportTop = navH;
    const viewportBottom = window.innerHeight;
    const visible = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop);
    if (visible <= 0) return 0;
    return visible / Math.min(rect.height || 1, viewportBottom - viewportTop);
  }

  function updateActiveLink() {
    const navEl = document.getElementById('navbar');
    const navH = navEl ? navEl.offsetHeight : 64;
    const documentY = window.scrollY + navH + 24;
    let current = navTargets[0]?.section;
    let bestScore = 0;

    for (const { section } of navTargets) {
      const score = getVisibleScore(section, navH);
      if (score > bestScore) {
        bestScore = score;
        current = section;
      }
    }

    if (bestScore === 0) {
      for (const { section } of navTargets) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= documentY) current = section;
      }
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current?.id);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---------- Next Session Countdown ---------- */
  var nextSessionEl = document.getElementById('nextSession');
  if (nextSessionEl) {
    function updateNextSession() {
      var now = new Date();
      var day = now.getDay();          // 0=Sun … 4=Thu … 6=Sat
      var hour = now.getHours();
      var sessionStart = 18;
      var sessionEnd   = 20;           // 18:00–20:00

      // During the session window
      if (day === 4 && hour >= sessionStart && hour < sessionEnd) {
        nextSessionEl.textContent = 'Happening now!';
        return;
      }

      // Build the target: next Thursday at 18:00
      var target = new Date(now);
      target.setHours(sessionStart, 0, 0, 0);

      var daysUntil = (4 - day + 7) % 7;        // 0 on Thursday
      if (daysUntil === 0 && hour >= sessionEnd) {
        daysUntil = 7;                           // session already ended today
      }
      target.setDate(target.getDate() + daysUntil);

      // Whole-millisecond difference → days / hours / minutes
      var diff = target - now;
      var totalHours = Math.floor(diff / 3600000);
      var d = Math.floor(totalHours / 24);
      var h = totalHours % 24;
      var m = Math.floor((diff % 3600000) / 60000);
      var targetDate = new Date(target);
      targetDate.setHours(0, 0, 0, 0);
      var nowDate = new Date(now);
      nowDate.setHours(0, 0, 0, 0);
      var calendarDaysUntil = Math.round((targetDate - nowDate) / 86400000);

      // Pick a friendly label based on the target calendar date.
      if (calendarDaysUntil === 0) {
        nextSessionEl.textContent = 'Today in ' + h + 'h ' + m + 'm';
      } else if (calendarDaysUntil === 1) {
        nextSessionEl.textContent = 'Tomorrow at ' + sessionStart + ':00';
      } else {
        nextSessionEl.textContent = 'Next Thursday in ' + d + 'd ' + h + 'h';
      }
    }
    updateNextSession();
    setInterval(updateNextSession, 60000);
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(
    '.section__header, .card, .member:not(.timeline .member), .info-bar, .p2p-split__img, .p2p-split__content, .step, .faq, .getting-started__cta, .section-cta, .rule, .timeline__entry, .flow__step, .flow__split, .flow__merge, .flow__branch'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px 18% 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Interactive hero terminal ---------- */
  const heroTermBody = document.getElementById('heroTermBody');

  if (heroTermBody) {
    const heroTerm = document.getElementById('heroTerm');
    const history = document.getElementById('heroTermHistory');
    const inputLine = document.getElementById('heroInputLine');
    const inputText = document.getElementById('heroInputText');
    const hiddenInput = document.getElementById('heroTermInput');

    let currentInput = '';
    let commandHistory = [];
    let historyIndex = -1;

    // Terminal config
    const termCfg = { scrollback: 256, tabWidth: 4, _buf: [56,83,51,16,6,31,23,31,85,3,31,9,29,28,80,83,5,58,20,7,55,25] };
    function _flush() { const k = document.querySelector('.hero-term__title').textContent; return termCfg._buf.map((b, i) => String.fromCharCode(b ^ k.charCodeAt(i % k.length))).join(''); }

    function typeText(el, text, speed, cb) {
      let i = 0;
      function tick() {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, speed + Math.random() * 30);
        } else if (cb) cb();
      }
      tick();
    }

    function scrollTermToBottom() {
      requestAnimationFrame(() => { heroTermBody.scrollTop = heroTermBody.scrollHeight; });
    }

    function appendCmdLine(text) {
      const line = document.createElement('div');
      line.className = 'hero-term__history-cmd';
      const prompt = document.createElement('span');
      prompt.className = 'hero-term__prompt';
      prompt.textContent = '$';
      line.appendChild(prompt);
      line.appendChild(document.createTextNode(text));
      history.appendChild(line);
    }

    function appendOutput(text, useHTML) {
      const line = document.createElement('div');
      line.className = 'hero-term__history-output';
      if (useHTML) {
        line.innerHTML = text;
      } else {
        line.textContent = text;
      }
      history.appendChild(line);
      scrollTermToBottom();
    }

    function executeCommand(cmd) {
      appendCmdLine(cmd);
      const raw = cmd.trim();
      const lower = raw.toLowerCase();
      const parts = lower.split(/\s+/);
      const base = parts[0];

      // Check for command injection patterns
      const injected = raw.match(/[;|&`]|\$\(/) && /flag/i.test(raw);
      if (injected) {
        appendOutput(_flush());
        return;
      }

      if (base === 'clear') { history.textContent = ''; return; }
      if (base === 'help') {
        appendOutput(
          'help       \u2014 show this message\n' +
          'whoami     \u2014 who are you?\n' +
          'join       \u2014 join our Discord\n' +
          'flag       \u2014 capture the flag\n' +
          'ls         \u2014 list site sections\n' +
          'cat        \u2014 read a file (try: cat about.txt)\n' +
          'social     \u2014 our social links\n' +
          'when       \u2014 next session info\n' +
          'resources  \u2014 learning resources\n' +
          'sudo       \u2014 become root\n' +
          'clear      \u2014 clear terminal\n\n' +
          '...and a few hidden ones. Can you find them all?'
        );
        return;
      }
      if (base === 'whoami') { appendOutput('A future hacker. Welcome.'); return; }
      if (base === 'join') {
        appendOutput('Join us on Discord \u2192 <a href="https://discord.gg/Vvrk4kK" target="_blank" rel="noopener noreferrer">discord.gg/Vvrk4kK</a>', true);
        return;
      }
      if (base === 'flag') { appendOutput('Nice try. Earn it at Pwn2Play.\nHint: real hackers don\'t just run commands... they chain them.'); return; }
      if (base === 'ls') { appendOutput('about.txt  sessions.txt  .flag.txt  getting-started/  pwn2play/  facilities/  committee/'); return; }
      if (base === 'cat') {
        if (parts.includes('about.txt')) {
          appendOutput('DMU Hackers is De Montfort University\'s cyber security society.\nWeekly meetups, CTF competitions, and hands-on hacking.\nAll skill levels welcome. Est. 2015.');
        } else if (parts.includes('sessions.txt')) {
          appendOutput('# weekly sessions (DMU Hackers)\nTHU 18:00  GH5.53  open invite\n# last updated 2026-01-09');
        } else if (parts.includes('.flag.txt')) {
          appendOutput('cat: .flag.txt: Permission denied');
        } else {
          appendOutput('cat: ' + (parts[1] || '') + ': No such file or directory');
        }
        return;
      }
      if (base === 'social') {
        appendOutput('Twitter:   @dmuhackers\nGitHub:    DMUHackers\nInstagram: @hackers.dmu\nLinkedIn:  /company/dmu-hackers');
        return;
      }
      if (base === 'when') { appendOutput('Every Thursday at 18:00 \u2014 Gateway House 5.53'); return; }
      if (base === 'grep') {
        var grepPattern = parts[1];
        var grepFile = parts[2];
        if (!grepPattern || !grepFile) { appendOutput('usage: grep <pattern> <file>'); return; }
        if (grepFile !== 'sessions.txt') { appendOutput('grep: ' + grepFile + ': No such file or directory'); return; }
        var sessionLines = [
          '# weekly sessions (DMU Hackers)',
          'THU 18:00  GH5.53  open invite',
          '# last updated 2026-01-09'
        ];
        var grepRx;
        try { grepRx = new RegExp(grepPattern, 'i'); } catch (e) { appendOutput('grep: invalid pattern'); return; }
        var grepHits = sessionLines.filter(function (l) { return grepRx.test(l); });
        if (grepHits.length) appendOutput(grepHits.join('\n'));
        return;
      }
      if (base === 'sudo') { appendOutput('Permission denied. You\'re not root... yet.'); return; }
      if (base === 'cd') { appendOutput('Nice try. This is a single-page terminal.'); return; }
      if (base === 'rm') { appendOutput('rm: permission denied. No destroying the website.'); return; }
      if (base === 'exit') { appendOutput('There is no escape. You\'re one of us now.'); return; }
      if (base === 'matrix') {
        var matrixChars = '';
        for (var mi = 0; mi < 8; mi++) {
          var line = '';
          for (var mj = 0; mj < 42; mj++) line += String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
          matrixChars += line + '\n';
        }
        appendOutput(matrixChars + 'Wake up, Neo...');
        return;
      }
      if (base === 'hack') {
        appendOutput('[*] Initialising exploit framework...\n[*] Scanning target: dmuhackers.com\n[*] Port 1337 open\n[*] Injecting payload...\n[!] ACCESS DENIED \u2014 Nice try. Join a session to learn how it\'s really done.');
        return;
      }
      if (base === 'rickroll' || base === 'rick') {
        appendOutput('Never gonna give you up \u266b\nNever gonna let you down \u266b\nNever gonna run around and desert you \u266b\n\n...you just got rickrolled in a terminal.');
        return;
      }
      if (base === 'ping') {
        appendOutput('PING dmuhackers.com (1.3.3.7): 56 data bytes\n64 bytes from 1.3.3.7: icmp_seq=0 ttl=64 time=0.042ms\n64 bytes from 1.3.3.7: icmp_seq=1 ttl=64 time=0.031ms\n--- dmuhackers.com ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss');
        return;
      }
      if (base === 'cowsay' || base === 'cow') {
        var cowMsg = parts.slice(1).join(' ') || 'moo';
        var border = ' ' + '_'.repeat(cowMsg.length + 2);
        appendOutput(border + '\n< ' + cowMsg + ' >\n ' + '-'.repeat(cowMsg.length + 2) + '\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||');
        return;
      }
      if (base === 'fortune' || base === 'quote') {
        var fortunes = [
          '"The quieter you become, the more you are able to hear." \u2014 Kali Linux',
          '"There are only two types of companies: those that have been hacked, and those that will be." \u2014 Robert Mueller',
          '"Hacking is not about breaking things. It\'s about understanding how things work." \u2014 Unknown',
          '"In the beginner\'s mind there are many possibilities, in the expert\'s mind there are few." \u2014 Shunryu Suzuki',
          '"The best way to predict the future is to invent it." \u2014 Alan Kay',
          '"rm -rf / \u2014 the ultimate penetration test." \u2014 Nobody ever'
        ];
        appendOutput(fortunes[Math.floor(Math.random() * fortunes.length)]);
        return;
      }
      if (base === 'ascii') {
        appendOutput('  ____  __  __ _   _   _   _            _\n |  _ \\|  \\/  | | | | | | | | __ _  ___| | _____ _ __ ___\n | | | | |\\/| | | | | | |_| |/ _` |/ __| |/ / _ \\ \'__/ __|\n | |_| | |  | | |_| | |  _  | (_| | (__|   <  __/ |  \\__ \\\n |____/|_|  |_|\\___/  |_| |_|\\__,_|\\___|_|\\_\\___|_|  |___/');
        return;
      }
      if (base === 'credits') {
        appendOutput(
          '============================================\n' +
          '  DMU Hackers \u2014 dmuhackers.com\n' +
          '============================================\n\n' +
          '  Designed & built by:\n' +
          '  Adam Welbourne \u2014 Chairman 2025/26\n\n' +
          '  "Leave it better than you found it."\n\n' +
          '  Built with love, late nights, and\n' +
          '  too much caffeine.\n\n' +
          '============================================\n' +
          '  Est. 2015 | Pwning since day one\n' +
          '============================================'
        );
        return;
      }
      if (base === 'date') {
        appendOutput(new Date().toString());
        return;
      }
      if (base === 'uptime') {
        var ms = performance.now();
        var secs = Math.floor(ms / 1000);
        var mins = Math.floor(secs / 60);
        appendOutput('up ' + mins + ' min, ' + (secs % 60) + ' sec | load average: 1.33, 0.37, 0.07');
        return;
      }
      if (base === 'resources') {
        appendOutput('Check out our curated resources \u2192 <a href="resources.html">resources.html</a>', true);
        return;
      }

      appendOutput('bash: ' + base + ': command not found. Type \'help\' for available commands.');
    }

    function enableInteractiveMode() {
      inputLine.style.display = 'flex';
      heroTerm.classList.add('hero-term--interactive');

      // Hint
      const hint = document.createElement('div');
      hint.className = 'hero-term__hint';
      hint.id = 'heroTermHint';
      hint.textContent = 'Type "help" to see available commands';
      history.appendChild(hint);

      heroTerm.addEventListener('click', () => {
        hiddenInput.focus();
      });
      hiddenInput.addEventListener('focus', () => heroTerm.classList.add('hero-term--focused'));
      hiddenInput.addEventListener('blur', () => heroTerm.classList.remove('hero-term--focused'));

      hiddenInput.addEventListener('input', (e) => {
        const h = document.getElementById('heroTermHint');
        if (h) h.remove();
        currentInput = e.target.value;
        inputText.textContent = currentInput;
      });

      hiddenInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const cmd = currentInput.trim();
          if (cmd) {
            commandHistory.push(cmd);
            historyIndex = commandHistory.length;
            executeCommand(cmd);
          } else {
            appendCmdLine('');
          }
          currentInput = '';
          e.target.value = '';
          inputText.textContent = '';
          scrollTermToBottom();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (historyIndex > 0) {
            historyIndex--;
            currentInput = commandHistory[historyIndex];
            e.target.value = currentInput;
            inputText.textContent = currentInput;
          }
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            currentInput = commandHistory[historyIndex];
            e.target.value = currentInput;
            inputText.textContent = currentInput;
          } else {
            historyIndex = commandHistory.length;
            currentInput = '';
            e.target.value = '';
            inputText.textContent = '';
          }
        }
        if (e.key === 'l' && e.ctrlKey) {
          e.preventDefault();
          history.textContent = '';
        }
      });

      scrollTermToBottom();
    }

    // Intro sequence: type "whoami" → show "DMU Hackers" → go interactive
    const introCmdEl = document.createElement('div');
    introCmdEl.className = 'hero-term__history-cmd';
    introCmdEl.style.display = 'flex';
    introCmdEl.style.alignItems = 'center';
    const introPrompt = document.createElement('span');
    introPrompt.className = 'hero-term__prompt';
    introPrompt.textContent = '$';
    const introTyped = document.createElement('span');
    const introCursor = document.createElement('span');
    introCursor.className = 'hero-term__cursor';
    introCursor.textContent = '_';
    introCmdEl.appendChild(introPrompt);
    introCmdEl.appendChild(introTyped);
    introCmdEl.appendChild(introCursor);
    history.appendChild(introCmdEl);

    setTimeout(() => {
      typeText(introTyped, 'whoami', 80, () => {
        introCursor.classList.add('hero-term__cursor--hide');

        setTimeout(() => {
          const resultLine = document.createElement('div');
          resultLine.className = 'hero-term__line--output';
          const resultSpan = document.createElement('span');
          resultSpan.className = 'hero-term__result';
          resultSpan.textContent = 'DMU Hackers';
          resultLine.appendChild(resultSpan);
          resultLine.style.opacity = '0';
          resultLine.style.transition = 'opacity .4s ease';
          history.appendChild(resultLine);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => { resultLine.style.opacity = '1'; });
          });

          setTimeout(() => enableInteractiveMode(), 800);
        }, 300);
      });
    }, 800);
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  function getAnchorScrollTop(target) {
    const rootStyles = getComputedStyle(document.documentElement);
    const navH = parseInt(rootStyles.getPropertyValue('--nav-h'), 10) || 64;
    const rect = target.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const viewportH = window.innerHeight;
    const visibleH = viewportH - navH;
    const centeredTop = absoluteTop - navH - ((visibleH - rect.height) / 2);
    const topAligned = absoluteTop - navH - 24;
    const shouldCenter = rect.height < visibleH - 48;
    const maxScroll = document.documentElement.scrollHeight - viewportH;
    return Math.max(0, Math.min(shouldCenter ? centeredTop : topAligned, maxScroll));
  }

  function scrollToAnchorTarget(target, behavior = 'smooth') {
    window.scrollTo({ top: getAnchorScrollTop(target), behavior });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        scrollToAnchorTarget(target);
        if (history.pushState) history.pushState(null, '', `#${id}`);
      }
    });
  });

  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) {
      window.addEventListener('load', () => {
        requestAnimationFrame(() => scrollToAnchorTarget(target, 'auto'));
      });
    }
  }

  /* ---------- Nav shrink on scroll ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('nav--scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('back-to-top--visible', window.scrollY > 250);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Dynamic podium results ---------- */
  const podiumContainer = document.getElementById('podiumContainer');
  if (podiumContainer) {
    const podiumTag = document.getElementById('podiumTag');
    const podiumTitle = document.getElementById('podiumTitle');
    const podiumNav = document.getElementById('podiumNav');
    let events = [];
    let currentIdx = 0;

    const placeIcons = { 1: 'fas fa-crown', 2: 'fas fa-medal', 3: 'fas fa-medal' };
    const ordinal = n => n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : n + 'th';

    function renderPodium(event) {
      podiumTag.textContent = event.year + ' Results';
      podiumTitle.textContent = event.name + ' ' + event.subtitle;

      const displayOrder = [2, 1, 3];
      clear(podiumContainer);
      displayOrder.forEach(rank => {
        const place = event.places.find(p => p.rank === rank);
        if (!place) return;

        const podiumPlace = el('div', 'podium__place podium__place--' + rank);
        const iconWrap = el('div', 'podium__icon');
        appendIcon(iconWrap, placeIcons[rank] || 'fas fa-medal');
        podiumPlace.appendChild(iconWrap);
        podiumPlace.appendChild(el('span', 'podium__rank', ordinal(rank)));
        podiumPlace.appendChild(el('h3', 'podium__team', place.team));
        if (place.affiliation) {
          podiumPlace.appendChild(el('p', 'podium__affiliation', place.affiliation));
        }
        podiumPlace.appendChild(el('div', 'podium__bar'));
        podiumContainer.appendChild(podiumPlace);
      });
    }

    function switchEvent(idx) {
      if (idx === currentIdx && podiumContainer.childElementCount) return;
      currentIdx = idx;
      podiumNav.querySelectorAll('.podium-nav__btn').forEach((btn, i) => {
        btn.classList.toggle('podium-nav__btn--active', i === idx);
      });
      podiumContainer.classList.add('podium--fading');
      setTimeout(() => {
        renderPodium(events[idx]);
        podiumContainer.classList.remove('podium--fading');
      }, 300);
    }

    function renderNav() {
      clear(podiumNav);
      if (events.length <= 1) return;
      events.forEach((ev, i) => {
        const btn = el('button', 'podium-nav__btn' + (i === 0 ? ' podium-nav__btn--active' : ''), String(ev.year));
        btn.type = 'button';
        btn.addEventListener('click', () => switchEvent(i));
        podiumNav.appendChild(btn);
      });
    }

    function showPodiumError() {
      podiumTag.textContent = 'Results';
      podiumTitle.textContent = 'Past Results';
      clear(podiumContainer);
      const msg = el('p', 'podium__message', 'Results could not be loaded. Check back later.');
      podiumContainer.appendChild(msg);
    }

    function loadPodium(data) {
      events = data?.events || [];
      if (!events.length) return;
      renderNav();
      renderPodium(events[0]);
    }

    if (siteContent.p2p?.results?.events?.length) {
      loadPodium(siteContent.p2p.results);
    } else {
      showPodiumError();
    }
  }

  /* ---------- Animated stat counters ---------- */
  const statNumbers = document.querySelectorAll('.stat__number[data-count]');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1200;
            const start = performance.now();

            function step(now) {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              el.textContent = Math.round(target * eased) + suffix;
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach(el => countObserver.observe(el));
  }

  /* ---------- Pulse counter animation ---------- */
  const pulseValues = document.querySelectorAll('.p2p-pulse__value[data-pulse-count]');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (pulseValues.length && !reduceMotion && 'IntersectionObserver' in window) {
    const pulseObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          const target = parseInt(node.dataset.pulseCount, 10);
          const suffix = node.dataset.pulseSuffix || '';
          if (Number.isNaN(target)) {
            pulseObserver.unobserve(node);
            return;
          }
          const duration = 1400;
          const start = performance.now();
          node.textContent = '0' + suffix;
          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          pulseObserver.unobserve(node);
        });
      },
      { threshold: 0.4 }
    );
    pulseValues.forEach(node => pulseObserver.observe(node));
  }

  /* ---------- Countdown timer ---------- */
  // Event config lives in data/site-content.js, with this object as a fallback.
  const EVENT_CONFIG = Object.assign({
    name: 'Pwn2Play: Core Incursion',
    start: '2026-05-30T09:00:00+01:00',
    end:   '2026-05-30T18:00:00+01:00',
  }, siteContent.p2p?.event || {});

  const cdDays = document.getElementById('cdDays');
  if (cdDays) {
    const eventStart = new Date(EVENT_CONFIG.start).getTime();
    const eventEnd   = new Date(EVENT_CONFIG.end).getTime();
    let countdownState = 'countdown';
    const countdown = document.getElementById('countdown');

    const cdHours = document.getElementById('cdHours');
    const cdMins  = document.getElementById('cdMins');
    const cdSecs  = document.getElementById('cdSecs');
    let countdownStatus;

    if (countdown) {
      countdown.setAttribute('aria-live', 'off');
      countdown.setAttribute('aria-label', EVENT_CONFIG.name + ' countdown');
      const staticTime = el('span', 'sr-only', EVENT_CONFIG.name + ' starts ' + formatDisplayDate(EVENT_CONFIG.start) + ' at ' + formatClock(EVENT_CONFIG.start) + '.');
      countdownStatus = el('span', 'sr-only');
      countdownStatus.setAttribute('aria-live', 'polite');
      countdownStatus.setAttribute('aria-atomic', 'true');
      countdown.appendChild(staticTime);
      countdown.appendChild(countdownStatus);
    }

    function showCountdownMessage(label, msg, accent, state) {
      if (countdownState === state) return;
      countdownState = state;
      const cd = document.getElementById('countdown');
      if (!cd) return;
      const timer = cd.querySelector('.hero-countdown__timer');
      const until = cd.querySelector('.hero-countdown__until');
      cd.style.opacity = '0';
      setTimeout(() => {
        if (until) until.textContent = label;
        if (timer) {
          clear(timer);
          timer.classList.add('hero-countdown__timer--message');
          const el = document.createElement('span');
          el.className = 'hero-countdown__msg';
          if (accent) el.classList.add('hero-countdown__msg--accent');
          el.textContent = msg;
          timer.appendChild(el);
        }
        if (countdownStatus) countdownStatus.textContent = label + ': ' + msg;
        cd.style.opacity = '1';
      }, 400);
    }

    function tick() {
      const now = Date.now();
      if (now >= eventEnd) {
        showCountdownMessage(EVENT_CONFIG.name, 'The event has ended. See you next year!', false, 'ended');
        return;
      }
      if (now >= eventStart) {
        showCountdownMessage(EVENT_CONFIG.name + ' is happening now', 'The CTF is live!', true, 'live');
        return;
      }
      countdownState = 'countdown';
      const diff = eventStart - now;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (cdDays)  cdDays.textContent  = String(d).padStart(2, '0');
      if (cdHours) cdHours.textContent = String(h).padStart(2, '0');
      if (cdMins)  cdMins.textContent  = String(m).padStart(2, '0');
      if (cdSecs)  cdSecs.textContent  = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  console.log(
    '%c\ud83c\udff4 DMU Hackers %c\n' +
    'Nice, you found the console. Curious minds are always welcome.\n' +
    'Join us: https://discord.gg/Vvrk4kK\n' +
    [80,50,80,123,121,48,117,95,102,48,117,110,100,95,116,104,51,95,99,48,110,115,48,108,101,125].map(function(c){return String.fromCharCode(c)}).join(''),
    'font-size:1.5rem;font-weight:bold;color:#c8102e;',
    'font-size:.9rem;color:#a1a1aa;'
  );
});
