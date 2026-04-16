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

async function seedDemoCars() {
  if (_cars.length > 0) return;
  const demo = [
    { make: 'BMW',           model: '3 Series',    trim: 'M Sport xDrive',       year: 2022, price: 52900,  mileage: 28500, color: 'Alpine White',      trans: 'Automatic', fuel: 'Gasoline', drive: 'AWD', status: 'available', images: [], img: '', desc: 'Immaculate condition, one owner, full service history. M Sport package includes 19" alloys, adaptive suspension, and heated seats.' },
    { make: 'Mercedes-Benz', model: 'GLC 300',     trim: '4MATIC AMG Line',      year: 2021, price: 61500,  mileage: 34200, color: 'Selenite Grey',     trans: 'Automatic', fuel: 'Gasoline', drive: 'AWD', status: 'available', images: [], img: '', desc: 'Premium SUV with Burmester sound system, panoramic roof, and full leather. AMG Line exterior and interior.' },
    { make: 'Audi',          model: 'Q5',          trim: 'Technik 45 TFSI',      year: 2023, price: 68800,  mileage: 12000, color: 'Navarra Blue',      trans: 'Automatic', fuel: 'Gasoline', drive: 'AWD', status: 'new',       images: [], img: '', desc: 'Nearly new with balance of factory warranty. Virtual cockpit, Bang & Olufsen audio, Matrix LED headlights.' },
    { make: 'Toyota',        model: 'Land Cruiser', trim: '200 Series GX-R',     year: 2020, price: 89500,  mileage: 45800, color: 'Pearl White',       trans: 'Automatic', fuel: 'Gasoline', drive: '4WD', status: 'available', images: [], img: '', desc: 'The legendary Land Cruiser 200 in excellent shape. Low mileage for year, full service history at Toyota dealer.' },
    { make: 'Porsche',       model: 'Cayenne',     trim: 'S Platinum Edition',   year: 2022, price: 115000, mileage: 19600, color: 'Jet Black Metallic', trans: 'Automatic', fuel: 'Gasoline', drive: 'AWD', status: 'available', images: [], img: '', desc: 'Sport Chrono Package, PASM, PDCC. Bose surround system, heated/ventilated seats, panoramic roof.' },
    { make: 'Tesla',         model: 'Model 3',     trim: 'Long Range AWD',       year: 2022, price: 48500,  mileage: 31200, color: 'Deep Blue Metallic', trans: 'Automatic', fuel: 'Electric', drive: 'AWD', status: 'sold',      images: [], img: '', desc: 'Full self-driving capability, Autopilot, premium interior with white vegan leather. Single owner, no accidents.' },
  ];
  for (const car of demo) {
    try {
      const saved = await apiFetch('POST', '/cars', car);
      _cars.push(saved);
    } catch (e) {
      console.error('Seed error:', e);
    }
  }
}
