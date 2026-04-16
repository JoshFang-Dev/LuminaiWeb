/* ── Navigation ────────────────────────────────────────────── */

let currentPage = 'home';

function showPage(p) {
  if (p === 'admin' && !isLoggedIn()) { showPage('login'); return; }

  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');
  currentPage = p;
  window.scrollTo(0, 0);

  // Nav link highlight
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navMap = { home: 'nav-home', about: 'nav-about', financing: 'nav-financing', contact: 'nav-contact' };
  if (navMap[p]) document.getElementById(navMap[p]).classList.add('active');

  // Update hash (keeps login/admin URL hidden from public nav)
  if (p === 'admin')  history.replaceState(null, '', '#/admin');
  else if (p === 'login') history.replaceState(null, '', '#/login');
  else                history.replaceState(null, '', '#');

  // Page-specific init
  if (p === 'home')    renderCars();
  if (p === 'admin')   renderAdmin();
  if (p === 'contact') populateCarSelect();
}

function toggleMobile() {
  const m = document.getElementById('mobileMenu');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

function handleRoute() {
  const hash = window.location.hash;
  if (hash === '#/login')       showPage('login');
  else if (hash === '#/admin')  isLoggedIn() ? showPage('admin') : showPage('login');
  else                          showPage('home');
}

window.addEventListener('hashchange', handleRoute);
