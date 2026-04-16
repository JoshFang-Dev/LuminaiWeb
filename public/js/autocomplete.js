/* ── Autocomplete Engine ───────────────────────────────────── */

const CAR_DB = {
  'Acura':['ILX','MDX','NSX','RDX','RLX','TLX','Integra','ZDX'],
  'Alfa Romeo':['Giulia','Giulietta','Stelvio','Tonale','4C'],
  'Audi':['A3','A4','A5','A6','A7','A8','Q3','Q5','Q7','Q8','TT','R8','e-tron','RS3','RS4','RS5','RS6','RS7','S3','S4','S5','S6','S7','S8','SQ5','SQ7','SQ8'],
  'BMW':['1 Series','2 Series','3 Series','4 Series','5 Series','6 Series','7 Series','8 Series','X1','X2','X3','X4','X5','X6','X7','iX','i4','i7','Z4','M2','M3','M4','M5','M8','X3 M','X5 M','X6 M'],
  'Buick':['Enclave','Encore','Encore GX','Envision','LaCrosse'],
  'Cadillac':['CT4','CT5','Escalade','Escalade ESV','XT4','XT5','XT6','Lyriq'],
  'Chevrolet':['Blazer','Bolt EV','Bolt EUV','Camaro','Colorado','Corvette','Equinox','Malibu','Silverado 1500','Silverado 2500HD','Silverado 3500HD','Suburban','Tahoe','Traverse','Trax'],
  'Chrysler':['300','Pacifica','Voyager'],
  'Dodge':['Challenger','Charger','Durango','Grand Caravan','Hornet','Journey'],
  'Ferrari':['296','488','812','F8','Roma','Portofino','SF90','Purosangue'],
  'Ford':['Bronco','Bronco Sport','Edge','Escape','Expedition','Explorer','F-150','F-250','F-350','Fusion','Maverick','Mustang','Mustang Mach-E','Ranger','Transit'],
  'Genesis':['G70','G80','G90','GV70','GV80','GV90','Electrified G80','Electrified GV70'],
  'GMC':['Acadia','Canyon','Sierra 1500','Sierra 2500HD','Sierra 3500HD','Terrain','Yukon','Yukon XL'],
  'Honda':['Accord','Civic','CR-V','HR-V','Odyssey','Passport','Pilot','Prologue','Ridgeline'],
  'Hyundai':['Elantra','IONIQ 5','IONIQ 6','Kona','Palisade','Santa Cruz','Santa Fe','Sonata','Tucson','Venue'],
  'Infiniti':['Q50','Q60','QX50','QX55','QX60','QX80'],
  'Jaguar':['E-Pace','F-Pace','F-Type','I-Pace','XE','XF'],
  'Jeep':['Cherokee','Compass','Gladiator','Grand Cherokee','Grand Wagoneer','Renegade','Wrangler'],
  'Kia':['Carnival','EV6','EV9','K5','Niro','Seltos','Sorento','Soul','Sportage','Stinger','Telluride'],
  'Lamborghini':['Huracán','Urus','Revuelto'],
  'Land Rover':['Defender','Discovery','Discovery Sport','Range Rover','Range Rover Evoque','Range Rover Sport','Range Rover Velar'],
  'Lexus':['ES','GS','GX','IS','LC','LS','LX','NX','RC','RX','RX 450h','UX'],
  'Lincoln':['Aviator','Corsair','Navigator','Nautilus'],
  'Maserati':['GranTurismo','Ghibli','Levante','Quattroporte','Grecale'],
  'Mazda':['CX-3','CX-30','CX-5','CX-50','CX-60','CX-90','Mazda3','Mazda6','MX-5 Miata','MX-30'],
  'Mercedes-Benz':['A-Class','C-Class','CLA','CLE','E-Class','EQB','EQC','EQE','EQS','G-Class','GLA','GLB','GLC','GLE','GLS','S-Class','SL','AMG GT','AMG C 63','AMG E 63','AMG G 63','AMG GLE 63','AMG S 63'],
  'MINI':['Clubman','Convertible','Countryman','Hardtop','Paceman'],
  'Mitsubishi':['Eclipse Cross','Outlander','Outlander PHEV','Outlander Sport','RVR'],
  'Nissan':['Altima','Armada','Frontier','Kicks','Leaf','Maxima','Murano','Pathfinder','Rogue','Rogue Sport','Sentra','Titan','Versa','370Z','400Z'],
  'Porsche':['718 Boxster','718 Cayman','911','Cayenne','Macan','Panamera','Taycan'],
  'Ram':['1500','2500','3500','ProMaster'],
  'Rolls-Royce':['Cullinan','Dawn','Ghost','Phantom','Spectre','Wraith'],
  'Subaru':['Ascent','BRZ','Crosstrek','Forester','Impreza','Legacy','Outback','Solterra','WRX'],
  'Tesla':['Cybertruck','Model 3','Model S','Model X','Model Y'],
  'Toyota':['4Runner','bZ4X','Camry','Corolla','Corolla Cross','GR86','GR Corolla','GR Supra','Highlander','Land Cruiser','Prius','RAV4','Sequoia','Sienna','Tacoma','Tundra','Venza'],
  'Volkswagen':['Atlas','Atlas Cross Sport','Golf','Golf GTI','Golf R','ID.4','Jetta','Passat','Taos','Tiguan'],
  'Volvo':['C40','S60','S90','V60','V90','XC40','XC60','XC90'],
};

