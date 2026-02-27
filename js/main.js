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
    '.section__header, .card, .member, .info-bar, .p2p-split__img, .p2p-split__content, .step, .faq, .getting-started__cta, .skill-badges'
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

  /* ---------- Particle canvas background ---------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    const PARTICLE_COUNT = 45;
    const MAX_DIST = 120;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.5,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.strokeStyle = `rgba(200,16,46,${0.08 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw & move particles
      for (const p of particles) {
        ctx.fillStyle = 'rgba(200,16,46,0.25)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      requestAnimationFrame(draw);
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReducedMotion.matches) {
      init();
      draw();
      window.addEventListener('resize', resize, { passive: true });
    }
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
