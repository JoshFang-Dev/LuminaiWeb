/* ── Inventory & Filter ────────────────────────────────────── */

const SVG_MILEAGE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l3 3"/><path d="M22 2 16 8"/></svg>`;
const SVG_TRANS   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`;
const SVG_DRIVE   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/></svg>`;

// Filter state
let fMakes = new Set(), fYears = new Set(), fStatus = '', fBody = '', fPriceMin = '', fPriceMax = '';

/* ── Sidebar accordion ─────────────────────────────────────── */
function toggleSection(id) {
  document.getElementById(id).classList.toggle('open');
}

function toggleMobileFilter() {
  const sb   = document.getElementById('filterSidebar');
  const open = sb.classList.toggle('mobile-open');
  document.getElementById('mobileFilterChevron').textContent = open ? '▲' : '▼';
  sb.style.display = open ? 'block' : '';
}

/* ── Pill setters ──────────────────────────────────────────── */
function setStatus(btn, val) {
  fStatus = val;
  document.querySelectorAll('#statusPills .filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterCars();
}

function setBody(btn, val) {
  fBody = val;
  document.querySelectorAll('#bodyPills .filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterCars();
}

function setPricePreset(btn, mn, mx) {
  fPriceMin = mn; fPriceMax = mx;
  document.querySelectorAll('#pricePills .filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('priceMin').value = mn || '';
  document.getElementById('priceMax').value = (mx && mx < 999999) ? mx : '';
  filterCars();
}

function toggleMakePill(btn, make) {
  btn.classList.toggle('active');
  btn.classList.contains('active') ? fMakes.add(make) : fMakes.delete(make);
  filterCars();
}

function toggleYearPill(btn, year) {
  btn.classList.toggle('active');
  btn.classList.contains('active') ? fYears.add(year) : fYears.delete(year);
  filterCars();
}

function clearAllFilters() {
  fMakes = new Set(); fYears = new Set(); fStatus = ''; fBody = ''; fPriceMin = ''; fPriceMax = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('priceMin').value    = '';
  document.getElementById('priceMax').value    = '';
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  document.querySelector('#statusPills .filter-pill[data-status=""]').classList.add('active');
  document.querySelector('#bodyPills   .filter-pill[data-body=""]').classList.add('active');
  document.querySelector('#pricePills  .filter-pill[data-price=""]').classList.add('active');
  filterCars();
}

/* ── Core filter + sort ────────────────────────────────────── */
function filterCars() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const mn = document.getElementById('priceMin').value ? Number(document.getElementById('priceMin').value) : null;
  const mx = document.getElementById('priceMax').value ? Number(document.getElementById('priceMax').value) : null;

  let cars = getCars();
  if (fStatus)     cars = cars.filter(c => c.status === fStatus);
  if (fMakes.size) cars = cars.filter(c => fMakes.has(c.make));
  if (fYears.size) cars = cars.filter(c => fYears.has(String(c.year)));
  if (fBody)       cars = cars.filter(c => (c.body || '').toLowerCase() === fBody.toLowerCase());
  if (mn !== null) cars = cars.filter(c => c.price >= mn);
  if (mx !== null && mx < 999999) cars = cars.filter(c => c.price <= mx);
  if (search)      cars = cars.filter(c => (c.make + ' ' + c.model + ' ' + c.year + ' ' + (c.trim || '')).toLowerCase().includes(search));

  const sort = document.getElementById('sortSelect')?.value || 'default';
  if (sort === 'price-asc')  cars.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') cars.sort((a, b) => b.price - a.price);
  if (sort === 'year-desc')  cars.sort((a, b) => b.year  - a.year);
  if (sort === 'year-asc')   cars.sort((a, b) => a.year  - b.year);

  const rc = document.getElementById('resultsCount');
  if (rc) rc.innerHTML = `<span>${cars.length}</span> vehicle${cars.length !== 1 ? 's' : ''}`;

  renderActiveFilters();
  renderCarGrid(cars);
}

/* ── Active filter tags ────────────────────────────────────── */
function renderActiveFilters() {
  const el = document.getElementById('activeFilters');
  if (!el) return;

  const tags = [];
  fMakes.forEach(m => tags.push({ label: 'Make: ' + m, remove: () => { fMakes.delete(m); document.querySelectorAll('#makePills .filter-pill').forEach(b => { if (b.dataset.make === m) b.classList.remove('active'); }); filterCars(); } }));
  fYears.forEach(y => tags.push({ label: 'Year: ' + y, remove: () => { fYears.delete(y); document.querySelectorAll('#yearPills .filter-pill').forEach(b => { if (b.dataset.year === y) b.classList.remove('active'); }); filterCars(); } }));
  if (fStatus) tags.push({ label: 'Status: ' + fStatus, remove: () => { fStatus = ''; document.querySelector('#statusPills .filter-pill[data-status=""]').classList.add('active'); document.querySelectorAll('#statusPills .filter-pill:not([data-status=""])').forEach(b => b.classList.remove('active')); filterCars(); } });
  if (fBody)   tags.push({ label: 'Type: '   + fBody,   remove: () => { fBody   = ''; document.querySelector('#bodyPills .filter-pill[data-body=""]').classList.add('active');   document.querySelectorAll('#bodyPills .filter-pill:not([data-body=""])').forEach(b => b.classList.remove('active'));   filterCars(); } });
  const search = document.getElementById('searchInput').value.trim();
  if (search)  tags.push({ label: 'Search: ' + search,  remove: () => { document.getElementById('searchInput').value = ''; filterCars(); } });

  if (!tags.length) { el.style.display = 'none'; el.innerHTML = ''; return; }
  el.style.display = 'flex';
  el.innerHTML = tags.map((t, i) => `<span class="active-tag">${escHtml(t.label)}<button onclick="activeTagRemove(${i})" title="Remove">✕</button></span>`).join('');
  el._removeHandlers = tags.map(t => t.remove);
}

function activeTagRemove(i) {
  const el = document.getElementById('activeFilters');
  if (el?._removeHandlers?.[i]) el._removeHandlers[i]();
}

/* ── Render sidebar pills + grid ───────────────────────────── */
function renderCars() {
  const cars = getCars();

  const makes = [...new Set(cars.map(c => c.make))].sort();
  document.getElementById('makePills').innerHTML = makes.map(m =>
    `<button class="filter-pill${fMakes.has(m) ? ' active' : ''}" data-make="${escHtml(m)}" onclick="toggleMakePill(this,'${escHtml(m)}')">${escHtml(m)}</button>`
  ).join('');

  const years = [...new Set(cars.map(c => String(c.year)))].sort((a, b) => b - a);
  document.getElementById('yearPills').innerHTML = years.map(y =>
    `<button class="filter-pill${fYears.has(y) ? ' active' : ''}" data-year="${y}" onclick="toggleYearPill(this,'${y}')">${y}</button>`
  ).join('');

  filterCars();
}

function renderCarGrid(cars) {
  const grid = document.getElementById('carGrid');
  if (!cars.length) {
    grid.innerHTML = '<div class="no-cars" style="grid-column:1/-1"><h3>No vehicles found</h3><p>Try adjusting your filters.</p></div>';
    return;
  }

  grid.innerHTML = cars.map(car => {
    const coverImg   = car.images?.length ? car.images[0] : car.img;
    const mileageVal = car.mileage ? Number(car.mileage).toLocaleString() + ' km' : '—';
    const transVal   = car.trans   ? car.trans.charAt(0).toUpperCase() + car.trans.slice(1) : '—';
    const driveVal   = car.drive   || '—';
    const title      = car.title   || `${car.year} ${car.make} ${car.model}`;
    const isSold     = car.status === 'sold';
    const badges     = car.badges  || [];
    const bodyStyle  = car.body    || '';

    return `
    <div class="car-card" onclick="openModal('${car.id}')">
      <div style="position:relative">
        ${coverImg
          ? `<div class="car-card-img"><img src="${escHtml(coverImg)}" alt="${escHtml(title)}" onerror="this.parentElement.innerHTML='<div style=width:100%;aspect-ratio:16/10;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:36px;color:var(--text3)>🚗</div>'" loading="lazy"></div>`
          : `<div class="car-placeholder"><span>🚗</span></div>`}
        ${car.status === 'new' ? '<span class="car-badge">New Arrival</span>' : ''}
        ${isSold              ? '<span class="car-badge-sold">Sold</span>'    : ''}
      </div>
      <div class="car-info">
        ${bodyStyle ? `<span class="car-body-pill">${escHtml(bodyStyle)}</span>` : ''}
        <div class="car-name">${escHtml(title)}</div>
        <div class="car-trim-line">${escHtml(car.trim || '')}</div>
        ${badges.length ? `<div class="car-highlights">${badges.map(b => `<span class="car-highlight-tag">${escHtml(b)}</span>`).join('')}</div>` : ''}
        <div class="car-quick-specs">
          <div class="car-qs-item"><span class="car-qs-icon" style="color:var(--text3)">${SVG_MILEAGE}</span><span class="car-qs-label">Mileage</span><span class="car-qs-value">${mileageVal}</span></div>
          <div class="car-qs-item"><span class="car-qs-icon" style="color:var(--text3)">${SVG_TRANS}</span><span class="car-qs-label">Trans</span><span class="car-qs-value">${escHtml(transVal)}</span></div>
          <div class="car-qs-item"><span class="car-qs-icon" style="color:var(--text3)">${SVG_DRIVE}</span><span class="car-qs-label">Drive</span><span class="car-qs-value">${escHtml(driveVal)}</span></div>
        </div>
        <div class="car-bottom">
          ${isSold ? '<span class="car-price-sold">Sold</span>' : `<span class="car-price">$${Number(car.price).toLocaleString()}</span>`}
          <span class="car-cta">View Details →</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ── Modal ─────────────────────────────────────────────────── */
let _modalIdx = 0;

function openModal(id) {
  const car = getCars().find(c => c.id === id);
  if (!car) return;

  const imgs = car.images?.length ? car.images : (car.img ? [car.img] : []);
  window._modalImgs = imgs;
  window._modalIdx  = 0;
  _modalIdx = 0;

  const galleryHtml = imgs.length
    ? `<div style="position:relative;width:100%;aspect-ratio:16/9;background:var(--bg3);overflow:hidden" id="modalGallery">
        <img id="modalGalleryImg" src="${escHtml(imgs[0])}" style="width:100%;height:100%;object-fit:cover;display:block"
          onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:60px>🚗</div>'">
        ${imgs.length > 1 ? `
          <button onclick="galleryNav(-1)" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.5);color:#fff;border:none;width:36px;height:36px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center">‹</button>
          <button onclick="galleryNav(1)"  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.5);color:#fff;border:none;width:36px;height:36px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center">›</button>
          <div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:6px" id="galDots">
            ${imgs.map((_, i) => `<div onclick="galleryGo(${i})" style="width:8px;height:8px;border-radius:50%;background:${i === 0 ? '#fff' : 'rgba(255,255,255,0.45)'};cursor:pointer;transition:background 0.2s" id="gdot-${i}"></div>`).join('')}
          </div>` : ''}
      </div>
      ${imgs.length > 1 ? `<div style="display:flex;gap:6px;padding:10px 0 0;overflow-x:auto" id="modalThumbs">
        ${imgs.map((src, i) => `<img src="${escHtml(src)}" onclick="galleryGo(${i})" style="width:72px;height:50px;object-fit:cover;cursor:pointer;border:2px solid ${i === 0 ? 'var(--gold)' : 'transparent'};flex-shrink:0;transition:border-color 0.2s" id="gthumb-${i}">`).join('')}
      </div>` : ''}`
    : `<div style="width:100%;aspect-ratio:16/9;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:60px">🚗</div>`;

  const displayTitle = car.title || `${car.year} ${car.make} ${car.model}`;
  const badges       = car.badges || [];
  const bodyStyle    = car.body   || '';

  const detailRows = [
    ['Transmission', car.trans     || '—'],
    ['Drive Type',   car.drive     || '—'],
    ['Fuel Type',    car.fuel      || '—'],
    ['Colour',       car.color     || '—'],
    ['Body Style',   bodyStyle     || '—'],
    ['Status',       car.status.charAt(0).toUpperCase() + car.status.slice(1)],
    ['Photos',       String(imgs.length)],
  ].map(([label, val]) =>
    `<div class="modal-detail-row"><span class="modal-detail-label">${label}</span><span class="modal-detail-value">${escHtml(val)}</span></div>`
  ).join('');

  document.getElementById('modalContent').innerHTML = `
    ${galleryHtml}
    <div class="modal-body">
      <div class="modal-make">${escHtml(car.make)}</div>
      <div class="modal-title">${escHtml(displayTitle)}</div>
      ${car.trim ? `<div class="modal-subtitle">${escHtml(car.trim)}</div>` : '<div style="margin-bottom:8px"></div>'}
      ${badges.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">${badges.map(b=>`<span style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border:1.5px solid var(--gold);color:var(--gold);border-radius:2px">${escHtml(b)}</span>`).join('')}</div>` : ''}
      <div class="modal-quick-specs">
        <div class="modal-qs-item"><span class="modal-qs-icon">${SVG_MILEAGE}</span><span class="modal-qs-label">Mileage</span><span class="modal-qs-value">${car.mileage ? Number(car.mileage).toLocaleString() + ' km' : '—'}</span></div>
        <div class="modal-qs-item"><span class="modal-qs-icon">${SVG_TRANS}</span><span class="modal-qs-label">Trans</span><span class="modal-qs-value">${escHtml(car.trans || '—')}</span></div>
        <div class="modal-qs-item"><span class="modal-qs-icon">${SVG_DRIVE}</span><span class="modal-qs-label">Drive</span><span class="modal-qs-value">${escHtml(car.drive || '—')}</span></div>
      </div>
      <div class="modal-details-grid">${detailRows}</div>
      ${car.desc ? `<div class="modal-desc-head">Description</div><div class="modal-desc">${escHtml(car.desc)}</div>` : ''}
      <div class="modal-footer">
        ${car.status === 'sold'
          ? '<span style="font-size:16px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);font-weight:600">Sold</span>'
          : `<div class="modal-price">$${Number(car.price).toLocaleString()}<span>CAD</span></div>`}
        ${car.status !== 'sold' ? `<button class="btn-primary" onclick="inquireAboutCar('${car.id}')">Inquire Now</button>` : ''}
      </div>
    </div>`;

  document.getElementById('carModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function galleryNav(dir) {
  const imgs = window._modalImgs || [];
  _modalIdx = ((window._modalIdx || 0) + dir + imgs.length) % imgs.length;
  window._modalIdx = _modalIdx;
  galleryGo(_modalIdx);
}

function galleryGo(i) {
  const imgs = window._modalImgs || [];
  window._modalIdx = i; _modalIdx = i;
  const el = document.getElementById('modalGalleryImg');
  if (el) el.src = imgs[i];
  imgs.forEach((_, j) => {
    const d = document.getElementById('gdot-'   + j); if (d) d.style.background   = j === i ? '#fff' : 'rgba(255,255,255,0.45)';
    const t = document.getElementById('gthumb-' + j); if (t) t.style.borderColor = j === i ? 'var(--gold)' : 'transparent';
  });
}

function closeModal() {
  document.getElementById('carModal').classList.remove('open');
  document.body.style.overflow = '';
}

function inquireAboutCar(id) {
  const car = getCars().find(c => c.id === id);
  closeModal();
  showPage('contact');
  setTimeout(() => {
    const sel = document.getElementById('cCar');
    if (car) for (let i = 0; i < sel.options.length; i++) if (sel.options[i].value === id) { sel.selectedIndex = i; break; }
  }, 100);
}

// Scripts are at the bottom of <body> so the DOM is ready when this runs
document.getElementById('carModal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });
