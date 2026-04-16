'use strict';
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const router  = express.Router();
const { CARS_FILE, UPLOADS_DIR, readJSON, writeJSON } = require('../lib/storage');

// GET /api/cars
router.get('/', (req, res) => {
  res.json(readJSON(CARS_FILE));
});

// POST /api/cars
router.post('/', (req, res) => {
  const cars = readJSON(CARS_FILE);
  const car  = { ...req.body, id: 'c' + Date.now(), createdAt: new Date().toISOString() };
  cars.unshift(car);
  writeJSON(CARS_FILE, cars);
  res.status(201).json(car);
});

// PUT /api/cars/:id
router.put('/:id', (req, res) => {
  const cars = readJSON(CARS_FILE);
  const idx  = cars.findIndex(c => c.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Car not found' });
  cars[idx] = { ...cars[idx], ...req.body, id: req.params.id };
  writeJSON(CARS_FILE, cars);
  res.json(cars[idx]);
});

// DELETE /api/cars/:id
router.delete('/:id', (req, res) => {
  const cars    = readJSON(CARS_FILE);
  const car     = cars.find(c => c.id === req.params.id);
  const updated = cars.filter(c => c.id !== req.params.id);
  if (updated.length === cars.length) return res.status(404).json({ error: 'Car not found' });
  writeJSON(CARS_FILE, updated);

  // Clean up image files from persistent storage
  if (car) {
    const imgs = car.images?.length ? car.images : (car.img ? [car.img] : []);
    imgs.forEach(url => {
      if (!url?.startsWith('/uploads/')) return;
      const fp = path.join(UPLOADS_DIR, path.basename(url));
      if (fs.existsSync(fp)) try { fs.unlinkSync(fp); } catch {}
    });
  }
  res.json({ ok: true });
});

module.exports = router;
