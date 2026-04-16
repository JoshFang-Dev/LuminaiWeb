/* ── Admin Dashboard ───────────────────────────────────────── */

function adminTab(tab) {
  ['overview', 'inventory', 'upload', 'messages'].forEach(t => {
    document.getElementById('ap-' + t).style.display = t === tab ? 'block' : 'none';
    document.getElementById('st-' + t).classList.toggle('active', t === tab);
  });
  if (tab === 'overview')  renderOverview();
  if (tab === 'inventory') renderInventoryTable();
  if (tab === 'messages')  renderMessages();
}

function renderAdmin() {
  const now    = new Date();
  const cars   = getCars();
  const msgs   = getMsgs();
  const unread = msgs.filter(m => !m.read).length;

  document.getElementById('adminDate').textContent =
    'Today is ' + now.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const badge = document.getElementById('unreadBadge');
  badge.style.display = unread ? 'inline' : 'none';
  badge.textContent   = unread;

  document.getElementById('sc-listings').textContent   = cars.filter(c => c.status !== 'sold').length;
  document.getElementById('sc-msgs').textContent       = unread;
  document.getElementById('sc-total-msgs').textContent = msgs.length;
  document.getElementById('sc-sold').textContent       = cars.filter(c => c.status === 'sold').length;

  renderOverview();
}

function renderOverview() {
  const el   = document.getElementById('overviewMsgs');
  const msgs = getMsgs().slice(0, 4);
  el.innerHTML = msgs.length
    ? '<div class="msg-list">' + msgs.map(m => msgItemHTML(m)).join('') + '</div>'
    : '<div class="empty-state"><h3>No Messages Yet</h3><p>Customer inquiries will appear here.</p></div>';
}

function renderMessages() {
  const el   = document.getElementById('msgList');
  const msgs = getMsgs();
  el.innerHTML = msgs.length
    ? '<div class="msg-list">' + msgs.map(m => msgItemHTML(m)).join('') + '</div>'
    : '<div class="empty-state"><h3>No Messages Yet</h3><p>Customer inquiries will appear here.</p></div>';
}

