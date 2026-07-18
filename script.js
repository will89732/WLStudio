/* ==========================================================================
   WL STUDIO — script.js
   Header behavior, mobile nav, hero particles, GSAP reveals, "gold thread"
   scroll signature, Swiper testimonials, project filters, contact form.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initMobileNav();
  initGoldThread();
  initParticles();
  initGsapReveals();
  initHeroSplit();
  initSwiper();
  initProjectFilter();
  initContactForm();
  setActiveNavLink();
});

/* ---------------- Page loader ---------------- */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 500);
  });
  // Safety fallback in case 'load' is delayed
  setTimeout(() => loader.classList.add('is-hidden'), 2200);
}

/* ---------------- Sticky header ---------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------- Mobile nav ---------------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open');
    nav.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* ---------------- Active nav link ---------------- */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[data-nav]').forEach((a) => {
    const target = a.getAttribute('data-nav');
    if (target === path || (target === 'index.html' && path === '')) {
      a.classList.add('is-active');
    }
  });
}

/* ---------------- Signature: Gold Thread scroll indicator ---------------- */
function initGoldThread() {
  const wrap = document.getElementById('gold-thread');
  if (!wrap) return;

  const svg = wrap.querySelector('svg');
  const progressPath = wrap.querySelector('.thread-progress');
  if (!svg || !progressPath) return;

  const length = progressPath.getTotalLength();
  progressPath.style.strokeDasharray = length;
  progressPath.style.strokeDashoffset = length;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    progressPath.style.strokeDashoffset = length - length * ratio;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------------- Ambient particles (hero canvas) ---------------- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      ctx.fill();
    });
    if (!prefersReduced) requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

/* ---------------- Hero heading split-line entrance ---------------- */
function initHeroSplit() {
  const title = document.querySelector('.hero-title');
  if (!title || typeof gsap === 'undefined') return;

  const lines = title.querySelectorAll('.line .word');
  gsap.set(lines, { yPercent: 110 });

  const tl = gsap.timeline({ delay: 0.5 });
  tl.to(lines, {
    yPercent: 0,
    duration: 1.1,
    stagger: 0.12,
    ease: 'power4.out',
  });

  gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.9, delay: 1.1, ease: 'power2.out' });
  gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.9, delay: 1.3, ease: 'power2.out' });
  gsap.from('.hero-meta .stat', {
    opacity: 0, y: 16, duration: 0.8, delay: 1.5, stagger: 0.1, ease: 'power2.out',
  });
  gsap.from('.eyebrow', { opacity: 0, x: -14, duration: 0.7, delay: 0.3, ease: 'power2.out' });
}

/* ---------------- GSAP scroll reveals ---------------- */
function initGsapReveals() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
      delay: (i % 3) * 0.06,
    });
  });

  // Subtle parallax on about visual / project thumbs
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    gsap.to(el, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // Section head underline draw
  gsap.utils.toArray('.eyebrow').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      x: -12,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}

/* ---------------- Swiper: testimonials ---------------- */
function initSwiper() {
  const el = document.querySelector('.testimonial-swiper');
  if (!el || typeof Swiper === 'undefined') return;
  new Swiper(el, {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5500, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      768: { slidesPerView: 2 },
      1100: { slidesPerView: 3 },
    },
  });
}

/* ---------------- Projects filter ---------------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-category]');
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            opacity: match ? 1 : 0,
            scale: match ? 1 : 0.94,
            duration: 0.35,
            onStart: () => { if (match) card.style.display = ''; },
            onComplete: () => { if (!match) card.style.display = 'none'; },
          });
        } else {
          card.style.display = match ? '' : 'none';
        }
      });
    });
  });
}

/* ---------------- Contact form validation ---------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const successBox = form.querySelector('.form-success');

  const validators = {
    name: (v) => v.trim().length >= 3,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => v.trim().length === 0 || /^[0-9()+\-\s]{8,}$/.test(v.trim()),
    message: (v) => v.trim().length >= 10,
  };

  function validateField(field) {
    const group = field.closest('.form-group');
    const rule = validators[field.name];
    if (!rule) return true;
    const ok = rule(field.value);
    group.classList.toggle('has-error', !ok);
    return ok;
  }

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('has-error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = form.querySelectorAll('input[name], textarea[name]');
    let allValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      const firstError = form.querySelector('.has-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    successBox.classList.add('is-visible');
    successBox.textContent = 'Mensagem enviada com sucesso. Nossa equipe entrará em contato em breve.';
    form.reset();
    setTimeout(() => successBox.classList.remove('is-visible'), 6000);
  });
}
