'use strict';
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');
const router  = express.Router();
const { UPLOADS_DIR } = require('../lib/storage');

const MIME_EXT = { png: 'png', webp: 'webp', gif: 'gif', jpeg: 'jpg', jpg: 'jpg' };
const MAX_B64_BYTES = 8 * 1024 * 1024; // 8 MB per image

// POST /api/images
router.post('/', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: 'No image data' });

    const match = data.match(/^data:image\/([a-z]+);base64,(.+)$/);
    if (!match)  return res.status(400).json({ error: 'Invalid image format' });

    const [, type, b64] = match;
    if (b64.length > MAX_B64_BYTES * 1.37) // base64 is ~37% larger than binary
      return res.status(413).json({ error: 'Image too large (max 8 MB)' });

    const ext      = MIME_EXT[type] || 'jpg';
    const filename = `${Date.now()}-${crypto.randomBytes(5).toString('hex')}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(b64, 'base64'));
    res.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