const ALL_MAKES = Object.keys(CAR_DB).sort();

const COLORS = ['Alpine White','Arctic White','Black Sapphire','Carbon Black','Cashmere Silver','Cognac Brown','Crystal White','Dark Graphite','Deep Blue','Estoril Blue','Glacier Silver','Graphite Grey','Imperial Blue','Jet Black','Lunar Silver','Magnetic Grey','Manhattan Green','Metallic Black','Midnight Blue','Mineral Grey','Moonstone Silver','Nardo Grey','Naval Blue','Navarra Blue','Night Black','Obsidian Black','Oxford White','Pearl White','Phantom Black','Platinum Silver','Portimao Blue','Racing Red','Selenite Grey','Sonic Grey','Space Grey','Titanium Silver','Volcanic Orange','Zinc Grey'];

const TRIMS = {
  'BMW':['M Sport','M Sport Plus','M Sport xDrive','xDrive','sDrive','Base','Luxury','Executive'],
  'Mercedes-Benz':['AMG Line','Premium','Premium Plus','Base','4MATIC','4MATIC+','Exclusive','Avantgarde','Night Edition'],
  'Audi':['Premium','Premium Plus','Prestige','S Line','Base','Technik','Progressiv','Komfort'],
  'Toyota':['LE','XLE','XSE','SE','TRD Off-Road','TRD Pro','Limited','Platinum','Base'],
  'Honda':['LX','EX','EX-L','Sport','Touring','Base','Type R'],
  'Ford':['XL','XLT','Lariat','King Ranch','Platinum','Raptor','Base','Titanium','ST'],
  'Chevrolet':['LS','LT','LTZ','Premier','Z71','SS','Base'],
  'Porsche':['Base','S','GTS','Turbo','Turbo S','4','4S','4 GTS','Platinum Edition'],
  'Lexus':['Base','F Sport','F Sport Series 2','F Sport Series 3','Ultra Luxury','Executive'],
  'default':['Base','Sport','Premium','Luxury','Executive','S','SE','SL','GT','RS','Touring','Edition 1','Black Edition','Night Edition'],
};

/* ── Admin form autocomplete ───────────────────────────────── */
function acShow(id, items, onSelect) {
  const dd = document.getElementById(id);
  if (!items.length) { dd.classList.remove('open'); return; }
  dd.innerHTML = items.slice(0, 12).map(item =>
    `<div class="ac-item" onmousedown="event.preventDefault()" onclick="(${onSelect.toString()})('${escHtml(item)}')">${highlightMatch(item, document.getElementById(id.replace('ac-', 'u-'))?.value || '')}</div>`
  ).join('');
  dd.classList.add('open');
}

function highlightMatch(str, query) {
  if (!query) return escHtml(str);
  const idx = str.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return escHtml(str);
  return escHtml(str.slice(0, idx)) + '<strong>' + escHtml(str.slice(idx, idx + query.length)) + '</strong>' + escHtml(str.slice(idx + query.length));
}

function acHide(id, delay = 0) {
  setTimeout(() => { const dd = document.getElementById(id); if (dd) dd.classList.remove('open'); }, delay);
}

function acMake(input) {
  const v = input.value.trim().toLowerCase();
  acShow('ac-make', v ? ALL_MAKES.filter(m => m.toLowerCase().includes(v)) : ALL_MAKES, val => {
    document.getElementById('u-make').value = val;
    acHide('ac-make');
    document.getElementById('u-model').focus();
    acModel(document.getElementById('u-model'));
  });
}

