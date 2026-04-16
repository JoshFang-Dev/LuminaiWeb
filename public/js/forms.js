/* ── Public Forms ──────────────────────────────────────────── */

function populateCarSelect() {
  const sel = document.getElementById('cCar');
  sel.innerHTML = '<option value="">General Inquiry</option>' +
    getCars()
      .filter(c => c.status !== 'sold')
      .map(c => `<option value="${c.id}">${c.year} ${c.make} ${c.model}</option>`)
      .join('');
}

async function submitContact(e) {
  e.preventDefault();
  const carId = document.getElementById('cCar').value;
  const car   = getCars().find(c => c.id === carId);
  const msg   = {
    first:    document.getElementById('cFirstName').value,
    last:     document.getElementById('cLastName').value,
    email:    document.getElementById('cEmail').value,
    phone:    document.getElementById('cPhone').value,
    carId,
    carLabel: car ? `${car.year} ${car.make} ${car.model}` : 'General Inquiry',
    message:  document.getElementById('cMessage').value,
  };
  try {
    const saved = await apiFetch('POST', '/messages', msg);
    _msgs.unshift(saved);
    const el = document.getElementById('contactMsg');
    el.className = 'form-msg success';
    el.textContent = "✓ Message sent! We'll get back to you within one business day.";
    e.target.reset();
    showToast('Message sent successfully!');
  } catch {
    const el = document.getElementById('contactMsg');
    el.className = 'form-msg error';
    el.textContent = 'Error sending message. Please try again.';
  }
}

function submitFinancing(e) {
  e.preventDefault();
  const el = document.getElementById('financeMsg');
  el.className = 'form-msg success';
  el.textContent = '✓ Application submitted! Our finance team will contact you within 24 hours.';
  e.target.reset();
  showToast('Application submitted!');
}
