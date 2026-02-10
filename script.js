const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const yearSpan = document.getElementById('year');
const leadForm = document.getElementById('lead-form');
const statusText = document.getElementById('form-status');
const revealItems = document.querySelectorAll('.reveal');
const progressFill = document.getElementById('scroll-progress-fill');
const logoStage = document.querySelector('.logo-stage');
const cursor = document.querySelector('.cursor');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.requestAnimationFrame(() => {
  document.body.classList.add('is-ready');
});

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
      statusText.textContent = 'Completa los campos obligatorios.';
      leadForm.reportValidity();
      return;
    }

    const emailBody = [`Nombre: ${nombre}`, `Email: ${email}`, `Proyecto: ${mensaje}`].join('\n');
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
    statusText.textContent = 'Abrimos tu correo para enviar el mensaje.';
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

if (logoStage && !prefersReducedMotion) {
  logoStage.addEventListener('pointermove', (event) => {
    const rect = logoStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    logoStage.style.setProperty('--mx', `${x}%`);
    logoStage.style.setProperty('--my', `${y}%`);
  });

  logoStage.addEventListener('pointerleave', () => {
    logoStage.style.setProperty('--mx', '50%');
    logoStage.style.setProperty('--my', '50%');
  });
}

if (cursor && !prefersReducedMotion) {
  window.addEventListener(
    'pointermove',
    (event) => {
      cursor.style.opacity = '1';
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    },
    { passive: true },
  );

  const focusTargets = document.querySelectorAll('a, button, input, textarea');

  focusTargets.forEach((target) => {
    target.addEventListener('pointerenter', () => {
      cursor.style.width = '30px';
      cursor.style.height = '30px';
    });

    target.addEventListener('pointerleave', () => {
      cursor.style.width = '';
      cursor.style.height = '';
    });
  });
}
