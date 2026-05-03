/* ═══════════════════════════════
   AGE CALCULATOR - script.js
   Agus Satria Adhitama
═══════════════════════════════ */

// ── POPULATE HARI ──────────────
var selD = document.getElementById('selD');
var selM = document.getElementById('selM');
var selY = document.getElementById('selY');

for (var d = 1; d <= 31; d++) {
  var opt = document.createElement('option');
  opt.value = d;
  opt.textContent = d < 10 ? '0' + d : '' + d;
  selD.appendChild(opt);
}

// ── POPULATE TAHUN ─────────────
var tahunIni = new Date().getFullYear();
for (var y = tahunIni - 1; y >= 1900; y--) {
  var opt2 = document.createElement('option');
  opt2.value = y;
  opt2.textContent = y;
  selY.appendChild(opt2);
}

// ── THEME TOGGLE ───────────────
var themeBtn  = document.getElementById('themeBtn');
var themeIcon = document.getElementById('themeIcon');
var body      = document.body;

var savedTheme = localStorage.getItem('age-theme') || 'dark';
body.className = savedTheme;
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeBtn.onclick = function () {
  if (body.classList.contains('dark')) {
    body.className = 'light';
    themeIcon.textContent = '🌙';
    localStorage.setItem('age-theme', 'light');
  } else {
    body.className = 'dark';
    themeIcon.textContent = '☀️';
    localStorage.setItem('age-theme', 'dark');
  }
};

// ── HITUNG BUTTON ──────────────
var hitungBtn = document.getElementById('hitungBtn');
var errMsg    = document.getElementById('errMsg');
var resultBox = document.getElementById('resultBox');
var tickInterval = null;

hitungBtn.onclick = function () {
  hitung();
};

function showErr(msg) {
  errMsg.textContent = msg;
  errMsg.className = 'error show';
}

function hideErr() {
  errMsg.className = 'error';
}

function hitung() {
  hideErr();

  var d = parseInt(selD.value, 10);
  var m = parseInt(selM.value, 10);
  var y = parseInt(selY.value, 10);

  // Validasi
  if (!selD.value || !selM.value || !selY.value) {
    showErr('⚠ Pilih hari, bulan, dan tahun terlebih dahulu.');
    return;
  }

  if (isNaN(d) || isNaN(m) || isNaN(y)) {
    showErr('⚠ Tanggal tidak valid.');
    return;
  }

  // Buat Date di local timezone - new Date(y, m-1, d)
  var dob   = new Date(y, m - 1, d);
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  // Cek overflow tanggal (misal 31 Feb)
  if (dob.getDate() !== d || dob.getMonth() !== m - 1 || dob.getFullYear() !== y) {
    showErr('⚠ Tanggal tidak valid (misal: 30 Feb tidak ada).');
    return;
  }

  if (dob >= today) {
    showErr('⚠ Tanggal harus sebelum hari ini!');
    return;
  }

  // Hitung umur
  var age = hitungUmur(dob, today);
  var totalHari = Math.floor((today - dob) / 86400000);

  // Tampilkan
  tampilkan(age, totalHari, dob, today);
  startTicker(dob);

  // Scroll ke hasil
  setTimeout(function () {
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── HITUNG UMUR ────────────────
function hitungUmur(dob, today) {
  var y = today.getFullYear() - dob.getFullYear();
  var m = today.getMonth()    - dob.getMonth();
  var d = today.getDate()     - dob.getDate();

  if (d < 0) {
    m--;
    var lastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    d += lastDay;
  }
  if (m < 0) {
    y--;
    m += 12;
  }

  return { y: y, m: m, d: d };
}

// ── TAMPILKAN ──────────────────
function tampilkan(age, totalHari, dob, today) {
  // Angka besar
  setNum('rTahun', age.y, 0);
  setNum('rBulan', age.m, 100);
  setNum('rHari',  age.d, 200);

  // Stats
  document.getElementById('sTotalHari').textContent  = totalHari.toLocaleString('id-ID');
  document.getElementById('sTotalBulan').textContent = (age.y * 12 + age.m).toLocaleString('id-ID');
  document.getElementById('sJantung').textContent    = (totalHari * 24 * 60 * 70 / 1e9).toFixed(2);

  // Ulang tahun
  var yr   = today.getFullYear();
  var next = new Date(yr, dob.getMonth(), dob.getDate());
  next.setHours(0, 0, 0, 0);
  if (next.getTime() === today.getTime()) {
    document.getElementById('sNextBday').textContent = '🎂 Hari ini !';
    document.getElementById('sBdayLbl').textContent  = 'Selamat ulang tahun !';
  } else {
    if (next < today) next = new Date(yr + 1, dob.getMonth(), dob.getDate());
    var sisa = Math.ceil((next - today) / 86400000);
    document.getElementById('sNextBday').textContent = sisa.toLocaleString('id-ID');
    document.getElementById('sBdayLbl').textContent  = 'hari lagi ulang tahun';
  }

  // Zodiak
  var z = getZodiak(dob.getMonth() + 1, dob.getDate());
  document.getElementById('zSym').textContent   = z.sym;
  document.getElementById('zName').textContent  = z.name;
  document.getElementById('zDates').textContent = z.dates;
  document.getElementById('zTrait').textContent = z.trait;

  // Fun fact
  var facts = [
    'Kamu sudah bernafas =' + Math.round(totalHari * 24 * 60 * 15).toLocaleString('id-ID') + ' kali sejak lahir.',
    'Kamu sudah tidur sekitar ' + (age.y * 0.33).toFixed(1) + ' tahun dari hidupmu.',
    'Bulan sudah mengorbit Bumi ' + Math.round(totalHari / 29.5).toLocaleString('id-ID') + ' kali sejak kamu lahir.',
    'Jantungmu sudah berdenyut ±' + (totalHari * 24 * 60 * 70 / 1e9).toFixed(2) + ' miliar kali tanpa berhenti.',
    'Kamu sudah mengorbit Matahari ' + (totalHari / 365.25).toFixed(1) + ' kali.',
  ];
  document.getElementById('funfact').textContent = facts[Math.floor(Math.random() * facts.length)];

  // Show result
  resultBox.className = 'result show slide-up';
}

function setNum(id, val, delay) {
  setTimeout(function () {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = val;
    el.className = 'num pop';
    el.addEventListener('animationend', function () {
      el.className = 'num';
    }, { once: true });
  }, delay);
}

// ── TICKER ─────────────────────
function startTicker(dob) {
  if (tickInterval) clearInterval(tickInterval);

  function tick() {
    var now  = Date.now();
    var diff = Math.floor((now - dob.getTime()) / 1000);
    var s    = diff % 60;
    var min  = Math.floor(diff / 60) % 60;
    var h    = Math.floor(diff / 3600) % 24;
    var day  = Math.floor(diff / 86400);

    document.getElementById('tD').textContent = day.toLocaleString('id-ID');
    document.getElementById('tH').textContent = h < 10 ? '0' + h : h;
    document.getElementById('tM').textContent = min < 10 ? '0' + min : min;
    document.getElementById('tS').textContent = s < 10 ? '0' + s : s;
  }

  tick();
  tickInterval = setInterval(tick, 1000);
}

// ── ZODIAK ─────────────────────
var ZODIAK = [
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

function getZodiak(month, day) {
  for (var i = 0; i < ZODIAK.length; i++) {
    var z = ZODIAK[i];
    if (month < z.m || (month === z.m && day <= z.d)) return z;
  }
  return ZODIAK[ZODIAK.length - 1];
}
