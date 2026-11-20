# Trace 迹绎 · site v2

Static, build-free marketing site for Trace (App Store id 6769310458). Open `index.html` through any static server.

- `index.html`, `css/`, `js/` — scrollytelling page: night-globe canvas, liquid-glass surfaces, sticky phone story, interactive route scrubber, mini demos (3D tilt, pin drag, record, globe), privacy bounce. EN / 中文 via `js/i18n.js`.
- `assets/video/` — real-device exports of the sample voyage (standard 3D + satellite, zh/en).
- `film/film.html` — the 30 s film as a frame-addressable timeline (`renderAt(t)`); `?lang=en|zh`. Rendered frame by frame with headless Chrome and stitched to H.264. `film/trace-film-*.mp4` are web versions, `film/masters/` are 6 Mbps masters for social posts.
- `legal/` — privacy policy and support page (bilingual).
