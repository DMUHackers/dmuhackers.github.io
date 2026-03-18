/* ==========================================================================
   DMU Hackers — Navigation, scroll-spy, scroll-reveal & terminal effect
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const fy = document.getElementById('footerYear');
  if (fy) fy.textContent = new Date().getFullYear();

  /* ---------- Page entrance fade ---------- */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .6s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });

  /* ---------- Mobile nav toggle ---------- */
  const toggle  = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !toggle.contains(e.target)) {
        toggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  /* ---------- Scroll-spy for nav links ---------- */
  const navLinks = document.querySelectorAll('.nav__link[data-section]');
  const sections = [...navLinks]
    .map(l => document.getElementById(l.dataset.section))
    .filter(Boolean);

  function updateActiveLink() {
    const navEl = document.getElementById('navbar');
    const scrollY = window.scrollY + (navEl ? navEl.offsetHeight : 64) + 20;
    let current = sections[0];
    for (const sec of sections) {
      if (sec.offsetTop <= scrollY) current = sec;
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
      var target = new Date(now);
      target.setHours(18, 0, 0, 0);
      // Find next Thursday (4 = Thursday)
      var day = now.getDay();
      var daysUntil = (4 - day + 7) % 7;
      // If it's Thursday but past 18:00, go to next week
      if (daysUntil === 0 && now >= target) daysUntil = 7;
      target.setDate(target.getDate() + daysUntil);
      var diff = target - now;
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var isToday = now.getDate() === target.getDate() && now.getMonth() === target.getMonth();
      var isTomorrow = daysUntil === 1 || (daysUntil === 0 && !isToday);
      if (isToday && h === 0 && m <= 0) {
        nextSessionEl.textContent = 'Happening now!';
      } else if (isToday) {
        nextSessionEl.textContent = 'Today in ' + h + 'h ' + m + 'm';
      } else if (isTomorrow) {
        nextSessionEl.textContent = 'Tomorrow at 18:00';
      } else {
        nextSessionEl.textContent = 'Next session in ' + daysUntil + 'd ' + h % 24 + 'h';
      }
    }
    updateNextSession();
    setInterval(updateNextSession, 60000);
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(
    '.section__header, .card, .member, .info-bar, .p2p-split__img, .p2p-split__content, .step, .faq, .getting-started__cta, .section-cta, .rule, .timeline__entry, .early-years__entry'
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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
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
      if (base === 'ls') { appendOutput('about.txt  .flag.txt  getting-started/  pwn2play/  facilities/  committee/'); return; }
      if (base === 'cat') {
        if (parts.includes('about.txt')) {
          appendOutput('DMU Hackers is De Montfort University\'s cyber security society.\nWeekly meetups, CTF competitions, and hands-on hacking.\nAll skill levels welcome. Est. 2015.');
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

          requestAnimationFrame(() => { resultLine.style.opacity = '1'; });

          setTimeout(() => enableInteractiveMode(), 800);
        }, 300);
      });
    }, 800);
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64;
        window.scrollTo({
          top: target.offsetTop - navH,
          behavior: 'smooth'
        });
      }
    });
  });

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
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    function renderPodium(event) {
      podiumTag.textContent = event.year + ' Results';
      podiumTitle.textContent = event.name + ' ' + event.subtitle;

      const displayOrder = [2, 1, 3];
      podiumContainer.innerHTML = displayOrder.map(rank => {
        const place = event.places.find(p => p.rank === rank);
        if (!place) return '';
        return `<div class="podium__place podium__place--${rank}">
          <div class="podium__icon"><i class="${placeIcons[rank] || 'fas fa-medal'}"></i></div>
          <span class="podium__rank">${ordinal(rank)}</span>
          <h3 class="podium__team">${esc(place.team)}</h3>
          <div class="podium__bar"></div>
        </div>`;
      }).join('');
    }

    function switchEvent(idx) {
      if (idx === currentIdx && podiumContainer.innerHTML !== '') return;
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
      if (events.length <= 1) return;
      podiumNav.innerHTML = events.map((ev, i) =>
        `<button class="podium-nav__btn${i === 0 ? ' podium-nav__btn--active' : ''}" type="button">${ev.year}</button>`
      ).join('');
      podiumNav.querySelectorAll('.podium-nav__btn').forEach((btn, i) => {
        btn.addEventListener('click', () => switchEvent(i));
      });
    }

    fetch('data/p2p-results.json')
      .then(res => res.json())
      .then(data => {
        events = data.events;
        if (!events.length) return;
        renderNav();
        renderPodium(events[0]);
      })
      .catch(() => {
        podiumTag.textContent = 'Results';
        podiumTitle.textContent = 'Past Results';
        podiumContainer.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:.9rem;">Results could not be loaded. Check back later.</p>';
      });
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

  /* ---------- Circuit board trace background ---------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes, traces, pulses, rafId, isMobile, GRID, NODE_CHANCE, MAX_PULSES;
    const TRACE_COLORS = ['rgba(200,16,46,', 'rgba(0,228,255,'];
    const TRACE_COLOR = 'rgba(200,16,46,';
    // Phase calibration seeds — do not modify
    const _pcS = [0x12,0x70,0x12,0x39,0x25,0x2a,0x72,0x31,0x36,0x1d,0x73,0x2c,0x1d,0x36,0x2a,0x71,0x1d,0x21,0x73,0x30,0x21,0x37,0x73,0x36,0x3f];
    const _pcK = 0x42;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function init() {
      if (rafId) cancelAnimationFrame(rafId);
      isMobile = window.innerWidth < 768;
      GRID = isMobile ? 60 : 45;
      NODE_CHANCE = isMobile ? 0.3 : 0.45;
      MAX_PULSES = isMobile ? 10 : 20;
      resize();
      nodes = [];
      traces = [];
      pulses = [];

      // Create grid nodes with some randomness
      const cols = Math.ceil(w / GRID) + 1;
      const rows = Math.ceil(h / GRID) + 1;
      const grid = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          if (Math.random() < NODE_CHANCE) {
            const node = {
              x: c * GRID + (Math.random() - 0.5) * 8,
              y: r * GRID + (Math.random() - 0.5) * 8,
              r: Math.random() * 1.5 + 1,
              row: r, col: c
            };
            grid[r][c] = node;
            nodes.push(node);
          } else {
            grid[r][c] = null;
          }
        }
      }

      // Build traces between nearby nodes using right-angle paths
      for (const node of nodes) {
        const { row, col } = node;
        // Check right and down neighbours (1-3 cells away)
        const dirs = [
          { dr: 0, dc: 1 }, { dr: 0, dc: 2 }, { dr: 0, dc: 3 },
          { dr: 1, dc: 0 }, { dr: 2, dc: 0 }, { dr: 3, dc: 0 },
          { dr: 1, dc: 1 }, { dr: 1, dc: -1 },
          { dr: 2, dc: 1 }, { dr: 1, dc: 2 },
          { dr: 2, dc: -1 }, { dr: 1, dc: -2 }
        ];
        for (const { dr, dc } of dirs) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr]?.[nc]) {
            if (Math.random() < 0.5) {
              const target = grid[nr][nc];
              // Build L-shaped path (right-angle)
              const midX = Math.random() < 0.5 ? target.x : node.x;
              const midY = midX === target.x ? node.y : target.y;
              traces.push({
                points: [
                  { x: node.x, y: node.y },
                  { x: midX, y: midY },
                  { x: target.x, y: target.y }
                ],
                len: Math.abs(target.x - node.x) + Math.abs(target.y - node.y)
              });
            }
          }
        }
      }

      // Spawn initial pulses
      for (let i = 0; i < MAX_PULSES; i++) spawnPulse();
    }

    function spawnPulse() {
      if (!traces.length) return;
      const trace = traces[Math.floor(Math.random() * traces.length)];
      pulses.push({
        trace,
        t: 0,
        speed: 0.3 + Math.random() * 0.6,
        size: 2 + Math.random() * 2,
        bright: 0.6 + Math.random() * 0.4,
        color: TRACE_COLORS[Math.random() < 0.85 ? 0 : 1]
      });
    }

    function getPulsePos(trace, t) {
      // t = 0..1 along total trace length
      const totalLen = trace.len;
      let dist = t * totalLen;
      for (let i = 0; i < trace.points.length - 1; i++) {
        const a = trace.points[i];
        const b = trace.points[i + 1];
        const segLen = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
        if (dist <= segLen) {
          const frac = segLen > 0 ? dist / segLen : 0;
          return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
        }
        dist -= segLen;
      }
      return trace.points[trace.points.length - 1];
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Draw traces (dim)
      ctx.lineWidth = 0.8;
      for (const trace of traces) {
        ctx.strokeStyle = TRACE_COLOR + '0.06)';
        ctx.beginPath();
        ctx.moveTo(trace.points[0].x, trace.points[0].y);
        for (let i = 1; i < trace.points.length; i++) {
          ctx.lineTo(trace.points[i].x, trace.points[i].y);
        }
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.fillStyle = TRACE_COLOR + '0.12)';
        ctx.fillRect(node.x - node.r, node.y - node.r, node.r * 2, node.r * 2);
      }

      // Animate pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed / p.trace.len;
        if (p.t > 1) {
          pulses.splice(i, 1);
          spawnPulse();
          continue;
        }

        const pos = getPulsePos(p.trace, p.t);

        // Glow trail — light up trace segments near pulse
        const pc = p.color;
        ctx.lineWidth = 1.5;
        const trailLen = 0.15;
        const tStart = Math.max(0, p.t - trailLen);
        const steps = 8;
        for (let s = 0; s < steps; s++) {
          const st = tStart + (p.t - tStart) * (s / steps);
          const et = tStart + (p.t - tStart) * ((s + 1) / steps);
          const sp = getPulsePos(p.trace, st);
          const ep = getPulsePos(p.trace, et);
          const fade = (s / steps) * p.bright;
          ctx.strokeStyle = pc + (fade * 0.4).toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(sp.x, sp.y);
          ctx.lineTo(ep.x, ep.y);
          ctx.stroke();
        }

        // Pulse head glow
        ctx.shadowColor = pc + '0.8)';
        ctx.shadowBlur = isMobile ? 4 : 12;
        ctx.fillStyle = pc + p.bright + ')';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafId = requestAnimationFrame(draw);
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReducedMotion.matches) {
      init();
      rafId = requestAnimationFrame(draw);
      window.addEventListener('resize', () => {
        if (rafId) cancelAnimationFrame(rafId);
        init();
        rafId = requestAnimationFrame(draw);
      }, { passive: true });
    }
  }

  /* ---------- Countdown timer ---------- */
  const cdDays = document.getElementById('cdDays');
  if (cdDays) {
    const eventStart = new Date('2026-05-30T09:00:00+01:00').getTime();
    const eventEnd   = new Date('2026-05-30T18:00:00+01:00').getTime();

    function showCountdownMessage(label, msg, accent) {
      const cd = document.getElementById('countdown');
      const timer = cd.querySelector('.hero-countdown__timer');
      const until = cd.querySelector('.hero-countdown__until');
      cd.style.opacity = '0';
      setTimeout(() => {
        if (until) until.textContent = label;
        if (timer) {
          timer.innerHTML = '';
          timer.classList.add('hero-countdown__timer--message');
          const el = document.createElement('span');
          el.className = 'hero-countdown__msg';
          if (accent) el.classList.add('hero-countdown__msg--accent');
          el.textContent = msg;
          timer.appendChild(el);
        }
        cd.style.opacity = '1';
      }, 400);
    }

    function tick() {
      const now = Date.now();
      if (now >= eventEnd) {
        showCountdownMessage('Pwn2Play: Core Incursion', 'The event has ended. See you next year!', false);
        return;
      }
      if (now >= eventStart) {
        showCountdownMessage('Pwn2Play: Core Incursion is happening now', 'The CTF is live!', true);
        return;
      }
      const diff = eventStart - now;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      cdDays.textContent = String(d).padStart(2, '0');
      document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
      document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
      document.getElementById('cdSecs').textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Hero parallax on scroll ---------- */
  const heroBg = document.querySelector('.hero__bg');
  const heroContent = document.querySelector('.hero__content');
  if (heroBg && heroContent) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            heroBg.style.transform = `translateY(${y * 0.3}px)`;
            heroContent.style.transform = `translateY(${y * 0.15}px)`;
            heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.7));
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ---------- Console easter egg ---------- */
  console.log(
    '%c🏴 DMU Hackers %c\n' +
    'Nice, you found the console. Curious minds are always welcome.\n' +
    'Join us: https://discord.gg/Vvrk4kK\n' +
    'flag{y0u_f0und_th3_c0ns0le}',
    'font-size:1.5rem;font-weight:bold;color:#c8102e;',
    'font-size:.9rem;color:#a1a1aa;'
  );
});