function acModel(input) {
  const make   = document.getElementById('u-make').value.trim();
  const models = CAR_DB[make] || [];
  const v      = input.value.trim().toLowerCase();
  acShow('ac-model', v ? models.filter(m => m.toLowerCase().includes(v)) : models, val => {
    document.getElementById('u-model').value = val;
    acHide('ac-model');
    document.getElementById('u-year').focus();
  });
}

function acYear(input) {
  const v    = input.value.trim();
  const cur  = new Date().getFullYear();
  const yrs  = Array.from({ length: cur - 1989 }, (_, i) => String(cur - i));
  acShow('ac-year', v ? yrs.filter(y => y.startsWith(v)) : yrs.slice(0, 10), val => {
    document.getElementById('u-year').value = val;
    acHide('ac-year');
    document.getElementById('u-trim').focus();
  });
}

function acTrim(input) {
  const make    = document.getElementById('u-make').value.trim();
  const options = TRIMS[make] || TRIMS['default'];
  const v       = input.value.trim().toLowerCase();
  acShow('ac-trim', v ? options.filter(t => t.toLowerCase().includes(v)) : options, val => {
    document.getElementById('u-trim').value = val;
    acHide('ac-trim');
  });
}

function acColor(input) {
  const v = input.value.trim().toLowerCase();
  acShow('ac-color', v ? COLORS.filter(c => c.toLowerCase().includes(v)) : COLORS, val => {
    document.getElementById('u-color').value = val;
    acHide('ac-color');
  });
}

/* ── Filter search autocomplete ────────────────────────────── */
let _fsIdx = -1;

function fsHide(delay) {
  setTimeout(() => {
    const dd = document.getElementById('fsDropdown');
    if (dd) { dd.classList.remove('open'); _fsIdx = -1; }
  }, delay);
}

function filterSearchAC(input) {
  const q  = input.value.trim().toLowerCase();
  const dd = document.getElementById('fsDropdown');
  const cars = getCars();

  if (!q) { dd.classList.remove('open'); _fsIdx = -1; return; }

  const makes  = [...new Set(cars.map(c => c.make))].sort();
  const models = [...new Set(cars.map(c => c.make + ' ' + c.model))].sort();
  const ymm    = [...new Set(cars.map(c => c.year + ' ' + c.make + ' ' + c.model))].sort((a, b) => b.localeCompare(a));
  const trims  = [...new Set(cars.filter(c => c.trim).map(c => c.make + ' ' + c.model + ' ' + c.trim))].sort();
  const years  = [...new Set(cars.map(c => String(c.year)))].sort((a, b) => b - a);
  const colors = [...new Set(cars.filter(c => c.color).map(c => c.color))].sort();

  const groups = [
    { label: 'Make',    items: makes.filter(x => x.toLowerCase().includes(q)),    icon: '🏷️' },
    { label: 'Model',   items: models.filter(x => x.toLowerCase().includes(q)),   icon: '🚗' },
    { label: 'Year',    items: years.filter(x => x.startsWith(q)),                icon: '📅' },
    { label: 'Vehicle', items: ymm.filter(x => x.toLowerCase().includes(q)),      icon: '🔎' },
    { label: 'Trim',    items: trims.filter(x => x.toLowerCase().includes(q)),    icon: '⚙️' },
    { label: 'Colour',  items: colors.filter(x => x.toLowerCase().includes(q)),   icon: '🎨' },
  ];

  let html = '', total = 0;
  const MAX = 4;

  groups.forEach(g => {
    if (!g.items.length) return;
    html += `<div class="fs-group-label">${g.label}</div>`;
    g.items.slice(0, MAX).forEach(item => {
      const count = cars.filter(c => (c.make + ' ' + c.model + ' ' + c.year + ' ' + (c.trim || '') + ' ' + (c.color || '')).toLowerCase().includes(item.toLowerCase())).length;
      html += `<div class="fs-item" data-val="${escHtml(item)}" onmousedown="event.preventDefault()" onclick="fsSelect('${escHtml(item)}')">
        <span class="fs-item-icon">${g.icon}</span>
        <div class="fs-item-main"><div>${fsHighlight(item, q)}</div><div class="fs-item-sub">${count} vehicle${count !== 1 ? 's' : ''}</div></div>
        <span class="fs-item-badge">${g.label}</span>
      </div>`;
      total++;
    });
    if (g.items.length > MAX) html += `<div class="fs-item" style="color:var(--text3);font-size:12px;padding:7px 14px 7px 38px">+${g.items.length - MAX} more…</div>`;
  });

  if (!total) html = `<div class="fs-item" style="color:var(--text3);pointer-events:none"><span class="fs-item-icon">🔍</span><div class="fs-item-main">No matches in inventory</div></div>`;

  dd.innerHTML = html;
  dd.classList.add('open');
  _fsIdx = -1;
}

