'use strict';
const express = require('express');
const path    = require('path');
const { PUBLIC_DIR, UPLOADS_DIR } = require('./lib/storage');

const app  = express();
const PORT = process.env.PORT || 3000;
const PROD = process.env.NODE_ENV === 'production';

// ── Middleware ─────────────────────────────────────────────────
app.use(require('cors')());

// Limit JSON body to 20 MB (base64 images); reject oversized requests early
app.use(express.json({ limit: '20mb' }));

// Serve static files with aggressive caching for assets
app.use(express.static(PUBLIC_DIR, {
  maxAge: PROD ? '1d' : 0,       // cache CSS/JS for 1 day in production
  etag:   true,
  lastModified: true,
}));

// Serve uploads with long cache (filenames are content-hashed so safe)
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: PROD ? '30d' : 0,
  immutable: PROD,
}));

// ── Redirect bare domain → www (handles root domain without GoDaddy forwarding)
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (PROD && !host.startsWith('www.') && !host.includes('localhost') && !host.includes('railway')) {
    return res.redirect(301, `https://www.${host}${req.url}`);
  }
  next();
});

// ── API routes ─────────────────────────────────────────────────
app.use('/api/cars',     require('./routes/cars'));
app.use('/api/images',   require('./routes/images'));
app.use('/api/messages', require('./routes/messages'));
app.get('/health', (_, res) => res.json({ status: 'ok', uptime: Math.round(process.uptime()) }));

// ── SPA fallback ───────────────────────────────────────────────
app.get('*', (_, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚗  Luminai Auto → http://localhost:${PORT}`);
  console.log(`🔐  Admin       → http://localhost:${PORT}/#/login\n`);
});
