/**
 * ================================================================
 * RAMAM GEMS — Premium Luxury Website JavaScript
 * ================================================================
 */

'use strict';

/* ──────────────────────────────────────────────────────────────
   SOCIAL MEDIA CONFIG — edit links here, one place only
────────────────────────────────────────────────────────────── */
const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/919829071015',
  facebook: 'https://facebook.com/',    // replace with actual URL
  instagram: 'https://instagram.com/',   // replace with actual URL
  linkedin: 'https://linkedin.com/',    // replace with actual URL
  youtube: 'https://youtube.com/',     // replace with actual URL
};

/* ──────────────────────────────────────────────────────────────
   APPLY SOCIAL LINKS from config
────────────────────────────────────────────────────────────── */
function applySocialLinks() {
  document.querySelectorAll('[aria-label="WhatsApp"]').forEach(el => el.href = SOCIAL_LINKS.whatsapp);
  document.querySelectorAll('[aria-label="Facebook"]').forEach(el => el.href = SOCIAL_LINKS.facebook);
  document.querySelectorAll('[aria-label="Instagram"]').forEach(el => el.href = SOCIAL_LINKS.instagram);
  document.querySelectorAll('[aria-label="LinkedIn"]').forEach(el => el.href = SOCIAL_LINKS.linkedin);
  document.querySelectorAll('[aria-label="YouTube"]').forEach(el => el.href = SOCIAL_LINKS.youtube);
}

/* ──────────────────────────────────────────────────────────────
   PAGE LOADER
────────────────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // Trigger hero reveal after loader
      triggerHeroReveal();
    }, 2000);
  });
}

function triggerHeroReveal() {
  const heroEls = document.querySelectorAll('#home .reveal-up, #home .hero-badge, #home .hero-title-line, #home .hero-tagline, #home .hero-sub, #home .hero-cta, #home .hero-stats');
  heroEls.forEach((el, i) => {
    const delay = parseInt(el.dataset.delay || 0) + i * 80;
    setTimeout(() => el.classList.add('visible'), delay);
  });
}

/* ──────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
────────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ──────────────────────────────────────────────────────────────
   NAVBAR — scroll hide/show, active section
────────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = 0;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Hide on scroll down, show on scroll up
    if (y > lastScrollY && y > 200) {
      navbar.classList.add('hide');
    } else {
      navbar.classList.remove('hide');
    }
    lastScrollY = y;
    highlightActiveSection();
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

function highlightActiveSection() {
  const links = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');
  const offset = 130;

  sections.forEach(section => {
    const top = section.offsetTop - offset;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${section.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   MOBILE MENU
────────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const overlay = document.getElementById('navOverlay');
  if (!hamburger || !navMenu) return;

  function close() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    if (overlay) overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
  if (overlay) overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ──────────────────────────────────────────────────────────────
   SMOOTH SCROLLING
────────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = (document.getElementById('navbar') || {}).offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
────────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => {
    // Skip hero elements (handled by triggerHeroReveal)
    if (el.closest('#home')) return;
    io.observe(el);
  });
}

/* ──────────────────────────────────────────────────────────────
   HERO CANVAS — Floating gem particles
────────────────────────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = [
    'rgba(212,175,55,',
    'rgba(155,35,53,',
    'rgba(27,107,58,',
    'rgba(15,76,129,',
    'rgba(92,45,145,',
  ];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor(W / 14), 60);
    for (let i = 0; i < count; i++) {
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.5 + 0.1,
        da: (Math.random() * 0.006 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
        col,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.alpha + ')';
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      p.alpha += p.da;
      if (p.alpha <= 0.05 || p.alpha >= 0.65) p.da *= -1;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });
    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────────
   HERO PARALLAX (mouse)
────────────────────────────────────────────────────────────── */
function initParallax() {
  const hero = document.querySelector('.hero');
  const orbs = document.querySelector('.hero-orbs');
  if (!hero || !orbs || window.matchMedia('(max-width:768px)').matches) return;

  hero.addEventListener('mousemove', e => {
    const cx = hero.offsetWidth / 2;
    const cy = hero.offsetHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orbs.style.transform = `translate(${dx * 18}px, ${dy * 12}px)`;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    orbs.style.transform = 'translate(0,0)';
  });
}

/* ──────────────────────────────────────────────────────────────
   ANIMATED COUNTERS
────────────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target], .hero-stat-num[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target || el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2200;
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

/* ──────────────────────────────────────────────────────────────
   TESTIMONIAL SLIDER
────────────────────────────────────────────────────────────── */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  const total = slides.length;
  let current = 0;
  let timer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function startTimer() { timer = setInterval(() => goTo(current + 1), 5500); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  // Touch swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetTimer(); }
  }, { passive: true });

  // Keyboard
  document.querySelector('.testimonial-slider')?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); resetTimer(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
  });

  startTimer();
}

