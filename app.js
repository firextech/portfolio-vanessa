/* =========================================================================
   Portfolio de Vanessa Caso — comportamiento
   Sin dependencias. Si el script no corre, la página se ve entera y quieta.
   Si el sistema pide menos movimiento, nada se anima.
   ========================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var canAnimate = !reduce.matches;

  if (canAnimate) root.classList.add('anim');
  // la entrada del héroe arranca en el primer fotograma tras pintar
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add('ready'); });
  });

  /* ---------------------------------------------------- revelado al entrar */
  var revealables = document.querySelectorAll('[data-rv]');
  if (canAnimate && 'IntersectionObserver' in window) {
    var rvObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        rvObserver.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealables.forEach(function (el) { rvObserver.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* --------------------------------------------------------- contadores */
  function runCounter(el) {
    var target = parseFloat(el.dataset.count || el.textContent) || 0;
    if (!canAnimate) { el.textContent = String(target); return; }
    var dur = 1400, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      // easeOutExpo: arranca rápido y frena
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var cObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        runCounter(e.target);
        cObserver.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      if (!canAnimate) { el.textContent = el.dataset.count; return; }
      el.textContent = '0';
      cObserver.observe(el);
      // red de seguridad: si el observador no llega a dispararse, el número se pone igual
      setTimeout(function () { if (el.textContent === '0') runCounter(el); }, 2500);
    });
  } else {
    counters.forEach(runCounter);
  }

  /* ------------------------------------------- barra de progreso + nav */
  var progress = document.querySelector('.progress');
  var nav = document.querySelector('.nav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
      if (nav) nav.classList.toggle('is-stuck', y > 8);

      // enlace de la sección en pantalla
      var current = -1;
      sections.forEach(function (sec, i) {
        if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.35) current = i;
      });
      navLinks.forEach(function (a, i) { a.classList.toggle('is-current', i === current); });

      // relleno de la línea de tiempo
      var rail = document.querySelector('.tl__rail');
      if (rail) {
        var tl = rail.parentElement.getBoundingClientRect();
        var fill = (window.innerHeight * 0.6 - tl.top) / tl.height;
        rail.style.setProperty('--fill', Math.max(0, Math.min(1, fill)) * 100 + '%');
      }

      // paralaje suave del retrato
      if (canAnimate) {
        var img = document.querySelector('.hero__frame img');
        if (img) {
          var r = img.parentElement.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) {
            img.style.transform = 'translate3d(0,' + (-r.top * 0.045).toFixed(2) + 'px,0) scale(1.06)';
          }
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* -------------------------------------- hitos de la línea de tiempo */
  if ('IntersectionObserver' in window) {
    var tlObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('is-in'); });
    }, { threshold: 0.35 });
    document.querySelectorAll('.tl__item').forEach(function (el) { tlObserver.observe(el); });
  }

  /* ------------------------------------ la frase se enciende al pasar */
  var stmt = document.querySelector('[data-stmt]');
  if (stmt) {
    var strong = stmt.querySelector('strong');
    var hlWords = strong ? strong.textContent.trim().split(/\s+/) : [];
    var plain = stmt.textContent.replace(/\s+/g, ' ').trim().split(' ');
    stmt.textContent = '';
    plain.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w' + (hlWords.indexOf(w) !== -1 ? ' hl' : '');
      s.textContent = w;
      stmt.appendChild(s);
      if (i < plain.length - 1) stmt.appendChild(document.createTextNode(' '));
    });
    var words = stmt.querySelectorAll('.w');
    if (!canAnimate) {
      words.forEach(function (w) { w.classList.add('on'); });
    } else {
      window.addEventListener('scroll', function () {
        var mid = window.innerHeight * 0.62;
        words.forEach(function (w) {
          w.classList.toggle('on', w.getBoundingClientRect().top < mid);
        });
      }, { passive: true });
    }
  }

  /* --------------------------------------- retícula de la banda oscura */
  var cv = document.querySelector('.dark__grid');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d');
    var cell = 46, pulses = [], raf = null, visible = false;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }
    function seed() {
      var r = cv.getBoundingClientRect();
      var cols = Math.ceil(r.width / cell), rows = Math.ceil(r.height / cell);
      pulses = [];
      for (var i = 0; i < 14; i++) {
        pulses.push({
          x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows),
          dir: Math.floor(Math.random() * 4), p: Math.random(),
          sp: 0.004 + Math.random() * 0.006, life: 0
        });
      }
    }
    function draw() {
      var r = cv.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      // retícula
      ctx.strokeStyle = 'rgba(220, 233, 241, .17)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var x = 0; x <= r.width; x += cell) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, r.height); }
      for (var y = 0; y <= r.height; y += cell) { ctx.moveTo(0, y + .5); ctx.lineTo(r.width, y + .5); }
      ctx.stroke();
      // señales que recorren las líneas
      pulses.forEach(function (s) {
        s.p += s.sp;
        if (s.p >= 1) {
          s.p = 0;
          if (s.dir === 0) s.x++; else if (s.dir === 1) s.y++; else if (s.dir === 2) s.x--; else s.y--;
          var cols = Math.ceil(r.width / cell), rows = Math.ceil(r.height / cell);
          if (s.x < 0) s.x = cols; if (s.x > cols) s.x = 0;
          if (s.y < 0) s.y = rows; if (s.y > rows) s.y = 0;
          if (Math.random() < 0.3) s.dir = Math.floor(Math.random() * 4);
        }
        var ax = s.x * cell, ay = s.y * cell, bx = ax, by = ay;
        if (s.dir === 0) bx += cell; else if (s.dir === 1) by += cell;
        else if (s.dir === 2) bx -= cell; else by -= cell;
        var cx = ax + (bx - ax) * s.p, cy = ay + (by - ay) * s.p;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cell * 0.9);
        g.addColorStop(0, 'rgba(220, 233, 241, .55)');
        g.addColorStop(1, 'rgba(220, 233, 241, 0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, cell * 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(220, 233, 241, .9)';
        ctx.beginPath(); ctx.arc(cx, cy, 1.6, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    function stillFrame() {
      var r = cv.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      ctx.strokeStyle = 'rgba(220, 233, 241, .17)';
      ctx.lineWidth = 1; ctx.beginPath();
      for (var x = 0; x <= r.width; x += cell) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, r.height); }
      for (var y = 0; y <= r.height; y += cell) { ctx.moveTo(0, y + .5); ctx.lineTo(r.width, y + .5); }
      ctx.stroke();
    }
    size();
    window.addEventListener('resize', function () { size(); if (!canAnimate || !visible) stillFrame(); }, { passive: true });

    if (!canAnimate) {
      stillFrame();
    } else if ('IntersectionObserver' in window) {
      // solo dibuja mientras la sección está en pantalla
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible && raf === null) draw();
          else if (!visible && raf !== null) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0.05 }).observe(cv.parentElement);
    } else {
      draw();
    }
  }

  /* ------------------------------------------------- menú en el móvil */
  var burger = document.querySelector('.nav__burger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- si cambia la preferencia, se deja todo quieto */
  reduce.addEventListener('change', function () {
    if (!reduce.matches) return;
    canAnimate = false;
    root.classList.remove('anim');
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  });
})();
