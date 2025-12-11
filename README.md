# AirCarry mobile concept preview

This repo hosts a static preview of the AirCarry mobile experience, mirroring the latest design mock across booking, sending, tracking, and searching flows. The layout uses four device frames inspired by the provided reference, organized into tabs so viewers can flip between each functional slice.

Each main action automatically glides to the next stage to show the end-to-end story, and the page floats on top of a subtle animated backdrop to keep the presentation investor-ready.

A personalized profile avatar in each mock screen highlights the trusted, user-first feel of the experience, and clicking it reveals a short profile card with traveler details.

## Running locally

Open `index.html` directly in your browser or serve the repo root with any static server:

```bash
python -m http.server 8000
```

## Deploying on Runway or any static host

Upload `index.html`, `styles.css`, and `script.js` to Runway (or any static host) and point the site root to `index.html`.
