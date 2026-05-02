/* ════════════════════════════════════════════════════════════
   AGE.IO — script.js
   Agus Satria Adhitama · v3.0
════════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM REFS ──────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const html        = document.documentElement;
const dobInput    = $('dobInput');
const calcBtn     = $('calcBtn');
const errorBanner = $('errorBanner');
const errorText   = $('errorText');
const resultDiv   = $('resultSection');
const resultDiv2  = $('resultDivider');
const themeSwitcher = $('themeSwitcher');
const bgCanvas    = $('bgCanvas');

/* ── THEME SYSTEM ──────────────────────────────────────────── */
const THEME_KEY = 'age-io-theme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

function applyTheme(theme) {
  html.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  // Update buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    const active = btn.dataset.t === theme;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  // Redraw canvas with new colors
  drawCanvas();
}

themeSwitcher.addEventListener('click', e => {
  const btn = e.target.closest('.theme-btn');
  if (!btn) return;
  applyTheme(btn.dataset.t);
});

// Keyboard support for theme
themeSwitcher.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const current = getTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }
});

applyTheme(getTheme());

/* ── CANVAS BACKGROUND ─────────────────────────────────────── */
const ctx = bgCanvas.getContext('2d');
let W, H, particles = [], animFrameId;

function resizeCanvas() {
  W = bgCanvas.width  = window.innerWidth;
  H = bgCanvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x  = Math.random() * W;
    this.y  = initial ? Math.random() * H : H + 10;
    this.r  = Math.random() * 1.2 + 0.3;
    this.vy = -(Math.random() * 0.4 + 0.15);
    this.vx = (Math.random() - 0.5) * 0.3;
    this.life   = 0;
    this.maxLife = Math.random() * 300 + 200;
    this.hue = Math.random() < 0.6 ? 75 : (Math.random() < 0.5 ? 168 : 295);
  }

  update() {
    this.x    += this.vx;
    this.y    += this.vy;
    this.life += 1;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }

  draw(ctx) {
    const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.55;
    const isDark = getTheme() === 'dark';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 90%, ${isDark ? 70 : 35}%, ${alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: 90 }, () => new Particle());
}

// Orbs / blobs
const orbs = [
  { x: 0.15, y: 0.2,  r: 0.35, hue: 75,  spd: 0.0006, phase: 0 },
  { x: 0.85, y: 0.75, r: 0.28, hue: 168, spd: 0.0008, phase: 2 },
  { x: 0.5,  y: 0.5,  r: 0.2,  hue: 295, spd: 0.0005, phase: 4 },
];

