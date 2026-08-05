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

  // --- Hero bowtie: scroll-driven untie on touch -----------------------
  // Desktop is untouched — there the untie is driven by :hover in CSS.
  //
  // Touch has no hover, so the bow is instead tied to scroll position: it
  // starts tied and pulls open as you scroll down the hero, re-tying if you
  // scroll back up. The scroll gesture *is* the animation, so there is no
  // transition on the wings here — a transition would lag a finger drag and
  // feel rubbery rather than direct.
  //
  // The label is deliberately left out of this. It is the CTA, and tying it
  // to scroll would mean an invisible call-to-action at the top of the page;
  // CSS keeps it fully visible on touch while only the bow itself moves.
  //
  // Every bail-out below leaves .is-scrolltied off, which means CSS keeps the
  // bow open and the CTA readable. Progressive enhancement, not a dependency.
  var bowtie = document.querySelector('.hero-bowtie');
  var touchish = window.matchMedia('(hover: none)').matches ||
                 window.matchMedia('(max-width: 860px)').matches;
  var stillness = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (bowtie && touchish && !stillness) {
    bowtie.classList.add('is-scrolltied');

    var bowTicking = false;

    function bowProgress() {
      // Fully untied by the time you have scrolled a bit under half a screen,
      // so the whole motion plays inside the hero rather than trailing into
      // the section below it. Viewport-relative so it feels the same on a
      // short phone and a tall one.
      var span = Math.max(window.innerHeight * 0.45, 1);
      var p = (window.pageYOffset || document.documentElement.scrollTop) / span;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    }

    function drawBowtie() {
      bowTicking = false;
      bowtie.style.setProperty('--untie', bowProgress().toFixed(3));
    }

    function onBowScroll() {
      if (bowTicking) return;
      bowTicking = true;
      window.requestAnimationFrame(drawBowtie);
    }

    window.addEventListener('scroll', onBowScroll, { passive: true });
    window.addEventListener('resize', onBowScroll, { passive: true });
    // Set the correct state immediately — a reload partway down the page must
    // not start from a tied bow and then jump on the first scroll event.
    drawBowtie();
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
