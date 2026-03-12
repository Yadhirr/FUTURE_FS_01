const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const menuToggle = $('.menu-toggle');
const nav = $('#site-nav');
const navLinks = $$('#site-nav a');
const sections = $$('main section[id]');
const year = $('#year');
const revealItems = $$('.reveal');
const filterButtons = $$('.filter-button');
const projectCards = $$('.project-card');
const contactForm = $('#contactForm');
const formStatus = $('#formStatus');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const setActiveNav = () => {
  const scrollY = window.scrollY + 120;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const matchingLink = document.querySelector(`#site-nav a[href="#${id}"]`);

    if (!matchingLink) return;

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) => link.classList.remove('active'));
      matchingLink.classList.add('active');
    }
  });
};

window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('load', setActiveNav);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    projectCards.forEach((card) => {
      const categoryList = (card.dataset.category || '').split(' ');
      const shouldShow = filter === 'all' || categoryList.includes(filter);
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

const validators = {
  name: (value) => value.trim().length >= 2 || 'Please enter your name.',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address.',
  subject: (value) => value.trim().length >= 3 || 'Please enter a subject.',
  message: (value) => value.trim().length >= 10 || 'Please enter a message with at least 10 characters.'
};

const showFieldError = (field, message = '') => {
  const wrapper = field.closest('.form-row');
  const errorElement = wrapper ? $('.error-message', wrapper) : null;
  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (errorElement) errorElement.textContent = message;
};

const validateField = (field) => {
  const validator = validators[field.name];
  if (!validator) return true;
  const result = validator(field.value);
  const isValid = result === true;
  showFieldError(field, isValid ? '' : result);
  return isValid;
};

if (contactForm) {
  const fields = $$('input, textarea', contactForm);
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = fields.every((field) => validateField(field));
    if (!isValid) {
      formStatus.textContent = 'Please fix the highlighted fields and try again.';
      formStatus.style.color = 'var(--danger)';
      return;
    }

    const formData = new FormData(contactForm);
    const name = formData.get('name').toString().trim();
    const email = formData.get('email').toString().trim();
    const subject = formData.get('subject').toString().trim();
    const message = formData.get('message').toString().trim();

    const recipient = 'your.email@example.com';
    const body = encodeURIComponent(
      `Name: ${name}
Email: ${email}

Message:
${message}`
    );

    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;

    formStatus.textContent = 'Your email app should open now.';
    formStatus.style.color = 'var(--success)';
    contactForm.reset();
  });
}

