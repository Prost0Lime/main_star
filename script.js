// === МЕМОРИИ (замени под себя) ===
const MEMORIES = [
  { src: "assets/memory1.jpg", caption: "«Наш маленький космос начался с тишины.»" },
  { src: "assets/memory2.jpg", caption: "«Закат пах корицей и ветром.»" },
  { src: "assets/memory3.jpg", caption: "«Смотри — даже звёзды улыбаются.»" },
  { src: "assets/memory4.jpg", caption: "«Ты — моё любимое созвездие.»" },
  { src: "assets/memory5.jpg", caption: "«И в темноте нам светло.»" },
  { src: "assets/memory6.jpg", caption: "«Твоё имя звучит как утренняя звезда.»" },
  { src: "assets/memory7.jpg", caption: "«Мы считали тишину до первого смеха.»" },
  { src: "assets/memory8.jpg", caption: "«Серебро ночи спуталось в твоих волосах.»" },
  { src: "assets/memory9.jpg", caption: "«Доверяю тебе даже самые тихие мечты.»" },
  { src: "assets/memory10.jpg", caption: "«Каждый вдох — как шаг по млечному пути.»" },
  { src: "assets/memory11.jpg", caption: "«Пока ты рядом, вселенная становится тесной.»" },
  { src: "assets/memory12.jpg", caption: "«Ты научила меня слушать свет.»" },
  { src: "assets/memory13.jpg", caption: "«Мы прячем желания в кончиках пальцев.»" },
  { src: "assets/memory14.jpg", caption: "«Искры от твоего взгляда рассыпались кометами.»" },
  { src: "assets/memory15.jpg", caption: "«Вместе мы — карта неба, которую никто не видел.»" },
  { src: "assets/memory16.jpg", caption: "«Ночь дышит нашими секретами.»" },
  { src: "assets/memory17.jpg", caption: "«Ты зажигаешь тёплые орбиты в моём сердце.»" },
  { src: "assets/memory18.jpg", caption: "«Мы шепчем звёздам, чтобы не забыли дорогу назад.»" },
  { src: "assets/memory19.jpg", caption: "«Каждый шаг с тобой звучит как музыка сфер.»" },
  { src: "assets/memory20.jpg", caption: "«Ты — моё вечное «оставайся» даже в темноте.»" },
  { src: "assets/memory21.jpg", caption: "«Мы смеёмся луной и пьём тишину глазами.»" },
  { src: "assets/memory22.jpg", caption: "«В твоих ладонях спрятано северное сияние.»" },
  { src: "assets/memory23.jpg", caption: "«Я верю в чудеса, потому что держу тебя за руку.»" },
  { src: "assets/memory24.jpg", caption: "«Наши тени переплетаются лучше любых созвездий.»" },
  { src: "assets/memory25.jpg", caption: "«Любовь — это когда в темноте видно больше.»" },
];
const FEATURED_COUNT = Math.min(25, MEMORIES.length);

// === ССЫЛКИ НА СЛОИ ===
const intro = document.getElementById('intro');
const scene = document.getElementById('scene');
const skyTop = document.getElementById('skyTop');
const skyMid = document.getElementById('skyMid');
const skyBot = document.getElementById('skyBot');
const horizonTop = document.getElementById('horizonTop');
const horizonMid = document.getElementById('horizonMid');
const horizonBot = document.getElementById('horizonBot');
const sunGroup = document.getElementById('sunGroup');
const sun = document.getElementById('sun');
const clouds = document.getElementById('clouds');
const horizonGlow = document.getElementById('horizonGlow');
const introStarsGroup = document.getElementById('introStars');
let introStarDots = [];
const introText = document.getElementById('introText');

const SVG_NS = 'http://www.w3.org/2000/svg';

const bg = document.getElementById('bg');
const starsLayer = document.getElementById('stars-layer');
const spaceWrapper = document.getElementById('space-wrapper');
const space = document.getElementById('space');
const fx = document.getElementById('fx');
const hint = document.getElementById('hint');
const audioToggle = document.getElementById('audioToggle');

const dpr = Math.min(2, window.devicePixelRatio || 1);

