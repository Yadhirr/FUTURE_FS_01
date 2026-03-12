/* Helper functions for selecting elements */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* Main element references */
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

/* Automatically update footer year */
if (year) {
  year.textContent = new Date().getFullYear();
}

/* Mobile navigation toggle */
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

/* Highlight active navigation link while scrolling */
const setActiveNav = () => {
  const scrollY = window.scrollY + 120;
  let activeId = '';

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      activeId = id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
  });
};

window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('load', setActiveNav);

/* Reveal items when they enter the viewport */
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

/* Project filtering */
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

/* Validation rules for contact form */
const validators = {
  name: (value) => value.trim().length >= 2 || 'Please enter your name.',
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address.',
  subject: (value) => value.trim().length >= 3 || 'Please enter a subject.',
  message: (value) =>
    value.trim().length >= 10 || 'Please enter a message with at least 10 characters.'
};

/* Display field validation errors */
const showFieldError = (field, message = '') => {
  const wrapper = field.closest('.form-row');
  const errorElement = wrapper ? $('.error-message', wrapper) : null;

  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (errorElement) errorElement.textContent = message;
};

/* Validate a single form field */
const validateField = (field) => {
  const validator = validators[field.name];
  if (!validator) return true;

  const result = validator(field.value);
  const isValid = result === true;

  showFieldError(field, isValid ? '' : result);
  return isValid;
};

/* Contact form handling */
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

    let firstInvalidField = null;
    let isValid = true;

    fields.forEach((field) => {
      const valid = validateField(field);
      if (!valid && !firstInvalidField) {
        firstInvalidField = field;
      }
      if (!valid) {
        isValid = false;
      }
    });

    if (!isValid) {
      if (formStatus) {
        formStatus.textContent = 'Please fix the highlighted fields and try again.';
        formStatus.style.color = 'var(--danger)';
      }
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    /* Create mailto link */
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const recipient = 'yadhir.ramrethan29@gmail.com';
    const body = encodeURIComponent(
      `Name: ${name}
Email: ${email}

Message:
${message}`
    );

    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;

    if (formStatus) {
      formStatus.textContent = 'Your email app should open now.';
      formStatus.style.color = 'var(--success)';
    }

    contactForm.reset();
  });
}

/* Creative scrolling gradient background effect */
const updateScrollBackground = () => {
  const scrollY = window.scrollY;
  document.documentElement.style.setProperty('--scroll-offset', `${scrollY * 0.35}px`);
};

window.addEventListener('scroll', updateScrollBackground, { passive: true });
window.addEventListener('load', updateScrollBackground);
