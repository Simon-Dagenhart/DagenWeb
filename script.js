/* ==========================================================================
   DagenWeb — script.js
   Shared behavior for every page: language toggle, footer year, and (on
   works.html only) the grid/list view switch. Nav links are plain <a>
   tags directly in the header now — no menu overlay/popover to wire up.

   No content-object/admin-panel system — content lives directly in each
   page's HTML, translated via data-ar attributes (same convention as
   english-teaching/assets/js/main.js elsewhere in this workspace). Arabic
   is the default language; English is the secondary, toggled-to option.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Language toggle (data-ar convention) ----------------------------
  var LANG_KEY = 'dagenweb-lang';
  var langToggle = document.getElementById('langToggle');

  function applyLang(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'ar';
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';

    document.querySelectorAll('[data-ar]').forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent;
      el.textContent = lang === 'en' ? el.dataset.en : el.dataset.ar;
    });
    document.querySelectorAll('[data-ar-html]').forEach(function (el) {
      if (el.dataset.enHtml === undefined) el.dataset.enHtml = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.enHtml : el.dataset.arHtml;
    });

    if (langToggle) langToggle.textContent = lang === 'en' ? 'العربية' : 'English';
    localStorage.setItem(LANG_KEY, lang);
  }

  // Arabic unless the visitor has explicitly switched to English before.
  applyLang(localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ar');

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var current = document.documentElement.lang === 'en' ? 'en' : 'ar';
      applyLang(current === 'en' ? 'ar' : 'en');
    });
  }

  // --- Hero bowtie: play the untie once on touch -----------------------
  // On a pointer device the untie is driven by :hover. Touch has no hover,
  // so CSS rests the bow open — correct, but phone visitors never see the
  // one motion that carries the brand. Here we arm it (tie it) and let it
  // untie itself as the hero settles. Once only, and the CTA is a real <a>
  // throughout, so a tap navigates whatever state the bow is in.
  //
  // Every bail-out below leaves .is-armed off, which means CSS keeps the bow
  // open and the CTA readable. Progressive enhancement, not a dependency.
  var bowtie = document.querySelector('.hero-bowtie');
  var touchish = window.matchMedia('(hover: none)').matches ||
                 window.matchMedia('(max-width: 860px)').matches;
  var stillness = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (bowtie && touchish && !stillness && 'IntersectionObserver' in window) {
    bowtie.classList.add('is-armed');

    var bowFallback;
    function openBowtie(delay) {
      clearTimeout(bowFallback);
      if (bowObserver) bowObserver.disconnect();
      // The delay lets the page-fade-in finish first — two motions at once
      // reads as noise rather than as one gesture.
      setTimeout(function () { bowtie.classList.add('is-open'); }, delay);
    }

    // A tied bow means the label is at opacity 0, so the CTA is invisible
    // until this runs. On a short phone the bowtie can start below the fold,
    // and a visitor who never scrolls would otherwise never see it at all.
    // The timer guarantees it opens regardless; whichever fires first wins.
    bowFallback = setTimeout(function () { openBowtie(0); }, 2400);

    // 0.35 rather than a majority: on a tall hero the bowtie is often only
    // partly on screen at rest, and waiting for 60% meant it sat tied.
    var bowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) openBowtie(260);
      });
    }, { threshold: 0.35 });
    bowObserver.observe(bowtie);
  }

  // --- Works grid: grid/list view toggle (works.html only) -------------
  // Briefly fades the grid out/in around the layout change instead of
  // snapping instantly, so switching views feels like a transition.
  var gridBtn = document.getElementById('viewGrid');
  var listBtn = document.getElementById('viewList');
  var worksGrid = document.getElementById('worksGrid');
  function setWorksView(isList) {
    if (worksGrid.classList.contains('list-view') === isList) return;
    worksGrid.classList.add('switching');
    setTimeout(function () {
      worksGrid.classList.toggle('list-view', isList);
      listBtn.classList.toggle('active', isList);
      gridBtn.classList.toggle('active', !isList);
      worksGrid.classList.remove('switching');
    }, 180);
  }
  if (gridBtn && listBtn && worksGrid) {
    gridBtn.addEventListener('click', function () { setWorksView(false); });
    listBtn.addEventListener('click', function () { setWorksView(true); });
  }
});
