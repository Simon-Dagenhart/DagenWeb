// DEMO login only — NOT real authentication.
// This is a front-end mock for a pitch/preview. It checks one hardcoded sample
// account entirely in the browser and sets a sessionStorage flag so portal.html
// can show the mock dashboard. A real student portal must authenticate on a
// server against a secure, hashed-password database — never in client-side JS.
(function () {
    var form = document.getElementById('loginForm');
    if (!form) return;

    var DEMO_ID = '20250001';
    var DEMO_PASSWORD = 'demo1234';

    var errorEl = document.getElementById('loginError');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var id = document.getElementById('studentId').value.trim();
        var pw = document.getElementById('password').value;

        if (id === DEMO_ID && pw === DEMO_PASSWORD) {
            try { sessionStorage.setItem('sindbad-demo-auth', '1'); } catch (err) {}
            window.location.href = 'portal.html';
        } else {
            if (errorEl) {
                errorEl.hidden = false;
                // Keep whichever language is currently active.
                var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
                if (lang === 'ar' && errorEl.dataset.ar) errorEl.textContent = errorEl.dataset.ar;
            }
        }
    });
})();
