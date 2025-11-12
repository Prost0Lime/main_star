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
let introStarsTweens = [];
let introTimeline = null;
const milkyWay = document.getElementById('milkyWay');
const heroCopy = document.querySelector('.hero-copy');
const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');
const heroSignature = document.querySelector('.hero-signature');

const SVG_NS = 'http://www.w3.org/2000/svg';

const bg = document.getElementById('bg');
const starsLayer = document.getElementById('stars-layer');
const spaceWrapper = document.getElementById('space-wrapper');
const space = document.getElementById('space');
const fx = document.getElementById('fx');
const hint = document.getElementById('hint');
const HINT_DEFAULT_TEXT = hint ? hint.textContent : '';
const HINT_HEART_MESSAGE = 'С любовью ...';
const audioToggle = document.getElementById('audioToggle');

const coarsePointer = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
const smallViewport = Math.max(window.innerWidth, window.innerHeight) <= 900;
const lowPowerMode = coarsePointer || smallViewport;

const MAX_DPR = lowPowerMode ? 1.3 : 2;
let dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

const SPACE_MULTIPLIER = lowPowerMode ? 2.4 : 3.2;
const INITIAL_SPACE_SCALE = 0.82;
const MIN_SPACE_SCALE = 0.62;
const MAX_SPACE_SCALE = 1.38;
let spaceViewScale = INITIAL_SPACE_SCALE;
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
let activeConstellation = [];
let pinchActive = false;
let pinchBase = null;
const activePointers = new Map();
let allStars = [];
const visitedStars = new Set();
let pendingHeartFinale = false;
let heartFinaleStarted = false;
let heartLineSvg = null;
let heartFinalLayout = [];
let heartLineReady = false;
let heartLineTimer = null;
let pendingHeartOutlineRefresh = false;
const HEART_MOVE_DURATION = 2.8;
const HEART_MOVE_STAGGER = 0.08;
const HEART_LINE_DELAY = 0.6;
const HEART_LINE_DRAW_DURATION = 5.4;

const CONSTELLATION_TEMPLATE = [
  { id: 1, x: 64, y: 312, size: 11.5, tw: 3.4 },
  { id: 2, x: 52, y: 96, size: 12.5, tw: 3.2 },
  { id: 3, x: 520, y: 190, size: 12.8, tw: 3.1 },
  { id: 4, x: 568, y: 84, size: 14.6, tw: 3.8 },
  { id: 5, x: 164, y: 136, size: 11.8, tw: 3.6 },
  { id: 6, x: 188, y: 284, size: 12.2, tw: 3.5 },
  { id: 7, x: 296, y: 126, size: 12.4, tw: 3.3 },
  { id: 8, x: 472, y: 324, size: 13.4, tw: 3.7 },
  { id: 9, x: 356, y: 256, size: 12.9, tw: 3.2 },
  { id: 10, x: 556, y: 118, size: 11.2, tw: 3.9 },
  { id: 11, x: 224, y: 164, size: 11.4, tw: 3.4 },
  { id: 12, x: 420, y: 110, size: 12.1, tw: 3.1 },
];

const CONSTELLATION_EDGES = [
  [1, 6],
  [6, 9],
  [9, 8],
  [8, 3],
  [3, 4],
  [4, 10],
  [10, 12],
  [12, 7],
  [7, 11],
  [11, 5],
  [5, 2],
  [6, 5],
  [7, 9],
  [3, 12],
];

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

function animateIntroStarsPulse(){
  if (!window.gsap || !introStarDots.length) return;
  introStarsTweens.forEach((tween) => {
    if (tween && typeof tween.kill === 'function') tween.kill();
  });
  introStarsTweens = introStarDots.map((star) => {
    const base = parseFloat(star.dataset.baseR || star.getAttribute('r') || '1.2');
    const toRadius = base * rand(1.4, 1.85);
    return gsap.to(star, {
      attr: { r: toRadius },
      duration: rand(2.4, 3.6),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: rand(0, 2.6),
    });
  });
}

