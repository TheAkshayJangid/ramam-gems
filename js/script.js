/* Ramam Gems — site interactions (vanilla JS) */
(function () {
  'use strict';

  /* ---------- Light / dark theme ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var metaTheme = document.getElementById('metaThemeColor');
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function syncThemeChrome(t) {
    if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#0c0f0d' : '#faf7ee');
    if (themeToggle) {
      var toLight = t === 'dark';
      themeToggle.setAttribute('aria-pressed', toLight ? 'false' : 'true');
      themeToggle.setAttribute('aria-label', toLight ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggle.setAttribute('title', toLight ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }
  function applyTheme(t) {
    document.documentElement.classList.add('theming');
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('rg-theme', t); } catch (e) { /* private mode */ }
    syncThemeChrome(t);
    setTimeout(function () { document.documentElement.classList.remove('theming'); }, 450);
  }
  syncThemeChrome(currentTheme());
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Sticky header shrink + back-to-top visibility ---------- */
  var header = document.getElementById('siteHeader');
  var backTop = document.getElementById('backTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (backTop) backTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Testimonial slider ---------- */
  var slider = document.getElementById('testimonialSlider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var dotsWrap = document.getElementById('sliderDots');
    var prev = document.getElementById('slidePrev');
    var next = document.getElementById('slideNext');
    var current = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Show review ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('active', k === current); });
      dots.forEach(function (d, k) { d.classList.toggle('active', k === current); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 6000);
    }
    if (prev) prev.addEventListener('click', function () { goTo(current - 1); restart(); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); restart(); });
    slider.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);
    goTo(0);
    restart();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Active nav highlighting ---------- */
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'))
    .filter(function (s) { return document.querySelector('.nav-link[href="#' + s.id + '"]'); });
  function setActiveNav() {
    var y = window.scrollY + 140;
    var currentId = sections.length ? sections[0].id : null;
    sections.forEach(function (s) {
      if (s.offsetTop <= y) currentId = s.id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + currentId);
    });
  }
  if (sections.length) {
    window.addEventListener('scroll', setActiveNav, { passive: true });
    setActiveNav();
  }

  /* ---------- Enquiry form → WhatsApp ---------- */
  var form = document.getElementById('enquiryForm');
  if (form) {
    var formError = document.getElementById('formError');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var gem = form.gemstone.value;
      var message = form.message.value.trim();
      var phoneOk = /^[+\d][\d\s\-()]{6,18}$/.test(phone);
      if (!name || !phoneOk || !message) {
        if (formError) formError.hidden = false;
        if (!name) form.name.focus();
        else if (!phoneOk) form.phone.focus();
        else form.message.focus();
        return;
      }
      if (formError) formError.hidden = true;
      var text = 'Hello Ramam Gems,%0A%0A' +
        'Name: ' + encodeURIComponent(name) + '%0A' +
        'Phone: ' + encodeURIComponent(phone) + '%0A' +
        (gem ? 'Interested in: ' + encodeURIComponent(gem) + '%0A' : '') +
        'Message: ' + encodeURIComponent(message);
      window.open('https://wa.me/919829071015?text=' + text, '_blank', 'noopener');
      form.reset();
    });
    ['name', 'phone', 'message'].forEach(function (f) {
      if (form[f]) form[f].addEventListener('input', function () {
        if (formError) formError.hidden = true;
      });
    });
  }
})();
