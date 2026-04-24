/* ── API / Data Layer ──────────────────────────────────────── */

const AUTH_KEY    = 'luminaiauto_auth';
const ADMIN_CREDS = { username: 'admin', password: 'luminaiauto2024' };
const API_BASE    = '/api';

// In-memory cache — populated on boot by loadData()
let _cars = [];
let _msgs = [];

function getCars()     { return _cars; }
function getMsgs()     { return _msgs; }
function isLoggedIn()  { return localStorage.getItem(AUTH_KEY) === '1'; }

async function apiFetch(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const r = await fetch(API_BASE + path, opts);
  if (!r.ok) { const t = await r.text(); throw new Error(t || r.statusText); }
  return r.json();
}

async function loadData() {
  try {
    const [cars, msgs] = await Promise.all([
      apiFetch('GET', '/cars'),
      apiFetch('GET', '/messages'),
    ]);
    _cars = cars;
    _msgs = msgs;
  } catch (e) {
    console.warn('Could not reach server — showing empty inventory.', e);
    _cars = [];
    _msgs = [];
  }
}
