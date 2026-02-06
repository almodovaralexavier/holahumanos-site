const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const yearSpan = document.getElementById('year');
const leadForm = document.getElementById('lead-form');
const statusText = document.getElementById('form-status');
const revealItems = document.querySelectorAll('.reveal');

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
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
    const proyecto = String(formData.get('proyecto') || '').trim();
    const mensaje = String(formData.get('mensaje') || '').trim();

    if (!leadForm.checkValidity()) {
      statusText.className = 'error';
      statusText.textContent = 'Revisa los campos obligatorios antes de enviar.';
      leadForm.reportValidity();
      return;
    }

    const emailBody = [
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      `Tipo de proyecto: ${proyecto}`,
      `Objetivo: ${mensaje}`,
    ].join('\n');

    const subject = encodeURIComponent('Nuevo lead desde holahumanos_site');
    const body = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:hola@holahumanos.com?subject=${subject}&body=${body}`;

    try {
      localStorage.setItem(
        'holahumanos:lastLead',
        JSON.stringify({ nombre, email, proyecto, mensaje, createdAt: new Date().toISOString() }),
      );
    } catch {
      // Ignore storage errors; submission still works via mailto.
    }

    window.location.href = mailtoUrl;
    statusText.className = 'ok';
    statusText.textContent = 'Solicitud preparada. Te abrimos tu correo para enviarla en un clic.';
    leadForm.reset();
  });
}

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

revealItems.forEach((item) => observer.observe(item));
