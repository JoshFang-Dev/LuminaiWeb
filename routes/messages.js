'use strict';
const express = require('express');
const router  = express.Router();
const { MSGS_FILE, readJSON, writeJSON } = require('../lib/storage');

// GET /api/messages
router.get('/', (req, res) => {
  res.json(readJSON(MSGS_FILE));
});

// POST /api/messages
router.post('/', (req, res) => {
  const msgs = readJSON(MSGS_FILE);
  const msg  = { ...req.body, id: 'm' + Date.now(), date: new Date().toISOString(), read: false };
  msgs.unshift(msg);
  writeJSON(MSGS_FILE, msgs);
  res.status(201).json(msg);
});

// PUT /api/messages/:id — mark read, etc.
router.put('/:id', (req, res) => {
  const msgs = readJSON(MSGS_FILE);
  const idx  = msgs.findIndex(m => m.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Message not found' });
  msgs[idx] = { ...msgs[idx], ...req.body };
  writeJSON(MSGS_FILE, msgs);
  res.json(msgs[idx]);
});

// DELETE /api/messages/:id
router.delete('/:id', (req, res) => {
  const msgs = readJSON(MSGS_FILE).filter(m => m.id !== req.params.id);
  writeJSON(MSGS_FILE, msgs);
  res.json({ ok: true });
});

module.exports = router;
