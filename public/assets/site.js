(() => {
  // ---------- the cloud ----------
  const PATH = (() => {
    const out = [];
    for (let i = 0; i <= 180; i++) {
      const t = i / 180 * 2 * Math.PI;
      const lobe = Math.pow(Math.abs(Math.cos(4 * t + 0.2)), 0.7);
      const k = 0.93 + 0.043 * (2 * lobe - 1) + 0.012 * Math.sin(2 * t + 1);
      out.push((i ? 'L' : 'M') + (50 + 50 * k * Math.cos(t)).toFixed(2) + ' ' + (50 + 50 * k * Math.sin(t)).toFixed(2));
    }
    return out.join(' ') + ' Z';
  })();
  const MOODS = {
    asleep:    { eyes: 'closed', mouth: 'snore', mark: 'zzz', scale: .9, glow: '#8E86C9', gs: .35, tint: '#8A8FB8', ta: .3, breath: 5.5, motion: '', drops: 1, speed: .15, reach: .06 },
    relaxed:   { eyes: 'open', mouth: '', mark: '', scale: 1, glow: '#B07CFF', gs: .55, tint: '#000', ta: 0, breath: 3.3, motion: '', drops: 2, speed: .35, reach: .12 },
    busy:      { eyes: 'open', mouth: '', mark: '', scale: 1.08, glow: '#6FC8FF', gs: .75, tint: '#000', ta: 0, breath: 1.6, motion: 'nhopsm .6s ease-in-out infinite', drops: 4, speed: 1.1, reach: .14 },
    asking:    { eyes: 'wide', mouth: 'oh', mark: 'bang', scale: 1.12, glow: '#FFD426', gs: .8, tint: '#FFE27A', ta: .12, breath: 1.6, motion: 'nhop .62s ease-in-out infinite', drops: 3, speed: .9, reach: .22 },
    impatient: { eyes: 'squint', mouth: 'wobble', mark: 'sweat', scale: 1.2, glow: '#FFA53A', gs: .85, tint: '#FFB347', ta: .22, breath: 1.1, motion: 'nhopsm .31s ease-in-out infinite', drops: 4, speed: 1.5, reach: .2 },
    angry:     { eyes: 'angry', mouth: 'frown', mark: 'vein', scale: 1.3, glow: '#FF4D4D', gs: 1, tint: '#FF5A5A', ta: .5, breath: .7, motion: 'nshake .14s linear infinite', drops: 7, speed: 2.6, reach: .3 },
    happy:     { eyes: 'happy', mouth: 'grin', mark: 'spark', scale: 1.1, glow: '#FF9BE0', gs: .8, tint: '#FFC2EC', ta: .15, breath: 1.4, motion: 'nhop .45s ease-in-out infinite', drops: 5, speed: 1.1, reach: .2 },
    lonely:    { eyes: 'sad', mouth: 'frown', mark: 'tear', scale: .86, glow: '#7D8BC4', gs: .35, tint: '#7F8FB8', ta: .32, breath: 6.6, motion: '', drops: 1, speed: .12, reach: .04 }
  };
  const INK = '#24163A';
  const EYES = {
    open: `<g class="nb-blink"><ellipse cx="48.5" cy="46" rx="6" ry="9" fill="${INK}"/><ellipse cx="67.5" cy="47" rx="6" ry="9" fill="${INK}"/><ellipse cx="46.8" cy="42" rx="2" ry="2.2" fill="#fff" fill-opacity=".2"/><ellipse cx="65.8" cy="43" rx="2" ry="2.2" fill="#fff" fill-opacity=".2"/></g>`,
    wide: `<g class="nb-blink"><ellipse cx="48.5" cy="46" rx="7.1" ry="10.6" fill="${INK}"/><ellipse cx="67.5" cy="47" rx="7.1" ry="10.6" fill="${INK}"/><ellipse cx="46.8" cy="42" rx="2.2" ry="2.4" fill="#fff" fill-opacity=".55"/><ellipse cx="65.8" cy="43" rx="2.2" ry="2.4" fill="#fff" fill-opacity=".55"/></g>`,
    happy: `<g fill="none" stroke="${INK}" stroke-width="3.8" stroke-linecap="round"><path d="M42 48 Q48.5 40 55 48"/><path d="M61 49 Q67.5 41 74 49"/></g>`,
    closed: `<g fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"><path d="M42 46 Q48.5 51 55 46"/><path d="M61 47 Q67.5 52 74 47"/></g>`,
    squint: `<g fill="${INK}"><ellipse cx="48.5" cy="47" rx="6.6" ry="3.6"/><ellipse cx="67.5" cy="48" rx="6.6" ry="3.6"/></g>`,
    angry: `<g><ellipse cx="48.5" cy="48" rx="6" ry="7.5" fill="${INK}"/><ellipse cx="67.5" cy="49" rx="6" ry="7.5" fill="${INK}"/><path d="M41 38 L55 43 M75 39 L61 44" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/></g>`,
    sad: `<g><ellipse cx="48.5" cy="49" rx="5.5" ry="7" fill="${INK}"/><ellipse cx="67.5" cy="50" rx="5.5" ry="7" fill="${INK}"/><path d="M42 42 L55 38 M74 43 L61 39" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`
  };
  const MOUTHS = {
    '': '',
    frown: `<path d="M53 65 Q58 59 63 65" fill="none" stroke="${INK}" stroke-opacity=".85" stroke-width="2.8" stroke-linecap="round"/>`,
    wobble: `<path d="M51 62 q1.75 -2.4 3.5 0 t3.5 0 t3.5 0 t3.5 0" fill="none" stroke="${INK}" stroke-opacity=".85" stroke-width="2.8" stroke-linecap="round"/>`,
    grin: `<path d="M51.5 59 L64.5 59 Q64.5 67 58 67 Q51.5 67 51.5 59 Z" fill="${INK}" fill-opacity=".85"/>`,
    oh: `<ellipse cx="58" cy="62" rx="2.6" ry="3.3" fill="${INK}" fill-opacity=".85"/>`,
    snore: `<circle cx="58" cy="62" r="1.8" fill="${INK}" fill-opacity=".6"/>`
  };
  const MARKS = {
    '': '',
    zzz: `<g class="nb-float" fill="#C9C4FF" font-family="Fredoka, ui-rounded, sans-serif" font-weight="600"><text x="86" y="14" font-size="11">z</text><text x="95" y="3" font-size="15">z</text></g>`,
    bang: `<text class="nb-float" x="88" y="10" font-size="26" font-weight="700" fill="#FFD426" font-family="Fredoka, ui-rounded, sans-serif">!</text>`,
    sweat: `<path d="M12 14 Q16 21 16 24 A4 4 0 0 1 8 24 Q8 21 12 14 Z" fill="#7FD0FF"/>`,
    vein: `<path d="M86 6 Q90 10 86 14 M98 6 Q94 10 98 14 M86 6 Q90 2 94 6 M90 14 Q94 18 98 14" stroke="#FF4D4D" stroke-width="3" stroke-linecap="round" fill="none"/>`,
    spark: `<g class="nb-float" font-family="sans-serif"><text x="88" y="8" font-size="14" fill="#FFE066">✦</text><text x="2" y="18" font-size="10" fill="#FF9BE0">✦</text><text x="96" y="84" font-size="9" fill="#fff">✦</text></g>`,
    tear: `<path d="M44 56 Q47 62 47 64 A3 3 0 0 1 41 64 Q41 62 44 56 Z" fill="#7FD0FF"/>`
  };
  const DEFS = `<defs>
    <linearGradient id="nbBase" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7FD0FF"/><stop offset=".5" stop-color="#B9B4FF"/><stop offset="1" stop-color="#F3B6EC"/></linearGradient>
    <radialGradient id="nbSky" cx=".12" cy=".5" r=".55"><stop offset="0" stop-color="#56BFFF" stop-opacity=".9"/><stop offset="1" stop-color="#56BFFF" stop-opacity="0"/></radialGradient>
    <radialGradient id="nbBlush" cx=".85" cy=".12" r=".5"><stop offset="0" stop-color="#F6A9E4" stop-opacity=".85"/><stop offset="1" stop-color="#F6A9E4" stop-opacity="0"/></radialGradient>
    <radialGradient id="nbCore" cx=".44" cy=".62" r=".36"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="nbTail" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7FD0FF"/><stop offset="1" stop-color="#B9B4FF"/></linearGradient>
    <clipPath id="nbClip"><path d="${PATH}"/></clipPath>
    <filter id="nbRim" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.8"/></filter>
  </defs>`;
  // The gradients are shared: define them once for the whole page.
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${DEFS}</svg>`);

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clouds = [];
  class Cloud {
    constructor(host) {
      this.host = host;
      const d = host.dataset;
      this.size = +d.size || 200;
      this.still = 'still' in d;
      this.uniform = 'uniform' in d;
      this.tail = 'tail' in d;
      this.badge = 'badge' in d;
      this.rain = 'rain' in d;
      this.ring = 'ring' in d;
      this.rainfall = 'rainfall' in d && !reduced;
      this.follows = !this.still && d.follows !== 'false';
      host.setAttribute('aria-hidden', 'true');
      this.set(d.cloud);
      clouds.push(this);
    }
    set(mood) {
      this.mood = MOODS[mood] ? mood : 'relaxed';
      const e = MOODS[this.mood], s = this.size;
      const W = Math.round(s * 1.5), svg = Math.round(s * 1.2), pad = Math.round((W - svg) / 2);
      const dot = Math.max(3, Math.round(s * .07)), R = s * (.5 + e.reach);
      const scale = this.still || this.uniform ? 1 : e.scale;
      const alpha = Math.round(e.gs * 255).toString(16).padStart(2, '0');
      let drops = '';
      if (!this.still) {
        const dur = (2 * Math.PI / e.speed).toFixed(2);
        for (let i = 0; i < e.drops; i++) {
          drops += `<div class="nb-orbit" style="animation-duration:${dur}s;animation-delay:${-(dur * i / e.drops).toFixed(2)}s"><i style="width:${dot}px;height:${dot}px;left:${Math.round(R - dot / 2)}px;top:${Math.round(-dot / 2)}px;box-shadow:0 0 ${dot}px ${e.glow}"></i></div>`;
        }
      }
      this.k = e.eyes === 'closed' ? 0 : (e.eyes === 'happy' || e.eyes === 'sad') ? .4 : 1;
      this.host.innerHTML = `<div class="nb-cloud" style="width:${W}px;height:${W}px;transform:scale(${scale})">
        <div class="nb-motion" style="${this.still || !e.motion ? '' : 'animation:' + e.motion}">
          ${drops}
          <div class="nb-body" style="left:${pad}px;top:${pad}px;width:${svg}px;height:${svg}px;animation-duration:${e.breath}s;filter:drop-shadow(0 0 ${Math.round(s * .04 * (.6 + e.gs))}px ${e.glow}) drop-shadow(0 0 ${Math.round(s * .14 * e.gs)}px ${e.glow}${alpha})">
            <svg viewBox="-10 -10 120 120" width="${svg}" height="${svg}">
              ${this.tail ? '<path d="M24 72 Q20 92 4 106 Q32 102 52 84 Z" fill="url(#nbTail)" stroke="#9FD9FF" stroke-opacity=".6" stroke-width="1.5" stroke-linejoin="round"/>' : ''}
              <g clip-path="url(#nbClip)">
                <path d="${PATH}" fill="url(#nbBase)"/><path d="${PATH}" fill="url(#nbSky)"/><path d="${PATH}" fill="url(#nbBlush)"/><path d="${PATH}" fill="url(#nbCore)"/>
                <path d="${PATH}" fill="${e.tint}" fill-opacity="${e.ta}"/>
                <path d="${PATH}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" filter="url(#nbRim)"/>
              </g>
              <g class="nb-face">${EYES[e.eyes]}${MOUTHS[e.mouth]}</g>
              ${this.still ? '' : MARKS[e.mark]}
              ${this.badge ? '<circle cx="91" cy="9" r="17" fill="#F2B33D" fill-opacity=".22"/><circle cx="91" cy="9" r="11.5" fill="#F2B33D"/>' : ''}
              ${this.rain ? [[18, 106, 1], [40, 118, .9], [62, 106, .8]].map(([x, y, k]) => `<path d="M${x} ${y - 16 * k} Q${x + 7 * k} ${y - 5 * k} ${x + 7 * k} ${y} A${7 * k} ${7 * k} 0 0 1 ${x - 7 * k} ${y} Q${x - 7 * k} ${y - 5 * k} ${x} ${y - 16 * k} Z" fill="#7FD0FF"/>`).join('') : ''}
              ${this.ring ? '<circle cx="50" cy="50" r="66" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="9"/><path d="M50 -16 A66 66 0 1 1 -16 50" fill="none" stroke="url(#nbBase)" stroke-width="9" stroke-linecap="round"/>' : ''}
            </svg>
          </div>
        </div>
        ${this.rainfall ? `<div class="nb-rainfall">${Array.from({ length: 16 }, (_, i) => `<i style="left:${(i * 61) % 100}%;animation-delay:${(-(i * .37) % 1).toFixed(2)}s;animation-duration:${(.8 + (i % 4) * .12).toFixed(2)}s"></i>`).join('')}</div>` : ''}
      </div>`;
      this.face = this.host.querySelector('.nb-face');
      this.look();
    }
    look() {
      if (!this.face) return;
      const k = this.follows ? this.k : 0;
      this.face.style.transform = `translate(${(gaze.x(this) * 14 * k).toFixed(2)}px, ${(gaze.y(this) * 12 * k).toFixed(2)}px)`;
    }
  }

  // Every cloud looks at the cursor, wherever it is on the page.
  const pointer = { x: null, y: null };
  const gaze = {
    calc(c) {
      if (pointer.x === null) return { x: 0, y: 0 };
      const r = c.host.getBoundingClientRect();
      const reach = Math.max(180, r.width * 1.2), cl = (v) => Math.max(-1, Math.min(1, v));
      return { x: cl((pointer.x - (r.left + r.width / 2)) / reach), y: cl((pointer.y - (r.top + r.height / 2)) / reach) };
    },
    x(c) { return (c._g = this.calc(c)).x; },
    y(c) { return (c._g || this.calc(c)).y; }
  };
  let raf = 0;
  const lookAll = () => { raf = 0; clouds.forEach((c) => c.follows && c.look()); };
  window.addEventListener('pointermove', (ev) => { pointer.x = ev.clientX; pointer.y = ev.clientY; if (!raf) raf = requestAnimationFrame(lookAll); }, { passive: true });
  window.addEventListener('scroll', () => { if (pointer.x !== null && !raf) raf = requestAnimationFrame(lookAll); }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer.x = pointer.y = null; lookAll(); });

  document.querySelectorAll('[data-cloud]').forEach((el) => new Cloud(el));
  const stageCloud = clouds.find((c) => c.host.id === 'stageCloud');

  // ---------- the playable stage ----------
  const STEPS = [
    { label: 'Nothing running', mood: 'asleep', color: '#8E86C9', glow: 'rgba(142,134,201,.10)', caption: 'No agents. It naps.', toast: '', glyphs: [] },
    { label: '3 agents working', mood: 'busy', color: '#6FC8FF', glow: 'rgba(111,200,255,.14)', caption: 'One droplet per agent, circling while they work.', toast: '', glyphs: ['w', 'w', 'w'] },
    { label: 'An agent asks something', mood: 'asking', color: '#FFD426', glow: 'rgba(255,212,38,.16)', caption: 'claude-5 wants to know: freeze time, or widen the window?', toast: 'Agent needs you', glyphs: ['a', 'w', 'w'] },
    { label: 'Ignore it for 3 minutes', mood: 'angry', color: '#FF4D4D', glow: 'rgba(255,77,77,.18)', caption: 'Three minutes. It has opinions about that.', toast: 'Hey! It’s been waiting 3 min', glyphs: ['a', 'a', 'w'] },
    { label: 'Answer it', mood: 'happy', color: '#FF9BE0', glow: 'rgba(255,155,224,.16)', caption: 'Answered from the keyboard. Back to work.', toast: '', glyphs: ['d', 'w', 'w'] }
  ];
  const stepsEl = document.getElementById('steps');
  STEPS.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'step'; b.dataset.a = 'step'; b.id = 'step-' + i;
    b.innerHTML = `<span class="dot" style="background:${s.color};box-shadow:0 0 10px ${s.color}"></span>${s.label}`;
    b.addEventListener('click', () => pick(i, true));
    stepsEl.appendChild(b);
  });
  const toast = document.getElementById('toast');
  function pick(i, user) {
    const s = STEPS[i];
    stepsEl.querySelectorAll('.step').forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
    stageCloud.set(s.mood);
    document.getElementById('halo').style.background = `radial-gradient(420px 320px at 50% 48%, ${s.glow}, transparent 70%)`;
    document.getElementById('caption').textContent = s.caption;
    document.getElementById('edge').innerHTML = s.glyphs.map((g) => `<span class="glyph ${g}"></span>`).join('');
    toast.hidden = !s.toast; toast.textContent = s.toast;
    if (user && window.gsap && !reduced) {
      gsap.fromTo(stageCloud.host, { scale: .82 }, { scale: 1, duration: .7, ease: 'elastic.out(1, .45)' });
      if (s.toast) gsap.fromTo(toast, { x: 24, scale: .5, opacity: 0 }, { x: 0, scale: 1, opacity: 1, duration: .45, ease: 'back.out(1.8)' });
    }
  }
  pick(1, false);

  // Menu bar glyphs: the cloud with its eyes cut out.
  document.querySelectorAll('.mbcloud').forEach((el) => {
    el.innerHTML = `<svg viewBox="0 0 100 100" width="16" height="16"><path fill="#fff" fill-rule="evenodd" d="${PATH} M45 46 m-7 0 a7 10 0 1 0 14 0 a7 10 0 1 0 -14 0 Z M64 47 m-7 0 a7 10 0 1 0 14 0 a7 10 0 1 0 -14 0 Z"/></svg>`;
  });

  // ---------- the cloud's forms (NimbiKit's CloudForm) ----------
  // 240 points each, clockwise from the top, so an outline springs from one form to the next
  // point by point. Shared by Tempo's stage and the notch stage.
  const FORMS = (() => {
    const N = 240, TAU = Math.PI * 2;
    const poly = (v, per = 40) => { const o = []; v.forEach((a, i) => { const b = v[(i + 1) % v.length]; for (let k = 0; k < per; k++) o.push([a[0] + (b[0] - a[0]) * k / per, a[1] + (b[1] - a[1]) * k / per]); }); return o; };
    const smooth = (p, n) => { for (let s = 0; s < n; s++) p = p.map((c, i) => { const a = p[(i - 1 + p.length) % p.length], b = p[(i + 1) % p.length]; return [(a[0] + 2 * c[0] + b[0]) / 4, (a[1] + 2 * c[1] + b[1]) / 4]; }); return p; };
    function resample(pts) {
      let area = 0; pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length]; area += a[0] * b[1] - b[0] * a[1]; });
      if (area < 0) pts = pts.slice().reverse();
      let top = 0; pts.forEach((p, i) => { const t = pts[top]; if (p[1] < t[1] - 1e-6 || (Math.abs(p[1] - t[1]) < 1e-6 && Math.abs(p[0]) < Math.abs(t[0]))) top = i; });
      pts = pts.slice(top).concat(pts.slice(0, top));
      const L = [0]; for (let i = 1; i <= pts.length; i++) { const p = pts[i - 1], q = pts[i % pts.length]; L.push(L[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1])); }
      const total = L[L.length - 1], out = []; let j = 0;
      for (let k = 0; k < N; k++) { const d = k / N * total; while (L[j + 1] < d) j++; const p = pts[j], q = pts[(j + 1) % pts.length], f = (d - L[j]) / ((L[j + 1] - L[j]) || 1); out.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]); }
      return out;
    }
    function crescent() {
      const R = .84, r = .72, cx = .36, cy = -.26, lit = [];
      for (let i = 0; i < 720; i++) { const t = i / 720 * TAU, x = R * Math.cos(t), y = R * Math.sin(t); if (Math.hypot(x - cx, y - cy) >= r) lit.push([x, y, t]); }
      let gap = 0; for (let i = 1; i < lit.length; i++) if (lit[i][2] - lit[i - 1][2] > .05) gap = i;
      const arc = lit.slice(gap).concat(lit.slice(0, gap)).map((p) => [p[0], p[1]]);
      const a0 = arc[0], a1 = arc[arc.length - 1];
      const t0 = Math.atan2(a1[1] - cy, a1[0] - cx); let t1 = Math.atan2(a0[1] - cy, a0[0] - cx);
      while (t1 > t0) t1 -= TAU;
      const back = []; for (let i = 0; i <= 160; i++) { const t = t0 + (t1 - t0) * i / 160; back.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
      return arc.concat(back);
    }
    return {
      cloud: { pts: Array.from({ length: N }, (_, i) => { const t = -Math.PI / 2 + i / N * TAU, lobe = Math.pow(Math.abs(Math.cos(4 * t + .2)), .7), k = .93 + .043 * (2 * lobe - 1) + .012 * Math.sin(2 * t + 1); return [k * Math.cos(t), k * Math.sin(t)]; }), face: [.08, 0], eyes: 1 },
      hourglass: { pts: resample(smooth(poly([[-.62, -.92], [.62, -.92], [.62, -.74], [.13, -.1], [.13, .1], [.66, .74], [.66, .92], [-.66, .92], [-.66, .74], [-.13, .1], [-.13, -.1], [-.62, -.74]]), 4)), face: [0, .27], eyes: .7 },
      bell: { pts: resample(smooth(poly([[-.1, -.94], [.1, -.94], [.13, -.8], [.44, -.64], [.6, -.2], [.64, .36], [.9, .66], [.9, .8], [-.9, .8], [-.9, .66], [-.64, .36], [-.6, -.2], [-.44, -.64], [-.13, -.8]]), 4)), face: [0, .04], eyes: .9 },
      mug: { pts: resample(smooth(poly([[-.66, -.5], [.44, -.5], [.44, -.34], [.82, -.3], [.92, .04], [.8, .38], [.44, .42], [.44, .6], [.26, .82], [-.48, .82], [-.66, .6]]), 4)), face: [-.06, .07], eyes: .9 },
      moon: { pts: resample(smooth(crescent(), 3)), face: [-.22, .07], eyes: .78 }
    };
  })();

  // ---------- Tempo: the cloud becomes the tool ----------
  // The same forms as NimbiKit's CloudForm: 240 points each, clockwise from the top, so the
  // outline springs from one to the next point by point.
  (() => {
    const host = document.getElementById('tempoStage');
    if (!host) return;
    const N = 240, TAU = Math.PI * 2;
    const MOMENTS = [
      { label: 'Focus', dot: '#0A84FF', form: 'hourglass', mood: 'busy', ring: '#0A84FF', minutes: 25, phase: 'Focus · 2 of 4' },
      { label: 'Time’s up', dot: '#F2B33D', form: 'bell', mood: 'asking', ring: '#F2B33D', minutes: 0, phase: 'A break is next' },
      { label: 'Short break', dot: '#30D158', form: 'mug', mood: 'happy', ring: '#30D158', minutes: 5, phase: 'Back to it at 14:50' },
      { label: 'Long break', dot: '#8E86C9', form: 'moon', mood: 'asleep', ring: '#30D158', minutes: 15, phase: 'Four done. Rest.' },
      { label: 'Paused', dot: '#B07CFF', form: 'cloud', mood: 'relaxed', ring: '#0A84FF', minutes: 25, phase: 'The cloud is waiting' }
    ];
    host.innerHTML = `<svg viewBox="-36 -36 172 172" role="img" aria-label="The Tempo cloud">
      <defs><clipPath id="tempoClip"><path class="shape-d"/></clipPath></defs>
      <circle cx="50" cy="50" r="80" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="5"/>
      <circle class="ring" cx="50" cy="50" r="80" fill="none" stroke-width="5" stroke-linecap="round" transform="rotate(-90 50 50)" pathLength="100" stroke-dasharray="100 100"/>
      <g class="swing"><g class="shape">
        <g clip-path="url(#tempoClip)">
          <path class="shape-d" fill="url(#nbBase)"/><path class="shape-d" fill="url(#nbSky)"/><path class="shape-d" fill="url(#nbBlush)"/><path class="shape-d" fill="url(#nbCore)"/>
          <path class="sand" fill="#24163A" fill-opacity=".2"/>
          <path class="shape-d" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" filter="url(#nbRim)"/>
        </g>
        <g class="steam" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.6" stroke-linecap="round"><path d="M38 20 q4 -6 0 -12 t0 -12"/><path d="M50 20 q4 -6 0 -12 t0 -12"/><path d="M62 20 q4 -6 0 -12 t0 -12"/></g>
        <g class="tface"><g class="nb-face"></g></g>
        <g class="mark"></g>
      </g></g>
    </svg>`;
    const shapes = host.querySelectorAll('.shape-d'), shapeG = host.querySelector('.shape'), swing = host.querySelector('.swing');
    const tface = host.querySelector('.tface'), face = host.querySelector('.nb-face'), mark = host.querySelector('.mark');
    const ring = host.querySelector('.ring'), sand = host.querySelector('.sand'), steam = host.querySelector('.steam');
    const timeEl = document.getElementById('tempoTime'), phaseEl = document.getElementById('tempoPhase');
    const pts = FORMS.cloud.pts.map((p) => p.slice()), vel = pts.map(() => [0, 0]);
    let target = FORMS.cloud, moment = null, started = 0, raf = 0, last = 0, visible = true, auto = !reduced, step = 0, timer = 0;
    const draw = () => { const d = pts.map(([x, y], i) => (i ? 'L' : 'M') + (50 + 50 * x).toFixed(2) + ' ' + (50 + 50 * y).toFixed(2)).join(' ') + ' Z'; shapes.forEach((p) => p.setAttribute('d', d)); };
    function show(i, user) {
      const m = MOMENTS[i]; moment = m; started = performance.now(); target = FORMS[m.form];
      const e = MOODS[m.mood];
      face.innerHTML = EYES[e.eyes] + MOUTHS[e.mouth];
      mark.innerHTML = MARKS[e.mark] || '';
      const [fx, fy] = target.face, k = target.eyes;
      tface.setAttribute('transform', `translate(${(58 + 100 * (fx - .08)).toFixed(1)} ${(46.5 + 100 * fy).toFixed(1)}) scale(${k}) translate(-58 -46.5)`);
      shapeG.style.filter = `drop-shadow(0 0 6px ${e.glow}) drop-shadow(0 0 22px ${e.glow}99)`;
      ring.setAttribute('stroke', m.ring);
      swing.setAttribute('class', 'swing' + (m.form === 'bell' && !reduced ? ' bell' : ''));
      steam.style.display = m.form === 'mug' ? '' : 'none';
      phaseEl.textContent = m.phase;
      stepsEl2.querySelectorAll('.step').forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
      if (user) { auto = false; clearTimeout(timer); }
      if (reduced) { target.pts.forEach((p, j) => { pts[j][0] = p[0]; pts[j][1] = p[1]; }); draw(); }
      tick(); kick();
    }
    // The minutes run (fast) while a moment shows; the hourglass's sand follows them.
    function tick() {
      if (!moment) return;
      const run = moment.minutes ? Math.min(1, (performance.now() - started) / 9000) : 1;
      const left = moment.minutes * 60 * (1 - (moment.label === 'Paused' ? .48 : run * .35) - (moment.label === 'Paused' ? 0 : .1));
      timeEl.textContent = moment.minutes ? `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(Math.floor(left % 60)).padStart(2, '0')}` : '00:00';
      ring.setAttribute('stroke-dasharray', `${moment.minutes ? (left / (moment.minutes * 60) * 100).toFixed(2) : 100} 100`);
      if (moment.form === 'hourglass') {
        const p = 1 - left / (moment.minutes * 60), h = .72 * p, lvl = -.1 - .72 * (1 - p), w = .1 + .46 * Math.min(1, (-.1 - lvl) / .64);
        sand.setAttribute('d', `M${50 - 50 * w} ${50 + 50 * lvl} L${50 + 50 * w} ${50 + 50 * lvl} L55 45 L45 45 Z M20 93 Q50 ${93 - 100 * h} 80 93 Z`);
      } else sand.setAttribute('d', '');
    }
    function frame(now) {
      raf = 0;
      const dt = Math.min(.033, (now - last) / 1000 || .016); last = now;
      let moving = false;
      pts.forEach((p, i) => {
        for (const a of [0, 1]) {
          const f = 170 * (target.pts[i][a] - p[a]) - 13 * vel[i][a];
          vel[i][a] += f * dt; p[a] += vel[i][a] * dt;
          if (Math.abs(vel[i][a]) > .002 || Math.abs(target.pts[i][a] - p[a]) > .002) moving = true;
        }
      });
      draw(); tick();
      if (visible && (moving || moment)) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && visible && !reduced) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function tour() { if (!auto) return; show(step % MOMENTS.length, false); step++; timer = setTimeout(tour, 3600); }
    const stepsEl2 = document.getElementById('tempoSteps');
    MOMENTS.forEach((m, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'step';
      b.innerHTML = `<span class="dot" style="background:${m.dot};box-shadow:0 0 10px ${m.dot}"></span>${m.label}`;
      b.addEventListener('click', () => show(i, true));
      stepsEl2.appendChild(b);
    });
    draw();
    // Only animate while the stage is on screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { kick(); if (auto && !timer) tour(); } }).observe(host);
    }
    show(0, false);
    if (auto) { step = 1; timer = setTimeout(tour, 3600); }
  })();

  // ---------- the notch: swipe from app to app (DESIGN.md 18.2a) ----------
  // Every app keeps its own island; a swipe hands the notch to the next one, whose page drifts in.
  // One island shows at a time, as on the Mac. The agents and the forecast are made up.
  (() => {
    const screen = document.getElementById('notchStage'), scale = document.getElementById('notchScale');
    if (!screen || !scale) return;
    const caption = document.getElementById('notchCaption');
    const TAU = Math.PI * 2;
    const pill = (label, key) => `<span class="nst-pill">${label}<span class="nst-key">${key}</span></span>`;
    const cloudBox = (cx, cy, size, mood) => `<span data-cloud="${mood}" data-size="${size}" data-follows="false" style="position:absolute;left:${cx - .75 * size}px;top:${cy - .75 * size}px"></span>`;
    const pageText = (x, mid, name, title, sub, pills) => `<span class="nst-name" style="left:${x}px;top:${mid - 58}px">${name}</span><span class="nst-title" style="left:${x}px;top:${mid - 44}px">${title}</span><span class="nst-sub" style="left:${x}px;top:${mid - 10}px">${sub}</span><span class="nst-pills" style="left:${x}px;top:${mid + 14}px">${pills}</span>`;
    // Tempo's cloud is an hourglass while you focus (NimbiKit's CloudForm).
    const hourglass = () => {
      const f = FORMS.hourglass, d = f.pts.map(([x, y], i) => (i ? 'L' : 'M') + (50 + 50 * x).toFixed(2) + ' ' + (50 + 50 * y).toFixed(2)).join(' ') + ' Z';
      const k = f.eyes, fx = 58 + 100 * (f.face[0] - .08), fy = 46.5 + 100 * f.face[1];
      return `<svg viewBox="-10 -10 120 120" width="110" height="110" style="position:absolute;left:19px;top:57px;overflow:visible;filter:drop-shadow(0 0 6px #6FC8FF) drop-shadow(0 0 18px #6FC8FF88)" aria-hidden="true">
        <defs><clipPath id="nstGlass"><path d="${d}"/></clipPath></defs>
        <g clip-path="url(#nstGlass)"><path d="${d}" fill="url(#nbBase)"/><path d="${d}" fill="url(#nbSky)"/><path d="${d}" fill="url(#nbBlush)"/><path d="${d}" fill="url(#nbCore)"/>
        <path d="M24 26 L76 26 L55 45 L45 45 Z M20 93 Q50 66 80 93 Z" fill="#24163A" fill-opacity=".2"/>
        <path d="${d}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" filter="url(#nbRim)"/></g>
        <g transform="translate(${fx.toFixed(1)} ${fy.toFixed(1)}) scale(${k}) translate(-58 -46.5)">${EYES.open}</g></svg>`;
    };
    const ring = (cx, cy) => `<svg width="100" height="100" viewBox="0 0 100 100" style="position:absolute;left:${cx - 50}px;top:${cy - 50}px" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="6"/><circle cx="50" cy="50" r="42" fill="none" stroke="#0A84FF" stroke-width="6" stroke-linecap="round" pathLength="100" stroke-dasharray="72 100" transform="rotate(-90 50 50)"/><text x="50" y="57" text-anchor="middle" fill="#fff" font-size="20" font-weight="600" font-family="-apple-system, system-ui, sans-serif">18′</text></svg><span class="nst-sub" style="left:${cx - 20}px;top:${cy + 50}px;font-size:10px;color:rgba(255,255,255,.4)">2 of 4</span>`;
    const chip = (x, y, name, color, bg) => `<span class="nst-chip" style="left:${x}px;top:${y}px;width:126px;background:${bg};border:1px solid ${color}55;color:${color}"><b style="background:${color}22"><i style="background:${color}"></i></b>${name}</span>`;
    const PAGES = [
      { id: 'relay', w: 610, h: 172, dots: false, say: 'Relay: its own dashboard, buttons and agents, as always.',
        cloud: cloudBox(64, 99, 50, 'asking'),
        text: `<span class="nst-btn" style="left:18px;top:5px"></span><span class="nst-btn" style="left:48px;top:5px;width:64px;border-radius:11px"></span>
          <span class="nst-btn" style="right:18px;top:5px"></span><span class="nst-btn" style="right:48px;top:5px"></span><span class="nst-btn" style="right:78px;top:5px"></span>
          <span class="nst-card" style="left:14px;top:40px;width:296px;height:118px"></span><span class="nst-card" style="left:318px;top:40px;width:278px;height:118px"></span>
          <span class="nst-title" style="left:112px;top:62px;font-size:15px">claude-5 is asking</span>
          <span class="nst-sub" style="left:112px;top:86px;font-size:12.5px">Freeze time, or widen the window?</span>
          <span class="nst-sub" style="left:112px;top:108px;font-size:12px;color:rgba(255,255,255,.4)">2 working · 1 done</span>
          ${chip(328, 56, 'api-server', '#5AB0FF', 'rgba(10,132,255,.12)')}${chip(462, 56, 'docs', '#30D158', 'rgba(48,209,88,.12)')}${chip(328, 104, 'claude-5', '#FFD426', 'rgba(255,212,38,.10)')}${chip(462, 104, 'tests', '#5AB0FF', 'rgba(10,132,255,.12)')}` },
      { id: 'skyline', w: 580, h: 208, dots: true, say: 'Skyline: the sky for the next twelve hours.',
        cloud: cloudBox(74, 112, 92, 'asleep'),
        text: pageText(140, 112, 'SKYLINE', '18° · clear sky', 'Dry for 12 hours · air good', pill('Forecast', '↩') + pill('Place', 'L')) +
          `<span class="nst-bars" style="left:420px;top:82px">${[3.6, 3.3, 3, 2.7, 2.4, 2.1, 1.9, 1.6, 1.4, 1.2, 1, .8].map((v) => `<i style="height:${Math.round(v * 14)}px"></i>`).join('')}</span><span class="nst-axis" style="left:420px;top:140px"><span>now</span><span>+6h</span><span>+12h</span></span>` },
      { id: 'tempo', w: 580, h: 208, dots: true, say: 'Tempo: an hourglass while you focus.',
        cloud: hourglass(),
        text: pageText(140, 112, 'TEMPO', 'Focus · 18 min left', 'Release notes · until 16:55', pill('Pause', 'space') + pill('Timer', '↩')) + ring(486, 106) },
    ];
    const NS = 'http://www.w3.org/2000/svg';
    const island = document.createElementNS(NS, 'svg'); island.classList.add('nst-island'); island.setAttribute('aria-hidden', 'true');
    const shape = document.createElementNS(NS, 'path'); island.appendChild(shape); scale.appendChild(island);
    const pages = PAGES.map((p) => {
      const el = document.createElement('div'); el.className = 'nst-page'; el.style.width = p.w + 'px'; el.style.height = p.h + 'px'; el.style.marginLeft = -p.w / 2 + 'px';
      el.innerHTML = `<div class="nst-layer nst-text">${p.text}</div><div class="nst-layer nst-cloud">${p.cloud}</div>`;
      el.querySelectorAll('[data-cloud]').forEach((c) => new Cloud(c));
      scale.appendChild(el); return el;
    });
    const hw = document.createElement('div'); hw.className = 'nst-hw'; scale.appendChild(hw);
    const dots = document.createElement('div'); dots.className = 'nst-dots'; scale.appendChild(dots);
    PAGES.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', p.id[0].toUpperCase() + p.id.slice(1)); b.innerHTML = '<i></i>'; b.addEventListener('click', (e) => { e.stopPropagation(); user(); go(i); }); dots.appendChild(b); });
    function islandPath(w, h) { const e = 7, r = 30, x0 = e, x1 = e + w; return `M0 0 Q${x0} 0 ${x0} ${e} L${x0} ${h - r} Q${x0} ${h} ${x0 + r} ${h} L${x1 - r} ${h} Q${x1} ${h} ${x1} ${h - r} L${x1} ${e} Q${x1} 0 ${x1 + e} 0 Z`; }
    let pos = 0, vel = 0, target = 0, cur = -1, drag = null, auto = !reduced, timer = 0, visible = true, raf = 0, last = 0, wheelAcc = 0, wheelQuiet = 0, wheelLock = false;
    const clampI = (i) => Math.max(0, Math.min(PAGES.length - 1, i));
    function go(i) { target = clampI(i); kick(); }
    function user() { auto = false; clearTimeout(timer); }
    function fit() { const k = Math.min(1, (screen.clientWidth - 16) / 640); scale.style.transform = `scale(${k})`; screen.style.height = Math.round(28 + 230 * k + 40) + 'px'; }
    function render() {
      const i = clampI(Math.round(pos)), p = PAGES[i], o = i - pos, a = Math.abs(o);
      if (i !== cur) {
        if (cur >= 0) pages[cur].classList.remove('on');
        pages[i].classList.add('on'); cur = i;
        island.setAttribute('width', p.w + 14); island.setAttribute('height', p.h); island.style.marginLeft = -(p.w + 14) / 2 + 'px';
        shape.setAttribute('d', islandPath(p.w, p.h));
        dots.style.display = p.dots ? 'flex' : 'none'; dots.style.top = (p.h - 12 - 7) + 'px';
        [...dots.children].forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-current', j === i ? 'true' : 'false'); });
        caption.textContent = p.say;
      }
      const el = pages[i];
      el.style.transform = `translateX(${(o * .55 * p.w).toFixed(1)}px)`; el.style.opacity = Math.max(0, 1 - 1.15 * a).toFixed(3);
      el.children[1].style.transform = `translate(${(o * .5 * p.w).toFixed(1)}px, ${(-10 * a).toFixed(1)}px) scale(${(1 - .18 * a).toFixed(3)})`;
      el.children[0].style.transform = `translateX(${(o * .15 * p.w).toFixed(1)}px)`;
    }
    function frame(now) {
      raf = 0; const dt = Math.min(.033, (now - last) / 1000 || .016); last = now;
      if (!drag) { if (reduced) { pos = target; vel = 0; } else { vel += (190 * (target - pos) - 22.5 * vel) * dt; pos += vel * dt; } }
      render();
      if (wheelLock && now - wheelQuiet > 220) { wheelLock = false; wheelAcc = 0; }
      if (visible && (drag || Math.abs(target - pos) > .001 || Math.abs(vel) > .001 || wheelLock)) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function tour() { if (!auto) return; go((Math.round(target) + 1) % PAGES.length); timer = setTimeout(tour, 3600); }
    // Drag (DESIGN.md 18.6): follows the pointer, 30% resistance past the ends; commits past 18% of the width or 0.45 px/ms.
    screen.addEventListener('pointerdown', (e) => { if (e.button !== 0 || e.target.closest('button')) return; user(); screen.setPointerCapture(e.pointerId); drag = { x: e.clientX, start: pos, lx: e.clientX, lt: performance.now(), v: 0 }; vel = 0; kick(); });
    screen.addEventListener('pointermove', (e) => {
      if (!drag) return; const w = PAGES[clampI(Math.round(drag.start))].w * .55, now = performance.now();
      let p = drag.start - (e.clientX - drag.x) / w; if (p < 0) p *= .3; if (p > PAGES.length - 1) p = PAGES.length - 1 + (p - PAGES.length + 1) * .3; pos = p;
      drag.v = (e.clientX - drag.lx) / Math.max(1, now - drag.lt); drag.lx = e.clientX; drag.lt = now;
    });
    const release = () => { if (!drag) return; const moved = pos - drag.start, start = Math.round(drag.start), w = PAGES[start].w; let t = start;
      if (Math.abs(moved) > .18 / .55 || Math.abs(drag.v) > .45) t = start + ((Math.abs(drag.v) > .45 ? -drag.v : moved) > 0 ? 1 : -1);
      vel = -drag.v * 1000 / (.55 * w); drag = null; go(t); };
    screen.addEventListener('pointerup', release); screen.addEventListener('pointercancel', release);
    // Two-finger swipe: past 46 px, one app; then quiet for 220 ms before the next.
    screen.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; e.preventDefault(); user(); wheelQuiet = performance.now();
      if (wheelLock) return; wheelAcc += e.deltaX;
      if (Math.abs(wheelAcc) > 46) { go(Math.round(target) + (wheelAcc > 0 ? 1 : -1)); wheelLock = true; wheelAcc = 0; kick(); }
    }, { passive: false });
    screen.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); user(); go(Math.round(target) + (e.key === 'ArrowRight' ? 1 : -1)); } });
    fit(); window.addEventListener('resize', fit); render();
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) { kick(); if (auto && !timer) timer = setTimeout(tour, 2400); } }).observe(screen);
    else if (auto) timer = setTimeout(tour, 2400);
  })();

  // The log's rail starts at the first dot, wherever text wrapping puts it.
  const rail = document.querySelector('.log .rail'), firstEntry = document.querySelector('.log .entry');
  const placeRail = () => {
    if (!rail || !firstEntry) return;
    const lr = rail.parentElement.getBoundingClientRect(), er = firstEntry.getBoundingClientRect();
    rail.style.top = Math.round(er.top - lr.top + er.height / 2) + 'px';
  };
  placeRail();
  window.addEventListener('resize', placeRail);
  window.addEventListener('load', placeRail);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeRail);

  // ---------- motion ----------
  if (!window.gsap || !window.ScrollTrigger || reduced) return;
  gsap.registerPlugin(ScrollTrigger);
  const q = (k) => document.querySelectorAll(`[data-a="${k}"]`);
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro.from(q('nav'), { y: -24, opacity: 0, duration: .8 })
    .from(q('eyebrow'), { y: 16, opacity: 0, duration: .6 }, '-=.5')
    .from(q('word'), { yPercent: 115, rotate: 6, duration: 1.1, stagger: .09 }, '-=.4')
    .from(q('lede'), { y: 24, opacity: 0, duration: .8 }, '-=.7')
    .from(q('step'), { x: -32, opacity: 0, duration: .6, stagger: .07, ease: 'back.out(1.7)' }, '-=.6')
    .from(q('stage'), { scale: .9, opacity: 0, duration: 1.4, ease: 'expo.out' }, .2);
  // A page opened in a background tab jumps straight to its finished state.
  if (document.visibilityState !== 'visible') intro.progress(1);

  gsap.to(q('progress'), { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
  gsap.to(q('stage'), { yPercent: -8, ease: 'none', scrollTrigger: { trigger: q('stage')[0], start: 'top top', end: 'bottom top', scrub: true } });
  q('reveal').forEach((el) => gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  ScrollTrigger.batch(q('card'), { start: 'top 90%', once: true, onEnter: (els) => gsap.from(els, { y: 90, rotate: (i) => (i % 2 ? 5 : -5), opacity: 0, duration: 1, stagger: .1, ease: 'back.out(1.6)', clearProps: 'transform' }) });
  gsap.fromTo(q('rail'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.log', start: 'top 80%', end: 'bottom 45%', scrub: .5 } });
  gsap.from(q('entry'), { x: 50, opacity: 0, duration: .9, stagger: .18, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.log', start: 'top 80%' } });
  gsap.from(q('relaytext'), { x: -70, opacity: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: q('relaytext')[0], start: 'top 80%' } });
  q('apptext').forEach((el) => gsap.from(el, { x: -70, opacity: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 80%' } }));
  q('appstage').forEach((el) => gsap.from(el, { scale: .92, opacity: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 85%' } }));
  document.querySelectorAll('.relay').forEach((sec) => {
    const k = sec.querySelectorAll('[data-a="kbd"]');
    if (k.length) gsap.from(k, { scale: .4, opacity: 0, duration: .5, stagger: .07, ease: 'back.out(2.5)', clearProps: 'transform', scrollTrigger: { trigger: sec, start: 'top 60%' } });
  });
  gsap.fromTo(q('gif'), { clipPath: 'inset(14% 14% 14% 14% round 24px)', scale: .94 }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', scale: 1, ease: 'none', scrollTrigger: { trigger: q('gif')[0], start: 'top 95%', end: 'top 35%', scrub: .6 } });
  gsap.from(q('footer'), { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: q('footer')[0], start: 'top 95%' } });
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
