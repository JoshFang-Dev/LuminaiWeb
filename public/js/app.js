/* ── App Bootstrap ─────────────────────────────────────────── */

(async () => {
  const grid = document.getElementById('carGrid');
  if (grid) grid.innerHTML = '<div class="no-cars" style="grid-column:1/-1"><h3 style="color:var(--text2)">Loading inventory…</h3></div>';

  await loadData();
  handleRoute();
})();
