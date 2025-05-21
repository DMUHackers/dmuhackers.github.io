document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.stepper-link[data-section]');
  const sections = Array.from(links)
    .map(link => link.getAttribute('data-section'))
    .filter(id => document.getElementById(id));

  function onScroll() {
    let scrollPos = window.scrollY || window.pageYOffset;
    let found = false;
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && section.offsetTop - 80 <= scrollPos) {
        links.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector('.stepper-link[data-section="' + sections[i] + '"]');
        if (activeLink) activeLink.classList.add('active');
        found = true;
        break;
      }
    }
    if (!found) links.forEach(link => link.classList.remove('active'));
  }

  window.addEventListener('scroll', onScroll);

  // Smooth scroll for sidebar links
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  onScroll();
});