function msgItemHTML(m) {
  const ds = new Date(m.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  return `
  <div class="msg-item${m.read ? '' : ' unread'}" onclick="openMsg('${m.id}',this)">
    <div class="msg-meta">
      <span class="msg-name">${escHtml(m.first)} ${escHtml(m.last)}</span>
      <span class="msg-email">${escHtml(m.email)}</span>
      ${m.carLabel && m.carLabel !== 'General Inquiry' ? `<span class="msg-car">${escHtml(m.carLabel)}</span>` : ''}
      <span class="msg-date">${ds}</span>
      ${!m.read ? '<span class="msg-unread-badge">New</span>' : ''}
    </div>
    <div class="msg-preview">${escHtml(m.message.substring(0, 120))}${m.message.length > 120 ? '…' : ''}</div>
    <div class="msg-detail" id="md-${m.id}">
      <div class="msg-detail-header">
        <div style="font-size:12px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">From</div>
        <div style="color:var(--text)">${escHtml(m.first)} ${escHtml(m.last)} — ${escHtml(m.email)}${m.phone ? ' — ' + escHtml(m.phone) : ''}</div>
        ${m.carLabel && m.carLabel !== 'General Inquiry' ? `<div style="margin-top:8px;font-size:13px;color:var(--gold)">Re: ${escHtml(m.carLabel)}</div>` : ''}
      </div>
      <div class="msg-detail-body">${escHtml(m.message)}</div>
      <div style="margin-top:16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <a href="mailto:${escHtml(m.email)}?subject=Re: Luminai Auto Inquiry"
           style="color:var(--gold);font-size:13px;letter-spacing:1px;text-transform:uppercase;border:1px solid var(--border2);padding:8px 18px;display:inline-block;transition:background 0.2s"
           onmouseover="this.style.background='rgba(240,120,0,0.08)'" onmouseout="this.style.background='transparent'">
          ↗ Reply via Email
        </a>
        <button onclick="event.stopPropagation();deleteMessage('${m.id}')"
          style="background:transparent;border:1px solid rgba(192,57,43,0.35);color:var(--red);font-size:12px;letter-spacing:1px;text-transform:uppercase;padding:8px 16px;cursor:pointer;transition:all 0.2s;font-family:inherit"
          onmouseover="this.style.background='rgba(192,57,43,0.06)'" onmouseout="this.style.background='transparent'">
          Delete
        </button>
      </div>
    </div>
  </div>`;
}

async function openMsg(id, el) {
  const detail = el.querySelector('.msg-detail') || document.getElementById('md-' + id);
  if (!detail) return;
  const isOpen = detail.classList.contains('open');
  detail.classList.toggle('open', !isOpen);
  if (!isOpen) {
    const msg = _msgs.find(m => m.id === id);
    if (msg && !msg.read) {
      msg.read = true;
      el.classList.remove('unread');
      el.querySelector('.msg-unread-badge')?.remove();
      updateUnreadBadge();
      try { await apiFetch('PUT', `/messages/${id}`, { read: true }); }
      catch (e) { console.error('Failed to mark read on server', e); }
    }
  }
}

function updateUnreadBadge() {
  const unread = getMsgs().filter(m => !m.read).length;
  const badge  = document.getElementById('unreadBadge');
  badge.style.display = unread ? 'inline' : 'none';
  badge.textContent   = unread;
  const sc = document.getElementById('sc-msgs');
  if (sc) sc.textContent = unread;
}

function renderInventoryTable() {
  const cars = getCars();
  const el   = document.getElementById('inventoryTable');
  document.getElementById('invCount').textContent = cars.length;

  if (!cars.length) {
    el.innerHTML = '<div class="empty-state"><h3>No Vehicles Listed</h3><p>Upload your first vehicle using the Upload Car section.</p></div>';
    return;
  }

  el.innerHTML = `
  <table class="cars-table">
    <thead><tr>
      <th>Image</th><th>Vehicle</th><th>Year</th><th>Body</th><th>Price</th><th>Status</th><th>Badges</th><th>Actions</th>
    </tr></thead>
    <tbody>
      ${cars.map(c => {
        const thumb = c.img || c.images?.[0] || '';
        const statusColor = c.status === 'sold' ? 'var(--text3)' : c.status === 'new' ? 'var(--gold)' : 'var(--green)';
        const displayTitle = c.title || `${c.make} ${c.model}`;
        const badges = c.badges || [];
        return `
        <tr>
          <td>${thumb
            ? `<img class="tbl-img" src="${escHtml(thumb)}" onerror="this.src=''">`
            : `<div style="width:60px;height:40px;background:var(--bg4);display:flex;align-items:center;justify-content:center;color:var(--text3)">🚗</div>`}
          </td>
          <td><strong style="color:var(--text)">${escHtml(displayTitle)}</strong><br><span style="font-size:12px;color:var(--text3)">${escHtml(c.trim||'')}</span></td>
          <td>${c.year}</td>
          <td style="font-size:12px;color:var(--text3)">${escHtml(c.body||'—')}</td>
          <td style="color:var(--gold)">$${Number(c.price).toLocaleString()}</td>
          <td><span style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${statusColor}">${c.status}</span></td>
          <td style="font-size:10px;color:var(--text3)">${badges.length ? badges.join(', ') : '—'}</td>
          <td style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="tbl-action" onclick="openEditModal('${c.id}')" style="border-color:rgba(0,0,0,0.2);color:var(--text2)">Edit</button>
            <button class="tbl-action" onclick="toggleSold('${c.id}')">${c.status === 'sold' ? 'Unmark Sold' : 'Mark Sold'}</button>
            <button class="tbl-action" onclick="deleteCar('${c.id}')" style="border-color:rgba(192,57,43,0.4);color:var(--red)">Delete</button>
          </td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>`;
}

async function toggleSold(id) {
  const car = _cars.find(c => c.id === id);
  if (!car) return;
  car.status = car.status === 'sold' ? 'available' : 'sold';
  try {
    await apiFetch('PUT', `/cars/${id}`, { status: car.status });
    renderInventoryTable();
    renderAdmin();
    showToast('Listing updated.');
  } catch (e) {
    showToast('Error updating listing.');
    console.error(e);
  }
}

async function deleteCar(id) {
  if (!confirm('Delete this listing? This cannot be undone.')) return;
  try {
    await apiFetch('DELETE', `/cars/${id}`);
    _cars = _cars.filter(c => c.id !== id);
    renderInventoryTable();
    renderAdmin();
    showToast('Listing deleted.');
  } catch (e) {
    showToast('Error deleting listing.');
    console.error(e);
  }
}

async function deleteMessage(id) {
  if (!confirm('Delete this message? This cannot be undone.')) return;
  try {
    await apiFetch('DELETE', `/messages/${id}`);
    _msgs = _msgs.filter(m => m.id !== id);
    renderMessages();
    renderOverview();
    updateUnreadBadge();
    showToast('Message deleted.');
  } catch (e) {
    showToast('Error deleting message.');
    console.error(e);
  }
}

/* ── Edit Car Modal ────────────────────────────────────────── */

function openEditModal(id) {
  const car = getCars().find(c => c.id === id);
  if (!car) return;

  // Populate all fields
  document.getElementById('e-id').value      = car.id;
  document.getElementById('e-title').value   = car.title  || '';
  document.getElementById('e-make').value    = car.make   || '';
  document.getElementById('e-model').value   = car.model  || '';
  document.getElementById('e-year').value    = car.year   || '';
  document.getElementById('e-trim').value    = car.trim   || '';
  document.getElementById('e-price').value   = car.price  || '';
  document.getElementById('e-mileage').value = car.mileage || '';
  document.getElementById('e-color').value   = car.color  || '';
  document.getElementById('e-desc').value    = car.desc   || '';

  // Selects — match by value
  setSelect('e-trans',  car.trans  || 'Automatic');
  setSelect('e-fuel',   car.fuel   || 'Gasoline');
  setSelect('e-drive',  car.drive  || 'AWD');
  setSelect('e-status', car.status || 'available');
  setSelect('e-body',   car.body   || '');

  // Badges — tick matching checkboxes
  const badges = car.badges || [];
  document.getElementById('eb-lowkm').checked    = badges.includes('LOW KM');
  document.getElementById('eb-bclocal').checked  = badges.includes('BC LOCAL');
  document.getElementById('eb-oneowner').checked = badges.includes('ONE OWNER');
  document.getElementById('eb-noacc').checked    = badges.includes('NO ACCIDENT');

  // Clear any previous message
  const msg = document.getElementById('editMsg');
  msg.className = 'form-msg'; msg.textContent = '';

  document.getElementById('editModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('open');
  document.body.style.overflow = '';
}

function setSelect(id, value) {
  const sel = document.getElementById(id);
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value === value || sel.options[i].text === value) {
      sel.selectedIndex = i; return;
    }
  }
  sel.selectedIndex = 0;
}

async function saveEdit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  btn.disabled = true; btn.textContent = 'Saving…';

  const id = document.getElementById('e-id').value;
  const updates = {
    title:   document.getElementById('e-title').value.trim(),
    make:    document.getElementById('e-make').value.trim(),
    model:   document.getElementById('e-model').value.trim(),
    trim:    document.getElementById('e-trim').value.trim(),
    year:    parseInt(document.getElementById('e-year').value),
    price:   parseInt(document.getElementById('e-price').value),
    mileage: document.getElementById('e-mileage').value ? parseInt(document.getElementById('e-mileage').value) : null,
    color:   document.getElementById('e-color').value.trim(),
    trans:   document.getElementById('e-trans').value,
    fuel:    document.getElementById('e-fuel').value,
    drive:   document.getElementById('e-drive').value,
    status:  document.getElementById('e-status').value,
    body:    document.getElementById('e-body').value,
    badges:  ['eb-lowkm','eb-bclocal','eb-oneowner','eb-noacc']
               .filter(bid => document.getElementById(bid).checked)
               .map(bid => document.getElementById(bid).value),
    desc:    document.getElementById('e-desc').value.trim(),
  };

  try {
    const saved = await apiFetch('PUT', `/cars/${id}`, updates);
    // Update cache
    const idx = _cars.findIndex(c => c.id === id);
    if (idx >= 0) _cars[idx] = { ..._cars[idx], ...saved };

    closeEditModal();
    renderInventoryTable();
    renderAdmin();
    showToast('Listing updated successfully.');
  } catch (err) {
    const msg = document.getElementById('editMsg');
    msg.className = 'form-msg error';
    msg.textContent = 'Error saving changes: ' + err.message;
    console.error(err);
  } finally {
    btn.disabled = false; btn.textContent = 'Save Changes';
  }
}

// Close edit modal on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) closeEditModal();
  });
});
