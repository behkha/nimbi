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
            </svg>
          </div>
        </div>
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
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  pick(1, false);

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
  gsap.from(q('kbd'), { scale: .4, opacity: 0, duration: .5, stagger: .07, ease: 'back.out(2.5)', clearProps: 'transform', scrollTrigger: { trigger: q('relaytext')[0], start: 'top 60%' } });
  gsap.fromTo(q('gif'), { clipPath: 'inset(14% 14% 14% 14% round 24px)', scale: .94 }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', scale: 1, ease: 'none', scrollTrigger: { trigger: q('gif')[0], start: 'top 95%', end: 'top 35%', scrub: .6 } });
  gsap.from(q('footer'), { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: q('footer')[0], start: 'top 95%' } });
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
