'use strict';
const express = require('express');
const router  = express.Router();
const { getMsgs, setMsgs } = require('../lib/storage');

// GET /api/messages
router.get('/', (req, res) => {
  res.json(getMsgs());
});

// POST /api/messages
router.post('/', (req, res) => {
  const msg  = { ...req.body, id: 'm' + Date.now(), date: new Date().toISOString(), read: false };
  const msgs = [msg, ...getMsgs()];
  setMsgs(msgs);
  res.status(201).json(msg);
});

// PUT /api/messages/:id
router.put('/:id', (req, res) => {
  const msgs = getMsgs();
  const idx  = msgs.findIndex(m => m.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Message not found' });
  msgs[idx] = { ...msgs[idx], ...req.body };
  setMsgs([...msgs]);
  res.json(msgs[idx]);
});

// DELETE /api/messages/:id
router.delete('/:id', (req, res) => {
  const msgs = getMsgs();
  if (!msgs.find(m => m.id === req.params.id))
    return res.status(404).json({ error: 'Message not found' });
  setMsgs(msgs.filter(m => m.id !== req.params.id));
  res.json({ ok: true });
});

module.exports = router;
