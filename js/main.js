/* ==========================================================================
   DMU Hackers — Navigation, scroll-spy & scroll-reveal
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
    '.section__header, .card, .member, .info-bar, .p2p-split__img, .p2p-split__content'
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
});
