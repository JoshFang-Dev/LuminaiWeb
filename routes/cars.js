'use strict';
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const router  = express.Router();
const { getCars, setCars, UPLOADS_DIR } = require('../lib/storage');

// GET /api/cars — served from memory, zero disk I/O
router.get('/', (req, res) => {
  res.json(getCars());
});

// POST /api/cars
router.post('/', (req, res) => {
  const car  = { ...req.body, id: 'c' + Date.now(), createdAt: new Date().toISOString() };
  const cars = [car, ...getCars()];
  setCars(cars);
  res.status(201).json(car);
});

// PUT /api/cars/:id
router.put('/:id', (req, res) => {
  const cars = getCars();
  const idx  = cars.findIndex(c => c.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Car not found' });
  cars[idx] = { ...cars[idx], ...req.body, id: req.params.id };
  setCars([...cars]);
  res.json(cars[idx]);
});

// DELETE /api/cars/:id
router.delete('/:id', (req, res) => {
  const cars  = getCars();
  const car   = cars.find(c => c.id === req.params.id);
  if (!car)   return res.status(404).json({ error: 'Car not found' });
  setCars(cars.filter(c => c.id !== req.params.id));

  // Delete image files (non-blocking)
  const imgs = car.images?.length ? car.images : (car.img ? [car.img] : []);
  setImmediate(() => {
    imgs.forEach(url => {
      if (!url?.startsWith('/uploads/')) return;
      const fp = path.join(UPLOADS_DIR, path.basename(url));
      try { if (fs.existsSync(fp)) fs.unlinkSync(fp); } catch {}
    });
  });

  res.json({ ok: true });
});

module.exports = router;
