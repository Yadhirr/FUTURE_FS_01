/* Helper functions for selecting single and multiple elements */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* Main element references used throughout the page */
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

/* Automatically update the footer year */
if (year) {
  year.textContent = new Date().getFullYear();
}

/* Mobile navigation toggle and auto-close on link click */
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

/* Highlight the current navigation link based on scroll position */
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

/* Run active navigation update on scroll and when page loads */
window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('load', setActiveNav);

/* Reveal elements when they enter the viewport using Intersection Observer */
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
  /* Fallback for older browsers */
  revealItems.forEach((item) => item.classList.add('visible'));
}

/* Filter project cards based on the selected category button */
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    /* Update active button state */
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    /* Show only matching projects */
    projectCards.forEach((card) => {
      const categoryList = (card.dataset.category || '').split(' ');
      const shouldShow = filter === 'all' || categoryList.includes(filter);
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

/* Validation rules for contact form fields */
const validators = {
  name: (value) => value.trim().length >= 2 || 'Please enter your name.',
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address.',
  subject: (value) => value.trim().length >= 3 || 'Please enter a subject.',
  message: (value) =>
    value.trim().length >= 10 || 'Please enter a message with at least 10 characters.'
};

/* Show or clear validation error messages for a field */
const showFieldError = (field, message = '') => {
  const wrapper = field.closest('.form-row');
  const errorElement = wrapper ? $('.error-message', wrapper) : null;

  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (errorElement) errorElement.textContent = message;
};

/* Validate a single field using the matching validation rule */
const validateField = (field) => {
  const validator = validators[field.name];
  if (!validator) return true;

  const result = validator(field.value);
  const isValid = result === true;

  showFieldError(field, isValid ? '' : result);
  return isValid;
};

/* Contact form validation and email handling */
if (contactForm) {
  const fields = $$('input, textarea', contactForm);

  /* Validate fields when user leaves them or edits invalid ones */
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validateField(field);
      }
    });
  });

  /* Handle contact form submission */
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = fields.every((field) => validateField(field));

    if (!isValid) {
      if (formStatus) {
        formStatus.textContent = 'Please fix the highlighted fields and try again.';
        formStatus.style.color = 'var(--danger)';
      }
      return;
    }

    /* Collect form data */
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();

    /* Build a mailto link so the user's email app opens */
    const recipient = 'yadhir.ramrethan29@gmail.com';
    const body = encodeURIComponent(
      `Name: ${name}
Email: ${email}

Message:
${message}`
    );

    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;

    /* Show success message and reset the form */
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

/* Update background effect on scroll and page load */
window.addEventListener('scroll', updateScrollBackground, { passive: true });
window.addEventListener('load', updateScrollBackground);
