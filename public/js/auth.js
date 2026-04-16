/* ── Auth ──────────────────────────────────────────────────── */

function doLogin(e) {
  e.preventDefault();
  const u   = document.getElementById('loginUser').value.trim();
  const p   = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  if (u === ADMIN_CREDS.username && p === ADMIN_CREDS.password) {
    localStorage.setItem(AUTH_KEY, '1');
    err.style.display = 'none';
    showPage('admin');
  } else {
    err.style.display = 'block';
  }
}

function doLogout() {
  localStorage.removeItem(AUTH_KEY);
  history.replaceState(null, '', '#');
  showPage('home');
  showToast('Signed out successfully.');
}
