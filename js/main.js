/* ==========================================================================
   DMU Hackers — Navigation, scroll-spy, scroll-reveal & terminal effect
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  }

  /* ---------- Scroll-spy for nav links ---------- */
  const navLinks = document.querySelectorAll('.nav__link[data-section]');
  const sections = [...navLinks]
    .map(l => document.getElementById(l.dataset.section))
    .filter(Boolean);

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
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

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(
    '.section__header, .card, .member, .info-bar, .p2p-split__img, .p2p-split__content, .step, .faq, .getting-started__cta, .skill-badges, .rules-item'
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

  /* ---------- Hero terminal typing effect ---------- */
  const heroCmd      = document.getElementById('heroCmd');
  const heroCursor   = document.getElementById('heroCursor');
  const heroOutput   = document.getElementById('heroOutput');
  const heroSubLine  = document.getElementById('heroSubLine');
  const heroSubCmd   = document.getElementById('heroSubCmd');
  const heroSubCursor = document.getElementById('heroSubCursor');

  if (heroCmd) {
    const introCmd = 'whoami';
    const subCommands = [
      'nmap -sV dmuhackers.com',
      'hashcat -m 0 hash.txt rockyou.txt',
      'sqlmap -u "target.com/?id=1" --dbs',
      'gobuster dir -u http://target -w common.txt',
      'john --wordlist=rockyou.txt shadow.hash',
      'python3 exploit.py --target 10.0.0.1',
      'curl -s http://ctf.dmuhackers.com/flag',
      'binwalk -e firmware.bin',
      'strings mystery_binary | grep flag',
    ];

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

    function deleteText(el, speed, cb) {
      let text = el.textContent;
      let i = text.length;
      function tick() {
        if (i > 0) {
          i--;
          el.textContent = text.slice(0, i);
          setTimeout(tick, speed);
        } else if (cb) cb();
      }
      tick();
    }

    // Phase 1: type "whoami", show output, then start cycling commands
    setTimeout(() => {
      typeText(heroCmd, introCmd, 80, () => {
        // Hide primary cursor
        heroCursor.classList.add('hero-term__cursor--hide');

        // Show "DMU Hackers" output
        setTimeout(() => {
          heroOutput.classList.add('is-visible');

          // Show sub-line and start cycling
          setTimeout(() => {
            heroSubLine.classList.add('is-visible');
            let subIdx = 0;
            function cycleSubCommands() {
              const cmd = subCommands[subIdx];
              typeText(heroSubCmd, cmd, 40, () => {
                setTimeout(() => {
                  deleteText(heroSubCmd, 18, () => {
                    subIdx = (subIdx + 1) % subCommands.length;
                    setTimeout(cycleSubCommands, 400);
                  });
                }, 2200);
              });
            }
            cycleSubCommands();
          }, 600);
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
        window.scrollTo({
          top: target.offsetTop - 64,
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
      backToTop.classList.toggle('back-to-top--visible', window.scrollY > 400);
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
      podiumContainer.innerHTML = displayOrder.map(rank => {
        const place = event.places.find(p => p.rank === rank);
        if (!place) return '';
        return `<div class="podium__place podium__place--${rank}">
          <div class="podium__icon"><i class="${placeIcons[rank] || 'fas fa-medal'}"></i></div>
          <span class="podium__rank">${ordinal(rank)}</span>
          <h3 class="podium__team">${place.team}</h3>
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
        podiumTitle.textContent = 'Podium';
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
    let w, h, nodes, traces, pulses;
    const GRID = 45;
    const TRACE_COLOR = 'rgba(200,16,46,';
    const NODE_CHANCE = 0.45;
    const MAX_PULSES = 20;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function init() {
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
        bright: 0.6 + Math.random() * 0.4
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
          ctx.strokeStyle = TRACE_COLOR + (fade * 0.4).toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(sp.x, sp.y);
          ctx.lineTo(ep.x, ep.y);
          ctx.stroke();
        }

        // Pulse head glow
        ctx.shadowColor = 'rgba(200,16,46,0.8)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = TRACE_COLOR + p.bright + ')';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(draw);
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReducedMotion.matches) {
      init();
      draw();
      window.addEventListener('resize', () => { init(); }, { passive: true });
    }
  }

  /* ---------- Countdown timer ---------- */
  const cdDays = document.getElementById('cdDays');
  if (cdDays) {
    const target = new Date('2026-05-30T09:00:00+01:00').getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        document.getElementById('countdown').innerHTML = '<span style="font-size:1.2rem;color:var(--accent);font-weight:700;">The CTF is live!</span>';
        document.querySelector('.countdown__until').textContent = 'Pwn2Play: Core Incursion is happening now';
        return;
      }
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
