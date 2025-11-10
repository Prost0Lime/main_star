// === МЕМОРИИ (замени под себя) ===
const MEMORIES = [
  { src: "assets/memory1.jpg", caption: "«Наш маленький космос начался с тишины.»" },
  { src: "assets/memory2.jpg", caption: "«Закат пах корицей и ветром.»" },
  { src: "assets/memory3.jpg", caption: "«Смотри — даже звёзды улыбаются.»" },
  { src: "assets/memory4.jpg", caption: "«Ты — моё любимое созвездие.»" },
  { src: "assets/memory5.jpg", caption: "«И в темноте нам светло.»" },
];
const FEATURED_COUNT = Math.min(10, MEMORIES.length);

// === ССЫЛКИ НА СЛОИ ===
const intro = document.getElementById('intro');
const skyTop = document.getElementById('skyTop');
const skyMid = document.getElementById('skyMid');
const skyBot = document.getElementById('skyBot');
const sunGroup = document.getElementById('sunGroup');
const clouds = document.getElementById('clouds');
const lampLight = document.getElementById('lampLight');
const bulb = document.getElementById('bulb');
const introText = document.getElementById('introText');

const bg = document.getElementById('bg');
const starsLayer = document.getElementById('stars-layer');
const fx = document.getElementById('fx');
const hint = document.getElementById('hint');

const dpr = Math.min(2, window.devicePixelRatio || 1);

// === ЭТАПЫ ИНТРО ===
// Таймлайн (секунды): 0–7 закат, 7–10 ночной переход, 10+ звезды + лампа
const INTRO = {
  SUNSET_DURATION: 7.0,
  NIGHT_FADE: 3.0,
  STARS_DELAY: 0.5,
};

let startTime = null;

function lerp(a,b,t){ return a + (b-a)*t; }

function animateIntro(ts){
  if(!startTime) startTime = ts;
  const t = (ts - startTime) / 1000;

  // 1) Солнце опускается, небо из тёплого в холодное, облака двигаются влево
  const t1 = Math.min(1, t / INTRO.SUNSET_DURATION);
  // Небо: с вечера (#304b7a → #0b1324), средний: (#8aa1d1 → #162139), низ: (#f2b36a → #0b1324)
  skyTop.setAttribute('stop-color', mixColor("#304b7a", "#0b1324", t1));
  skyMid.setAttribute('stop-color', mixColor("#8aa1d1", "#162139", t1));
  skyBot.setAttribute('stop-color', mixColor("#f2b36a", "#0b1324", t1));

  // Солнце: опустить и чуть уменьшить
  const sunY = lerp(560, 650, t1);
  const sunScale = lerp(1, 0.85, t1);
  sunGroup.setAttribute('transform', `translate(0, ${sunY-560}) scale(${sunScale})`);

  // Облака: плывут влево и слегка растворяются к концу 1 этапа
  const cloudShift = -40 * t1;
  clouds.setAttribute('transform', `translate(${cloudShift}, 0)`);
  clouds.setAttribute('opacity', String(0.9 * (1 - t1*0.6)));

  // 2) Переход к ночи: облака исчезают, небо темнеет ещё, текст пропадает
  const t2 = Math.max(0, Math.min(1, (t - INTRO.SUNSET_DURATION) / INTRO.NIGHT_FADE));
  if (t2 > 0){
    skyTop.setAttribute('stop-color', mixColor(skyTop.getAttribute('stop-color'), "#05070b", t2));
    skyMid.setAttribute('stop-color', mixColor(skyMid.getAttribute('stop-color'), "#0f1726", t2));
    skyBot.setAttribute('stop-color', mixColor(skyBot.getAttribute('stop-color'), "#05070b", t2));
    clouds.setAttribute('opacity', String(0.3 * (1 - t2)));
    introText.setAttribute('opacity', String(0.9 * (1 - t2)));
  }

  // 3) Ночь: включаем лампу, скрываем интро и показываем звёзды
  if (t >= INTRO.SUNSET_DURATION + INTRO.NIGHT_FADE + INTRO.STARS_DELAY){
    lampLight.setAttribute('opacity', "1");
    bulb.setAttribute('fill', "#ffc66e");
    endIntro();
    return;
  }

  requestAnimationFrame(animateIntro);
}

function endIntro(){
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
const bgCtx = bg.getContext('2d');
let W,H, starfield=[];
function resize(){
  const dpr = Math.min(2, window.devicePixelRatio||1);
  W = bg.width = fx.width = Math.floor(innerWidth * dpr);
  H = bg.height = fx.height = Math.floor(innerHeight * dpr);
  bg.style.width = fx.style.width = innerWidth + 'px';
  bg.style.height = fx.style.height = innerHeight + 'px';
  genStarfield();
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
  const dt = (t - t0)/1000; t0 = t;
  bgCtx.clearRect(0,0,W,H);
  // тёмный ночной градиент
  const g = bgCtx.createRadialGradient(W*0.5,H*0.9,Math.min(W,H)*0.05, W*0.5,H*0.5, Math.max(W,H)*0.7);
  g.addColorStop(0,'#091221');
  g.addColorStop(1,'#000000');
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
  starsLayer.innerHTML = '';
  starsLayer.style.pointerEvents = 'none';
  const used = [];
  const count = FEATURED_COUNT;

  for(let i=0;i<count;i++){
    const star = document.createElement('button');
    star.className = 'star';
    const size = 10 + Math.random()*10;
    const x = 10 + Math.random()*80;
    const y = 14 + Math.random()*66;
    star.style.setProperty('--size', `${size}px`);
    star.style.setProperty('--x', `${x}%`);
    star.style.setProperty('--y', `${y}%`);
    star.style.setProperty('--tw', `${2 + Math.random()*1.8}s`);

    // коллизии
    let ok = true;
    for (const p of used) if (Math.hypot(p.x-x, p.y-y) < 10) { ok=false; break; }
    if (!ok){ i--; continue; }
    used.push({x,y});

    const mem = MEMORIES[i % MEMORIES.length];
    star.dataset.src = mem.src;
    star.dataset.caption = mem.caption;

    const open = (clientX, clientY)=>{
      openMemory(mem.src, mem.caption);
      sparkle(clientX, clientY);
    };
    star.addEventListener('click', e => open(e.clientX, e.clientY));
    star.addEventListener('touchstart', e => {
      const t = e.touches[0]; open(t.clientX, t.clientY);
    }, {passive:true});

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
const fxCtx = fx.getContext('2d');
let particles = [];
function sparkle(x,y){
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

// Инициализация после завершения интро
function initBackground(){
  window.addEventListener('resize', resize, {passive:true});
  resize();
  requestAnimationFrame(renderBackground);
  requestAnimationFrame(renderFx);
}

// Старт анимации интро
requestAnimationFrame(animateIntro);

// Предзагрузка изображений
for (const m of MEMORIES) { const img = new Image(); img.src = m.src; }