const SPACE_MULTIPLIER = 3.2;
let spaceWidth = window.innerWidth;
let spaceHeight = window.innerHeight;
let viewX = 0;
let viewY = 0;
let maxViewX = 0;
let maxViewY = 0;
let viewInitialized = false;
let panPointerId = null;
let panStartX = 0;
let panStartY = 0;
let originViewX = 0;
let originViewY = 0;
let panMovedDuringGesture = false;
let panJustHappened = false;

// === ЭТАПЫ ИНТРО ===
// Таймлайн (секунды): 0–7 закат, 7–10 ночной переход, 10+ звезды + лампа
const INTRO = {
  SUNSET_DURATION: 4.8,
  BLUE_HOUR: 1.8,
  NIGHT_FALL: 0,
  STARS_DELAY: 0,
  STARS_FADE: 0,
  HOLD: 0.45,
};

const CAMERA = {
  START_OFFSET: 0.62,
  DURATION: 3.4,
  LIFT: 360,
  SCALE: 1.12,
};

INTRO.TWILIGHT_TOTAL = INTRO.BLUE_HOUR + INTRO.NIGHT_FALL;
const finaleTail = INTRO.STARS_DELAY + INTRO.STARS_FADE;
INTRO.TOTAL = INTRO.SUNSET_DURATION + INTRO.TWILIGHT_TOTAL + finaleTail + INTRO.HOLD;

let startTime = null;
let introFinished = false;
let backgroundStarted = false;

