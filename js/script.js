/* =========================================================
   Nicolás Muñoz · Portafolio 2026 — interacciones
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tema claro / oscuro ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('nm-theme', next); } catch (e) { /* sin almacenamiento */ }
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'light' ? '#f6f4ef' : '#0b0c10');
    });
  }

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  function closeNav() {
    if (!navToggle) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    navLinks.classList.remove('is-open');
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
      navLinks.classList.toggle('is-open', !open);
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Header con borde al hacer scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Enlace activo según la sección visible ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Aparición suave ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Texto rotativo en la terminal ---------- */
  var typedEl = document.getElementById('typed');
  var words = ['Power Apps', 'Power Automate', 'Copilot Studio', 'Power BI', 'RPA', 'SharePoint', 'Azure', 'React · Node.js'];
  if (typedEl && !reduceMotion) {
    var w = 0, c = words[0].length, deleting = false;
    var tick = function () {
      var word = words[w];
      if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1700); }
      if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; return setTimeout(tick, 260); }
      c += deleting ? -1 : 1;
      typedEl.textContent = words[w].slice(0, c);
      setTimeout(tick, deleting ? 40 : 80);
    };
    tick();
  }

  /* ---------- Galerías ---------- */
  var galleries = document.querySelectorAll('.gallery');
  galleries.forEach(function (gallery) {
    var mainBtn = gallery.querySelector('.gallery-main');
    var mainImg = mainBtn.querySelector('img');
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('.thumb'));

    function show(i) {
      var t = thumbs[i];
      if (!t) return;
      thumbs.forEach(function (x) { x.classList.toggle('is-active', x === t); });
      mainImg.classList.add('is-swapping');
      setTimeout(function () {
        mainImg.src = t.dataset.src;
        mainImg.alt = t.dataset.alt || '';
        mainImg.classList.remove('is-swapping');
      }, 150);
      gallery.dataset.index = i;
    }

    thumbs.forEach(function (t, i) {
      t.setAttribute('aria-label', 'Ver captura ' + (i + 1) + ' de ' + thumbs.length);
      t.addEventListener('click', function () { show(i); });
    });

    mainBtn.addEventListener('click', function () {
      var items = thumbs.length
        ? thumbs.map(function (t) { return { src: t.dataset.src, alt: t.dataset.alt || '' }; })
        : [{ src: mainImg.src, alt: mainImg.alt }];
      openLightbox(items, Number(gallery.dataset.index || 0));
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbItems = [], lbIndex = 0, lastFocus = null;

  function renderLb() {
    var item = lbItems[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCap.textContent = item.alt + (lbItems.length > 1 ? '  ·  ' + (lbIndex + 1) + ' / ' + lbItems.length : '');
    var multi = lbItems.length > 1;
    lb.querySelector('.lb-prev').style.visibility = multi ? 'visible' : 'hidden';
    lb.querySelector('.lb-next').style.visibility = multi ? 'visible' : 'hidden';
  }
  function openLightbox(items, index) {
    lbItems = items; lbIndex = index || 0;
    lastFocus = document.activeElement;
    renderLb();
    lb.hidden = false;
    document.body.classList.add('lb-open');
    lb.querySelector('.lb-close').focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.classList.remove('lb-open');
    if (lastFocus) lastFocus.focus();
  }
  function step(d) {
    lbIndex = (lbIndex + d + lbItems.length) % lbItems.length;
    renderLb();
  }
  if (lb) {
    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
  }

  /* ---------- Año del footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
