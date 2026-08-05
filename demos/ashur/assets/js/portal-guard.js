// Sends visitors back to the demo login unless the demo"auth" flag is set.
// This is presentation logic only — it does NOT protect any real data (there is
// none here). A real portal would enforce access on the server, not in JS.
(function () {
    var authed;
    try { authed = sessionStorage.getItem('sindbad-demo-auth') === '1'; } catch (e) { authed = false; }
    if (!authed) {
        window.location.replace('login.html');
        return;
    }
    var logout = document.getElementById('logoutLink');
    if (logout) {
        logout.addEventListener('click', function () {
            try { sessionStorage.removeItem('sindbad-demo-auth'); } catch (e) {}
        });
    }
})();
