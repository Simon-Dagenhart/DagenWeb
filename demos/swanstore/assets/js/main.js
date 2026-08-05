/* ==========================================================================
   سوان ستور — shared behaviour + data layer
   Loaded by every page (storefront + admin). Everything is null-guarded so
   the admin panel can reuse the helpers without the storefront markup.
   ========================================================================== */
(function () {
  'use strict';

  var R = (window.Swanstore = window.Swanstore || {});
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Store contact — placeholders, swap in the real numbers/handle
     ------------------------------------------------------------------ */
  R.CONTACT = {
    whatsappNumber: '9647500000000',        // digits only, no + — used in wa.me links
    phoneDisplay: '+964 750 000 0000',
    phoneTel: '+9647500000000',
    // The Instagram icon and handle are shown as contact info but are not
    // linked anywhere. Put the profile URL back here and re-wrap the icon in
    // an <a> if the account goes live.
    instagramHandle: '@swanstore.iq'
  };

  /* ------------------------------------------------------------------
     Tiny helpers
     ------------------------------------------------------------------ */
  R.escapeHTML = function (str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var esc = R.escapeHTML;

  // price is always latin digits + arabic currency, kept LTR-safe inside RTL copy
  R.formatPrice = function (amount) {
    return '<bdi>' + Number(amount).toLocaleString('en-US') + '</bdi><span class="cur">د.ع</span>';
  };
  R.formatPriceText = function (amount) {
    return Number(amount).toLocaleString('en-US') + ' د.ع';
  };

  R.whatsappLink = function (product, message) {
    var msg = message || ('مرحبًا، أرغب بطلب: ' + product.name + ' — ' + R.formatPriceText(product.price));
    return 'https://wa.me/' + R.CONTACT.whatsappNumber + '?text=' + encodeURIComponent(msg);
  };

  R.toast = function (message) {
    var toast = document.getElementById('swanstoreToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'swanstoreToast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  };

  /* ------------------------------------------------------------------
     Lucide icons, inlined (currentColor, stroke 1.5)
     ------------------------------------------------------------------ */
  function lucide(body, size) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (size ? ' style="width:' + size + 'px;height:' + size + 'px"' : '') + '>' + body + '</svg>';
  }
  R.LUCIDE = {
    search: lucide('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
    menu: lucide('<line x1="4" x2="20" y1="7" y2="7"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="14" y1="17" y2="17"/>'),
    close: lucide('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    messageCircle: lucide('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),
    phone: lucide('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
    instagram: lucide('<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>'),
    alertTriangle: lucide('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
    check: lucide('<path d="M20 6 9 17l-5-5"/>'),
    shield: lucide('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'),
    truck: lucide('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>'),
    sparkles: lucide('<path d="M9.94 14.06 4 20"/><path d="M12 3 9.9 8.6 4 10.7l5.9 2.1L12 18.4l2.1-5.6L20 10.7l-5.9-2.1z"/><path d="M18 15h.01"/><path d="M19.5 18.5 21 20"/>'),
    heart: lucide('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
    arrowUp: lucide('<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>'),
    arrowLeft: lucide('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),
    arrowRight: lucide('<path d="m12 19 7-7-7-7"/><path d="M5 12h14"/>'),
    link: lucide('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
    disc: lucide('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/>')
  };

  /* ------------------------------------------------------------------
     Category line-art (also hydrated into [data-icon] placeholders)
     ------------------------------------------------------------------ */
  var ICON_PATHS = {
    vinyl:
      '<circle cx="32" cy="32" r="29"/><circle cx="32" cy="32" r="22" stroke-opacity=".5"/>' +
      '<circle cx="32" cy="32" r="15.5" stroke-opacity=".5"/><circle cx="32" cy="32" r="9" stroke-opacity=".5"/>' +
      '<circle cx="32" cy="32" r="3.4" fill="currentColor" stroke="none"/>',
    shirt:
      '<path d="M22 8 10 16 16 27 22 22 22 57 42 57 42 22 48 27 54 16 42 8C39 13 36 15 32 15 28 15 25 13 22 8Z"/>' +
      '<path d="M27 30h10M27 37h10" stroke-opacity=".45"/>',
    pendant:
      '<path d="M32 6C21 6 14 14 14 24c0 7 3 11 6 14v8c0 2 2 4 4 4h4v-6h4v6h4v-6h4v6h4c2 0 4-2 4-4v-8c3-3 6-7 6-14C50 14 43 6 32 6Z"/>' +
      '<circle cx="24" cy="25" r="3.4" fill="currentColor" stroke="none"/>' +
      '<circle cx="40" cy="25" r="3.4" fill="currentColor" stroke="none"/><path d="M27 35h10"/>',
    poster:
      '<rect x="9" y="7" width="46" height="50" rx="2"/><path d="M9 41 23 27 33 37 43 23 55 35"/>' +
      '<circle cx="19" cy="17" r="3.2" fill="currentColor" stroke="none"/>',
    guitar:
      '<path d="M41 8 52 19"/><path d="M45 4 56 15"/><path d="M43 17 30 30"/>' +
      '<path d="M30 30c-5-3-11-2-15 2s-5 10-2 14 4 5 4 9 4 7 8 7 7-3 8-7 3-6 6-7 6-4 6-9-4-9-9-9c-3 0-5 1-6 0Z"/>' +
      '<circle cx="26" cy="42" r="5" stroke-opacity=".5"/>'
  };
  function iconSVG(key, extraClass) {
    var body = ICON_PATHS[key] || ICON_PATHS.poster;
    return '<svg class="' + (extraClass || '') + '" viewBox="0 0 64 64" fill="none" stroke="currentColor"' +
      ' stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + body + '</svg>';
  }
  R.icon = iconSVG;
  R.ICON_KEYS = Object.keys(ICON_PATHS);

  /* ------------------------------------------------------------------
     Generated cover art — used whenever a product has no photograph, so
     an empty catalogue still looks designed instead of broken.
     ------------------------------------------------------------------ */
  var ART_TONES = {
    vinyl:   { a: '#1b1013', b: '#0b0b0e', glow: 'rgba(225,29,47,.34)' },
    shirt:   { a: '#101620', b: '#0b0b0e', glow: 'rgba(120,155,215,.26)' },
    pendant: { a: '#1a1510', b: '#0b0b0e', glow: 'rgba(226,172,82,.26)' },
    poster:  { a: '#0f1a17', b: '#0b0b0e', glow: 'rgba(70,195,150,.22)' },
    guitar:  { a: '#191014', b: '#0b0b0e', glow: 'rgba(225,29,47,.3)' }
  };
  function hash(str) {
    var h = 0;
    for (var i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  R.productArtHTML = function (p) {
    var key = ART_TONES[p.icon] ? p.icon : 'poster';
    var t = ART_TONES[key];
    var seed = hash(p.id || p.name);
    var uid = 'a' + seed.toString(36) + key;
    var angle = 20 + (seed % 40);           // gradient tilt varies per product
    var offset = 30 + (seed % 30);          // glow position varies per product

    return (
      '<svg class="art-svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img"' +
      ' aria-label="' + esc(p.name) + '">' +
        '<defs>' +
          '<linearGradient id="g' + uid + '" gradientTransform="rotate(' + angle + ' .5 .5)">' +
            '<stop offset="0" stop-color="' + t.a + '"/><stop offset="1" stop-color="' + t.b + '"/>' +
          '</linearGradient>' +
          '<radialGradient id="r' + uid + '" cx="' + offset + '%" cy="18%" r="72%">' +
            '<stop offset="0" stop-color="' + t.glow + '"/><stop offset="1" stop-color="transparent"/>' +
          '</radialGradient>' +
          '<pattern id="d' + uid + '" width="9" height="9" patternUnits="userSpaceOnUse">' +
            '<circle cx="1.6" cy="1.6" r="1.1" fill="rgba(241,233,215,.07)"/>' +
          '</pattern>' +
        '</defs>' +
        '<rect width="400" height="500" fill="url(#g' + uid + ')"/>' +
        '<rect width="400" height="500" fill="url(#r' + uid + ')"/>' +
        '<rect width="400" height="500" fill="url(#d' + uid + ')"/>' +
        '<g transform="translate(200 236) rotate(' + ((seed % 9) - 4) + ') scale(3.4) translate(-32 -32)"' +
        ' fill="none" stroke="#f1e9d7" stroke-opacity=".26" stroke-width="1.5"' +
        ' stroke-linejoin="round" stroke-linecap="round" color="rgba(241,233,215,.26)">' +
          (ICON_PATHS[key] || ICON_PATHS.poster) +
        '</g>' +
        '<text x="200" y="452" text-anchor="middle" fill="rgba(241,233,215,.34)"' +
        ' font-family="IBM Plex Sans Arabic, sans-serif" font-size="17" direction="rtl">' +
          esc(p.category) +
        '</text>' +
        '<rect x="0.5" y="0.5" width="399" height="499" fill="none" stroke="rgba(241,233,215,.06)"/>' +
      '</svg>'
    );
  };

  // real photo when supplied, generated art otherwise
  R.productThumbHTML = function (p, opts) {
    opts = opts || {};
    if (p.image) {
      return '<img src="' + esc(p.image) + '" alt="' + esc(p.name + ' — ' + p.category) + '"' +
        ' width="800" height="1000" decoding="async"' + (opts.eager ? '' : ' loading="lazy"') + '>';
    }
    return R.productArtHTML(p);
  };

  /* ------------------------------------------------------------------
     Product data — fetched once, cached on the promise
     ------------------------------------------------------------------ */
  R.loadProducts = function () {
    if (!R._productsPromise) {
      R._productsPromise = fetch('data/products.json', { cache: 'no-store' })
        .then(function (res) {
          if (!res.ok) throw new Error('تعذّر تحميل المنتجات');
          return res.json();
        })
        .then(function (data) {
          window.SWANSTORE_PRODUCTS = data;
          return data;
        });
    }
    return R._productsPromise;
  };

  /* ------------------------------------------------------------------
     Cards + grids
     ------------------------------------------------------------------ */
  R.productCardHTML = function (p, opts) {
    opts = opts || {};
    var out = p.inStock === false;
    return (
      '<a href="product.html?id=' + encodeURIComponent(p.id) + '"' +
      ' class="product-card reveal' + (out ? ' out-of-stock' : '') + '">' +
        '<div class="product-thumb">' +
          (out
            ? '<span class="stock-badge">غير متوفر حاليًا</span>'
            : (p.tag ? '<span class="product-tag">' + esc(p.tag) + '</span>' : '')) +
          R.productThumbHTML(p, opts) +
        '</div>' +
        '<div class="product-body">' +
          '<span class="product-cat">' + esc(p.category) + '</span>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<span class="product-price">' + R.formatPrice(p.price) + '</span>' +
          '<span class="go">عرض التفاصيل <span class="arrow">←</span></span>' +
        '</div>' +
      '</a>'
    );
  };

  R.renderGrid = function (container, products, emptyMessage) {
    if (!container) return;
    if (!products || !products.length) {
      container.innerHTML = '<p class="empty-state">' + esc(emptyMessage || 'لا توجد منتجات في هذا التصنيف حاليًا.') + '</p>';
      return;
    }
    container.innerHTML = products.map(function (p) { return R.productCardHTML(p); }).join('');
    R.observeReveal('.reveal:not(.in-view)');
  };

  R.deriveCategories = function (products) {
    var order = [], byCat = {};
    products.forEach(function (p) {
      if (!byCat[p.category]) {
        byCat[p.category] = { category: p.category, icon: p.icon, count: 0 };
        order.push(p.category);
      }
      byCat[p.category].count += 1;
    });
    return order.map(function (c) { return byCat[c]; });
  };

  R.countLabel = function (n) {
    if (n === 1) return 'منتج واحد';
    if (n === 2) return 'منتجان';
    if (n <= 10) return n + ' منتجات';
    return n + ' منتجًا';
  };

  /* ------------------------------------------------------------------
     Search — arabic-normalised matching + levenshtein "did you mean"
     ------------------------------------------------------------------ */
  function normalizeAr(str) {
    return (str || '')
      .replace(/[ً-ْٰ]/g, '')   // strip tashkeel
      .replace(/[إأآا]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/[ـ]/g, '')
      .toLowerCase()
      .trim();
  }
  R.normalizeAr = normalizeAr;

  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    var dp = new Array(n + 1), i, j;
    for (j = 0; j <= n; j++) dp[j] = j;
    for (i = 1; i <= m; i++) {
      var prev = dp[0];
      dp[0] = i;
      for (j = 1; j <= n; j++) {
        var tmp = dp[j];
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return dp[n];
  }

  // { matches: [...], suggestions: [...] }
  R.search = function (query, products) {
    products = products || window.SWANSTORE_PRODUCTS || [];
    var q = normalizeAr(query);
    if (!q) return { matches: [], suggestions: [] };

    var matches = products.filter(function (p) {
      return normalizeAr(p.name + ' ' + p.category + ' ' + p.description).indexOf(q) !== -1;
    });
    if (matches.length) return { matches: matches, suggestions: [] };

    var candidates = [];
    products.forEach(function (p) {
      normalizeAr(p.name + ' ' + p.category).split(/\s+/).forEach(function (w) {
        if (!w) return;
        var sim = 1 - levenshtein(q, w) / Math.max(q.length, w.length);
        if (sim > 0.4) candidates.push({ product: p, sim: sim });
      });
    });
    candidates.sort(function (a, b) { return b.sim - a.sim; });

    var seen = {}, suggestions = [];
    candidates.forEach(function (c) {
      if (!seen[c.product.id]) { seen[c.product.id] = true; suggestions.push(c.product); }
    });
    return { matches: [], suggestions: suggestions.slice(0, 4) };
  };

  R.suggestChipsHTML = function (products) {
    return products.map(function (p) {
      return '<button type="button" class="search-suggest-chip" data-suggest="' + esc(p.name) + '">' + esc(p.name) + '</button>';
    }).join('');
  };

  /* ------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  R.observeReveal = function (selector) {
    var targets = document.querySelectorAll(selector || '.reveal');
    if (!targets.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        setTimeout(function () { el.classList.add('in-view'); }, (siblings % 8) * 70);
        io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px' });
    targets.forEach(function (el) { io.observe(el); });
  };

  /* ------------------------------------------------------------------
     Chrome: header, nav drawer, search overlay, to-top, year
     ------------------------------------------------------------------ */
  function boot() {
    document.querySelectorAll('[data-icon]').forEach(function (el) {
      el.innerHTML = iconSVG(el.getAttribute('data-icon'));
    });
    document.querySelectorAll('[data-lucide]').forEach(function (el) {
      var name = el.getAttribute('data-lucide');
      if (R.LUCIDE[name]) el.innerHTML = R.LUCIDE[name];
    });

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    R.observeReveal('.reveal');

    /* --- header state + scroll progress --- */
    var header = document.querySelector('.site-header');
    var progress = document.querySelector('.scroll-progress');
    var toTop = document.getElementById('toTop');
    if (header || toTop) {
      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY || window.pageYOffset;
          if (header) header.classList.toggle('is-stuck', y > 24);
          if (toTop) toTop.classList.toggle('show', y > 620);
          if (progress) {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
          }
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }

    /* --- mobile drawer --- */
    var navToggle = document.getElementById('navToggle');
    var nav = document.getElementById('mainNav');
    var backdrop = document.getElementById('navBackdrop');
    if (navToggle && nav) {
      var setNav = function (open) {
        nav.classList.toggle('open', open);
        if (backdrop) backdrop.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
        navToggle.innerHTML = open ? R.LUCIDE.close : R.LUCIDE.menu;
        document.body.style.overflow = open ? 'hidden' : '';
      };
      navToggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
      if (backdrop) backdrop.addEventListener('click', function () { setNav(false); });
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
      window.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    }

    /* --- search overlay --- */
    var overlay = document.getElementById('searchOverlay');
    var openers = document.querySelectorAll('[data-open-search]');
    if (overlay && openers.length) {
      var input = overlay.querySelector('input');
      var results = document.getElementById('searchResults');
      var closeBtn = overlay.querySelector('.search-close');
      var lastFocus = null;

      var setSearch = function (open) {
        overlay.classList.toggle('open', open);
        overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
          lastFocus = document.activeElement;
          setTimeout(function () { input.focus(); input.select(); }, 60);
          R.loadProducts().catch(function () {});
        } else if (lastFocus) {
          lastFocus.focus();
        }
      };
      R.openSearch = function () { setSearch(true); };

      openers.forEach(function (btn) {
        btn.addEventListener('click', function (e) { e.preventDefault(); setSearch(true); });
      });
      if (closeBtn) closeBtn.addEventListener('click', function () { setSearch(false); });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) setSearch(false); });
      window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('open')) setSearch(false);
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          setSearch(!overlay.classList.contains('open'));
        }
      });

      var hintHTML = results ? results.innerHTML : '';
      var debounce;
      var render = function () {
        var q = input.value.trim();
        if (!q) { results.innerHTML = hintHTML; return; }
        R.loadProducts().then(function (products) {
          var res = R.search(q, products);
          if (res.matches.length) {
            results.innerHTML = res.matches.slice(0, 8).map(function (p) {
              return (
                '<a class="search-hit" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
                  '<span class="hit-art">' + R.productThumbHTML(p) + '</span>' +
                  '<span class="hit-body">' +
                    '<strong>' + esc(p.name) + '</strong>' +
                    '<span>' + esc(p.category) + (p.inStock === false ? ' — غير متوفر' : '') + '</span>' +
                  '</span>' +
                  '<span class="hit-price">' + R.formatPriceText(p.price) + '</span>' +
                '</a>'
              );
            }).join('');
          } else {
            results.innerHTML =
              '<div class="search-hint">لا توجد نتائج لـ «' + esc(q) + '»' +
              (res.suggestions.length
                ? '<div class="search-suggest-chips">' + R.suggestChipsHTML(res.suggestions) + '</div>'
                : ' — جرّب كلمة أخرى.') +
              '</div>';
          }
        });
      };
      input.addEventListener('input', function () {
        clearTimeout(debounce);
        debounce = setTimeout(render, 160);
      });
      if (results) {
        results.addEventListener('click', function (e) {
          var chip = e.target.closest('[data-suggest]');
          if (!chip) return;
          input.value = chip.getAttribute('data-suggest');
          render();
          input.focus();
        });
      }
    }

    /* --- count-up stats --- */
    var stats = document.querySelectorAll('[data-count]');
    if (stats.length && !reduceMotion && 'IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10) || 0;
          var start = performance.now();
          (function step(now) {
            var t = Math.min(1, (now - start) / 1100);
            el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
            if (t < 1) requestAnimationFrame(step);
          })(start);
          so.unobserve(el);
        });
      }, { threshold: 0.6 });
      stats.forEach(function (el) { so.observe(el); });
    } else {
      stats.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