function buildIntroTimeline(){
  if (!window.gsap || !intro) {
    endIntro();
    return;
  }

  const durations = {
    sunset: 6.2,
    twilight: 3.8,
    night: 4.6,
    dawn: 6.4,
  };

  introTimeline = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    repeat: -1,
    repeatDelay: 0,
    onRepeat: () => {
      if (!introFinished) {
        endIntro();
      }
    },
  });

  introTimeline.set(scene, { transformOrigin: '50% 70%', y: 0, scale: 1 });
  introTimeline.set(sunGroup, { transformOrigin: '195px 560px', y: 0, scale: 1 });
  introTimeline.set(clouds, { x: 0, y: 0, opacity: 0.96 });
  if (milkyWay) {
    introTimeline.set(milkyWay, { transformOrigin: '50% 50%', scale: 1.08, rotation: -5, autoAlpha: 0 });
  }
  if (introStarsGroup) {
    introTimeline.set(introStarsGroup, { autoAlpha: 0 });
  }

  const { sunset, twilight, night, dawn } = durations;
  const settleOffset = Math.max(0, dawn - 1.8);

  introTimeline.addLabel('sunset', 0);
  introTimeline.to(skyTop, { attr: { 'stop-color': '#ff9d67' }, duration: sunset }, 'sunset');
  introTimeline.to(skyMid, { attr: { 'stop-color': '#ff7a7a' }, duration: sunset }, 'sunset');
  introTimeline.to(skyBot, { attr: { 'stop-color': '#7c3ae1' }, duration: sunset }, 'sunset');
  introTimeline.to(horizonTop, { attr: { 'stop-color': '#ffc085' }, duration: sunset }, 'sunset');
  introTimeline.to(horizonMid, { attr: { 'stop-color': '#b25acd' }, duration: sunset }, 'sunset');
  introTimeline.to(horizonGlow, { opacity: 0.88, duration: sunset, ease: 'sine.inOut' }, 'sunset');
  introTimeline.to(sunGroup, { y: 195, scale: 0.55, duration: sunset, ease: 'power1.inOut' }, 'sunset');
  introTimeline.to(sun, { autoAlpha: 0, duration: sunset * 0.65, ease: 'power1.out' }, 'sunset+=0.3');
  introTimeline.to(clouds, { x: -160, y: -48, duration: sunset, ease: 'power1.inOut' }, 'sunset');
  introTimeline.to(scene, { y: -90, scale: 1.08, duration: sunset, ease: 'power2.inOut' }, 'sunset+=0.4');

  introTimeline.addLabel('twilight', `sunset+=${sunset}`);
  introTimeline.to(skyTop, { attr: { 'stop-color': '#d57ff7' }, duration: twilight }, 'twilight');
  introTimeline.to(skyMid, { attr: { 'stop-color': '#8c4fe6' }, duration: twilight }, 'twilight');
  introTimeline.to(skyBot, { attr: { 'stop-color': '#36186f' }, duration: twilight }, 'twilight');
  introTimeline.to(horizonTop, { attr: { 'stop-color': '#ff9b80' }, duration: twilight }, 'twilight');
  introTimeline.to(horizonMid, { attr: { 'stop-color': '#743ec7' }, duration: twilight }, 'twilight');
  introTimeline.to(horizonGlow, { opacity: 0.56, duration: twilight, ease: 'sine.inOut' }, 'twilight');
  if (milkyWay) {
    introTimeline.to(milkyWay, { autoAlpha: 0.48, duration: twilight * 0.85, ease: 'sine.inOut' }, 'twilight+=0.3');
    introTimeline.to(milkyWay, { rotation: 2, duration: twilight, ease: 'sine.inOut' }, 'twilight');
  }
  if (introStarsGroup) {
    introTimeline.to(introStarsGroup, { autoAlpha: 0.78, duration: twilight * 0.9, ease: 'sine.inOut' }, 'twilight+=0.2');
  }
  introTimeline.to(scene, { y: -210, scale: 1.14, duration: twilight, ease: 'power2.inOut' }, 'twilight');
  introTimeline.to(clouds, { opacity: 0.52, duration: twilight, ease: 'sine.inOut' }, 'twilight');

  introTimeline.addLabel('night', `twilight+=${twilight}`);
  introTimeline.to(skyTop, { attr: { 'stop-color': '#2b0b3f' }, duration: night }, 'night');
  introTimeline.to(skyMid, { attr: { 'stop-color': '#1c0f3f' }, duration: night }, 'night');
  introTimeline.to(skyBot, { attr: { 'stop-color': '#090421' }, duration: night }, 'night');
  introTimeline.to(horizonTop, { attr: { 'stop-color': '#8c3eae' }, duration: night }, 'night');
  introTimeline.to(horizonMid, { attr: { 'stop-color': '#3c1f7c' }, duration: night }, 'night');
  introTimeline.to(horizonGlow, { opacity: 0.24, duration: night, ease: 'sine.inOut' }, 'night');
  if (milkyWay) {
    introTimeline.to(milkyWay, { autoAlpha: 0.86, duration: night * 0.65, ease: 'sine.inOut' }, 'night');
    introTimeline.to(milkyWay, { rotation: 6, duration: night, ease: 'sine.inOut' }, 'night');
  }
  if (introStarsGroup) {
    introTimeline.to(introStarsGroup, { autoAlpha: 1, duration: night * 0.6, ease: 'sine.inOut' }, 'night');
  }
  introTimeline.to(scene, { y: -280, scale: 1.2, duration: night, ease: 'power2.inOut' }, 'night');
  introTimeline.to(clouds, { opacity: 0.22, duration: night, ease: 'sine.inOut' }, 'night');

  introTimeline.addLabel('dawn', `night+=${night}`);
  introTimeline.to(skyTop, { attr: { 'stop-color': '#ffb35c' }, duration: dawn }, 'dawn');
  introTimeline.to(skyMid, { attr: { 'stop-color': '#ff6e6e' }, duration: dawn }, 'dawn');
  introTimeline.to(skyBot, { attr: { 'stop-color': '#6c2bd9' }, duration: dawn }, 'dawn');
  introTimeline.to(horizonTop, { attr: { 'stop-color': '#ffb978' }, duration: dawn }, 'dawn');
  introTimeline.to(horizonMid, { attr: { 'stop-color': '#8548a8' }, duration: dawn }, 'dawn');
  introTimeline.to(horizonGlow, { opacity: 0.92, duration: dawn, ease: 'sine.inOut' }, 'dawn');
  introTimeline.to(sunGroup, { y: 0, scale: 1, duration: dawn, ease: 'power1.inOut' }, 'dawn');
  introTimeline.to(sun, { autoAlpha: 1, duration: dawn * 0.8, ease: 'sine.out' }, 'dawn+=1.2');
  introTimeline.to(clouds, { x: 0, y: 0, opacity: 0.96, duration: dawn, ease: 'power1.inOut' }, 'dawn');
  if (milkyWay) {
    introTimeline.to(milkyWay, { autoAlpha: 0, duration: dawn * 0.8, ease: 'sine.inOut' }, 'dawn');
    introTimeline.to(milkyWay, { rotation: 12, duration: dawn, ease: 'sine.inOut' }, 'dawn');
  }
  if (introStarsGroup) {
    introTimeline.to(introStarsGroup, { autoAlpha: 0.12, duration: dawn * 0.8, ease: 'sine.inOut' }, 'dawn');
  }
  introTimeline.to(scene, { y: -60, scale: 1.04, duration: dawn, ease: 'power2.inOut' }, 'dawn');
  introTimeline.to(scene, { y: 0, scale: 1, duration: 1.8, ease: 'power2.out' }, `dawn+=${settleOffset.toFixed(2)}`);

  introTimeline.call(() => {
    if (!backgroundStarted) {
      initBackground();
    }
  }, null, 'night+=1.6');
}

