/* ==========================================================================
   DagenWeb — script.js (rebuilt from scratch, 2026-07-25)
   Shared behavior for every page: menu overlay, language toggle, footer
   year, and (on works.html only) the grid/list view switch.

   No content-object/admin-panel system this time — content lives directly
   in each page's HTML, translated via data-ar attributes (same convention
   as english-teaching/assets/js/main.js elsewhere in this workspace).
   Arabic is the default language; English is the secondary, toggled-to
   option.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Menu: floating button + small rising panel (popover pattern) ----
  var menuToggle = document.getElementById('menuToggle');
  var menuOverlay = document.getElementById('menuOverlay');

  function openMenu() {
    menuOverlay.classList.add('open');
    menuToggle.classList.add('open');
  }
  function closeMenu() {
    menuOverlay.classList.remove('open');
    menuToggle.classList.remove('open');
  }
  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menuOverlay.classList.contains('open')) closeMenu();
      else openMenu();
    });
    menuOverlay.querySelectorAll('.menu-links a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    // Popover convention: clicking anywhere outside the panel/button closes it.
    document.addEventListener('click', function (e) {
      if (!menuOverlay.classList.contains('open')) return;
      if (menuOverlay.contains(e.target) || menuToggle.contains(e.target)) return;
      closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

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