let t = 0;

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);

  const isDark = getTheme() === 'dark';

  // Orbs
  orbs.forEach(o => {
    const ox = (o.x + Math.sin(t * o.spd + o.phase) * 0.1) * W;
    const oy = (o.y + Math.cos(t * o.spd * 0.7 + o.phase) * 0.08) * H;
    const r  = o.r * Math.min(W, H);

    const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
    const alpha = isDark ? 0.07 : 0.05;
    grad.addColorStop(0, `hsla(${o.hue}, 90%, 60%, ${alpha})`);
    grad.addColorStop(1, `hsla(${o.hue}, 90%, 60%, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ox, oy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Grid
  ctx.strokeStyle = isDark
    ? 'rgba(255,255,255,0.018)'
    : 'rgba(0,0,0,0.035)';
  ctx.lineWidth = 1;
  const gridSize = 64;
  for (let x = 0; x < W; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Particles
  particles.forEach(p => { p.update(); p.draw(ctx); });

  t++;
  animFrameId = requestAnimationFrame(drawCanvas);
}

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
resizeCanvas();
initParticles();
drawCanvas();


/* ── DATE INPUT SETUP ──────────────────────────────────────── */
dobInput.max = new Date().toISOString().split('T')[0];

dobInput.addEventListener('change', () => {
  hideError();
  // Don't collapse result on change if already shown
});

dobInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') triggerCalc();
});

/* ── BUTTON RIPPLE ─────────────────────────────────────────── */
calcBtn.addEventListener('click', e => {
  const ripple = calcBtn.querySelector('.btn-ripple');
  const rect   = calcBtn.getBoundingClientRect();
  ripple.style.left = (e.clientX - rect.left - 10) + 'px';
  ripple.style.top  = (e.clientY - rect.top  - 10) + 'px';
  ripple.classList.remove('go');
  void ripple.offsetWidth;
  ripple.classList.add('go');
  triggerCalc();
});

/* ── MAIN CALCULATION ──────────────────────────────────────── */
function triggerCalc() {
  const val = dobInput.value;

  if (!val) {
    showError('Tanggal lahir wajib diisi dulu ya!');
    return;
  }

  // Parse manual untuk hindari timezone shift (bug di UTC+7 Indonesia)
  const parts = val.split('-');
  if (parts.length !== 3) { showError('Format tanggal tidak dikenali.'); return; }

  const dob   = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  const today = new Date();
  dob.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (isNaN(dob.getTime())) {
    showError('Format tanggal tidak dikenali.');
    return;
  }
  if (dob >= today) {
    showError('Tanggal tidak bisa hari ini atau masa depan!');
    return;
  }

  hideError();

  const age     = calcAge(dob, today);
  const total   = calcTotalDays(dob, today);
  const nextBd  = calcNextBday(dob, today);
  const zodiac  = getZodiac(dob.getMonth() + 1, dob.getDate());
  const fact    = getFunFact(age, total, dob);

  renderResult(age, total, nextBd, zodiac, fact, dob);
  startLiveTicker(dob);
}

/* ── AGE CALCULATION ───────────────────────────────────────── */
function calcAge(dob, today) {
  let y = today.getFullYear() - dob.getFullYear();
  let m = today.getMonth()    - dob.getMonth();
  let d = today.getDate()     - dob.getDate();

  if (d < 0) {
    m--;
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    d += prevMonthDays;
  }
  if (m < 0) { y--; m += 12; }

  return { y, m, d };
}

function calcTotalDays(dob, today) {
  return Math.floor((today - dob) / 86400000);
}

function calcNextBday(dob, today) {
  const yr = today.getFullYear();
  let next = new Date(yr, dob.getMonth(), dob.getDate());
  next.setHours(0, 0, 0, 0);
  if (next.getTime() === today.getTime()) return 0;
  if (next < today) next = new Date(yr + 1, dob.getMonth(), dob.getDate());
  return Math.ceil((next - today) / 86400000);
}

/* ── ZODIAC DATA ───────────────────────────────────────────── */
const ZODIACS = [
  { m:1,  d:19, name:'Capricorn',   sym:'♑', dates:'22 Des – 19 Jan', trait:'Disiplin, ambisius, sabar' },
  { m:2,  d:18, name:'Aquarius',    sym:'♒', dates:'20 Jan – 18 Feb', trait:'Inovatif, bebas, humanis' },
  { m:3,  d:20, name:'Pisces',      sym:'♓', dates:'19 Feb – 20 Mar', trait:'Empatik, intuitif, artistik' },
  { m:4,  d:19, name:'Aries',       sym:'♈', dates:'21 Mar – 19 Apr', trait:'Berani, energik, pemimpin' },
  { m:5,  d:20, name:'Taurus',      sym:'♉', dates:'20 Apr – 20 Mei', trait:'Teguh, setia, penuh selera' },
  { m:6,  d:20, name:'Gemini',      sym:'♊', dates:'21 Mei – 20 Jun', trait:'Adaptif, cerdas, komunikatif' },
  { m:7,  d:22, name:'Cancer',      sym:'♋', dates:'21 Jun – 22 Jul', trait:'Peka, protektif, penuh kasih' },
  { m:8,  d:22, name:'Leo',         sym:'♌', dates:'23 Jul – 22 Agt', trait:'Karismatik, percaya diri, murah hati' },
  { m:9,  d:22, name:'Virgo',       sym:'♍', dates:'23 Agt – 22 Sep', trait:'Analitis, teliti, rendah hati' },
  { m:10, d:22, name:'Libra',       sym:'♎', dates:'23 Sep – 22 Okt', trait:'Adil, harmonis, diplomatis' },
  { m:11, d:21, name:'Scorpio',     sym:'♏', dates:'23 Okt – 21 Nov', trait:'Intens, loyal, penuh passion' },
  { m:12, d:21, name:'Sagittarius', sym:'♐', dates:'22 Nov – 21 Des', trait:'Petualang, optimis, jujur' },
  { m:12, d:31, name:'Capricorn',   sym:'♑', dates:'22 Des – 19 Jan', trait:'Disiplin, ambisius, sabar' },
];

function getZodiac(month, day) {
  for (const z of ZODIACS) {
    if (month < z.m || (month === z.m && day <= z.d)) return z;
  }
  return ZODIACS[11];
}

/* ── FUN FACTS ─────────────────────────────────────────────── */
function getFunFact(age, totalDays, dob) {
  const totalHours   = totalDays * 24;
  const totalMins    = totalHours * 60;
  const breaths      = Math.round(totalMins * 15).toLocaleString('id-ID');
  const heartbeats   = (totalMins * 70 / 1e9).toFixed(2);
  const sleepYears   = (age.y * 0.33).toFixed(1);
  const moonOrbit    = Math.round(totalDays / 29.5);
  const earthOrbit   = Math.round(totalDays / 365.25 * 10) / 10;
  const bloodPumped  = Math.round(totalMins * 70 * 0.07 / 1000).toLocaleString('id-ID');

  const facts = [
    `Sejak lahir, kamu sudah menarik nafas sekitar ${breaths} kali — setiap nafas membawa cerita baru.`,
    `Dalam ${age.y} tahun hidupmu, kamu sudah tidur sekitar ${sleepYears} tahun — dan itu bukan waktu yang terbuang.`,
    `Bulan telah mengorbit Bumi sebanyak ${moonOrbit.toLocaleString('id-ID')} kali sejak kamu lahir.`,
    `Jantungmu sudah berdenyut ±${heartbeats} miliar kali — tanpa berhenti, tanpa komplain.`,
    `Kamu sudah mengorbit Matahari sebanyak ${earthOrbit} kali — kamu adalah pejalan antariksa.`,
    `Jantungmu telah memompa sekitar ${bloodPumped} liter darah sejak hari pertama kamu hadir di dunia.`,
  ];

  return facts[Math.floor(Math.random() * facts.length)];
}

/* ── RENDER RESULT ─────────────────────────────────────────── */
function renderResult(age, total, nextBd, zodiac, fact, dob) {
  // Show divider & result
  resultDiv2.hidden = false;
  resultDiv.hidden  = false;

  // Animate sections
  resultDiv2.classList.add('reveal');
  resultDiv.classList.add('reveal');

  // ── Big numbers with staggered pop
  setNumAnimated($('numTahun'), age.y, 0);
  setNumAnimated($('numBulan'), age.m, 120);
  setNumAnimated($('numHari'),  age.d, 240);

  // ── Progress bars (% within max range)
  setTimeout(() => {
    $('fillTahun').style.width = `${Math.min((age.y / 100) * 100, 100)}%`;
    $('fillBulan').style.width = `${Math.min((age.m / 12) * 100, 100)}%`;
    $('fillHari').style.width  = `${Math.min((age.d / 31) * 100, 100)}%`;
  }, 300);

  // ── Stats
  $('statTotalHari').textContent  = total.toLocaleString('id-ID');
  $('statTotalBulan').textContent = (age.y * 12 + age.m).toLocaleString('id-ID');

  // Heartbeats (billions)
  const totalMins = total * 24 * 60;
  $('statJantung').textContent = (totalMins * 70 / 1e9).toFixed(2);

  if (nextBd === 0) {
    $('statNextBday').textContent  = '🎂 Hari ini!';
    $('statBdayLabel').textContent = 'Selamat ulang tahun!';
  } else {
    $('statNextBday').textContent  = nextBd.toLocaleString('id-ID');
    $('statBdayLabel').textContent = 'hari lagi ulang tahun';
  }

  // ── Zodiac
  $('zodiacSym').textContent   = zodiac.sym;
  $('zodiacName').textContent  = zodiac.name;
  $('zodiacDates').textContent = zodiac.dates;
  $('zodiacTrait').textContent = zodiac.trait;

  // ── Fun fact
  $('funfactText').textContent = fact;

  // Scroll to result smoothly
  setTimeout(() => {
    resultDiv2.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

/* Animated number set */
function setNumAnimated(el, val, delay) {
  setTimeout(() => {
    el.textContent = String(val).padStart(2, '0');
    el.classList.remove('num-pop');
    void el.offsetWidth;
    el.classList.add('num-pop');
    el.addEventListener('animationend', () => el.classList.remove('num-pop'), { once: true });
  }, delay);
}

/* ── LIVE TICKER ───────────────────────────────────────────── */
let tickerInterval = null;
let prevS = -1;

function startLiveTicker(dob) {
  if (tickerInterval) clearInterval(tickerInterval);

  function tick() {
    const now  = new Date();
    const diff = now - dob;

    const totalSec = Math.floor(diff / 1000);
    const s  = totalSec % 60;
    const m  = Math.floor(totalSec / 60) % 60;
    const h  = Math.floor(totalSec / 3600) % 24;
    const d  = Math.floor(totalSec / 86400);

    const segD = $('tickD');
    const segH = $('tickH');
    const segM = $('tickM');
    const segS = $('tickS');

    segD.textContent = d.toLocaleString('id-ID');
    segH.textContent = String(h).padStart(2, '0');
    segM.textContent = String(m).padStart(2, '0');
    segS.textContent = String(s).padStart(2, '0');

    // Flash seconds
    if (s !== prevS) {
      segS.classList.remove('changed');
      void segS.offsetWidth;
      segS.classList.add('changed');
      prevS = s;
    }
  }

  tick();
  tickerInterval = setInterval(tick, 1000);
}

/* ── ERROR HANDLING ────────────────────────────────────────── */
function showError(msg) {
  errorText.textContent = msg;
  errorBanner.hidden = false;

  // Re-trigger shake
  errorBanner.style.animation = 'none';
  void errorBanner.offsetWidth;
  errorBanner.style.animation = '';

  dobInput.focus();
}

function hideError() {
  errorBanner.hidden = true;
}

/* ── ACCESSIBILITY ─────────────────────────────────────────── */
// Allow keyboard navigation for all interactive elements
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('role', 'button');
});

// Announce results to screen readers
function announceResult(age) {
  const msg = `Umur kamu adalah ${age.y} tahun, ${age.m} bulan, dan ${age.d} hari.`;
  const live = document.createElement('div');
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  live.className = 'sr-only';
  live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
  live.textContent = msg;
  document.body.appendChild(live);
  setTimeout(() => live.remove(), 3000);
}

/* ── CLEANUP ON PAGE HIDE ──────────────────────────────────── */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animFrameId);
    if (tickerInterval) clearInterval(tickerInterval);
  } else {
    drawCanvas();
    // Restart ticker if DOB was set
    if (dobInput.value && !resultDiv.hidden) {
      const dob = new Date(dobInput.value + 'T00:00:00');
      startLiveTicker(dob);
    }
  }
});
