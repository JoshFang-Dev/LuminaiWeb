/* ── Image Upload & Drag-to-reorder ────────────────────────── */

let uploadedImages = [];
let _dndSrc = null;

/* ── Dropzone ──────────────────────────────────────────────── */
function dzOver(e)  { e.preventDefault(); document.getElementById('dropzone').classList.add('over'); }
function dzLeave()  { document.getElementById('dropzone').classList.remove('over'); }
function dzDrop(e)  { e.preventDefault(); document.getElementById('dropzone').classList.remove('over'); dzFiles(e.dataTransfer.files); }

function dzFiles(files) {
  [...files].forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => { uploadedImages.push({ dataUrl: ev.target.result, name: file.name }); renderThumbs(); };
    reader.readAsDataURL(file);
  });
}

/* ── Thumbnails + drag-to-reorder ──────────────────────────── */
function removeThumb(idx) { uploadedImages.splice(idx, 1); renderThumbs(); }

function renderThumbs() {
  const grid = document.getElementById('imgThumbGrid');
  if (!uploadedImages.length) { grid.innerHTML = ''; return; }
  grid.innerHTML = uploadedImages.map((img, i) => `
    <div class="img-thumb" draggable="true" id="thumb-${i}" data-idx="${i}"
      ondragstart="thumbDragStart(event,${i})" ondragover="thumbDragOver(event,${i})"
      ondragleave="thumbDragLeave(event,${i})" ondrop="thumbDrop(event,${i})" ondragend="thumbDragEnd()">
      <img src="${img.dataUrl}" alt="${escHtml(img.name)}">
      ${i === 0 ? '<div class="img-thumb-primary">Cover</div>' : `<div class="img-thumb-order">${i + 1}</div>`}
      <div class="img-thumb-drag-hint">⠿</div>
      <button type="button" class="img-thumb-remove" onclick="event.stopPropagation();removeThumb(${i})" title="Remove">✕</button>
    </div>`
  ).join('');
}

function thumbDragStart(e, idx) {
  _dndSrc = idx;
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => { const el = document.getElementById('thumb-' + idx); if (el) el.classList.add('dnd-dragging'); }, 0);
}
function thumbDragOver(e, idx) {
  e.preventDefault(); e.dataTransfer.dropEffect = 'move';
  if (idx === _dndSrc) return;
  document.querySelectorAll('.img-thumb').forEach(el => el.classList.remove('dnd-over'));
  document.getElementById('thumb-' + idx)?.classList.add('dnd-over');
}
function thumbDragLeave(e, idx) { document.getElementById('thumb-' + idx)?.classList.remove('dnd-over'); }
function thumbDrop(e, idx) {
  e.preventDefault();
  if (_dndSrc === null || _dndSrc === idx) return;
  uploadedImages.splice(idx, 0, uploadedImages.splice(_dndSrc, 1)[0]);
  _dndSrc = null;
  renderThumbs();
}
function thumbDragEnd() {
  _dndSrc = null;
  document.querySelectorAll('.img-thumb').forEach(el => el.classList.remove('dnd-dragging', 'dnd-over'));
}

/* ── Upload car ────────────────────────────────────────────── */
async function uploadCar(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  btn.disabled = true; btn.textContent = 'Uploading…';

  try {
    // 1. Upload images → get server URLs
    const imageUrls = [];
    for (const img of uploadedImages) {
      try {
        const res = await apiFetch('POST', '/images', { data: img.dataUrl, name: img.name });
        imageUrls.push(res.url);
      } catch {
        imageUrls.push(img.dataUrl); // base64 fallback
      }
    }

    // 2. POST car
    const car = {
      title:   document.getElementById('u-title').value.trim(),
      make:    document.getElementById('u-make').value.trim(),
      model:   document.getElementById('u-model').value.trim(),
      trim:    document.getElementById('u-trim').value.trim(),
      year:    parseInt(document.getElementById('u-year').value),
      price:   parseInt(document.getElementById('u-price').value),
      mileage: document.getElementById('u-mileage').value ? parseInt(document.getElementById('u-mileage').value) : null,
      color:   document.getElementById('u-color').value.trim(),
      trans:   document.getElementById('u-trans').value,
      fuel:    document.getElementById('u-fuel').value,
      drive:   document.getElementById('u-drive').value,
      status:  document.getElementById('u-status').value,
      body:    document.getElementById('u-body').value,
      badges:  ['b-lowkm','b-bclocal','b-oneowner','b-noacc']
                 .filter(id => document.getElementById(id).checked)
                 .map(id => document.getElementById(id).value),
      images:  imageUrls,
      img:     imageUrls[0] || '',
      desc:    document.getElementById('u-desc').value.trim(),
    };

    const saved = await apiFetch('POST', '/cars', car);
    _cars.unshift(saved);

    const el = document.getElementById('uploadMsg');
    el.className = 'form-msg success';
    el.textContent = `✓ ${saved.year} ${saved.make} ${saved.model} published with ${imageUrls.length} photo${imageUrls.length !== 1 ? 's' : ''}!`;
    e.target.reset();
    // uncheck badges manually (checkboxes inside custom labels don't always reset)
    ['b-lowkm','b-bclocal','b-oneowner','b-noacc'].forEach(id => { document.getElementById(id).checked = false; });
    uploadedImages = [];
    renderThumbs();
    renderAdmin();
    showToast('Vehicle published!');
    setTimeout(() => adminTab('inventory'), 1400);

  } catch (err) {
    const el = document.getElementById('uploadMsg');
    el.className = 'form-msg error';
    el.textContent = 'Error saving vehicle: ' + err.message;
    console.error(err);
  } finally {
    btn.disabled = false; btn.textContent = 'Publish Listing';
  }
}
