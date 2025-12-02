# SkyRelay marketing site

A single-page, investor-focused landing site for SkyRelay, a peer-to-peer international delivery network that matches senders with travelers who have unused luggage capacity.

## Running locally

This is a pure static site. Open `index.html` directly in your browser, or serve the repo root with any static server:

```bash
python -m http.server 8000
```

## Deploying on Runway or any static host

The deployable bundle is just the three files in this repository: `index.html`, `styles.css`, and `script.js`. Upload them to Runway (or any static host), point the site root to `index.html`, and you are live.
