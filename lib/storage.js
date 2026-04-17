'use strict';
const fs   = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '..', 'data');

const PUBLIC_DIR = fs.existsSync(path.join(__dirname, '..', 'public'))
  ? path.join(__dirname, '..', 'public')
  : path.join(__dirname, '..');

const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const CARS_FILE   = path.join(DATA_DIR, 'cars.json');
const MSGS_FILE   = path.join(DATA_DIR, 'messages.json');

// ── Bootstrap ─────────────────────────────────────────────────
[DATA_DIR, UPLOADS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});
if (!fs.existsSync(CARS_FILE)) fs.writeFileSync(CARS_FILE, '[]', 'utf8');
if (!fs.existsSync(MSGS_FILE)) fs.writeFileSync(MSGS_FILE, '[]', 'utf8');

// ── In-memory cache ────────────────────────────────────────────
// Loaded once at startup. All reads are instant memory lookups.
// Writes update memory immediately, then flush to disk asynchronously
// within 200 ms — batching rapid updates into a single disk write.
function _load(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

const _cache  = { cars: _load(CARS_FILE), msgs: _load(MSGS_FILE) };
const _timers = {};

function _flush(file, key) {
  clearTimeout(_timers[key]);
  _timers[key] = setTimeout(() => {
    const tmp = file + '.tmp';
    try {
      // Write to temp file then rename = atomic, no corrupt data on crash
      fs.writeFileSync(tmp, JSON.stringify(_cache[key]), 'utf8');
      fs.renameSync(tmp, file);
    } catch (e) { console.error('Storage flush error:', e); }
  }, 200);
}

function getCars()    { return _cache.cars; }
function setCars(arr) { _cache.cars = arr; _flush(CARS_FILE, 'cars'); }
function getMsgs()    { return _cache.msgs; }
function setMsgs(arr) { _cache.msgs = arr; _flush(MSGS_FILE, 'msgs'); }

module.exports = { DATA_DIR, PUBLIC_DIR, UPLOADS_DIR, getCars, setCars, getMsgs, setMsgs };
