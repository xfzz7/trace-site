(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var I18N = window.TRACE_I18N, TRIPS = window.TRACE_TRIPS, PLACES = window.TRACE_PLACES;
  var lang = 'en';
  try { lang = localStorage.getItem('lang') || ((navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en'); } catch (e) { lang = (navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en'; }
  var visible = new WeakMap(); // el -> bool

  /* ---------- visibility helper ---------- */
  var vio = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { visible.set(e.target, e.isIntersecting); if (e.target._onvis) e.target._onvis(e.isIntersecting); });
  }, { threshold: 0.12 }) : null;
  function watch(el, fn) { if (!el) return; el._onvis = fn; if (vio) vio.observe(el); else fn(true); }
  function isVis(el) { return visible.get(el) !== false; }

  /* ---------- i18n ---------- */
  function splitWords(el, text) {
    el.innerHTML = '';
    var parts = lang === 'zh' ? (text.match(/[^，。、！？,.]+[，。、！？,.]?/g) || [text]) : text.split(' ');
    parts.forEach(function (p, i) {
      var w = document.createElement('span'); w.className = 'w';
      var s = document.createElement('span'); s.textContent = p + (lang === 'zh' ? '' : ''); s.style.transitionDelay = (0.05 * i + 0.1) + 's';
      w.appendChild(s); el.appendChild(w);
      if (lang !== 'zh' && i < parts.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  function applyText() {
    var d = I18N[lang];
    $$('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (d[k] != null) el.textContent = d[k]; });
    $$('[data-i18n-words]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-words'); var had = el.classList.contains('in');
      el.classList.remove('in'); splitWords(el, d[k]);
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
      if (had) el.classList.add('in');
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    document.title = lang === 'zh' ? '迹绎 Trace · 把照片，重新走一遍' : 'Trace · Walk your photos back across the map';
    $('#langBtn').textContent = lang === 'zh' ? 'English' : '中文';
  }
  function applyMedia() {
    $$('video[data-vid]').forEach(function (v) {
      var n = 'assets/video/' + lang + '-' + v.getAttribute('data-vid') + '.mp4';
      var s = v.querySelector('source');
      if (s.getAttribute('src') !== n) { s.setAttribute('src', n); v.poster = 'assets/video/' + lang + '-' + v.getAttribute('data-vid') + '.jpg'; v.load(); if (isVis(v) && !reduce) v.play().catch(function () {}); }
      else v.poster = 'assets/video/' + lang + '-' + v.getAttribute('data-vid') + '.jpg';
    });
    $('#stageShot').src = 'assets/shots/' + lang + '/3.jpg';
    var fv = $('#filmVid'); if (fv) { fv.poster = 'film/poster-' + lang + '.jpg'; var fs = fv.querySelector('source'); var fn = 'film/trace-film-' + lang + '.mp4'; if (fs.getAttribute('src') !== fn) { fs.setAttribute('src', fn); fv.load(); } }
    var m = $('#marquee'); m.innerHTML = '';
    for (var r = 0; r < 2; r++) for (var i = 1; i <= 5; i++) { var im = new Image(); im.src = 'assets/shots/' + lang + '/' + i + '.jpg'; im.alt = (lang === 'zh' ? '迹绎截图 ' : 'Trace screenshot ') + i; im.loading = 'lazy'; if (r) im.setAttribute('aria-hidden', 'true'); m.appendChild(im); }
    // photo-name chips in hero
    var strip = $('#strip'); strip.innerHTML = '';
    TRIPS[lang].forEach(function (t) { var d = document.createElement('div'); d.style.backgroundImage = 'url(assets/photos/' + t.img + '.jpg)'; strip.appendChild(d); });
  }
  function setLang(l) {
    lang = l; try { localStorage.setItem('lang', l); } catch (e) {}
    applyText(); applyMedia(); Scrub.rebuild(); Pin.rebuild(); heroPins();
  }
  $('#langBtn').addEventListener('click', function () { setLang(lang === 'zh' ? 'en' : 'zh'); });

  /* ---------- nav / reveal ---------- */
  var nav = $('#nav');
  addEventListener('scroll', function () { nav.classList.toggle('solid', scrollY > 24); }, { passive: true });
  var rio = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }) : null;
  $$('.reveal').forEach(function (el, i) { el.style.setProperty('--d', (i % 4) * 0.06 + 's'); if (rio) rio.observe(el); else el.classList.add('in'); });

  /* ---------- starfield ---------- */
  (function stars() {
    var c = $('#stars'), x = c.getContext('2d'), W, H, S = [], dpr = Math.min(devicePixelRatio || 1, 2);
    function size() { W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr; S = []; var n = Math.round(innerWidth * innerHeight / 9000); for (var i = 0; i < n; i++) S.push({ x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.2 + .3) * dpr, p: Math.random() * 6.28, s: Math.random() * .6 + .2, d: Math.random() * .5 + .1 }); }
    size(); addEventListener('resize', size);
    function frame(t) {
      x.clearRect(0, 0, W, H);
      var sy = scrollY * dpr;
      for (var i = 0; i < S.length; i++) { var s = S[i]; var a = .35 + .5 * Math.sin(t / 1000 * s.s + s.p); x.globalAlpha = Math.max(.05, a) * .8; x.fillStyle = '#cfe6ff'; var y = ((s.y - sy * s.d) % H + H) % H; x.beginPath(); x.arc(s.x, y, s.r, 0, 6.283); x.fill(); }
      if (!reduce) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------- hero route + pins ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function heroPins() {
    var g = $('#heroPins'); g.innerHTML = '';
    var path = $('#heroPath'), L = path.getTotalLength();
    var imgs = TRIPS[lang].map(function (t) { return t.img; });
    var fr = [.16, .38, .6, .8, .95];
    fr.forEach(function (f, i) {
      var p = path.getPointAtLength(L * f);
      var gp = document.createElementNS(SVGNS, 'g'); gp.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')'); gp.style.cssText = 'opacity:0;transform-origin:center;transition:opacity .5s ease ' + (0.5 + f * 2.4) + 's';
      var id = 'hp' + i;
      gp.innerHTML = '<clipPath id="' + id + '"><circle r="26"/></clipPath><circle r="34" fill="#5db2ff" opacity=".18"/><circle r="29" fill="#fff"/><image href="assets/photos/' + imgs[i] + '.jpg" x="-26" y="-26" width="52" height="52" preserveAspectRatio="xMidYMid slice" clip-path="url(#' + id + ')"/>';
      g.appendChild(gp);
      setTimeout(function () { gp.style.opacity = 1; }, 60);
    });
    var live = $('#heroPathLive'); live.style.transition = 'none'; live.style.strokeDasharray = L; live.style.strokeDashoffset = L;
    requestAnimationFrame(function () { requestAnimationFrame(function () { live.style.transition = 'stroke-dashoffset 3.4s cubic-bezier(.4,.1,.2,1)'; live.style.strokeDashoffset = 0; }); });
  }
  (function heroTilt() {
    var wrap = $('#heroDevice'), d = $('[data-tilt]', wrap);
    if (reduce || !d) return;
    wrap.addEventListener('pointermove', function (e) { var r = wrap.getBoundingClientRect(); var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; d.style.transform = 'rotateY(' + px * 14 + 'deg) rotateX(' + -py * 10 + 'deg)'; });
    wrap.addEventListener('pointerleave', function () { d.style.transform = ''; });
  })();

  /* ---------- videos: play only when visible ---------- */
  $$('#hero .vid').forEach(function (v) { watch(v, function (on) { if (reduce) return; on ? v.play().catch(function () {}) : v.pause(); }); });

  /* ---------- story ---------- */
  (function story() {
    var screen = $('#stageScreen'), steps = $$('.step'), dots = $$('#storyDots i');
    var vids = { 1: $('[data-layer="1"]'), 2: $('[data-layer="2"]') };
    var pkGrid = $('#pkGrid'), pkCount = $('#pkCount'), timers = [];
    var all = ['goldengate', 'lombard', 'bixby', 'mcway', 'santamonica', 'bund', 'yuyuan', 'westlake', 'lingyin', 'zhuozheng', 'goldengate', 'bund'];
    all.forEach(function (n) { var d = document.createElement('div'); d.style.backgroundImage = 'url(assets/photos/' + n + '.jpg)'; pkGrid.appendChild(d); });
    function runPicker() {
      timers.forEach(clearTimeout); timers = []; var cells = $$('div', pkGrid); cells.forEach(function (c) { c.classList.remove('sel'); }); pkCount.textContent = '0';
      [0, 2, 4, 7, 9].forEach(function (idx, k) { timers.push(setTimeout(function () { cells[idx].classList.add('sel'); pkCount.textContent = String(k + 1); }, 500 + k * 380)); });
    }
    var current = -1;
    function activate(i) {
      if (i === current) return; current = i; screen.setAttribute('data-active', i);
      steps.forEach(function (s, k) { s.classList.toggle('on', k === i); }); dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
      Object.keys(vids).forEach(function (k) { var v = vids[k]; if (+k === i) { if (v.preload !== 'auto') { v.preload = 'auto'; } if (!reduce) v.play().catch(function () {}); } else { v.pause(); } });
      if (i === 0) runPicker();
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) activate(+e.target.getAttribute('data-step')); }); }, { rootMargin: '-45% 0px -45% 0px' });
      steps.forEach(function (s) { io.observe(s); });
    } else activate(0);
    activate(0);
  })();

  /* ---------- scrub map ---------- */
  var Scrub = (function () {
    var svg = $('#mapSvg'), cam = $('#cam'), you = $('#you'), W = 800, H = 520;
    var base = $('#routeBase'), live = $('#routeLive'), live2 = $('#routeLive2'), wps = $('#wps'), grat = $('#grat');
    var range = $('#scrubRange'), playBtn = $('#playBtn'), playIcon = $('#playIcon');
    var pcImg = $('#pcImg'), pcName = $('#pcName'), pcIdx = $('#pcIdx'), cnt = $('#scrubCount'), hLat = $('#hudLat'), hLon = $('#hudLon'), card = $('#photoCard');
    var trip, pts, L, fr, proj, t = 0, playing = false, last = 0, cx = 0, cy = 0, cz = 1.9, tx = 0, ty = 0, tz = 1.9, idx = -1, raf = 0;
    var PLAY = 'M8 5v14l11-7z', PAUSE = 'M7 5h4v14H7zM13 5h4v14h-4z';
    function build() {
      trip = TRIPS[lang]; wps.innerHTML = ''; grat.innerHTML = '';
      var lats = trip.map(function (p) { return p.lat; }), lons = trip.map(function (p) { return p.lon; });
      var la0 = Math.min.apply(0, lats), la1 = Math.max.apply(0, lats), lo0 = Math.min.apply(0, lons), lo1 = Math.max.apply(0, lons);
      var midLat = (la0 + la1) / 2, k = Math.cos(midLat * Math.PI / 180);
      var spanX = (lo1 - lo0) * k, spanY = (la1 - la0), sc = Math.min((W - 220) / spanX, (H - 180) / spanY);
      proj = { sc: sc, k: k, lo0: lo0, la1: la1, ox: (W - spanX * sc) / 2, oy: (H - spanY * sc) / 2 };
      pts = trip.map(function (p) { return { x: proj.ox + (p.lon - lo0) * k * sc, y: proj.oy + (la1 - p.lat) * sc }; });
      // smooth catmull-rom path with a gentle lateral bow between points so routes read as travel, not ruler lines
      var d = 'M' + pts[0].x + ' ' + pts[0].y;
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6, c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
        d += ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ',' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ',' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
      }
      base.setAttribute('d', d); live.setAttribute('d', d); live2.setAttribute('d', d);
      L = live.getTotalLength(); [live, live2].forEach(function (p) { p.style.strokeDasharray = L; });
      // waypoint fractions (nearest sampled length)
      fr = pts.map(function (p) { var best = 0, bd = 1e9; for (var s = 0; s <= L; s += 3) { var q = live.getPointAtLength(s), dd = (q.x - p.x) * (q.x - p.x) + (q.y - p.y) * (q.y - p.y); if (dd < bd) { bd = dd; best = s; } } return best / L; });
      fr[0] = 0; fr[fr.length - 1] = 1;
      pts.forEach(function (p, i) {
        var g = document.createElementNS(SVGNS, 'g'); g.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')'); g.setAttribute('data-i', i);
        g.innerHTML = '<clipPath id="wc' + i + '"><circle r="13"/></clipPath><circle r="17" fill="#fff" opacity=".95"/><image href="assets/photos/' + trip[i].img + '.jpg" x="-13" y="-13" width="26" height="26" preserveAspectRatio="xMidYMid slice" clip-path="url(#wc' + i + ')"/>';
        g.style.cssText = 'opacity:.45;transition:opacity .4s'; wps.appendChild(g);
      });
      // graticule
      var step = .5, gx = '';
      for (var lo = Math.floor(lo0 - 8); lo <= lo1 + 8; lo += step) { var x = proj.ox + (lo - lo0) * k * sc; gx += '<line x1="' + x + '" y1="-1000" x2="' + x + '" y2="1600"/>'; }
      for (var la = Math.floor(la0 - 8); la <= la1 + 8; la += step) { var y = proj.oy + (la1 - la) * sc; gx += '<line x1="-1600" y1="' + y + '" x2="2400" y2="' + y + '"/>'; }
      grat.innerHTML = gx;
      idx = -1; set(t, true);
    }
    function cardTo(i) {
      if (i === idx) return; idx = i; var p = trip[i];
      card.style.opacity = 0; setTimeout(function () { pcImg.src = 'assets/photos/' + p.img + '.jpg'; pcImg.alt = p.name; pcName.textContent = p.name; card.style.opacity = 1; }, 120);
      pcIdx.textContent = (i + 1) + ' / ' + trip.length; cnt.textContent = (i + 1) + ' / ' + trip.length;
      $$('g', wps).forEach(function (g, j) { g.style.opacity = j <= i ? 1 : .45; });
    }
    function set(v, immediate) {
      t = Math.max(0, Math.min(1, v));
      var q = live.getPointAtLength(L * t);
      live.style.strokeDashoffset = L * (1 - t); live2.style.strokeDashoffset = L * (1 - t);
      you.setAttribute('transform', 'translate(' + q.x + ' ' + q.y + ')');
      tx = q.x; ty = q.y; if (immediate) { cx = tx; cy = ty; cz = tz; }
      var i = 0; for (var j = 0; j < fr.length; j++) if (t >= fr[j] - 0.001) i = j; cardTo(i);
      range.value = Math.round(t * 1000); range.style.setProperty('--p', (t * 100) + '%');
      var lon = proj.lo0 + (q.x - proj.ox) / (proj.k * proj.sc), lat = proj.la1 - (q.y - proj.oy) / proj.sc;
      hLat.textContent = Math.abs(lat).toFixed(3) + '°' + (lat >= 0 ? 'N' : 'S'); hLon.textContent = Math.abs(lon).toFixed(3) + '°' + (lon >= 0 ? 'E' : 'W');
      render();
    }
    function render() { cam.setAttribute('transform', 'translate(' + W / 2 + ' ' + (H / 2 - 40) + ') scale(' + cz + ') translate(' + -cx + ' ' + -cy + ')'); }
    function loop(ts) {
      raf = 0;
      if (!isVis($('#map'))) return schedule();
      var dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
      if (playing) { var nt = t + dt / 16; if (nt >= 1) { nt = 1; setPlaying(false); } set(nt); }
      var e = 1 - Math.pow(.0015, dt); cx += (tx - cx) * e; cy += (ty - cy) * e; cz += (tz - cz) * e; render();
      schedule();
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(loop); }
    function setPlaying(p) { playing = p; playIcon.setAttribute('d', p ? PAUSE : PLAY); playBtn.setAttribute('aria-label', p ? 'Pause' : 'Play'); if (p && t >= 1) set(0); }
    playBtn.addEventListener('click', function () { setPlaying(!playing); });
    range.addEventListener('input', function () { setPlaying(false); set(range.value / 1000); });
    watch($('#map'), function (on) { if (on && !reduce && !Scrub.started) { Scrub.started = true; setTimeout(function () { setPlaying(true); }, 700); } });
    return { rebuild: function () { build(); schedule(); }, started: false };
  })();

  /* ---------- 3D tilt canvas ---------- */
  (function tilt3d() {
    var c = $('#tiltCanvas'), x = c.getContext('2d'), slider = $('#pitch'), W = c.width, H = c.height;
    var seed = 11; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var blocks = []; for (var gx = 0; gx < 11; gx++) for (var gy = 0; gy < 8; gy++) { if (rnd() < .22) continue; var w = 22 + rnd() * 12, d = 22 + rnd() * 12; blocks.push({ x: 40 + gx * 46 + (46 - w) / 2, y: 20 + gy * 40 + (40 - d) / 2, w: w, d: d, h: 8 + Math.pow(rnd(), 2.2) * 70 }); }
    var route = [[0, 300], [90, 250], [170, 230], [250, 170], [330, 175], [400, 110], [470, 120], [560, 70]];
    var time = 0, p = +slider.value;
    function draw(t) {
      var rad = p * Math.PI / 180, cs = Math.cos(rad), sn = Math.sin(rad), sy = Math.max(cs, .18);
      x.clearRect(0, 0, W, H);
      var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d1a2c'); g.addColorStop(1, '#09111d'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      
      x.save(); x.translate(W / 2 - 280, H / 2 - 20);
      function Y(y) { return (y - 150) * sy; }
      // ground grid again in proper space
      x.strokeStyle = 'rgba(120,180,255,.08)'; for (var a = 0; a <= 12; a++) { x.beginPath(); x.moveTo(30 + a * 46, Y(10)); x.lineTo(30 + a * 46, Y(350)); x.stroke(); } for (var b = 0; b <= 9; b++) { x.beginPath(); x.moveTo(30, Y(10 + b * 40)); x.lineTo(30 + 12 * 46, Y(10 + b * 40)); x.stroke(); }
      // route on ground
      x.lineWidth = 4; x.lineCap = 'round'; x.strokeStyle = 'rgba(93,178,255,.9)'; x.shadowColor = '#5db2ff'; x.shadowBlur = 12; x.beginPath(); route.forEach(function (r, i) { var X = 20 + r[0], YY = Y(r[1] + 20); i ? x.lineTo(X, YY) : x.moveTo(X, YY); }); x.stroke(); x.shadowBlur = 0;
      // blocks sorted by y
      var bs = blocks.slice().sort(function (m, n) { return m.y - n.y; });
      bs.forEach(function (b) {
        var h = b.h * sn * 0.95, y0 = Y(b.y), y1 = Y(b.y + b.d), xl = b.x, xr = b.x + b.w;
        var tone = 36 + Math.min(1, b.h / 80) * 26;
        // front face
        x.fillStyle = 'hsl(212 42% ' + (tone - 6) + '%)'; x.beginPath(); x.moveTo(xl, y1); x.lineTo(xr, y1); x.lineTo(xr, y1 - h); x.lineTo(xl, y1 - h); x.closePath(); x.fill();
        // right face
        x.fillStyle = 'hsl(212 40% ' + (tone - 14) + '%)'; x.beginPath(); x.moveTo(xr, y1); x.lineTo(xr, y1 - h); x.lineTo(xr, y0 - h); x.lineTo(xr, y0); x.closePath(); x.fill();
        // top
        x.fillStyle = 'hsl(206 70% ' + (tone + 14) + '%)'; x.fillRect(xl, y0 - h, b.w, Math.max(1, y1 - y0));
      });
      // moving dot
      var u = (Math.sin(t / 1800) * .5 + .5) * (route.length - 1), i0 = Math.floor(u), f = u - i0, r0 = route[i0], r1 = route[Math.min(i0 + 1, route.length - 1)];
      var px = 20 + r0[0] + (r1[0] - r0[0]) * f, py = Y(r0[1] + 20 + (r1[1] - r0[1]) * f);
      x.fillStyle = '#fff'; x.beginPath(); x.arc(px, py, 7, 0, 6.283); x.fill(); x.fillStyle = '#2f8bff'; x.beginPath(); x.arc(px, py, 4.5, 0, 6.283); x.fill();
      x.restore();
    }
    var raf = 0;
    function loop(t) { raf = 0; if (isVis(c)) { draw(t); } raf = requestAnimationFrame(loop); }
    slider.addEventListener('input', function () { p = +slider.value; slider.style.setProperty('--p', (p / 70 * 100) + '%'); draw(performance.now()); });
    slider.style.setProperty('--p', (p / 70 * 100) + '%');
    watch(c, function (on) { if (on && !raf) raf = requestAnimationFrame(loop); });
    draw(0);
  })();

  /* ---------- pin drag ---------- */
  var Pin = (function () {
    var box = $('#pinMap'), pin = $('#pin'), nm = $('#pinName'), co = $('#pinCoord'), wb = $('#writeBtn'), written = false;
    var LA0 = 38.0, LA1 = 37.2, LO0 = -122.7, LO1 = -121.8, px = .55, py = .48;
    function hav(a, b, c, d) { var R = 6371, r = Math.PI / 180, dl = (c - a) * r, dn = (d - b) * r, h = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dn / 2) * Math.sin(dn / 2); return 2 * R * Math.asin(Math.sqrt(h)); }
    function update() {
      var lat = LA0 + (LA1 - LA0) * py, lon = LO0 + (LO1 - LO0) * px, best = null, bd = 1e9;
      PLACES[lang].forEach(function (p) { var d = hav(lat, lon, p[1], p[2]); if (d < bd) { bd = d; best = p[0]; } });
      var near = lang === 'zh' ? ('距' + best + ' ' + bd.toFixed(1) + ' 公里') : (bd.toFixed(1) + ' km from ' + best);
      nm.textContent = near; co.textContent = lat.toFixed(4) + '°N, ' + Math.abs(lon).toFixed(4) + '°W';
      pin.style.left = px * 100 + '%'; pin.style.top = py * 100 + '%';
      written = false; wb.classList.remove('ok'); wb.textContent = I18N[lang].f3_btn;
    }
    function moveTo(e) { var r = box.getBoundingClientRect(); px = Math.max(.04, Math.min(.96, (e.clientX - r.left) / r.width)); py = Math.max(.1, Math.min(.84, (e.clientY - r.top) / r.height)); update(); }
    var drag = false;
    pin.addEventListener('pointerdown', function (e) { drag = true; pin.classList.add('drag'); pin.setPointerCapture(e.pointerId); e.preventDefault(); });
    pin.addEventListener('pointermove', function (e) { if (drag) moveTo(e); });
    pin.addEventListener('pointerup', function () { drag = false; pin.classList.remove('drag'); });
    box.addEventListener('pointerdown', function (e) { if (e.target === pin || pin.contains(e.target)) return; moveTo(e); });
    wb.addEventListener('click', function () { written = true; wb.classList.add('ok'); wb.textContent = I18N[lang].f3_done; });
    return { rebuild: update };
  })();

  /* ---------- record demo ---------- */
  (function rec() {
    var card = $('#recCard'), btn = $('#recBtn'), cnt = $('#recCount'), arc = $('#recArc'), busy = false;
    btn.addEventListener('click', function () {
      if (busy) return; busy = true; card.classList.remove('done'); card.classList.add('run'); arc.style.transition = 'none'; arc.style.strokeDashoffset = 327; cnt.style.opacity = 1;
      var n = 3; cnt.textContent = n;
      var iv = setInterval(function () {
        n--; if (n > 0) { cnt.textContent = n; return; }
        clearInterval(iv); cnt.textContent = '●'; cnt.style.color = '#ff5a4f'; arc.style.transition = 'stroke-dashoffset 2.6s linear'; arc.style.strokeDashoffset = 0;
        setTimeout(function () { card.classList.remove('run'); card.classList.add('done'); cnt.style.color = ''; busy = false; setTimeout(function () { if (!busy) { card.classList.remove('done'); cnt.textContent = '3'; arc.style.transition = 'none'; arc.style.strokeDashoffset = 327; } }, 3600); }, 2700);
      }, 700);
    });
  })();

  /* ---------- live card ---------- */
  (function live() { var c = $('#liveCard'); if (reduce) return; setInterval(function () { if (isVis(c)) { c.classList.add('on'); setTimeout(function () { c.classList.remove('on'); }, 3000); } }, 6500); watch(c, function () {}); })();

  /* ---------- globe ---------- */
  (function globe() {
    var c = $('#globe'), x = c.getContext('2d'), W = c.width, H = c.height, R = Math.min(W, H) * .43, pts = [], N = 1500, rot = 0;
    var GA = Math.PI * (3 - Math.sqrt(5));
    function land(la, lo) { return Math.sin(lo * 2.1 + la * 1.3) + Math.sin(lo * 4.3 - la * 2.2) * .6 + Math.cos(la * 3.1 + lo * .7) * .7 > .55; }
    for (var i = 0; i < N; i++) { var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = GA * i, la = Math.asin(y), lo = Math.atan2(Math.sin(th) * r, Math.cos(th) * r); pts.push({ la: la, lo: lo, land: land(la, lo) }); }
    var cities = [[37.8, -122.4], [31.2, 121.5], [64.1, -21.9], [48.9, 2.35], [-33.9, 151.2], [35.7, 139.7], [40.7, -74]];
    var arcs = [[0, 1], [1, 5], [3, 2], [2, 6], [6, 0], [4, 5]];
    function vec(la, lo) { return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]; }
    function rotY(v, a) { var c = Math.cos(a), s = Math.sin(a); return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]; }
    var tilt = -.35; function rotX(v) { var c = Math.cos(tilt), s = Math.sin(tilt); return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c]; }
    function P(v) { var q = rotX(rotY(v, rot)); return { x: W / 2 + q[0] * R, y: H / 2 - q[1] * R, z: q[2] }; }
    function frame(t) {
      requestAnimationFrame(frame); if (!isVis(c)) return; rot = t / 6000;
      x.clearRect(0, 0, W, H);
      var g = x.createRadialGradient(W / 2, H / 2, R * .6, W / 2, H / 2, R * 1.35); g.addColorStop(0, 'rgba(47,139,255,.18)'); g.addColorStop(1, 'rgba(47,139,255,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = 'rgba(8,16,30,.9)'; x.beginPath(); x.arc(W / 2, H / 2, R, 0, 6.283); x.fill();
      pts.forEach(function (p) { var q = P(vec(p.la, p.lo)); if (q.z < 0) return; x.globalAlpha = (.12 + q.z * .8) * (p.land ? 1 : .35); x.fillStyle = p.land ? '#9fd0ff' : '#3a6aa8'; x.fillRect(q.x, q.y, 2, 2); });
      x.globalAlpha = 1; x.lineCap = 'round';
      arcs.forEach(function (a, ai) {
        var A = vec(cities[a[0]][0] * Math.PI / 180, cities[a[0]][1] * Math.PI / 180), B = vec(cities[a[1]][0] * Math.PI / 180, cities[a[1]][1] * Math.PI / 180);
        var om = Math.acos(Math.max(-1, Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]))), prev = null, prog = ((t / 3200 + ai * .37) % 1);
        for (var s = 0; s <= 40; s++) { var u = s / 40, k0 = Math.sin((1 - u) * om) / Math.sin(om), k1 = Math.sin(u * om) / Math.sin(om), lift = 1 + Math.sin(u * Math.PI) * .22; var v = [(A[0] * k0 + B[0] * k1) * lift, (A[1] * k0 + B[1] * k1) * lift, (A[2] * k0 + B[2] * k1) * lift]; var q = P(v); if (prev && q.z > -.1 && prev.z > -.1) { var on = u < prog; x.strokeStyle = on ? 'rgba(155,231,255,.95)' : 'rgba(93,178,255,.25)'; x.lineWidth = on ? 2.4 : 1.2; x.beginPath(); x.moveTo(prev.x, prev.y); x.lineTo(q.x, q.y); x.stroke(); } prev = q; }
      });
      cities.forEach(function (c2) { var q = P(vec(c2[0] * Math.PI / 180, c2[1] * Math.PI / 180)); if (q.z < 0) return; x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.arc(q.x, q.y, 4.5, 0, 6.283); x.fill(); x.fillStyle = 'rgba(93,178,255,.35)'; x.beginPath(); x.arc(q.x, q.y, 10 + Math.sin(t / 400) * 2, 0, 6.283); x.fill(); });
    }
    watch(c, function () {}); requestAnimationFrame(frame);
  })();

  /* ---------- privacy bounce ---------- */
  (function privacy() {
    var scene = $('#pvScene'), th = $('#pvThumbs'), btn = $('#sendBtn'), names = ['goldengate', 'lombard', 'bixby', 'mcway', 'santamonica', 'bund', 'yuyuan', 'westlake', 'lingyin'];
    names.forEach(function (n) { var i = document.createElement('i'); i.style.backgroundImage = 'url(assets/photos/' + n + '.jpg)'; th.appendChild(i); });
    function fire(k) {
      var b = document.createElement('div'); b.className = 'bullet'; b.style.backgroundImage = 'url(assets/photos/' + names[k % names.length] + '.jpg)';
      var phone = $('.pv__phone', scene), wall = $('.pv__wall', scene), sr = scene.getBoundingClientRect(), pr = phone.getBoundingClientRect(), wr = wall.getBoundingClientRect();
      var x0 = pr.right - sr.left - 20, y0 = pr.top - sr.top + pr.height / 2 + (k % 3 - 1) * 26, x1 = wr.left - sr.left - 26;
      b.style.left = x0 + 'px'; b.style.top = y0 + 'px'; scene.appendChild(b);
      var a = b.animate([{ transform: 'translateX(0) scale(1)', opacity: 1 }, { transform: 'translateX(' + (x1 - x0) + 'px) scale(1)', opacity: 1, offset: .55 }, { transform: 'translateX(' + (x1 - x0 - 60) + 'px) scale(.6) rotate(-30deg)', opacity: 0 }], { duration: 1200, easing: 'ease-in-out' });
      a.onfinish = function () { b.remove(); };
      setTimeout(function () { wall.animate([{ background: 'repeating-linear-gradient(#ff2d2d 0 8px,transparent 8px 14px)' }, { background: 'repeating-linear-gradient(#c93b3b 0 8px,transparent 8px 14px)' }], { duration: 400 }); }, 660);
    }
    btn.addEventListener('click', function () { for (var k = 0; k < 6; k++) setTimeout(function (kk) { return function () { fire(kk); }; }(k), k * 160); });
  })();

  /* ---------- film fallback ---------- */
  (function film() { var s = $('#filmVid source'); if (!s) return; s.addEventListener('error', function () { $('#film').hidden = true; }); })();

  /* ---------- boot ---------- */
  applyText(); applyMedia(); Scrub.rebuild(); Pin.rebuild(); heroPins();
  watch($('#heroTitle'), function () {});
})();
