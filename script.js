/**
 * Ramam Gems — Premium Website JavaScript
 * Author: Ramam Gems | Jaipur, Rajasthan
 */

'use strict';

/* ─────────────────────────────────────────
   LOADER
───────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.classList.add('loading');

  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // Trigger hero animations after load
      document.querySelectorAll('.fade-in-up').forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('visible');
        }, i * 150);
      });
    }, 1800);
  });
})();

/* ─────────────────────────────────────────
   HEADER — Sticky + Scroll Effect
───────────────────────────────────────── */
(function initHeader() {
  var header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─────────────────────────────────────────
   MOBILE HAMBURGER MENU
───────────────────────────────────────── */
(function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('mainNav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ─────────────────────────────────────────
   SMOOTH SCROLLING
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var headerH = document.getElementById('header') ? document.getElementById('header').offsetHeight : 70;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* ─────────────────────────────────────────
   ACTIVE NAV LINK ON SCROLL
───────────────────────────────────────── */
function updateActiveNavLink() {
  var sections = document.querySelectorAll('section[id], div[id="home"]');
  var scrollPos = window.scrollY + 120;

  sections.forEach(function (section) {
    var top = section.offsetTop;
    var bottom = top + section.offsetHeight;
    var id = section.getAttribute('id');
    var link = document.querySelector('.nav-link[href="#' + id + '"]');
    if (!link) return;

    if (scrollPos >= top && scrollPos < bottom) {
      document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    }
  });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL ANIMATION
───────────────────────────────────────── */
(function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  function checkReveal() {
    var windowH = window.innerHeight;
    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowH - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal, { passive: true });
  checkReveal();
})();

/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────── */
(function initCounters() {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  var hasRun = false;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var startTime = null;
    var startVal = 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * (target - startVal) + startVal);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function checkCounters() {
    if (hasRun) return;
    var statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    var rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      hasRun = true;
      counters.forEach(function (el) { animateCounter(el); });
      window.removeEventListener('scroll', checkCounters);
    }
  }

  window.addEventListener('scroll', checkCounters, { passive: true });
  checkCounters();
})();

/* ─────────────────────────────────────────
   TESTIMONIAL SLIDER
───────────────────────────────────────── */
(function initSlider() {
  var track = document.getElementById('testimonialTrack');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var dotsContainer = document.getElementById('sliderDots');
  if (!track) return;

  var cards = track.querySelectorAll('.testimonial-card');
  var total = cards.length;
  var current = 0;
  var autoInterval = null;

  // Build dots
  cards.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); });
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    dotsContainer.querySelectorAll('.slider-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

  function startAuto() {
    autoInterval = setInterval(next, 5000);
  }
  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }
  startAuto();

  // Touch / swipe support
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   BACK TO TOP
───────────────────────────────────────── */
(function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
(function initContactForm() {
  var form = document.getElementById('contactForm');
  var successEl = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    var required = form.querySelectorAll('[required]');
    var valid = true;
    required.forEach(function (field) {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e85555';
        valid = false;
      }
    });

    if (!valid) {
      var firstInvalid = form.querySelector('[required]:not([value])');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate form submission
    var submitBtn = form.querySelector('[type="submit"]');
    var originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(function () {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
      if (successEl) {
        successEl.classList.add('show');
        setTimeout(function () { successEl.classList.remove('show'); }, 5000);
      }
    }, 1500);
  });
})();

/* ─────────────────────────────────────────
   HERO PARTICLES
───────────────────────────────────────── */
(function initParticles() {
  var container = document.getElementById('heroParticles');
  if (!container) return;

  var count = 28;
  for (var i = 0; i < count; i++) {
    createParticle(container);
  }

  function createParticle(parent) {
    var p = document.createElement('div');
    p.className = 'particle';
    var size = Math.random() * 4 + 1.5;
    var left = Math.random() * 100;
    var delay = Math.random() * 12;
    var duration = Math.random() * 12 + 10;

    p.style.cssText = [
      'width:' + size + 'px',
      'height:' + size + 'px',
      'left:' + left + '%',
      'bottom:-' + size + 'px',
      'animation-duration:' + duration + 's',
      'animation-delay:' + delay + 's',
      'opacity:0'
    ].join(';');

    parent.appendChild(p);
  }
})();

/* ─────────────────────────────────────────
   FOOTER YEAR
───────────────────────────────────────── */
(function setFooterYear() {
  var el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─────────────────────────────────────────
   GALLERY — Keyboard accessibility
───────────────────────────────────────── */
(function initGallery() {
  var items = document.querySelectorAll('.gallery-gem-card');
  items.forEach(function (card) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Trigger hover state visually
        card.querySelector('.gallery-overlay').style.transform = 'translateY(0)';
      }
    });
  });
})();
