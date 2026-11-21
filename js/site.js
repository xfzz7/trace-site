/* 迹绎 Trace · site v3 */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var assetRoot = new URL('../', document.currentScript.src).href;
  var motion = matchMedia('(prefers-reduced-motion: reduce)');
  var lang = root.dataset.lang === 'en' ? 'en' : 'zh';

  /* ================= copy ================= */
  var T = {
    zh: {
      brand: '迹绎', nav_get: '下载',
      hero_kicker: '一个把照片放回地图的 App',
      hero_title: '照片记得<br>你去过哪里。',
      hero_lede: '选几张带位置的照片，迹绎会按拍摄顺序在地图上回放这趟旅程。',
      cta_store: '前往 App Store', cta_how: '看看它怎么做',
      hero_fine: 'iPhone 与 iPad · 无需账号 · 照片不离开手机',
      b1_t: '它们本来躺在相册里。',
      b1_p: '十月里的三天，五张照片，夹在几百张截图、收据和表情包中间。你很少再翻到它们。',
      b2_t: '但每一张都记着时间和地点。',
      b2_p: '带位置信息的照片记录了拍摄时间和地点。迹绎用它们给照片排序，在地图上标出每一站。',
      b3_t: '按时间连起来，就是你走过的路。',
      b4_t: '走完，留下一页记录。',
      b4_p: '天数、里程、经过的地方，自动整理好，存在 App 里。哪天想起来，点开接着看。',
      ticket_label: '旅程记录', u_days: '天', u_moments: '个瞬间',
      play_kicker: '然后，按下播放',
      play_t: '镜头沿着你的路线，<br>一张一张飞过去。',
      play_p: '照片按拍摄顺序亮起，地图跟着移动。实况照片会动，视频完整播放。下面是 App 里录下来的真实画面。',
      std_t: '标准地图 · 3D', std_p: '看清街道和建筑，再沿着照片之间的连线回顾旅程。',
      sat_t: '卫星 · 3D', sat_p: '湖面、山脊和屋顶，都是你当时真正经过的样子。',
      det_kicker: '几个你会用到的细节', det_t: '不打扰，但想得周到。',
      d1_t: '先看一段示例', d1_p: '不想马上授权相册？打开就能看一段内置旅程，不读你的照片，也不留进记录。',
      d2_t: '实况照片与视频', d2_p: '实况照片会动起来，视频完整播放。一趟旅程放完，就是一部短片。',
      d3_t: '补上缺失的位置', d3_p: '有些照片没带位置？搜索地点或拖动图钉补上，还可以把位置写回照片本身。',
      d4_t: '把回放录成视频', d4_p: '打开「播放时录制」，整段回放连同原声录成视频，存进相册或直接分享出去。',
      d5_t: '每一段都钉在首页', d5_p: '首页地图收着你走过的每一趟。随时点开，重新回放。',
      d6_t: 'iPad 上也一样', d6_p: '大屏幕上看卫星 3D，更像在翻一本会动的旅行相册。',
      pv_t: '你的旅程，<br>只在你的手机里。',
      pv_1: '不需要注册，没有账号。', pv_2: '照片、位置和路线都不上传。',
      pv_3: '没有广告，没有统计和追踪 SDK。', pv_4: '旅程记录保存在 App 内。',
      pv_note: '地图和地名来自 Apple 系统服务，其余计算都在本机完成。', pv_link: '阅读隐私政策',
      final_t: '下一段旅程，<br>已经在你的相册里了。',
      final_fine: 'iPhone 与 iPad · iOS 17 及以上',
      ft_privacy: '隐私政策', ft_support: '技术支持', ft_tm: 'Apple、iPhone、iPad 和 App Store 是 Apple Inc. 的商标。',
      doc_title: '迹绎 Trace · 照片记得你去过哪里', lang_btn: 'EN', day: function (n) { return '第 ' + n + ' 天'; }
    },
    en: {
      brand: 'Trace', nav_get: 'Get the app',
      hero_kicker: 'An app that puts photos back on the map',
      hero_title: 'Your photos remember where you’ve been.',
      hero_lede: 'Pick photos with locations. Trace puts them on a map in the order you took them and replays the trip.',
      cta_store: 'Get it on the App Store', cta_how: 'See how it works',
      hero_fine: 'iPhone & iPad · No account · Photos never leave your phone',
      b1_t: 'They were sitting in your library.',
      b1_p: 'Three days in October, five photos, buried between hundreds of screenshots, receipts and memes. You rarely scroll back that far.',
      b2_t: 'Each one knows when and where.',
      b2_p: 'Photos with location data record when and where they were taken. Trace uses that information to order your photos and place them on the map.',
      b3_t: 'In order, they become the road you took.',
      b4_t: 'At the end, a page to keep.',
      b4_p: 'Days, distance and the places you passed, gathered for you and kept in the app. Open it again whenever the trip comes back to mind.',
      ticket_label: 'Voyage record', u_days: 'days', u_moments: 'moments',
      play_kicker: 'Then press play',
      play_t: 'The camera follows your route, photo by photo.',
      play_p: 'Photos light up in the order you took them while the map moves with you. Live Photos move and videos play in full. These are real recordings from the app.',
      std_t: 'Standard · 3D', std_p: 'See the streets and buildings around each stop.',
      sat_t: 'Satellite · 3D', sat_p: 'The water, ridgelines and rooftops you actually passed.',
      det_kicker: 'Details you will reach for', det_t: 'Quiet, but thought through.',
      d1_t: 'Watch a sample first', d1_p: 'Not ready to grant photo access? A built-in trip plays right away. It never reads your library or lands in your history.',
      d2_t: 'Live Photos and video', d2_p: 'Live Photos come alive and videos play in full. By the end, the trip is a short film.',
      d3_t: 'Fill in missing places', d3_p: 'Photo without a location? Search or drag a pin, and optionally write the place back into the photo.',
      d4_t: 'Record the replay', d4_p: 'Turn on recording and the whole replay, original sound included, becomes a video to save or share.',
      d5_t: 'Every trip, pinned', d5_p: 'Your home map keeps every voyage. Open any saved trip to replay it.',
      d6_t: 'Just as good on iPad', d6_p: 'Satellite 3D on a big screen feels like flipping through a travel album that moves.',
      pv_t: 'Your trips live on your phone. Only there.',
      pv_1: 'No sign-up. No account.', pv_2: 'Photos, places and routes are never uploaded.',
      pv_3: 'No ads. No analytics or tracking SDKs.', pv_4: 'Trip history is stored in the app.',
      pv_note: 'Maps and place names come from Apple’s system services. Everything else is calculated on the device.', pv_link: 'Read the privacy policy',
      final_t: 'Your next trip is already in your library.',
      final_fine: 'iPhone & iPad · iOS 17 or later',
      ft_privacy: 'Privacy Policy', ft_support: 'Support', ft_tm: 'Apple, iPhone, iPad and App Store are trademarks of Apple Inc.',
      doc_title: 'Trace · Your photos remember where you’ve been', lang_btn: '中文', day: function (n) { return 'Day ' + n; }
    }
  };

  /* ================= trips (same data as the app's built-in samples) ================= */
  var TRIPS = {
    zh: {
      title: '上海、杭州、苏州', dates: '2025 年 10 月 2 日 – 4 日', days: 3, dist: 304, unit: '公里',
      view: { lon: 120.85, lat: 30.88, span: 2.7 },
      stops: [
        { name: '外滩', img: 'bund', lon: 121.48602, lat: 31.23923, d: 1, t: '10月2日 09:20', off: [120, -95] },
        { name: '豫园', img: 'yuyuan', lon: 121.48798, lat: 31.22893, d: 1, t: '10月2日 15:10', off: [120, 95] },
        { name: '西湖断桥', img: 'westlake', lon: 120.14885, lat: 30.26035, d: 2, t: '10月3日 10:05', off: [40, 150] },
        { name: '灵隐寺', img: 'lingyin', lon: 120.10194, lat: 30.24139, d: 2, t: '10月3日 16:40', off: [-130, 30] },
        { name: '拙政园', img: 'zhuozheng', lon: 120.629, lat: 31.3244, d: 3, t: '10月4日 11:20', off: [-50, -140] }
      ],
      routeLine: '三天，从上海到杭州，再折回苏州。',
      cities: [['南通', 120.86, 32.0], ['无锡', 120.3, 31.57], ['常州', 119.97, 31.81], ['嘉兴', 120.75, 30.75], ['湖州', 120.09, 30.89], ['绍兴', 120.58, 30.0], ['宁波', 121.55, 29.87]],
      labels: [['东 海', 122.02, 30.62, 'sea'], ['太 湖', 120.2, 31.23, 'water'], ['长 江', 120.62, 32.07, 'water'], ['杭 州 湾', 121.1, 30.45, 'water']],
      grat: { lons: [120, 121, 122], lats: [30, 31, 32], ew: 'E', ns: 'N' },
      sea: [[121.0, 32.7], [121.35, 32.32], [121.7, 32.0], [121.97, 31.72], [121.6, 31.85], [121.2, 31.95], [120.9, 32.0], [120.6, 32.02], [120.35, 31.97],
        [120.55, 31.88], [120.9, 31.78], [121.2, 31.6], [121.45, 31.45], [121.75, 31.3], [121.95, 31.12], [121.98, 30.88],
        [121.75, 30.85], [121.5, 30.8], [121.3, 30.7], [121.05, 30.58], [120.85, 30.45], [120.6, 30.35], [120.4, 30.3],
        [120.55, 30.22], [120.85, 30.17], [121.15, 30.25], [121.45, 30.2], [121.7, 30.02], [121.85, 29.95], [122.05, 29.88], [122.0, 29.4],
        [123.6, 29.4], [123.6, 32.7]],
      islands: [[[121.17, 31.8], [121.45, 31.72], [121.85, 31.55], [121.95, 31.49], [121.75, 31.5], [121.4, 31.62], [121.2, 31.72]]],
      lakes: [[[119.92, 31.18], [119.95, 31.38], [120.1, 31.5], [120.28, 31.55], [120.42, 31.42], [120.5, 31.2], [120.42, 31.05], [120.25, 30.93], [120.05, 30.95]],
        [[120.13, 30.26], [120.155, 30.262], [120.16, 30.245], [120.14, 30.235]]],
      rivers: [[[120.38, 31.97], [120.0, 32.05], [119.6, 32.25], [119.2, 32.25]], [[120.42, 30.3], [120.25, 30.22], [120.12, 30.15], [119.95, 30.0], [119.7, 29.8], [119.45, 29.6]]]
    },
    en: {
      title: 'San Francisco, Big Sur and Santa Monica', dates: 'Oct 2 – 4, 2025', days: 3, dist: 359, unit: 'miles',
      view: { lon: -120.75, lat: 36.0, span: 5.6 },
      stops: [
        { name: 'Golden Gate Bridge', img: 'goldengate', lon: -122.4786, lat: 37.8199, d: 1, t: 'Oct 2, 9:20 AM', off: [150, -70] },
        { name: 'Lombard Street', img: 'lombard', lon: -122.4187, lat: 37.8021, d: 1, t: 'Oct 2, 3:10 PM', off: [150, 88] },
        { name: 'Bixby Creek Bridge', img: 'bixby', lon: -121.9017, lat: 36.3715, d: 2, t: 'Oct 3, 10:05 AM', off: [-165, 0] },
        { name: 'McWay Falls', img: 'mcway', lon: -121.6719, lat: 36.1583, d: 2, t: 'Oct 3, 4:40 PM', off: [140, 70] },
        { name: 'Santa Monica Pier', img: 'santamonica', lon: -118.4973, lat: 34.0092, d: 3, t: 'Oct 4, 11:20 AM', off: [-100, -150] }
      ],
      routeLine: 'Three days down the Pacific coast, from the bay to the pier.',
      cities: [['San Jose', -121.89, 37.34], ['Monterey', -121.89, 36.6], ['Fresno', -119.79, 36.74], ['San Luis Obispo', -120.66, 35.28], ['Bakersfield', -119.02, 35.37], ['Santa Barbara', -119.7, 34.42]],
      labels: [['PACIFIC OCEAN', -122.3, 35.0, 'sea']],
      grat: { lons: [-123, -122, -121, -120, -119, -118], lats: [34, 35, 36, 37, 38], ew: 'W', ns: 'N' },
      sea: [[-123.3, 38.6], [-123.05, 38.3], [-122.97, 38.0], [-122.8, 37.92], [-122.6, 37.86], [-122.48, 37.83],
        [-122.45, 37.87], [-122.42, 37.93], [-122.4, 38.02], [-122.3, 38.08], [-122.25, 38.05], [-122.32, 37.9], [-122.3, 37.82], [-122.2, 37.72], [-122.1, 37.6], [-122.02, 37.48],
        [-122.12, 37.47], [-122.25, 37.56], [-122.37, 37.65], [-122.39, 37.78], [-122.46, 37.81],
        [-122.51, 37.77], [-122.5, 37.6], [-122.5, 37.45], [-122.42, 37.2], [-122.3, 37.08], [-122.05, 36.95], [-121.9, 36.95], [-121.8, 36.8], [-121.8, 36.7],
        [-121.92, 36.6], [-121.95, 36.5], [-121.92, 36.3], [-121.75, 36.1], [-121.5, 35.85], [-121.3, 35.65], [-121.0, 35.45], [-120.88, 35.35], [-120.85, 35.1],
        [-120.63, 34.9], [-120.62, 34.55], [-120.47, 34.45], [-120.0, 34.46], [-119.7, 34.4], [-119.4, 34.32], [-119.2, 34.15], [-118.8, 34.02], [-118.52, 34.03],
        [-118.45, 33.92], [-118.4, 33.75], [-118.28, 33.71], [-118.1, 33.73], [-117.9, 33.6], [-117.6, 33.4], [-117.3, 33.1], [-117.3, 32.6], [-125, 32.6], [-125, 38.6]],
      islands: [[[-119.95, 34.05], [-119.55, 34.06], [-119.5, 33.98], [-119.9, 33.96]], [[-120.25, 34.0], [-119.98, 34.0], [-119.98, 33.9], [-120.2, 33.92]]],
      lakes: [], rivers: []
    }
  };

  /* ================= i18n ================= */
  function applyCopy() {
    var d = T[lang];
    $$('[data-t]').forEach(function (el) {
      var v = d[el.getAttribute('data-t')];
      if (typeof v !== 'string') return;
      if (el.hasAttribute('data-html')) el.innerHTML = v; else if (/<br>/.test(v)) el.innerHTML = v; else el.textContent = v;
    });
    document.title = d.doc_title;
    $('#langBtn').textContent = d.lang_btn;
    $('#langBtn').setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
    root.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    root.dataset.lang = lang;

    var trip = TRIPS[lang];
    $$('[data-photo]').forEach(function (im) { var s = trip.stops[+im.getAttribute('data-photo')]; im.src = photo(s.img); im.alt = s.name; });
    $$('[data-stop-name]').forEach(function (el) { el.textContent = trip.stops[+el.getAttribute('data-stop-name')].name; });
    $$('[data-stop-time]').forEach(function (el) { el.textContent = trip.stops[+el.getAttribute('data-stop-time')].t; });
    $$('[data-trip]').forEach(function (el) { el.textContent = trip[el.getAttribute('data-trip')]; });
    var r = $('.beat__route');
    r.innerHTML = trip.stops.map(function (s) { return '<b>' + s.name + '</b>'; }).join('<i>→</i>') + (lang === 'zh' ? '。' : '.') + '<br>' + trip.routeLine;
  }
  function photo(n) { return assetRoot + 'assets/photos/' + n + '.jpg'; }

  /* ================= videos ================= */
  var videos = $$('video[data-src]');
  var visibleVideos = new Set();

  function syncVideo(video) {
    if (!motion.matches && visibleVideos.has(video)) {
      video.play().catch(function () {});
    } else {
      video.pause();
    }
  }

  var vio = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) visibleVideos.add(entry.target);
      else visibleVideos.delete(entry.target);
      syncVideo(entry.target);
    });
  }, { threshold: .25 });

  function setVideos() {
    $$('video[data-src]').forEach(function (v) {
      var base = assetRoot + 'assets/video/' + lang + '-' + v.getAttribute('data-src');
      if (v.getAttribute('src') === base + '.mp4') return;
      v.poster = base + '.jpg';
      v.src = base + '.mp4';
      syncVideo(v);
      v.setAttribute('aria-label', lang === 'zh' ? '迹绎在地图上回放一段旅程' : 'Trace replaying a trip on the map');
    });
  }
  videos.forEach(function (video) { vio.observe(video); });
  motion.addEventListener('change', function () {
    videos.forEach(syncVideo);
    lastF = -1;
    render();
  });

  /* ================= map plate ================= */
  var NS = 'http://www.w3.org/2000/svg';
  var svg = $('#plateMap'), tilesEl = $('#plateTiles'), plate = $('#plate');
  var world, roll, stopsG, routePath, leaders = [], dots = [], tiles = [], photoTiles = [], segLen = [], cum = [];
  var proj;

  function makeProj(v) {
    var s = 1000 / v.span, k = Math.cos(v.lat * Math.PI / 180);
    return function (lon, lat) { return [500 + (lon - v.lon) * k * s, 500 - (lat - v.lat) * s]; };
  }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var a in attrs) n.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function f1(n) { return Math.round(n * 10) / 10; }
  // Catmull-Rom through points → smooth cubic path
  function smooth(pts, closed) {
    var p = pts.map(function (q) { return proj(q[0], q[1]); }), n = p.length, d = 'M' + f1(p[0][0]) + ' ' + f1(p[0][1]);
    for (var i = 0; i < (closed ? n : n - 1); i++) {
      var p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      if (!closed) { if (i === 0) p0 = p1; if (i + 2 >= n) p3 = p2; }
      var t = .18;
      d += 'C' + f1(p1[0] + (p2[0] - p0[0]) * t) + ' ' + f1(p1[1] + (p2[1] - p0[1]) * t) + ' ' +
        f1(p2[0] - (p3[0] - p1[0]) * t) + ' ' + f1(p2[1] - (p3[1] - p1[1]) * t) + ' ' + f1(p2[0]) + ' ' + f1(p2[1]);
    }
    return d + (closed ? 'Z' : '');
  }

  function buildMap() {
    var trip = TRIPS[lang];
    proj = makeProj(trip.view);
    svg.innerHTML = '';
    var g = el('g', { id: 'mapBase' }, svg);

    // graticule
    trip.grat.lons.forEach(function (lon) {
      var x = proj(lon, 0)[0]; el('line', { class: 'grat', x1: x, x2: x, y1: 0, y2: 1000 }, g);
      el('text', { class: 'grat-l', x: x + 6, y: 988 }, g).textContent = Math.abs(lon) + '°' + trip.grat.ew;
    });
    trip.grat.lats.forEach(function (lat) {
      var y = proj(0, lat)[1]; el('line', { class: 'grat', x1: 0, x2: 1000, y1: y, y2: y }, g);
      el('text', { class: 'grat-l', x: 10, y: y - 6 }, g).textContent = lat + '°' + trip.grat.ns;
    });

    el('path', { class: 'sea', d: smooth(trip.sea, true) }, g);
    el('path', { class: 'coast', d: smooth(trip.sea, true) }, g);
    trip.islands.forEach(function (isl) { el('path', { class: 'island', d: smooth(isl, true), fill: 'var(--land)', stroke: 'var(--rule)', 'stroke-width': 1.2 }, g); });
    trip.lakes.forEach(function (lk) { el('path', { class: 'lake', d: smooth(lk, true) }, g); });
    trip.rivers.forEach(function (rv, i) { el('path', { class: 'river', d: smooth(rv, false), 'stroke-width': i === 0 ? 9 : 5 }, g); });

    trip.labels.forEach(function (l) {
      var p = proj(l[1], l[2]);
      el('text', { class: 'city', x: p[0], y: p[1], 'text-anchor': 'middle', style: 'font-style:italic;letter-spacing:.25em;opacity:.75' }, g).textContent = l[0];
    });
    trip.cities.forEach(function (c) {
      var p = proj(c[1], c[2]);
      el('circle', { class: 'city-dot', cx: p[0], cy: p[1], r: 3.2 }, g);
      el('text', { class: 'city', x: p[0] + 9, y: p[1] + 6 }, g).textContent = c[0];
    });

    // compass
    var cg = el('g', { transform: 'translate(944 64)' }, g);
    el('circle', { class: 'compass', r: 26 }, cg);
    el('path', { d: 'M0 -20 L6 4 L0 0 L-6 4Z', fill: 'var(--red)' }, cg);
    el('text', { class: 'compass-t', y: -32, 'text-anchor': 'middle' }, cg).textContent = 'N';

    // route
    var pts = trip.stops.map(function (s) { return proj(s.lon, s.lat); });
    var d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
      var bend = .16; // gentle arc, like a flight path
      d += 'Q' + f1(mx - dy * bend) + ' ' + f1(my + dx * bend) + ' ' + f1(b[0]) + ' ' + f1(b[1]);
    }
    stopsG = el('g', {}, svg);
    el('path', { class: 'route-bg', d: d }, stopsG);
    routePath = el('path', { class: 'route', d: d }, stopsG);
    var total = routePath.getTotalLength();
    // cumulative length at each stop: walk the path and find nearest sample
    cum = [0];
    var samples = 600, si = 1;
    for (var k = 1; k < pts.length; k++) {
      var best = Infinity, bestL = 0;
      for (var j = si; j <= samples; j++) {
        var L = total * j / samples, q = routePath.getPointAtLength(L), dd = (q.x - pts[k][0]) * (q.x - pts[k][0]) + (q.y - pts[k][1]) * (q.y - pts[k][1]);
        if (dd < best) { best = dd; bestL = L; si = j; }
      }
      cum.push(bestL);
    }
    cum[cum.length - 1] = total;
    routePath.style.strokeDasharray = total + ' ' + total;
    routePath.style.strokeDashoffset = total;
    routePath._total = total;

    leaders = []; dots = [];
    trip.stops.forEach(function (s, i) {
      var p = pts[i];
      leaders.push(el('line', { class: 'leader', x1: p[0], y1: p[1], x2: p[0] + s.off[0], y2: p[1] + s.off[1] }, stopsG));
    });
    trip.stops.forEach(function (s, i) { dots.push(el('circle', { class: 'stop', cx: pts[i][0], cy: pts[i][1], r: 7 }, stopsG)); });

    buildTiles(pts);
    var strip = $('#ticketStrip'); strip.innerHTML = '';
    trip.stops.forEach(function (s) { var im = new Image(); im.src = photo(s.img); im.alt = ''; strip.appendChild(im); });
  }

  /* camera-roll grid → map stamps */
  var GRID = 4, PHOTO_AT = [1, 4, 6, 11, 14];
  function buildTiles(pts) {
    var trip = TRIPS[lang];
    tilesEl.innerHTML = ''; tiles = []; photoTiles = [];
    if (!world) {
      // wrap svg + tiles in one "world" layer so the final zoom-out moves them together
      world = document.createElement('div'); world.className = 'world';
      world.style.cssText = 'position:absolute;inset:0;transform-origin:50% 8%;transition:transform .8s cubic-bezier(.2,.8,.2,1)';
      plate.insertBefore(world, svg); world.appendChild(svg);
      roll = document.createElement('div');
      roll.style.cssText = 'position:absolute;inset:0;background:var(--card)';
      world.appendChild(roll); world.appendChild(tilesEl);
    }
    var pad = 3.2, gap = 1.1, cell = (100 - pad * 2 - gap * (GRID - 1)) / GRID, fill = ['f-shot', 'f-doc', 'f-blank'], fi = 0, pi = 0;
    for (var i = 0; i < GRID * GRID; i++) {
      var r = Math.floor(i / GRID), c = i % GRID, t = document.createElement('div');
      var g = { x: pad + c * (cell + gap), y: pad + r * (cell + gap), w: cell, h: cell };
      var isPhoto = PHOTO_AT.indexOf(i) >= 0;
      if (isPhoto) {
        var s = trip.stops[pi], p = pts[pi], size = 15;
        t.className = 'tile tile--photo';
        t.innerHTML = '<img alt="" src="' + photo(s.img) + '"><span class="tile__cap"><b>' + s.name + '</b>' + s.t + '</span>';
        t._grid = g;
        t._map = { x: (p[0] + s.off[0]) / 10 - size / 2, y: (p[1] + s.off[1]) / 10 - size / 2, w: size, h: size };
        t._i = pi; photoTiles.push(t); pi++;
      } else {
        t.className = 'tile tile--filler ' + fill[fi++ % 3];
        t.innerHTML = '<i></i>';
        t._grid = g;
      }
      tiles.push(t); tilesEl.appendChild(t);
    }
  }

  /* ================= scroll choreography ================= */
  var beats = $$('.beat'), ticker = $('#ticker'), ticket = $('#ticket');
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function seg(f, a, b) { return clamp((f - a) / (b - a), 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function phase() {
    // continuous 0..3 across the four beats, measured at 55% of the viewport
    var y = innerHeight * .55, c = beats.map(function (b) { var r = b.getBoundingClientRect(); return r.top + r.height / 2; });
    if (y <= c[0]) return 0;
    for (var i = 0; i < c.length - 1; i++) if (y < c[i + 1]) return i + (y - c[i]) / (c[i + 1] - c[i]);
    return c.length - 1;
  }

  var lastHot = -2, lastF = -1;
  function render() {
    var f = phase();
    if (motion.matches) f = Math.round(f);
    if (Math.abs(f - lastF) < .001) return;
    lastF = f;
    beats.forEach(function (b, i) { b.classList.toggle('is-on', Math.round(f) === i); });

    // 1) roll fades, fillers drift away
    var fade = seg(f, .25, .8);
    roll.style.opacity = 1 - fade;
    tiles.forEach(function (t) {
      if (t._map) return;
      t.style.left = t._grid.x + '%'; t.style.top = t._grid.y + '%'; t.style.width = t._grid.w + '%'; t.style.height = t._grid.h + '%';
      t.style.opacity = 1 - seg(f, .2, .6);
      t.style.transform = 'scale(' + (1 - .15 * fade) + ')';
    });
    // 2) photos fly to their places, staggered
    photoTiles.forEach(function (t) {
      var k = ease(seg(f, .35 + t._i * .07, .85 + t._i * .07)), g = t._grid, m = t._map;
      t.style.left = lerp(g.x, m.x, k) + '%'; t.style.top = lerp(g.y, m.y, k) + '%';
      t.style.width = lerp(g.w, m.w, k) + '%'; t.style.height = lerp(g.h, m.h, k) + '%';
      t.style.transform = 'rotate(' + (k * ((t._i % 2) ? 3 : -3)) + 'deg)';
      t.classList.toggle('is-map', k > .95);
    });
    var pinsIn = seg(f, .9, 1.15);
    leaders.forEach(function (l) { l.style.opacity = pinsIn * .4; });
    dots.forEach(function (d) { d.style.opacity = pinsIn; });

    // 3) route draws stop to stop
    var n = cum.length - 1, rp = seg(f, 1.15, 2.55) * n, k2 = Math.min(Math.floor(rp), n - 1), fr = rp - k2;
    var L = rp >= n ? cum[n] : lerp(cum[k2], cum[k2 + 1], ease(fr));
    routePath.style.strokeDashoffset = routePath._total - L;
    var hot = f < 1.05 ? -1 : (rp >= n ? n : (fr > .92 ? k2 + 1 : k2));
    if (f > 2.75) hot = -1;
    if (hot !== lastHot) {
      lastHot = hot;
      photoTiles.forEach(function (t) { t.classList.toggle('is-hot', t._i === hot); t.style.zIndex = t._i === hot ? 5 : ''; });
      dots.forEach(function (d, i) { d.setAttribute('r', i === hot ? 11 : 7); });
      if (hot >= 0) {
        var s = TRIPS[lang].stops[hot];
        $('#tickerDay').textContent = T[lang].day(s.d) + ' · ' + s.t;
        $('#tickerPlace').textContent = s.name;
      }
    }
    ticker.classList.toggle('is-on', hot >= 0);

    // 4) overview + record
    var end = f > 2.7;
    world.style.transform = end ? 'scale(.64)' : '';
    if (end !== ticket.classList.contains('is-on')) {
      ticket.classList.toggle('is-on', end);
      $$('img', $('#ticketStrip')).forEach(function (im, i) { im.style.transitionDelay = end ? (.35 + i * .16) + 's' : '0s'; im.classList.toggle('is-lit', end); });
    }
  }
  var ticking = false;
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; render(); nav(); }); }
  }
  function nav() { $('.nav').classList.toggle('is-solid', scrollY > 24); }

  /* ================= reveal ================= */
  var rio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
  }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('.sec-head, .duo__item, .ledger li, .vows li, .privacy .title, .final__in > *').forEach(function (n, i) {
    n.classList.add('rv'); n.style.transitionDelay = ((i % 3) * .08) + 's'; rio.observe(n);
  });

  /* ================= controls ================= */
  function setLang(l) {
    lang = l;
    try { localStorage.setItem('trace.lang', l); } catch (e) {}
    var url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', l);
      try { history.replaceState(null, '', url); } catch (e) {}
    }
    applyCopy(); setVideos(); buildMap(); lastF = -1; lastHot = -2; ticket.classList.remove('is-on'); render();
  }
  $('#langBtn').addEventListener('click', function () { setLang(lang === 'zh' ? 'en' : 'zh'); });
  $('#themeBtn').addEventListener('click', function () {
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('trace.theme', root.dataset.theme); } catch (e) {}
  });

  applyCopy(); setVideos(); buildMap(); render(); nav();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { lastF = -1; onScroll(); });
})();
