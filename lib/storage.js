'use strict';
const fs   = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '..', 'data');

const PUBLIC_DIR = fs.existsSync(path.join(__dirname, '..', 'public'))
  ? path.join(__dirname, '..', 'public')
  : path.join(__dirname, '..');

const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const CARS_FILE   = path.join(DATA_DIR, 'cars.json');
const MSGS_FILE   = path.join(DATA_DIR, 'messages.json');

// Ensure dirs + files exist on first boot
[DATA_DIR, UPLOADS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});
if (!fs.existsSync(CARS_FILE)) fs.writeFileSync(CARS_FILE, '[]', 'utf8');
if (!fs.existsSync(MSGS_FILE)) fs.writeFileSync(MSGS_FILE, '[]', 'utf8');

function readJSON(file) {
  try   { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { DATA_DIR, PUBLIC_DIR, UPLOADS_DIR, CARS_FILE, MSGS_FILE, readJSON, writeJSON };