/* ──────────────────────────────────────────────────────────────
   GALLERY FILTER
────────────────────────────────────────────────────────────── */
function initGalleryFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item[data-category]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   FAQ ACCORDION
────────────────────────────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      items.forEach(other => {
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        const a = other.querySelector('.faq-answer');
        if (a) a.classList.remove('open');
      });

      // Toggle this
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });

    // Keyboard support
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   CONTACT FORM → WHATSAPP
────────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const WHATSAPP_NUMBER = '919829071015';

  // Validation rules
  const rules = {
    'cf-name': { required: true, errorId: 'err-name', msg: 'Please enter your full name.' },
    'cf-phone': { required: true, errorId: 'err-phone', msg: 'Please enter your phone number.', pattern: /^\+?[\d\s\-]{7,15}$/ },
    'cf-city': { required: true, errorId: 'err-city', msg: 'Please enter your city.' },
    'cf-interest': { required: true, errorId: 'err-interest', msg: 'Please select an option.' },
    'cf-message': { required: true, errorId: 'err-message', msg: 'Please describe your requirement.' },
  };

  function clearErrors() {
    Object.values(rules).forEach(r => {
      const errEl = document.getElementById(r.errorId);
      if (errEl) errEl.textContent = '';
      const field = form.querySelector(`[name="${Object.keys(rules).find(k => rules[k] === r)}"]`);
    });
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }

  function validateField(fieldId) {
    const rule = rules[fieldId];
    if (!rule) return true;
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(rule.errorId);
    if (!field) return true;

    const val = field.value.trim();
    if (rule.required && !val) {
      field.classList.add('error');
      if (errEl) errEl.textContent = rule.msg;
      return false;
    }
    if (rule.pattern && val && !rule.pattern.test(val)) {
      field.classList.add('error');
      if (errEl) errEl.textContent = 'Please enter a valid phone number.';
      return false;
    }
    field.classList.remove('error');
    if (errEl) errEl.textContent = '';
    return true;
  }

  // Live validation on blur
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validateField(id));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    // Validate all fields
    let valid = true;
    let firstInvalid = null;
    Object.keys(rules).forEach(id => {
      if (!validateField(id)) {
        valid = false;
        if (!firstInvalid) firstInvalid = document.getElementById(id);
      }
    });

    if (!valid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Build WhatsApp message
    const name = document.getElementById('cf-name').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const email = document.getElementById('cf-email').value.trim() || 'Not provided';
    const city = document.getElementById('cf-city').value.trim();
    const interest = document.getElementById('cf-interest').value;
    const message = document.getElementById('cf-message').value.trim();

    const waMessage =
      `*New Inquiry from Ramam Gems Website*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*City:* ${city}\n` +
      `*Interested In:* ${interest}\n` +
      `*Message:* ${message}\n\n` +
      `_Please contact this customer._`;

    const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    // Button loading state
    const btn = document.getElementById('formSubmitBtn');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Opening WhatsApp...</span>';
    btn.disabled = true;

    setTimeout(() => {
      window.open(waURL, '_blank', 'noopener,noreferrer');
      btn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Message Ready in WhatsApp!</span>';
      btn.style.background = 'linear-gradient(135deg, #2ECC71, #1A7A45)';
      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    }, 600);
  });
}

/* ──────────────────────────────────────────────────────────────
   FLOATING ACTION BUTTONS — hide/show on scroll
────────────────────────────────────────────────────────────── */
function initFABs() {
  const fabContainer = document.getElementById('fabContainer');
  if (!fabContainer) return;

  let lastY = 0;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (y > lastY && y > 300) {
      fabContainer.classList.add('hide');
    } else {
      fabContainer.classList.remove('hide');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────────
   BACK TO TOP
────────────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ──────────────────────────────────────────────────────────────
   DARK / LIGHT THEME TOGGLE
────────────────────────────────────────────────────────────── */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;

  const saved = localStorage.getItem('rg-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rg-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/* ──────────────────────────────────────────────────────────────
   RIPPLE EFFECT on buttons
────────────────────────────────────────────────────────────── */
function initRipple() {
  document.querySelectorAll('.ripple').forEach(el => {
    el.addEventListener('click', function (e) {
      const rect = el.getBoundingClientRect();
      const pseudo = el.querySelector('::after'); // CSS handles this
      // Just trigger the class
      el.classList.remove('ripple-active');
      void el.offsetWidth; // reflow
      el.classList.add('ripple-active');
      // Update pseudo-element origin via custom properties
      el.style.setProperty('--ripple-x', (e.clientX - rect.left) + 'px');
      el.style.setProperty('--ripple-y', (e.clientY - rect.top) + 'px');
      setTimeout(() => el.classList.remove('ripple-active'), 700);
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   FOOTER YEAR
────────────────────────────────────────────────────────────── */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────────────────────────────
   LAZY LOADING for images
────────────────────────────────────────────────────────────── */
function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // native lazy load
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        io.unobserve(img);
      }
    });
  });
  imgs.forEach(img => io.observe(img));
}

/* ──────────────────────────────────────────────────────────────
   SMOOTH SECTION TRANSITIONS (slight tint on enter)
────────────────────────────────────────────────────────────── */
function initSectionTransitions() {
  const sections = document.querySelectorAll('.section');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.08 });
  sections.forEach(s => io.observe(s));
}

/* ──────────────────────────────────────────────────────────────
   INIT ALL
────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applySocialLinks();
  initThemeToggle();
  initLoader();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initHeroCanvas();
  initParallax();
  initCounters();
  initTestimonialSlider();
  initGalleryFilter();
  initFAQ();
  initContactForm();
  initFABs();
  initBackToTop();
  initRipple();
  initLazyImages();
  initSectionTransitions();
  setFooterYear();
});
