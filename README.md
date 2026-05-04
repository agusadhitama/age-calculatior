# AGE CALCULATOR - Kamu Sudah Hidup Berapa Lama?

> **Kalkulator umur presisi tinggi** dengan desain premium dark/light theme. Dihitung hingga detik ini tanpa framework, tanpa dependencies.

---

## ✨ Fitur

- 🎂 **Hitung umur akurat** tahun, bulan, dan hari
- ⏱️ **Live ticker real-time** waktu hidupmu terus berjalan di layar
- 📆 **Total hari & bulan** yang sudah kamu jalani
- 💓 **Estimasi detak jantung** sejak lahir
- 🎉 **Countdown ulang tahun** berikutnya
- 🌙 **Zodiak otomatis** lengkap dengan sifat kepribadian
- ✦ **Fun fact** acak tiap perhitungan
- 🌗 **Dark / Light theme** tersimpan otomatis di browser
- 📱 **Fully responsive** mobile, tablet, desktop

---

## 🚀 Demo

🔗 **[LIVE DEMO](https://agusadhitama.github.io/age-calculator)**

---

## 📁 Struktur Project

```
age-calculator/
├── index.html   # Markup & struktur halaman
├── style.css    # Semua styling + dark/light theme
├── script.js    # Logic kalkulasi + interaksi
└── README.md    # Dokumentasi ini
```

---

## 🛠️ Cara Pakai

### Jalankan Lokal

Cukup buka `index.html` langsung di browser tidak perlu server, tidak perlu install apapun.

```bash
# Clone repo
git clone https://github.com/agusadhitama/age-calculato.git

# Masuk folder
cd age calculator

# Buka di browser (atau klik 2x file index.html)
open index.html
```

---

## ⚙️ Cara Kerja

### Kalkulasi Umur

Umur dihitung dengan membandingkan tanggal lahir terhadap tanggal hari ini secara akurat mempertimbangkan jumlah hari tiap bulan dan tahun kabisat.

```js
function hitungUmur(dob, today) {
  var y = today.getFullYear() - dob.getFullYear();
  var m = today.getMonth()    - dob.getMonth();
  var d = today.getDate()     - dob.getDate();

  if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }

  return { y, m, d };
}
```

### Parsing Tanggal

Tanggal dibuat menggunakan `new Date(year, month-1, day)` bukan dari string ISO sehingga tidak ada timezone shift yang umum terjadi di region UTC+7 (Indonesia).

---

## 🎨 Design System

| Token | Dark | Light |
|-------|------|-------|
| Background | `#08080d` | `#f0efe9` |
| Surface | `#10101a` | `#ffffff` |
| Accent | `#c8f135` | `#2d6e00` |
| Text primary | `#f0f0f4` | `#18180f` |
| Text muted | `#7777a0` | `#777760` |

**Tipografi:**
- `Playfair Display` angka besar & headline
- `DM Mono` label, ticker, kode
- `Outfit` UI umum & tombol

---

## 🧰 Tech Stack

| | |
|---|---|
| **HTML** | Semantic, accessible markup |
| **CSS** | Custom properties, CSS Grid, Flexbox |
| **JavaScript** | Vanilla ES5+ no framework, no build tool |
| **Fonts** | Google Fonts (Playfair Display, DM Mono, Outfit) |
| **Deploy** | GitHub Pages |

---

## 📖 Filosofi

> *"You don't need a framework to build something beautiful."*

Project ini dibuat sebagai bukti bahwa HTML, CSS, dan JavaScript murni tanpa React, tanpa Vite, tanpa npm masih bisa menghasilkan produk yang terasa premium dan berfungsi dengan baik.

---

## 👤 Author

**Agus Satria Adhitama**

- GitHub: [@agusadhitama](https://github.com/agusadhitama)

---

## 📄 License

MIT License - bebas digunakan, dimodifikasi, dan didistribusikan.

---

<div align="center">
  <sub>No framework. Just craft. ✦</sub>
</div>
