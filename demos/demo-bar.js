/* ==========================================================================
   DagenWeb — demo bar
   Injected into every page of a demo site hosted inside the portfolio
   (demos/ashur/, demos/swanstore/). Two jobs:
     1. Make it unmistakable that this is a design demo, not a live business.
     2. Give a reviewer a one-click way back to the portfolio from any page.

   Self-contained on purpose (styles inlined, no dependencies) so it can be
   dropped into any demo regardless of that site's own CSS/JS conventions.
   Bilingual label is static rather than wired to each site's language
   toggle — the demos differ (Ashur has an AR/EN toggle, swanstore is
   Arabic-only) and this keeps one file working for both.
   ========================================================================== */

(function () {
  'use strict';

  // Depth from this demo page back to the portfolio root. Pages sit at
  // demos/<site>/page.html (2 up) or demos/<site>/sub/page.html (3 up);
  // the injecting script tag's own src tells us which.
  var script = document.currentScript;
  var toDemosRoot = (script && script.getAttribute('src') || '../demo-bar.js')
    .replace(/demo-bar\.js$/, '');
  var toPortfolio = toDemosRoot + '../';

  var css = ''
    + '.dw-demo-bar{position:fixed;inset-inline:0;bottom:0;z-index:9999;'
    + 'display:flex;align-items:center;justify-content:space-between;gap:12px;'
    + 'padding:8px 16px;background:#161514;color:#f2f2f2;'
    + "font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:13px;"
    + 'box-shadow:0 -2px 16px rgba(0,0,0,.28);direction:ltr}'
    + '.dw-demo-bar__tag{display:inline-flex;align-items:center;gap:8px;font-weight:600}'
    + '.dw-demo-bar__dot{width:7px;height:7px;border-radius:50%;background:#cb6e8e;flex-shrink:0}'
    + '.dw-demo-bar__muted{color:#a3a3a3;font-weight:400}'
    + '.dw-demo-bar a{color:#fff;text-decoration:none;font-weight:600;'
    + 'border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:5px 14px;'
    + 'white-space:nowrap;transition:background .2s,border-color .2s}'
    + '.dw-demo-bar a:hover{background:#cb6e8e;border-color:#cb6e8e}'
    + 'body{padding-bottom:52px!important}'
    + '@media (max-width:520px){.dw-demo-bar{font-size:11.5px;padding:7px 10px}'
    + '.dw-demo-bar__muted{display:none}}'
    // Demo-only polish: the source sites keep empty media boxes as TODO
    // markers for photography that hasn't been supplied yet. Left visible
    // those read as broken images to a reviewer, so collapse any media
    // placeholder that has no image in it. The source site is untouched —
    // this rule only ships with the hosted demo copy.
    + '.hero-media:not(:has(img)),.media-placeholder:not(:has(img)){display:none!important}';

  function mount() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.className = 'dw-demo-bar';
    bar.setAttribute('role', 'complementary');
    bar.setAttribute('aria-label', 'Demo notice');

    var tag = document.createElement('span');
    tag.className = 'dw-demo-bar__tag';
    var dot = document.createElement('span');
    dot.className = 'dw-demo-bar__dot';
    tag.appendChild(dot);
    tag.appendChild(document.createTextNode('معاينة تجريبية · Demo'));
    var muted = document.createElement('span');
    muted.className = 'dw-demo-bar__muted';
    muted.textContent = '— نموذج تصميم من DagenWeb، وليس نشاطًا تجاريًا فعليًا.';
    tag.appendChild(muted);

    var back = document.createElement('a');
    back.href = toPortfolio + 'works.html';
    back.textContent = '← DagenWeb';

    bar.appendChild(tag);
    bar.appendChild(back);
    document.body.appendChild(bar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