function fsHighlight(str, q) {
  if (!q) return escHtml(str);
  const i = str.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return escHtml(str);
  return escHtml(str.slice(0, i)) + '<strong>' + escHtml(str.slice(i, i + q.length)) + '</strong>' + escHtml(str.slice(i + q.length));
}

function fsSelect(val) {
  document.getElementById('searchInput').value = val;
  document.getElementById('fsDropdown').classList.remove('open');
  _fsIdx = -1;
  filterCars();
}

function filterSearchKey(e) {
  const dd    = document.getElementById('fsDropdown');
  const items = dd.querySelectorAll('.fs-item[data-val]');
  if (!items.length) return;
  if (e.key === 'ArrowDown')  { e.preventDefault(); _fsIdx = Math.min(_fsIdx + 1, items.length - 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); _fsIdx = Math.max(_fsIdx - 1, 0); }
  else if (e.key === 'Enter') { e.preventDefault(); _fsIdx >= 0 && items[_fsIdx] ? fsSelect(items[_fsIdx].dataset.val) : (dd.classList.remove('open'), filterCars()); return; }
  else if (e.key === 'Escape') { dd.classList.remove('open'); _fsIdx = -1; return; }
  items.forEach((el, i) => el.classList.toggle('fs-focused', i === _fsIdx));
  if (items[_fsIdx]) items[_fsIdx].scrollIntoView({ block: 'nearest' });
}

/* ── Edit modal autocomplete (mirrors upload form, uses e- prefix) ── */
function acEdit(field, input) {
  const v = input.value.trim().toLowerCase();
  const ddId = 'ace-' + field;

  if (field === 'make') {
    acShowGeneric(ddId, v ? ALL_MAKES.filter(m => m.toLowerCase().includes(v)) : ALL_MAKES, val => {
      document.getElementById('e-make').value = val;
      acHide(ddId);
      acEdit('model', document.getElementById('e-model'));
    }, input);

  } else if (field === 'model') {
    const make = document.getElementById('e-make').value.trim();
    const models = CAR_DB[make] || [];
    acShowGeneric(ddId, v ? models.filter(m => m.toLowerCase().includes(v)) : models, val => {
      document.getElementById('e-model').value = val;
      acHide(ddId);
    }, input);

  } else if (field === 'year') {
    const cur = new Date().getFullYear();
    const yrs = Array.from({ length: cur - 1989 }, (_, i) => String(cur - i));
    acShowGeneric(ddId, v ? yrs.filter(y => y.startsWith(v)) : yrs.slice(0, 10), val => {
      document.getElementById('e-year').value = val;
      acHide(ddId);
    }, input);

  } else if (field === 'trim') {
    const make = document.getElementById('e-make').value.trim();
    const opts = TRIMS[make] || TRIMS['default'];
    acShowGeneric(ddId, v ? opts.filter(t => t.toLowerCase().includes(v)) : opts, val => {
      document.getElementById('e-trim').value = val;
      acHide(ddId);
    }, input);

  } else if (field === 'color') {
    acShowGeneric(ddId, v ? COLORS.filter(c => c.toLowerCase().includes(v)) : COLORS, val => {
      document.getElementById('e-color').value = val;
      acHide(ddId);
    }, input);
  }
}

// Generic version of acShow that doesn't assume id → u- field mapping
function acShowGeneric(id, items, onSelect, inputEl) {
  const dd = document.getElementById(id);
  if (!items.length) { dd.classList.remove('open'); return; }
  const query = inputEl ? inputEl.value : '';
  dd.innerHTML = items.slice(0, 12).map(item =>
    `<div class="ac-item" onmousedown="event.preventDefault()" onclick="(${onSelect.toString()})('${escHtml(item)}')">${highlightMatch(item, query)}</div>`
  ).join('');
  dd.classList.add('open');
}
