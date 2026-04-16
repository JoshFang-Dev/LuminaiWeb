'use strict';
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');
const router  = express.Router();
const { UPLOADS_DIR } = require('../lib/storage');

// POST /api/images — accepts base64 data URL, saves file, returns { url }
router.post('/', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: 'No image data provided' });

    const match = data.match(/^data:([A-Za-z+/\-]+);base64,(.+)$/);
    let ext = 'jpg';
    let b64;

    if (match) {
      const mime = match[1];
      b64 = match[2];
      if      (mime.includes('png'))  ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('gif'))  ext = 'gif';
    } else {
      b64 = data; // raw base64 fallback
    }

    const filename = `${Date.now()}-${crypto.randomBytes(5).toString('hex')}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(b64, 'base64'));
    res.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
