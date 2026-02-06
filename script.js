const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const yearSpan = document.getElementById('year');
const leadForm = document.getElementById('lead-form');
const statusText = document.getElementById('form-status');
const revealItems = document.querySelectorAll('.reveal');
const progressFill = document.getElementById('scroll-progress-fill');
const wordRotator = document.getElementById('word-rotator');
const heroStage = document.querySelector('.hero-stage');
const parallaxItems = document.querySelectorAll('[data-depth]');
const magneticItems = document.querySelectorAll('.magnetic');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '✕' : '☰';
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (nav?.classList.contains('open')) {
      nav.classList.remove('open');
      if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '☰';
      }
    }
  });
});

if (leadForm && statusText) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const nombre = String(formData.get('nombre') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const mensaje = String(formData.get('mensaje') || '').trim();

    if (!leadForm.checkValidity()) {
      statusText.className = 'error';
      statusText.textContent = 'Completa los campos antes de enviar.';
      leadForm.reportValidity();
      return;
    }

    const emailBody = [`Nombre: ${nombre}`, `Email: ${email}`, `Objetivo: ${mensaje}`].join('\n');

    const subject = encodeURIComponent('Nuevo lead desde holahumanos_site');
    const body = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:hola@holahumanos.com?subject=${subject}&body=${body}`;

    try {
      localStorage.setItem(
        'holahumanos:lastLead',
        JSON.stringify({ nombre, email, mensaje, createdAt: new Date().toISOString() }),
      );
    } catch {
      // Ignore storage errors.
    }

    window.location.href = mailtoUrl;
    statusText.className = 'ok';
    statusText.textContent = 'Perfecto. Te abrimos tu correo para enviar el mensaje.';
    leadForm.reset();
  });
}

if (progressFill) {
  const setScrollProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  setScrollProgress();
  window.addEventListener('scroll', setScrollProgress, { passive: true });
  window.addEventListener('resize', setScrollProgress);
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const delay = Number(entry.target.getAttribute('data-delay') || '0');
      window.setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay);

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.2 },
);

revealItems.forEach((item) => revealObserver.observe(item));

if (wordRotator && !prefersReducedMotion) {
  const words = ['landing', 'embudo', 'sistema', 'operación'];
  let current = 0;

  window.setInterval(() => {
    wordRotator.classList.add('is-swapping');

    window.setTimeout(() => {
      current = (current + 1) % words.length;
      wordRotator.textContent = words[current];
      wordRotator.classList.remove('is-swapping');
    }, 250);
  }, 2200);
}

if (heroStage && parallaxItems.length > 0 && !prefersReducedMotion) {
  const moveParallax = (event) => {
    const rect = heroStage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (event.clientX - centerX) / rect.width;
    const deltaY = (event.clientY - centerY) / rect.height;

    parallaxItems.forEach((item) => {
      const depth = Number(item.getAttribute('data-depth') || '0');
      const moveX = deltaX * depth * 120;
      const moveY = deltaY * depth * 120;
      item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  };

  window.addEventListener('pointermove', moveParallax, { passive: true });
}

if (!prefersReducedMotion) {
  magneticItems.forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);

      item.style.transform = `translate(${relX * 0.12}px, ${relY * 0.12}px)`;
    });

    item.addEventListener('pointerleave', () => {
      item.style.transform = '';
    });
  });
}

const tiltCards = document.querySelectorAll('.tilt-card');

if (!prefersReducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -offsetY * 8;
      const rotateY = offsetX * 10;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
