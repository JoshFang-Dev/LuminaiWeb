'use strict';
const express = require('express');
const path    = require('path');
const { PUBLIC_DIR, UPLOADS_DIR } = require('./lib/storage');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────
app.use(require('cors')());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));

// Redirect bare domain to www with HTTPS
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (!host.startsWith('www.')) {
    return res.redirect(301, 'https://www.' + host + req.url);
  }
  next();
});

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/cars',     require('./routes/cars'));
app.use('/api/images',   require('./routes/images'));
app.use('/api/messages', require('./routes/messages'));
app.get('/health', (_, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// ── SPA fallback ───────────────────────────────────────────────
app.get('*', (_, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n──────────────────────────────────────────');
  console.log(` 🚗  Luminai Auto  →  http://localhost:${PORT}`);
  console.log(` 🔐  Admin panel  →  http://localhost:${PORT}/#/login`);
  console.log('──────────────────────────────────────────\n');
});
