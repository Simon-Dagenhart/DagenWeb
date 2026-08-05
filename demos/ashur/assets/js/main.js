// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('navToggle');
    var navList = document.getElementById('navList');
    if (toggle && navList) {
        toggle.addEventListener('click', function () {
            navList.classList.toggle('open');
        });
        navList.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navList.classList.remove('open');
            });
        });
    }

    // Footer year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Language toggle (English/Arabic). Every translatable element carries
    // a data-ar="..." attribute holding its Arabic text right next to the
    // English text already in the HTML — applyLang() swaps between them
    // and caches the original English on first switch so it can restore it.
    // Elements with nested tags (e.g. a paragraph with a link inside) use
    // data-ar-html instead, which swaps innerHTML rather than textContent
    // so the nested markup survives the translation.
    var langToggle = document.getElementById('langToggle');
    if (langToggle) {
        var applyLang = function (lang) {
            document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            document.querySelectorAll('[data-ar]').forEach(function (el) {
                if (el.dataset.en === undefined) el.dataset.en = el.textContent;
                el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.en;
            });
            document.querySelectorAll('[data-ar-html]').forEach(function (el) {
                if (el.dataset.enHtml === undefined) el.dataset.enHtml = el.innerHTML;
                el.innerHTML = lang === 'ar' ? el.dataset.arHtml : el.dataset.enHtml;
            });
            document.querySelectorAll('[data-ar-placeholder]').forEach(function (el) {
                if (el.dataset.enPlaceholder === undefined) el.dataset.enPlaceholder = el.getAttribute('placeholder') || '';
                el.setAttribute('placeholder', lang === 'ar' ? el.dataset.arPlaceholder : el.dataset.enPlaceholder);
            });
            langToggle.textContent = lang === 'ar' ? 'English' : 'العربية';
            localStorage.setItem('sindbadschools-lang', lang);
        };

        // Arabic is the default language for this school; English is opt-in
        // via the toggle. A stored preference always wins over the default.
        applyLang(localStorage.getItem('sindbadschools-lang') || 'ar');

        langToggle.addEventListener('click', function () {
            var current = document.documentElement.lang === 'ar' ? 'ar' : 'en';
            applyLang(current === 'ar' ? 'en' : 'ar');
        });
    }

    // Contact form -> mailto (static hosting has no server to receive submissions)
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = form.querySelector('#cf-name').value.trim();
            var email = form.querySelector('#cf-email').value.trim();
            var childGrade = form.querySelector('#cf-grade').value;
            var message = form.querySelector('#cf-message').value.trim();
            var status = document.getElementById('formStatus');

            var subject = 'Website inquiry from ' + (name || 'a parent/guardian');
            var body = 'Name: ' + name + '\nEmail: ' + email + '\nGrade of interest: ' + childGrade + '\n\nMessage:\n' + message;
            var mailto = 'mailto:simonkazage007@gmail.com'
                + '?subject=' + encodeURIComponent(subject)
                + '&body=' + encodeURIComponent(body);

            window.location.href = mailto;
            if (status) {
                var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
                status.textContent = lang === 'ar'
                    ? 'يتم فتح تطبيق البريد الإلكتروني لإرسال هذه الرسالة...'
                    : 'Opening your email app to send this message...';
                status.classList.add('ok');
            }
        });
    }
});

// Gentle scroll-reveal for cards/sections (progressive enhancement).
// Targets existing structural classes only — no HTML changes needed.
document.addEventListener('DOMContentLoaded', function () {
    var targets = document.querySelectorAll(
        '.card, .news-card, .testimonial-card, .staff-card, .timeline li, .event-card, .step, .cta-banner'
    );
    if (!targets.length) return;

    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el, i) {
        el.classList.add('reveal-init');
        el.style.transitionDelay = (i % 3) * 60 + 'ms';
        observer.observe(el);
    });
});

// A little notebook mascot that gently roams the page. Purely decorative:
// it ignores pointer events and holds still if the visitor prefers reduced motion.
document.addEventListener('DOMContentLoaded', function () {
    var note = document.createElement('div');
    note.className = 'roaming-notebook';
    note.setAttribute('aria-hidden', 'true');
    note.innerHTML =
        '<svg viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="13" y="8" width="30" height="30" rx="3" fill="#fffdf9" stroke="#e0d6c6"/>' +
        '<rect x="7" y="5" width="31" height="33" rx="4" fill="#7a1c3d"/>' +
        '<rect x="7" y="5" width="6" height="33" rx="3" fill="#5c1530"/>' +
        '<circle cx="10" cy="11" r="1.5" fill="#c9a227"/>' +
        '<circle cx="10" cy="21.5" r="1.5" fill="#c9a227"/>' +
        '<circle cx="10" cy="32" r="1.5" fill="#c9a227"/>' +
        '<rect x="18" y="12" width="15" height="2.6" rx="1.3" fill="#c9a227"/>' +
        '<circle cx="21" cy="26" r="2.4" fill="#fffdf9"/><circle cx="21.8" cy="26.4" r="1.05" fill="#2a2024"/>' +
        '<circle cx="30" cy="26" r="2.4" fill="#fffdf9"/><circle cx="30.8" cy="26.4" r="1.05" fill="#2a2024"/>' +
        '<path d="M23.5 31.3c1.2 1 3.8 1 5 0" stroke="#c9a227" stroke-width="1.4" stroke-linecap="round"/>' +
        '</svg>';
    document.body.appendChild(note);

    var size = 46;
    var rand = function (min, max) { return min + Math.random() * (max - min); };
    var maxX = function () { return Math.max(20, window.innerWidth - size - 16); };
    var maxY = function () { return Math.max(70, window.innerHeight - size - 16); };

    var x = rand(30, maxX()), y = rand(window.innerHeight * 0.55, maxY());
    var tx = x, ty = y;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
        note.style.transform = 'translate(' + maxX() + 'px,' + maxY() + 'px)';
        return;
    }

    var pickTarget = function () { tx = rand(16, maxX()); ty = rand(64, maxY()); };
    pickTarget();

    var speed = 1.0;                 // px per ~16ms
    var last = performance.now();
    var frame = function (now) {
        var dt = Math.min(48, now - last); last = now;
        var dx = tx - x, dy = ty - y;
        var dist = Math.hypot(dx, dy) || 1;
        if (dist < 5) {
            pickTarget();
        } else {
            var step = speed * dt / 16;
            x += (dx / dist) * step;
            y += (dy / dist) * step;
        }
        var bob = Math.sin(now / 520) * 4;
        var rot = Math.max(-10, Math.min(10, (dx / dist) * 12));
        note.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (y + bob).toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    window.addEventListener('resize', function () {
        x = Math.min(x, maxX()); y = Math.min(y, maxY());
        pickTarget();
    });
});