function lerp(a,b,t){ return a + (b-a)*t; }
function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }
function easeInOutCubic(x){
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easeOutCubic(x){ return 1 - Math.pow(1 - x, 3); }
function easeOutQuad(x){ return 1 - (1 - x) * (1 - x); }

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function initClouds(){
  if (!clouds) return;
  while (clouds.firstChild) clouds.removeChild(clouds.firstChild);
  const clusterCount = Math.floor(rand(3, 6));
  for (let i = 0; i < clusterCount; i++) {
    const group = document.createElementNS(SVG_NS, 'g');
    const baseX = rand(-40, 260);
    const baseY = rand(230, 320);
    const scale = rand(0.55, 0.9);
    group.setAttribute('transform', `translate(${baseX.toFixed(1)} ${baseY.toFixed(1)}) scale(${scale.toFixed(3)})`);
    const partCount = Math.floor(rand(3, 6));
    for (let p = 0; p < partCount; p++) {
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', rand(-42, 46).toFixed(1));
      circle.setAttribute('cy', rand(-18, 18).toFixed(1));
      circle.setAttribute('r', rand(16, 34).toFixed(1));
      const opacity = (0.68 + Math.random() * 0.24).toFixed(2);
      circle.setAttribute('fill', '#f6f8ff');
      circle.setAttribute('fill-opacity', opacity);
      group.appendChild(circle);
    }
    clouds.appendChild(group);
  }
}

function initIntroStars(){
  if (!introStarsGroup) return;
  introStarsGroup.innerHTML = '';
  const count = 12;
  introStarDots = [];
  for (let i = 0; i < count; i++) {
    const star = document.createElementNS(SVG_NS, 'circle');
    const cx = rand(32, 358);
    const cy = rand(56, 228);
    const base = rand(0.9, 1.85);
    star.setAttribute('cx', cx.toFixed(1));
    star.setAttribute('cy', cy.toFixed(1));
    star.setAttribute('r', base.toFixed(2));
    star.dataset.baseR = base.toFixed(2);
    star.dataset.delay = rand(0, 0.8).toFixed(3);
    star.dataset.wobble = rand(0.18, 0.42).toFixed(3);
    introStarsGroup.appendChild(star);
    introStarDots.push(star);
  }
}

const SKY = {
  top: { day: '#4f7fbc', dusk: '#2f466b', night: '#050b16' },
  mid: { day: '#9ab6e6', dusk: '#465c87', night: '#081327' },
  bot: { day: '#f6c38f', dusk: '#6c4a73', night: '#0b1a2e' },
};

const HORIZON = {
  top: { dusk: '#f3c27f', night: '#162339' },
  mid: { dusk: '#6b4c7c', night: '#0d192c' },
  botOpacity: { dusk: 0.24, night: 0 },
};

function animateIntro(ts){
  if (introFinished) return;
  if(!startTime) startTime = ts;
  const t = (ts - startTime) / 1000;

  const sunsetProgress = easeInOutCubic(clamp(t / INTRO.SUNSET_DURATION, 0, 1));
  const twilightProgress = easeInOutCubic(clamp((t - INTRO.SUNSET_DURATION) / INTRO.TWILIGHT_TOTAL, 0, 1));
  const nightProgress = easeInOutCubic(clamp((t - INTRO.SUNSET_DURATION - INTRO.BLUE_HOUR) / INTRO.NIGHT_FALL, 0, 1));

  if (!backgroundStarted && nightProgress > 0.2) {
    initBackground();
  }

  const stageTop = mixColor(SKY.top.day, SKY.top.dusk, sunsetProgress);
  const stageMid = mixColor(SKY.mid.day, SKY.mid.dusk, sunsetProgress);
  const stageBot = mixColor(SKY.bot.day, SKY.bot.dusk, sunsetProgress);

  skyTop.setAttribute('stop-color', mixColor(stageTop, SKY.top.night, twilightProgress));
  skyMid.setAttribute('stop-color', mixColor(stageMid, SKY.mid.night, twilightProgress));
  skyBot.setAttribute('stop-color', mixColor(stageBot, SKY.bot.night, twilightProgress));

  const horizonTopColor = mixColor(HORIZON.top.dusk, HORIZON.top.night, twilightProgress);
  horizonTop.setAttribute('stop-color', horizonTopColor);
  horizonTop.setAttribute('stop-opacity', (0.94 * (1 - twilightProgress * 0.7)).toFixed(3));
  horizonMid.setAttribute('stop-color', mixColor(HORIZON.mid.dusk, HORIZON.mid.night, twilightProgress));
  horizonMid.setAttribute('stop-opacity', (0.52 * (1 - twilightProgress * 0.88)).toFixed(3));
  horizonBot.setAttribute('stop-opacity', (HORIZON.botOpacity.dusk * (1 - twilightProgress)).toFixed(3));
  horizonGlow.setAttribute('opacity', (0.92 * (1 - twilightProgress) * (1 - nightProgress * 0.8)).toFixed(3));

  const sunY = lerp(560, 720, sunsetProgress);
  const sunScale = lerp(1, 0.78, sunsetProgress);
  sunGroup.setAttribute('transform', `translate(0, ${sunY-560}) scale(${sunScale})`);
  sun.setAttribute('opacity', Math.max(0, 1 - sunsetProgress * 0.85 - twilightProgress * 0.6).toFixed(3));

  const cloudShift = lerp(0, -150, sunsetProgress) + lerp(0, -80, twilightProgress);
  clouds.setAttribute('transform', `translate(${cloudShift}, ${-8 * sunsetProgress})`);
  const cloudOpacity = 0.9 * (1 - sunsetProgress * 0.4) * (1 - twilightProgress) * (1 - nightProgress);
  clouds.setAttribute('opacity', Math.max(0, cloudOpacity).toFixed(3));

  const textOpacity = Math.max(0, 0.95 * (1 - sunsetProgress * 1.1));
  introText.setAttribute('opacity', textOpacity.toFixed(3));

  const cameraStart = INTRO.SUNSET_DURATION + INTRO.BLUE_HOUR * (CAMERA.START_OFFSET - 0.25);
  const cameraProgress = easeInOutCubic(clamp((t - cameraStart) / CAMERA.DURATION, 0, 1));
  if (scene) {
    const lift = lerp(0, CAMERA.LIFT, cameraProgress);
    const scale = lerp(1, CAMERA.SCALE, cameraProgress);
    scene.setAttribute('transform', `translate(0 ${lift.toFixed(2)}) scale(${scale.toFixed(3)})`);
  }
  const fadeBlend = clamp(nightProgress * 0.96, 0, 1);
  intro.style.opacity = (1 - fadeBlend).toFixed(3);

  if (introStarsGroup) {
    const starsStart = INTRO.SUNSET_DURATION + INTRO.BLUE_HOUR + INTRO.STARS_DELAY;
    const inRaw = clamp((t - starsStart) / INTRO.STARS_FADE, 0, 1);
    const starsProgress = easeInOutCubic(inRaw);
    const fadeOut = 1 - easeInOutCubic(clamp((nightProgress - 0.42) / 0.46, 0, 1));
    const starOpacity = starsProgress * fadeOut;
    introStarsGroup.setAttribute('opacity', starOpacity.toFixed(3));
    introStarDots.forEach((star) => {
      const base = parseFloat(star.dataset.baseR || star.getAttribute('r'));
      const delay = parseFloat(star.dataset.delay || '0');
      const wobble = parseFloat(star.dataset.wobble || '0.28');
      const localRaw = clamp((t - starsStart - delay) / (INTRO.STARS_FADE * 0.9), 0, 1);
      const local = easeInOutCubic(localRaw);
      const settle = 1 - easeInOutCubic(clamp((nightProgress - 0.58) / 0.34, 0, 1));
      const pulse = 0.65 + local * 0.55 + Math.sin((t * 0.6 + delay * 3)) * wobble * settle;
      star.setAttribute('r', Math.max(0.1, base * pulse * settle).toFixed(2));
    });
  }

  if (t >= INTRO.TOTAL) {
    endIntro();
    return;
  }

  requestAnimationFrame(animateIntro);
}

function endIntro(){
  introFinished = true;
  intro.style.opacity = '0';
  intro.classList.add('hidden');
  // Запуск ночного фона и звёзд
  initBackground();
  placeFeaturedStars();
  hint.classList.add('show');
  hint.classList.remove('hidden');
}

// Смешивание цветов hex → hex
function hexToRgb(hex){
  const n = hex.replace('#','');
  const bigint = parseInt(n, 16);
  if (n.length === 6){
    return [(bigint>>16)&255, (bigint>>8)&255, bigint&255];
  }
  return [0,0,0];
}
function rgbToHex([r,g,b]){
  const s = (n)=> n.toString(16).padStart(2,'0');
  return '#' + s(r) + s(g) + s(b);
}
function mixColor(a,b,t){
  const ra = hexToRgb(a), rb = hexToRgb(b);
  return rgbToHex([
    Math.round(lerp(ra[0], rb[0], t)),
    Math.round(lerp(ra[1], rb[1], t)),
    Math.round(lerp(ra[2], rb[2], t)),
  ]);
}

// === НОЧНОЙ ФОН И ЗВЁЗДЫ (canvas+divs) ===
const bgCtx = bg ? bg.getContext('2d') : null;
let W,H, starfield=[];

function updateSpaceTransform(){
  if (!space) return;
  viewX = clamp(viewX, 0, maxViewX);
  viewY = clamp(viewY, 0, maxViewY);
  space.style.transform = `translate(${-viewX}px, ${-viewY}px)`;
}

function resize(){
  const scale = Math.min(2, window.devicePixelRatio||1);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const prevMaxX = maxViewX;
  const prevMaxY = maxViewY;
  const prevWidth = spaceWidth;
  const prevHeight = spaceHeight;

  if (space){
    const targetWidth = Math.max(vw * SPACE_MULTIPLIER, 1600);
    const targetHeight = Math.max(vh * SPACE_MULTIPLIER, 1600);
    spaceWidth = Math.max(targetWidth, prevWidth);
    spaceHeight = Math.max(targetHeight, prevHeight);
    space.style.width = `${spaceWidth}px`;
    space.style.height = `${spaceHeight}px`;
  } else {
    spaceWidth = Math.max(vw, prevWidth);
    spaceHeight = Math.max(vh, prevHeight);
  }

  maxViewX = Math.max(0, spaceWidth - vw);
  maxViewY = Math.max(0, spaceHeight - vh);

  if (!viewInitialized){
    viewX = maxViewX / 2;
    viewY = maxViewY / 2;
    viewInitialized = true;
  } else {
    const fracX = prevMaxX > 0 ? viewX / prevMaxX : 0.5;
    const fracY = prevMaxY > 0 ? viewY / prevMaxY : 0.5;
    viewX = maxViewX > 0 ? fracX * maxViewX : 0;
    viewY = maxViewY > 0 ? fracY * maxViewY : 0;
  }

  if (bg){
    W = Math.floor(spaceWidth * scale);
    H = Math.floor(spaceHeight * scale);
    if (bg.width !== W) bg.width = W;
    if (bg.height !== H) bg.height = H;
    bg.style.width = `${spaceWidth}px`;
    bg.style.height = `${spaceHeight}px`;
  }

  if (fx){
    const fw = Math.floor(vw * scale);
    const fh = Math.floor(vh * scale);
    if (fx.width !== fw) fx.width = fw;
    if (fx.height !== fh) fx.height = fh;
    fx.style.width = `${vw}px`;
    fx.style.height = `${vh}px`;
  }

  updateSpaceTransform();
  genStarfield();
}

function handlePanPointerDown(e){
  if (!spaceWrapper) return;
  if (typeof e.button === 'number' && e.button !== 0) return;
  panPointerId = e.pointerId;
  panStartX = e.clientX;
  panStartY = e.clientY;
  originViewX = viewX;
  originViewY = viewY;
  panMovedDuringGesture = false;
}

function handlePanPointerMove(e){
  if (panPointerId === null || e.pointerId !== panPointerId) return;
  const dx = e.clientX - panStartX;
  const dy = e.clientY - panStartY;
  if (!panMovedDuringGesture && Math.hypot(dx, dy) > 6){
    panMovedDuringGesture = true;
    if (spaceWrapper){
      spaceWrapper.classList.add('panning');
      if (typeof spaceWrapper.setPointerCapture === 'function'){
        spaceWrapper.setPointerCapture(panPointerId);
      }
    }
  }
  if (!panMovedDuringGesture) return;
  viewX = originViewX - dx;
  viewY = originViewY - dy;
  updateSpaceTransform();
}

function handlePanPointerUp(e){
  if (panPointerId === null || (e && e.pointerId !== panPointerId)) return;
  if (spaceWrapper){
    spaceWrapper.classList.remove('panning');
    if (typeof spaceWrapper.releasePointerCapture === 'function'){
      if (!spaceWrapper.hasPointerCapture || spaceWrapper.hasPointerCapture(panPointerId)){
        spaceWrapper.releasePointerCapture(panPointerId);
      }
    }
  }
  if (panMovedDuringGesture){
    panJustHappened = true;
    requestAnimationFrame(() => { panJustHappened = false; });
  }
  panPointerId = null;
  panMovedDuringGesture = false;
}
function genStarfield(){
  const layers = [
    { count: Math.floor((W*H)/70000), size:[0.7,1.2], alpha:[0.3,0.6], speed:0.02 },
    { count: Math.floor((W*H)/120000), size:[1.2,1.8], alpha:[0.5,0.8], speed:0.04 },
    { count: Math.floor((W*H)/180000), size:[1.8,2.4], alpha:[0.7,1.0], speed:0.07 },
  ];
  starfield = [];
  for(const L of layers){
    for(let i=0;i<L.count;i++){
      starfield.push({
        x: Math.random()*W,
        y: Math.random()*H,
        r: (L.size[0] + Math.random()*(L.size[1]-L.size[0])),
        a: L.alpha[0] + Math.random()*(L.alpha[1]-L.alpha[0]),
        s: L.speed * (0.5 + Math.random()),
        tw: 0.5 + Math.random()*0.5,
        phase: Math.random()*Math.PI*2
      });
    }
  }
}
let t0 = performance.now();
function renderBackground(t){
  if (!bgCtx) return;
  const dt = (t - t0)/1000; t0 = t;
  bgCtx.clearRect(0,0,W,H);
  // тёмный ночной градиент
  const g = bgCtx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#050b16');
  g.addColorStop(0.55, '#081327');
  g.addColorStop(1, '#0b1a2e');
  bgCtx.fillStyle = g;
  bgCtx.fillRect(0,0,W,H);

  for(const s of starfield){
    s.phase += dt * s.tw * 2.0;
    const twinkle = 0.7 + 0.3*Math.sin(s.phase);
    bgCtx.globalAlpha = Math.max(0.05, Math.min(1, s.a*twinkle));
    bgCtx.beginPath();
    bgCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    bgCtx.fillStyle = '#ffffff';
    bgCtx.fill();
    s.x += s.s * dt * 20;
    if (s.x > W + 5) s.x = -5;
  }
  bgCtx.globalAlpha = 1;
  requestAnimationFrame(renderBackground);
}

// Кликабельные звезды
function placeFeaturedStars(){
  if (!starsLayer) return;
  starsLayer.innerHTML = '';
  starsLayer.style.pointerEvents = 'none';
  const used = [];
  const count = FEATURED_COUNT;
  const width = spaceWidth || window.innerWidth;
  const height = spaceHeight || window.innerHeight;
  const marginX = Math.min(240, width * 0.18);
  const marginY = Math.min(240, height * 0.18);

  for(let i=0;i<count;i++){
    const star = document.createElement('button');
    star.className = 'star';
    const size = 10 + Math.random()*10;
    let x = 0;
    let y = 0;
    let attempts = 0;
    const maxAttempts = 80;
    while (attempts < maxAttempts){
      x = rand(marginX, width - marginX);
      y = rand(marginY, height - marginY);
      let ok = true;
      for (const p of used) {
        if (Math.hypot(p.x - x, p.y - y) < 140) { ok = false; break; }
      }
      if (ok) break;
      attempts++;
    }
    used.push({x,y});
    star.style.setProperty('--size', `${size}px`);
    star.style.setProperty('--x', `${x}px`);
    star.style.setProperty('--y', `${y}px`);
    star.style.setProperty('--tw', `${2 + Math.random()*1.8}s`);

    const mem = MEMORIES[i % MEMORIES.length];
    star.dataset.src = mem.src;
    star.dataset.caption = mem.caption;

    const open = (clientX, clientY)=>{
      star.classList.add('visited');
      const rect = star.getBoundingClientRect();
      const hasCoords = Number.isFinite(clientX) && Number.isFinite(clientY);
      const sparkleX = hasCoords ? clientX : rect.left + rect.width / 2;
      const sparkleY = hasCoords ? clientY : rect.top + rect.height / 2;
      openMemory(mem.src, mem.caption);
      sparkle(sparkleX, sparkleY);
    };
    star.addEventListener('click', e => {
      if (panJustHappened) return;
      const isKeyboard = e.detail === 0;
      open(isKeyboard ? undefined : e.clientX, isKeyboard ? undefined : e.clientY);
    });

    starsLayer.appendChild(star);
  }
  starsLayer.style.pointerEvents = 'auto';
}

// Модалка
const memoryEl = document.getElementById('memory');
const memoryImg = document.getElementById('memoryImg');
const captionEl = document.getElementById('caption');
const closeBtn = document.getElementById('closeBtn');
function openMemory(src, caption){
  memoryImg.src = src;
  captionEl.textContent = caption || '';
  memoryEl.classList.remove('hidden');
}
function closeMemory(){ memoryEl.classList.add('hidden'); }
closeBtn.addEventListener('click', closeMemory);
memoryEl.addEventListener('click', e => { if (e.target === memoryEl) closeMemory(); });

// Блёстки
const fxCtx = fx ? fx.getContext('2d') : null;
let particles = [];
function sparkle(x,y){
  if (!fx || !fxCtx) return;
  const rect = fx.getBoundingClientRect();
  const px = (x - rect.left) * dpr;
  const py = (y - rect.top) * dpr;
  for (let i=0;i<28;i++){
    const a = Math.random()*Math.PI*2;
    const sp = 80 + Math.random()*220;
    particles.push({
      x:px,y:py, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp,
      life:0, ttl:0.6 + Math.random()*0.5, size:1 + Math.random()*2,
      hue:210 + Math.random()*40
    });
  }
}
let lastFx = performance.now();
function renderFx(t){
  if (!fxCtx) return;
  const dt = Math.min(0.033, (t - lastFx)/1000);
  lastFx = t;
  fxCtx.clearRect(0,0,fx.width,fx.height);
  particles = particles.filter(p => p.life < p.ttl);
  for(const p of particles){
    p.life += dt;
    const f = p.life / p.ttl;
    const alpha = Math.max(0, 1 - f);
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.vy += 40 * dt;
    fxCtx.globalCompositeOperation = 'lighter';
    fxCtx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${alpha})`;
    fxCtx.beginPath(); fxCtx.arc(p.x,p.y, p.size*dpr, 0, Math.PI*2); fxCtx.fill();
    fxCtx.globalCompositeOperation = 'source-over';
  }
  requestAnimationFrame(renderFx);
}

// === Аудио-эмбиент ===
const ambient = {
  audio: null,
  active: false,
  fadeHandle: null,
};

function ensureAmbient(){
  if (ambient.audio) return ambient;

  const probe = document.createElement('audio');
  if (!probe || typeof probe.canPlayType !== 'function' || probe.canPlayType('audio/mpeg') === '') {
    return null;
  }

  const audio = new Audio();
  audio.src = 'assets/ambient.mp3'; // замените файлом с атмосферой
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  audio.setAttribute('aria-hidden', 'true');
  audio.style.display = 'none';
  audio.addEventListener('error', () => {
    if (audioToggle) audioToggle.style.display = 'none';
  }, { once: true });
  document.body.appendChild(audio);

  ambient.audio = audio;
  return ambient;
}

function fadeAudioTo(audio, target, duration, done){
  if (!audio) return;
  if (ambient.fadeHandle) {
    cancelAnimationFrame(ambient.fadeHandle);
    ambient.fadeHandle = null;
  }
  const startVolume = audio.volume;
  const clampedTarget = clamp(target, 0, 1);
  if (duration <= 0) {
    audio.volume = clampedTarget;
    if (done) done();
    return;
  }
  const startTime = performance.now();
  function step(now){
    const progress = clamp((now - startTime) / (duration * 1000), 0, 1);
    const value = startVolume + (clampedTarget - startVolume) * progress;
    audio.volume = clamp(value, 0, 1);
    if (progress < 1) {
      ambient.fadeHandle = requestAnimationFrame(step);
    } else {
      ambient.fadeHandle = null;
      if (done) done();
    }
  }
  ambient.fadeHandle = requestAnimationFrame(step);
}

function updateAudioToggle(){
  if (!audioToggle) return;
  audioToggle.textContent = ambient.active ? '🔊' : '🔈';
  audioToggle.classList.toggle('on', ambient.active);
  audioToggle.setAttribute('aria-pressed', ambient.active ? 'true' : 'false');
  audioToggle.setAttribute('aria-label', ambient.active ? 'Выключить атмосферный звук' : 'Включить атмосферный звук');
}

function startAmbient(auto = false){
  const state = ensureAmbient();
  if (!state) {
    if (audioToggle) audioToggle.style.display = 'none';
    return;
  }
  const { audio } = state;
  const playPromise = audio.play();
  if (playPromise && typeof playPromise.then === 'function') {
    playPromise.catch(() => {
      if (audioToggle) audioToggle.style.display = 'none';
    });
  }
  const target = auto ? 0.24 : 0.32;
  fadeAudioTo(audio, target, 3.2);
  state.active = true;
  updateAudioToggle();
}

function stopAmbient(){
  if (!ambient.audio || !ambient.active) return;
  const audio = ambient.audio;
  fadeAudioTo(audio, 0.0001, 2.2, () => {
    if (audio.volume <= 0.001) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
  ambient.active = false;
  updateAudioToggle();
}

function toggleAmbient(){
  if (ambient.active) stopAmbient(); else startAmbient();
}

if (audioToggle){
  audioToggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAmbient();
  });
  updateAudioToggle();
}

function handleFirstInteraction(event){
  if (ambient.active) return;
  if (audioToggle && audioToggle.contains(event.target)) return;
  startAmbient(true);
}

document.addEventListener('pointerdown', handleFirstInteraction, { once: true });
document.addEventListener('keydown', (event) => {
  if (ambient.active) return;
  const tag = event.target && event.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
  startAmbient(true);
}, { once: true });

if (spaceWrapper){
  spaceWrapper.addEventListener('pointerdown', handlePanPointerDown);
  spaceWrapper.addEventListener('pointermove', handlePanPointerMove);
  spaceWrapper.addEventListener('pointerup', handlePanPointerUp);
  spaceWrapper.addEventListener('pointercancel', handlePanPointerUp);
}

// Инициализация после завершения интро
function initBackground(){
  if (backgroundStarted) return;
  backgroundStarted = true;
  window.addEventListener('resize', resize, {passive:true});
  resize();
  requestAnimationFrame(renderBackground);
  requestAnimationFrame(renderFx);
}

// Старт анимации интро
initIntroStars();
initClouds();
requestAnimationFrame(animateIntro);

// Предзагрузка изображений
for (const m of MEMORIES) { const img = new Image(); img.src = m.src; }
