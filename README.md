# Luminai Auto Group

Premium pre-owned car dealership website with a hidden admin panel.

---

## Quick Start

```bash
npm install
node server.js
# → http://localhost:3000
# → http://localhost:3000/#/login  (admin, hidden from public)
```

Default credentials: `admin` / `luminaiauto2024`

---

## Project Structure

```
luminai-auto/
│
├── server.js              Entry point — mounts routes, serves static files
├── package.json
│
├── lib/
│   └── storage.js         File paths, readJSON / writeJSON helpers
│
├── routes/
│   ├── cars.js            GET / POST / PUT / DELETE  /api/cars
│   ├── images.js          POST /api/images (base64 → file on disk)
│   └── messages.js        GET / POST / PUT / DELETE  /api/messages
│
└── public/                Served statically
    ├── index.html         HTML structure only — no inline CSS or JS
    ├── css/
    │   └── styles.css     All styles (variables, layout, components)
    └── js/                One concern per file, loaded in order
        ├── utils.js         escHtml, showToast
        ├── api.js           Data cache (_cars/_msgs), apiFetch, loadData, seed
        ├── nav.js           showPage, route handling, mobile menu
        ├── inventory.js     Filters, car grid, modal, image gallery
        ├── autocomplete.js  Admin form AC (make/model/year/trim/colour) + filter search AC
        ├── upload.js        Dropzone, drag-to-reorder thumbnails, uploadCar
        ├── forms.js         Contact form, financing form
        ├── auth.js          Login, logout
        ├── admin.js         Dashboard, messages panel, inventory table
        └── app.js           Boot sequence (loads data, seeds demo cars, routes)
```

---

## API Endpoints

| Method   | Path                  | Description                          |
|----------|-----------------------|--------------------------------------|
| GET      | `/api/cars`           | All car listings                     |
| POST     | `/api/cars`           | Create listing                       |
| PUT      | `/api/cars/:id`       | Update listing (status, edits)       |
| DELETE   | `/api/cars/:id`       | Delete listing + image files         |
| POST     | `/api/images`         | Upload image (base64 → saved to disk)|
| GET      | `/api/messages`       | All customer messages                |
| POST     | `/api/messages`       | Submit inquiry                       |
| PUT      | `/api/messages/:id`   | Update message (e.g. mark as read)   |
| DELETE   | `/api/messages/:id`   | Delete message                       |
| GET      | `/health`             | Health check (used by Railway/Render)|

---

## Data & Storage

| What           | Where                         | Notes                                   |
|----------------|-------------------------------|-----------------------------------------|
| Car listings   | `data/cars.json`              | Auto-created on first run               |
| Messages       | `data/messages.json`          | Auto-created on first run               |
| Uploaded images| `data/uploads/`               | Served at `/uploads/<filename>`         |

Both `data/` and `data/uploads/` are created automatically — never commit them.

---

## Environment Variables

| Variable   | Default         | Description                                      |
|------------|-----------------|--------------------------------------------------|
| `PORT`     | `3000`          | Port to listen on                                |
| `DATA_DIR` | `./data`        | Override data directory (use for cloud volumes)  |

Example for Railway/Render:
```
DATA_DIR=/app/data
PORT=3000
```

---

## JS File Load Order & Dependencies

Scripts load in this order — each file can safely call functions from files above it at runtime (not at parse time):

```
utils.js        → no deps
api.js          → utils
nav.js          → api, utils  (calls renderCars/renderAdmin/populateCarSelect at runtime)
inventory.js    → api, utils, nav
autocomplete.js → api, utils
upload.js       → api, utils, admin  (calls renderAdmin/adminTab at runtime)
forms.js        → api, utils, nav
auth.js         → api, utils, nav
admin.js        → api, utils, nav, inventory
app.js          → everything  (called last — boots the app)
```

---

## Deployment

See **DEPLOY.md** for full guides covering Railway, Render, and a VPS with Nginx + HTTPS.

Quick version for Railway:
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOU/luminai-auto.git
git push -u origin main
# → railway.app → New Project → Deploy from GitHub → add Volume at /app/data → set DATA_DIR=/app/data
```

---

## Admin Panel

Accessed at `/#/login` — not linked anywhere in the public navigation.

- **Overview** — live stats + recent messages
- **Inventory** — table of all listings, mark sold, delete
- **Upload Car** — drag & drop multi-image with reorder, full autocomplete
- **Messages** — expandable inbox with unread badges, one-click reply via email

---

## Changing the Admin Password

Open `public/js/api.js` and update:

```js
const ADMIN_CREDS = { username: 'admin', password: 'your-new-password' };
```

> For production, store credentials server-side using environment variables rather than hardcoding them in the frontend.