function animateHeroCopy(){
  if (!window.gsap) return;
  const revealTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const items = [heroTitle, heroSubtitle, heroSignature].filter(Boolean);
  items.forEach((el, idx) => {
    gsap.set(el, { autoAlpha: 0, y: 32 + idx * 6 });
  });
  if (heroTitle) {
    revealTimeline.to(heroTitle, { autoAlpha: 1, y: 0, duration: 1.6 }, 0);
  }
  if (heroSubtitle) {
    revealTimeline.to(heroSubtitle, { autoAlpha: 1, y: 0, duration: 1.8 }, 0.25);
  }
  if (heroSignature) {
    revealTimeline.to(heroSignature, { autoAlpha: 1, y: 0, duration: 1.8 }, 0.5);
  }
  if (heroCopy) {
    gsap.set(heroCopy, { filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' });
    revealTimeline.to(heroCopy, { filter: 'drop-shadow(0 18px 48px rgba(90, 60, 200, 0.35))', duration: 2.6, ease: 'sine.out' }, 0.4);
  }
  revealTimeline.call(() => {
    items.forEach((el, idx) => {
      gsap.to(el, {
        y: '+=12',
        duration: 9 + idx * 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: idx * 0.25,
      });
    });
  });
}

function endIntro(){
  if (introFinished) return;
  introFinished = true;
  if (intro){
    if (window.gsap){
      gsap.to(intro, { duration: 1.6, autoAlpha: 0, ease: 'sine.out', onComplete: () => intro.classList.add('hidden') });
    } else {
      intro.classList.add('hidden');
    }
  }
  if (heroCopy){
    if (window.gsap){
      gsap.to(heroCopy, { duration: 1.4, autoAlpha: 0, ease: 'sine.out' });
    } else {
      heroCopy.style.opacity = '0';
    }
  }
  initBackground();
  placeFeaturedStars();
  hint.classList.add('show');
  hint.classList.remove('hidden');
}

// === НОЧНОЙ ФОН И ЗВЁЗДЫ (canvas+divs) ===
const bgCtx = bg ? bg.getContext('2d') : null;
let W,H, starfield=[];

function updateSpaceTransform(){
  if (!space) return;
  viewX = clamp(viewX, 0, maxViewX);
  viewY = clamp(viewY, 0, maxViewY);
  const scale = spaceViewScale;
  const tx = -viewX;
  const ty = -viewY;
  space.style.transform = `scale(${scale}) translate(${tx}px, ${ty}px)`;
}

function updateViewBounds(vw = window.innerWidth, vh = window.innerHeight){
  const scaledViewWidth = vw / spaceViewScale;
  const scaledViewHeight = vh / spaceViewScale;
  maxViewX = Math.max(0, spaceWidth - scaledViewWidth);
  maxViewY = Math.max(0, spaceHeight - scaledViewHeight);
}

function markInteractionComplete(){
  panJustHappened = true;
  requestAnimationFrame(() => { panJustHappened = false; });
}

function setPanningActive(active){
  if (!spaceWrapper) return;
  if (active){
    spaceWrapper.classList.add('panning');
  } else {
    spaceWrapper.classList.remove('panning');
  }
}

function applyScale(targetScale, anchorX = window.innerWidth / 2, anchorY = window.innerHeight / 2){
  const prevScale = spaceViewScale;
  const nextScale = clamp(targetScale, MIN_SPACE_SCALE, MAX_SPACE_SCALE);
  if (Math.abs(nextScale - prevScale) < 1e-4) return false;
  const worldX = viewX + anchorX / prevScale;
  const worldY = viewY + anchorY / prevScale;
  spaceViewScale = nextScale;
  updateViewBounds();
  viewX = worldX - anchorX / spaceViewScale;
  viewY = worldY - anchorY / spaceViewScale;
  updateSpaceTransform();
  return true;
}

function updateDpr(){
  dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
}

function resize(){
  updateDpr();
  const scale = dpr;
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

  updateViewBounds(vw, vh);

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
  if (heartFinaleStarted){
    heartFinalLayout = computeHeartLayout();
    applyHeartPositions(heartFinalLayout, false);
    if (heartLineReady){
      createHeartOutline(heartFinalLayout, false);
    } else {
      pendingHeartOutlineRefresh = true;
    }
  } else if (activeConstellation && activeConstellation.length){
    createConstellationLines(activeConstellation);
  }
}

function startPinch(){
  if (activePointers.size < 2) return;
  const iterator = activePointers.values();
  const first = iterator.next().value;
  const second = iterator.next().value;
  if (!first || !second) return;
  const distance = Math.hypot(first.x - second.x, first.y - second.y);
  if (distance <= 0) return;
  const centerX = (first.x + second.x) / 2;
  const centerY = (first.y + second.y) / 2;
  pinchActive = true;
  pinchBase = {
    distance,
    scale: spaceViewScale,
    centerX,
    centerY,
    worldCenterX: viewX + centerX / spaceViewScale,
    worldCenterY: viewY + centerY / spaceViewScale,
  };
  panPointerId = null;
  panMovedDuringGesture = true;
  setPanningActive(true);
  if (spaceWrapper && typeof spaceWrapper.setPointerCapture === 'function'){
    for (const id of activePointers.keys()){
      try { spaceWrapper.setPointerCapture(id); } catch (_) {}
    }
  }
}

function handleSpacePointerDown(e){
  if (!spaceWrapper) return;
  if (typeof e.button === 'number' && e.button !== 0) return;
  if (!viewInitialized) return;
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (activePointers.size === 1){
    panPointerId = e.pointerId;
    panStartX = e.clientX;
    panStartY = e.clientY;
    originViewX = viewX;
    originViewY = viewY;
    panMovedDuringGesture = false;
  } else if (activePointers.size === 2){
    startPinch();
  }
}

function handleSpacePointerMove(e){
  if (!activePointers.has(e.pointerId)) return;
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (pinchActive && pinchBase){
    const iterator = activePointers.values();
    const first = iterator.next().value;
    const second = iterator.next().value;
    if (first && second){
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      if (distance > 0){
        const centerX = (first.x + second.x) / 2;
        const centerY = (first.y + second.y) / 2;
        const rawScale = pinchBase.scale * (distance / pinchBase.distance);
        spaceViewScale = clamp(rawScale, MIN_SPACE_SCALE, MAX_SPACE_SCALE);
        updateViewBounds();
        viewX = pinchBase.worldCenterX - centerX / spaceViewScale;
        viewY = pinchBase.worldCenterY - centerY / spaceViewScale;
        updateSpaceTransform();
      }
    }
    return;
  }

  if (panPointerId !== e.pointerId) return;
  const dx = e.clientX - panStartX;
  const dy = e.clientY - panStartY;
  if (!panMovedDuringGesture && Math.hypot(dx, dy) > 6){
    panMovedDuringGesture = true;
    setPanningActive(true);
    if (spaceWrapper && typeof spaceWrapper.setPointerCapture === 'function'){
      try { spaceWrapper.setPointerCapture(panPointerId); } catch (_) {}
    }
  }
  if (!panMovedDuringGesture) return;
  const invScale = 1 / spaceViewScale;
  viewX = originViewX - dx * invScale;
  viewY = originViewY - dy * invScale;
  updateSpaceTransform();
}

function finishPanGesture(pointerId){
  if (spaceWrapper){
    if (!pinchActive){
      setPanningActive(false);
    }
    if (typeof spaceWrapper.releasePointerCapture === 'function'){
      try { spaceWrapper.releasePointerCapture(pointerId); } catch (_) {}
    }
  }
  if (panMovedDuringGesture){
    markInteractionComplete();
  }
  panPointerId = null;
  panMovedDuringGesture = false;
}

function handleSpacePointerUp(e){
  if (!activePointers.has(e.pointerId)) return;

  if (pinchActive){
    if (spaceWrapper && typeof spaceWrapper.releasePointerCapture === 'function'){
      try { spaceWrapper.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  }

  activePointers.delete(e.pointerId);

  if (pinchActive){
    if (activePointers.size >= 2){
      startPinch();
      return;
    }
    if (activePointers.size < 2){
      if (panMovedDuringGesture){
        markInteractionComplete();
      }
      pinchActive = false;
      pinchBase = null;
      if (activePointers.size === 1){
        const [id, pos] = activePointers.entries().next().value;
        panPointerId = id;
        panStartX = pos.x;
        panStartY = pos.y;
        originViewX = viewX;
        originViewY = viewY;
        panMovedDuringGesture = false;
      } else {
        panPointerId = null;
        panMovedDuringGesture = false;
        setPanningActive(false);
      }
    }
    return;
  }

  if (panPointerId === e.pointerId){
    finishPanGesture(e.pointerId);
  } else {
    if (!pinchActive && activePointers.size === 0){
      setPanningActive(false);
    }
  }
}

function handleSpaceWheel(e){
  if (!spaceWrapper) return;
  if (!viewInitialized) return;
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  const delta = e.deltaY;
  if (!Number.isFinite(delta)) return;
  const factor = Math.exp(-delta * 0.002);
  const changed = applyScale(spaceViewScale * factor, e.clientX, e.clientY);
  if (changed){
    markInteractionComplete();
  }
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
  const densityScale = lowPowerMode ? 0.55 : 1;
  const speedScale = lowPowerMode ? 0.75 : 1;
  const twinkleScale = lowPowerMode ? 0.8 : 1;
  const layers = [
    { count: Math.max(12, Math.floor(densityScale * (W*H)/70000)), size:[0.7,1.2], alpha:[0.3,0.6], speed:0.02 * speedScale },
    { count: Math.max(8, Math.floor(densityScale * (W*H)/120000)), size:[1.2,1.8], alpha:[0.5,0.8], speed:0.04 * speedScale },
    { count: Math.max(6, Math.floor(densityScale * (W*H)/180000)), size:[1.8,2.4], alpha:[0.7,1.0], speed:0.07 * speedScale },
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
        tw: (0.5 + Math.random()*0.5) * twinkleScale,
        phase: Math.random()*Math.PI*2
      });
    }
  }
}
const MIN_BG_FRAME_MS = lowPowerMode ? (1000 / 30) : 0;
let lastBgTick = performance.now();
function renderBackground(t){
  if (!bgCtx) return;
  const elapsedMs = t - lastBgTick;
  if (MIN_BG_FRAME_MS && elapsedMs < MIN_BG_FRAME_MS){
    requestAnimationFrame(renderBackground);
    return;
  }
  const dt = Math.min(0.05, Math.max(0.016, elapsedMs / 1000));
  lastBgTick = t;
  bgCtx.clearRect(0,0,W,H);
  // тёмный ночной градиент
  const g = bgCtx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#130a2c');
  g.addColorStop(0.5, '#1a0f3f');
  g.addColorStop(0.78, '#0d0828');
  g.addColorStop(1, '#05031a');
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

function buildConstellationLayout(width, height){
  if (!CONSTELLATION_TEMPLATE.length) return [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const pt of CONSTELLATION_TEMPLATE){
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }
  if (!Number.isFinite(minX) || !Number.isFinite(maxX)) return [];
  const baseWidth = Math.max(1, maxX - minX);
  const baseHeight = Math.max(1, maxY - minY);
  const baseCenterX = (minX + maxX) / 2;
  const baseCenterY = (minY + maxY) / 2;
  const targetSpan = Math.min(width, height) * 0.68;
  const span = Math.max(baseWidth, baseHeight);
  const scale = span > 0 ? targetSpan / span : 1;
  const sizeScale = clamp(scale * 0.92, 0.7, 1.45);
  const margin = Math.min(width, height) * 0.08;
  const cx = width / 2;
  const cy = height / 2;
  return CONSTELLATION_TEMPLATE.map((pt) => {
    const px = clamp(cx + (pt.x - baseCenterX) * scale, margin, width - margin);
    const py = clamp(cy + (pt.y - baseCenterY) * scale, margin, height - margin);
    const twVariation = (Math.random() - 0.5) * 0.6;
    return {
      id: pt.id,
      x: px,
      y: py,
      size: Math.max(8, (pt.size || 12) * sizeScale),
      tw: Math.max(2.4, (pt.tw || 3.2) + twVariation),
    };
  });
}

function createConstellationLines(layout){
  if (heartFinaleStarted) return;
  if (!starsLayer || !layout || !layout.length) return;
  const existing = starsLayer.querySelector('.constellation-lines');
  if (existing) existing.remove();
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.classList.add('constellation-lines');
  const width = spaceWidth || window.innerWidth;
  const height = spaceHeight || window.innerHeight;
  svg.setAttribute('width', width.toFixed(2));
  svg.setAttribute('height', height.toFixed(2));
  svg.setAttribute('viewBox', `0 0 ${width.toFixed(2)} ${height.toFixed(2)}`);
  const map = new Map(layout.map((pt) => [pt.id, pt]));
  CONSTELLATION_EDGES.forEach((edge) => {
    const [aId, bId] = edge;
    const a = map.get(aId);
    const b = map.get(bId);
    if (!a || !b) return;
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', a.x.toFixed(2));
    line.setAttribute('y1', a.y.toFixed(2));
    line.setAttribute('x2', b.x.toFixed(2));
    line.setAttribute('y2', b.y.toFixed(2));
    line.style.setProperty('--flow-duration', `${(4.2 + Math.random() * 2.4).toFixed(2)}s`);
    line.style.setProperty('--pulse-duration', `${(3 + Math.random() * 2.4).toFixed(2)}s`);
    line.style.animationDelay = `${(-Math.random() * 3).toFixed(2)}s`;
    svg.appendChild(line);
  });
  starsLayer.insertBefore(svg, starsLayer.firstChild || null);
}

function generateHeartCurve(count){
  const pts = [];
  if (count <= 0) return pts;
  const start = Math.PI;
  const total = Math.PI * 2;
  for (let i = 0; i < count; i++){
    const t = start - (total * i) / count;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push({ x, y });
  }
  return pts;
}

function buildHeartLayout(count, centerX, centerY, span){
  if (count <= 0) return [];
  const raw = generateHeartCurve(count);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  raw.forEach((pt) => {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  });
  const baseWidth = Math.max(1, maxX - minX);
  const baseHeight = Math.max(1, maxY - minY);
  const scale = span > 0 ? span / Math.max(baseWidth, baseHeight) : 1;
  const baseCenterX = (minX + maxX) / 2;
  const baseCenterY = (minY + maxY) / 2;
  return raw.map((pt) => ({
    x: centerX + (pt.x - baseCenterX) * scale,
    y: centerY - (pt.y - baseCenterY) * scale,
  }));
}

function computeHeartLayout(){
  if (!allStars.length) return [];
  const viewportWidth = window.innerWidth / spaceViewScale;
  const viewportHeight = window.innerHeight / spaceViewScale;
  const centerX = viewX + viewportWidth / 2;
  const centerY = viewY + viewportHeight / 2 - Math.min(viewportHeight, viewportWidth) * 0.08;
  const span = Math.min(viewportWidth, viewportHeight) * 0.72;
  return buildHeartLayout(allStars.length, centerX, centerY, span);
}

function applyHeartPositions(layout, animate = false){
  if (!layout.length) return;
  const update = () => {
    layout.forEach((pos, idx) => {
      const star = allStars[idx];
      if (!star) return;
      const x = pos.x.toFixed(2);
      const y = pos.y.toFixed(2);
      star.dataset.heartX = x;
      star.dataset.heartY = y;
      star.style.setProperty('--x', `${x}px`);
      star.style.setProperty('--y', `${y}px`);
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
    });
  };
  if (animate){
    layout.forEach((_, idx) => {
      const star = allStars[idx];
      if (!star) return;
      star.classList.add('heart-star');
      star.style.transitionDelay = `${(idx * HEART_MOVE_STAGGER).toFixed(2)}s`;
      star.style.setProperty('--heart-tilt', `${rand(-10, 10).toFixed(2)}deg`);
    });
    requestAnimationFrame(update);
  } else {
    layout.forEach((_, idx) => {
      const star = allStars[idx];
      if (!star) return;
      const prev = star.style.transition;
      star.style.transition = 'none';
      star.style.transitionDelay = '0s';
      const x = layout[idx].x.toFixed(2);
      const y = layout[idx].y.toFixed(2);
      star.dataset.heartX = x;
      star.dataset.heartY = y;
      star.style.setProperty('--x', `${x}px`);
      star.style.setProperty('--y', `${y}px`);
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      void star.offsetWidth;
      star.style.transition = prev;
    });
  }
}

function removeConstellationLines(){
  if (!starsLayer) return;
  const lines = starsLayer.querySelectorAll('.constellation-lines');
  lines.forEach((line) => line.remove());
}

function createHeartOutline(layout, animate = false){
  if (!starsLayer || !layout.length) return;
  if (heartLineTimer){
    clearTimeout(heartLineTimer);
    heartLineTimer = null;
  }
  if (heartLineSvg) heartLineSvg.remove();
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.classList.add('heart-outline');
  const width = spaceWidth || window.innerWidth;
  const height = spaceHeight || window.innerHeight;
  svg.setAttribute('width', width.toFixed(2));
  svg.setAttribute('height', height.toFixed(2));
  svg.setAttribute('viewBox', `0 0 ${width.toFixed(2)} ${height.toFixed(2)}`);
  const path = document.createElementNS(SVG_NS, 'path');
  const commands = layout.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`).join(' ');
  path.setAttribute('d', `${commands} Z`);
  svg.appendChild(path);
  if (animate){
    heartLineReady = false;
    pendingHeartOutlineRefresh = false;
    const length = path.getTotalLength();
    const dash = length.toFixed(2);
    path.style.strokeDasharray = dash;
    path.style.strokeDashoffset = dash;
    requestAnimationFrame(() => {
      path.classList.add('draw');
      path.style.strokeDashoffset = '0';
      heartLineTimer = setTimeout(() => {
        heartLineTimer = null;
        heartLineReady = true;
        if (pendingHeartOutlineRefresh && heartFinalLayout.length){
          pendingHeartOutlineRefresh = false;
          createHeartOutline(heartFinalLayout, false);
        }
      }, HEART_LINE_DRAW_DURATION * 1000);
    });
  } else {
    path.classList.add('draw');
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
    heartLineReady = true;
    pendingHeartOutlineRefresh = false;
  }
  if (starsLayer.firstChild){
    starsLayer.insertBefore(svg, starsLayer.firstChild);
  } else {
    starsLayer.appendChild(svg);
  }
  heartLineSvg = svg;
  if (hint){
    hint.textContent = HINT_HEART_MESSAGE;
    hint.classList.remove('hidden');
    hint.classList.add('show');
  }
}

function startHeartFinale(){
  if (heartFinaleStarted || !allStars.length) return;
  pendingHeartFinale = false;
  heartFinaleStarted = true;
  heartLineReady = false;
  pendingHeartOutlineRefresh = false;
  if (heartLineTimer){
    clearTimeout(heartLineTimer);
    heartLineTimer = null;
  }
  removeConstellationLines();
  starsLayer.classList.add('heart-mode');
  starsLayer.style.pointerEvents = 'none';
  if (hint){
    hint.classList.remove('show');
    hint.classList.add('hidden');
  }
  allStars.forEach((star) => {
    star.classList.add('heart-star');
    star.classList.add('visited');
    star.style.pointerEvents = 'none';
  });
  heartFinalLayout = computeHeartLayout();
  applyHeartPositions(heartFinalLayout, true);
  const totalDelay = HEART_MOVE_DURATION + HEART_MOVE_STAGGER * Math.max(0, allStars.length - 1) + HEART_LINE_DELAY;
  setTimeout(() => {
    createHeartOutline(heartFinalLayout, true);
  }, totalDelay * 1000);
}

// Кликабельные звезды
function placeFeaturedStars(){
  if (!starsLayer) return;
  starsLayer.innerHTML = '';
  starsLayer.style.pointerEvents = 'none';
  if (hint && HINT_DEFAULT_TEXT){
    hint.textContent = HINT_DEFAULT_TEXT;
  }
  allStars = [];
  visitedStars.clear();
  pendingHeartFinale = false;
  heartFinaleStarted = false;
  heartFinalLayout = [];
  heartLineReady = false;
  pendingHeartOutlineRefresh = false;
  if (heartLineTimer){
    clearTimeout(heartLineTimer);
    heartLineTimer = null;
  }
  if (heartLineSvg){
    heartLineSvg.remove();
    heartLineSvg = null;
  }
  starsLayer.classList.remove('heart-mode');
  const width = spaceWidth || window.innerWidth;
  const height = spaceHeight || window.innerHeight;
  const fullConstellation = buildConstellationLayout(width, height);
  const count = FEATURED_COUNT;
  const constellationLayout = fullConstellation.slice(0, Math.min(count, fullConstellation.length));
  activeConstellation = constellationLayout.map((pt) => ({ ...pt }));
  const used = constellationLayout.map((pt) => ({ x: pt.x, y: pt.y }));
  const marginX = Math.min(240, width * 0.16);
  const marginY = Math.min(240, height * 0.16);
  const minDist = Math.min(200, Math.max(130, Math.min(width, height) * 0.18));
  let memoryIndex = 0;

  const nextMemory = () => {
    const mem = MEMORIES[memoryIndex % MEMORIES.length];
    memoryIndex += 1;
    return mem;
  };

  const createStar = ({ x, y, size, tw, extraClass }, mem) => {
    const star = document.createElement('button');
    star.className = extraClass ? `star ${extraClass}` : 'star';
    star.style.setProperty('--size', `${size.toFixed(2)}px`);
    star.style.setProperty('--x', `${x.toFixed(2)}px`);
    star.style.setProperty('--y', `${y.toFixed(2)}px`);
    star.style.setProperty('--tw', `${(tw || 3).toFixed(2)}s`);
    star.style.left = `${x.toFixed(2)}px`;
    star.style.top = `${y.toFixed(2)}px`;
    star.dataset.src = mem.src;
    star.dataset.caption = mem.caption;
    star.dataset.originX = x.toFixed(2);
    star.dataset.originY = y.toFixed(2);

    const open = () => {
      star.classList.add('visited');
      const wasVisited = visitedStars.has(star);
      visitedStars.add(star);
      if (!wasVisited && visitedStars.size === allStars.length && allStars.length > 0 && !heartFinaleStarted){
        pendingHeartFinale = true;
      }
      const rect = star.getBoundingClientRect();
      const sparkleX = rect.left + rect.width / 2;
      const sparkleY = rect.top + rect.height / 2;
      openMemory(mem.src, mem.caption);
      sparkle(sparkleX, sparkleY);
    };
    star.addEventListener('click', () => {
      if (panJustHappened) return;
      open();
    });

    starsLayer.appendChild(star);
    allStars.push(star);
    return star;
  };

  for (const node of constellationLayout){
    createStar({ ...node, extraClass: 'constellation-star' }, nextMemory());
  }

  let created = constellationLayout.length;
  const maxAttempts = 140;
  while (created < count){
    let x = 0;
    let y = 0;
    let attempts = 0;
    while (attempts < maxAttempts){
      x = rand(marginX, width - marginX);
      y = rand(marginY, height - marginY);
      let ok = true;
      for (const p of used){
        if (Math.hypot(p.x - x, p.y - y) < minDist){
          ok = false;
          break;
        }
      }
      if (ok) break;
      attempts++;
    }
    used.push({ x, y });
    const mem = nextMemory();
    createStar({ x, y, size: 10 + Math.random() * 10, tw: 2 + Math.random() * 1.8 }, mem);
    created++;
  }

  createConstellationLines(activeConstellation);
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
function closeMemory(){
  memoryEl.classList.add('hidden');
  if (pendingHeartFinale && !heartFinaleStarted){
    setTimeout(() => {
      if (pendingHeartFinale && !heartFinaleStarted){
        startHeartFinale();
      }
    }, 320);
  }
}
closeBtn.addEventListener('click', closeMemory);
memoryEl.addEventListener('click', e => { if (e.target === memoryEl) closeMemory(); });

// Блёстки
const fxCtx = fx ? fx.getContext('2d') : null;
let particles = [];
const SPARKLE_PARTICLE_COUNT = lowPowerMode ? 16 : 28;
const SPARKLE_MIN_SPEED = lowPowerMode ? 60 : 80;
const SPARKLE_MAX_SPEED = lowPowerMode ? 160 : 220;

function sparkle(x,y){
  if (!fx || !fxCtx) return;
  const rect = fx.getBoundingClientRect();
  const px = (x - rect.left) * dpr;
  const py = (y - rect.top) * dpr;
  for (let i=0;i<SPARKLE_PARTICLE_COUNT;i++){
    const a = Math.random()*Math.PI*2;
    const sp = SPARKLE_MIN_SPEED + Math.random()*(SPARKLE_MAX_SPEED - SPARKLE_MIN_SPEED);
    particles.push({
      x:px,y:py, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp,
      life:0, ttl:0.6 + Math.random()*0.5, size:1 + Math.random()*2,
      hue:210 + Math.random()*40
    });
  }
}
const MIN_FX_FRAME_MS = lowPowerMode ? (1000 / 45) : 0;
let lastFx = performance.now();
function renderFx(t){
  if (!fxCtx) return;
  const elapsedMs = t - lastFx;
  if (MIN_FX_FRAME_MS && elapsedMs < MIN_FX_FRAME_MS){
    requestAnimationFrame(renderFx);
    return;
  }
  const dt = Math.min(0.05, Math.max(0.016, elapsedMs/1000));
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
  spaceWrapper.addEventListener('pointerdown', handleSpacePointerDown);
  spaceWrapper.addEventListener('pointermove', handleSpacePointerMove);
  spaceWrapper.addEventListener('pointerup', handleSpacePointerUp);
  spaceWrapper.addEventListener('pointercancel', handleSpacePointerUp);
  spaceWrapper.addEventListener('wheel', handleSpaceWheel, { passive: false });
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
animateIntroStarsPulse();
buildIntroTimeline();
animateHeroCopy();

// Предзагрузка изображений
for (const m of MEMORIES) { const img = new Image(); img.src = m.src; }
