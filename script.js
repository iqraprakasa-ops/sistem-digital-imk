/* =========================================================
   SISTEM DIGITAL INTERAKTIF — LOGIKA
   Bagian:
   1. Data gerbang & soal
   2. Penyimpanan progres (localStorage)
   3. Materi: buka/tutup + tandai selesai
   4. Simulator gerbang logika
   5. Konverter bilangan
   6. Kuis
   7. Inisialisasi
   ========================================================= */

/* ---------------- 1a. DATA GERBANG LOGIKA ---------------- */
// Tambah gerbang baru cukup di sini: rumus, jumlah input, fungsi, dan catatan.
const GERBANG = {
  AND: {
    rumus: "Y = A · B",
    input: 2,
    hitung: (a, b) => (a === 1 && b === 1 ? 1 : 0),
    catatan: "Output 1 hanya jika A dan B sama-sama 1."
  },
  OR: {
    rumus: "Y = A + B",
    input: 2,
    hitung: (a, b) => (a === 1 || b === 1 ? 1 : 0),
    catatan: "Output 1 jika salah satu atau kedua input bernilai 1."
  },
  NOT: {
    rumus: "Y = Ā",
    input: 1,
    hitung: (a) => (a === 1 ? 0 : 1),
    catatan: "Membalik input: 0 menjadi 1, 1 menjadi 0."
  },
  NAND: {
    rumus: "Y = (A · B)′",
    input: 2,
    hitung: (a, b) => (a === 1 && b === 1 ? 0 : 1),
    catatan: "Kebalikan AND: output 0 hanya jika A dan B sama-sama 1."
  },
  NOR: {
    rumus: "Y = (A + B)′",
    input: 2,
    hitung: (a, b) => (a === 1 || b === 1 ? 0 : 1),
    catatan: "Kebalikan OR: output 1 hanya jika A dan B sama-sama 0."
  },
  XOR: {
    rumus: "Y = A ⊕ B",
    input: 2,
    hitung: (a, b) => (a !== b ? 1 : 0),
    catatan: "Output 1 jika kedua input berbeda."
  },
  XNOR: {
    rumus: "Y = (A ⊕ B)′",
    input: 2,
    hitung: (a, b) => (a === b ? 1 : 0),
    catatan: "Output 1 jika kedua input sama."
  }
};

/* ---------------- 1b. DATA KUIS ---------------- */
const SOAL = [
  {
    tanya: "Bilangan biner 1011 sama dengan berapa dalam desimal?",
    pilihan: ["9", "11", "13", "15"],
    jawaban: 1,
    penjelasan: "1011 = 8 + 0 + 2 + 1 = 11. Hitung dari kanan: 1, 2, 4, 8."
  },
  {
    tanya: "Bilangan desimal 255 dalam heksadesimal adalah…",
    pilihan: ["EE", "FF", "F0", "1F"],
    jawaban: 1,
    penjelasan: "255 = 15 × 16 + 15, dan 15 dalam heksadesimal ditulis F. Jadi FF."
  },
  {
    tanya: "Gerbang yang outputnya 1 hanya jika semua input bernilai 1 adalah…",
    pilihan: ["OR", "AND", "XOR", "NOR"],
    jawaban: 1,
    penjelasan: "AND butuh semua input 1. OR cukup salah satu, XOR butuh input berbeda."
  },
  {
    tanya: "Berapa output gerbang NAND jika A = 1 dan B = 1?",
    pilihan: ["0", "1", "A", "B"],
    jawaban: 0,
    penjelasan: "NAND adalah kebalikan AND. AND(1,1) = 1, jadi NAND(1,1) = 0."
  },
  {
    tanya: "Menurut hukum De Morgan, (A · B)′ sama dengan…",
    pilihan: ["A′ · B′", "A′ + B′", "A + B", "A · B"],
    jawaban: 1,
    penjelasan: "De Morgan: (A · B)′ = A′ + B′. Tanda operasi berbalik saat semua di-negasi."
  },
  {
    tanya: "Gerbang XOR akan menghasilkan output 1 ketika…",
    pilihan: [
      "Kedua input sama",
      "Kedua input berbeda",
      "Semua input bernilai 0",
      "Semua input bernilai 1"
    ],
    jawaban: 1,
    penjelasan: "XOR (exclusive OR) aktif saat input berbeda: 0,1 atau 1,0."
  },
  {
    tanya: "Pada half adder, sinyal carry dihasilkan oleh gerbang…",
    pilihan: ["XOR", "AND", "NOT", "OR"],
    jawaban: 1,
    penjelasan: "Half adder: Sum = A ⊕ B (XOR) dan Carry = A · B (AND)."
  }
];

/* ---------------- 2. PENYIMPANAN PROGRES ---------------- */
const KUNCI_MATERI = "sistemdigital.materi";
const KUNCI_SKOR = "sistemdigital.skor";

// localStorage bisa diblokir (mode privat), jadi selalu dibungkus try/catch.
function bacaPenyimpanan(kunci, cadangan) {
  try {
    const isi = localStorage.getItem(kunci);
    return isi ? JSON.parse(isi) : cadangan;
  } catch (e) {
    return cadangan;
  }
}

function simpanPenyimpanan(kunci, nilai) {
  try {
    localStorage.setItem(kunci, JSON.stringify(nilai));
  } catch (e) {
    /* diabaikan: progres tetap jalan selama sesi ini */
  }
}

let materiSelesai = bacaPenyimpanan(KUNCI_MATERI, []);
let skorTerbaik = bacaPenyimpanan(KUNCI_SKOR, null);

const semuaMateri = Array.from(document.querySelectorAll(".lesson"));
const TOTAL_MATERI = semuaMateri.length;

/* ---------------- 3. MATERI ---------------- */
semuaMateri.forEach(function (kartu) {
  const id = kartu.dataset.lesson;
  const tombolBuka = kartu.querySelector(".lesson-toggle");
  const isi = kartu.querySelector(".lesson-body");
  const tombolSelesai = kartu.querySelector(".done-btn");

  tombolBuka.addEventListener("click", function () {
    const terbuka = tombolBuka.getAttribute("aria-expanded") === "true";
    tombolBuka.setAttribute("aria-expanded", String(!terbuka));
    isi.hidden = terbuka;
    tombolBuka.querySelector(".lesson-toggle-label").textContent = terbuka
      ? "Buka materi"
      : "Tutup materi";
  });

  tombolSelesai.addEventListener("click", function () {
    if (materiSelesai.includes(id)) {
      materiSelesai = materiSelesai.filter(function (x) {
        return x !== id;
      });
    } else {
      materiSelesai.push(id);
    }
    simpanPenyimpanan(KUNCI_MATERI, materiSelesai);
    gambarStatusMateri();
    gambarProgres();
  });
});

function gambarStatusMateri() {
  semuaMateri.forEach(function (kartu) {
    const selesai = materiSelesai.includes(kartu.dataset.lesson);
    const tombol = kartu.querySelector(".done-btn");
    kartu.classList.toggle("is-done", selesai);
    tombol.setAttribute("aria-pressed", String(selesai));
    tombol.textContent = selesai ? "✓ Sudah selesai" : "Tandai selesai";
  });
}

/* ---------------- 4. SIMULATOR GERBANG ---------------- */
let gerbangAktif = "AND";
let nilaiA = 0;
let nilaiB = 0;

const chips = document.querySelectorAll(".gate-chip");
const inputA = document.getElementById("input-a");
const inputB = document.getElementById("input-b");
const switchB = document.getElementById("switch-b-wrap");
const labelA = document.getElementById("val-a");
const labelB = document.getElementById("val-b");
const lamp = document.getElementById("lamp");
const lampVal = document.getElementById("lamp-val");
const simFormula = document.getElementById("sim-formula");
const simNote = document.getElementById("sim-note");
const tabel = document.getElementById("truth-table");

chips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    gerbangAktif = chip.dataset.gate;
    gambarSimulator();
  });
});

inputA.addEventListener("change", function () {
  nilaiA = inputA.checked ? 1 : 0;
  gambarSimulator();
});

inputB.addEventListener("change", function () {
  nilaiB = inputB.checked ? 1 : 0;
  gambarSimulator();
});

function gambarSimulator() {
  const g = GERBANG[gerbangAktif];
  const jumlahInput = g.input;

  // Status tombol gerbang (aria-pressed untuk aksesibilitas)
  chips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", String(chip.dataset.gate === gerbangAktif));
  });

  // Gerbang NOT hanya punya satu input
  switchB.hidden = jumlahInput === 1;

  labelA.textContent = String(nilaiA);
  labelB.textContent = String(nilaiB);
  simFormula.textContent = g.rumus;
  simNote.textContent = g.catatan;

  // Hitung output dan perbarui lampu indikator
  const hasil = jumlahInput === 1 ? g.hitung(nilaiA) : g.hitung(nilaiA, nilaiB);
  lampVal.textContent = String(hasil);
  lamp.classList.toggle("is-on", hasil === 1);

  gambarTabel(g, jumlahInput);
}

function gambarTabel(g, jumlahInput) {
  const kombinasi = jumlahInput === 1 ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];

  let html =
    "<caption>Tabel kebenaran " + gerbangAktif + "</caption>" +
    "<thead><tr><th>A</th>" +
    (jumlahInput === 2 ? "<th>B</th>" : "") +
    '<th class="col-y">Y</th></tr></thead><tbody>';

  kombinasi.forEach(function (baris) {
    const a = baris[0];
    const b = baris[1];
    const y = jumlahInput === 1 ? g.hitung(a) : g.hitung(a, b);
    const aktif = a === nilaiA && (jumlahInput === 1 || b === nilaiB);

    html +=
      '<tr class="' + (aktif ? "is-active" : "") + '">' +
      "<td>" + a + "</td>" +
      (jumlahInput === 2 ? "<td>" + b + "</td>" : "") +
      '<td class="col-y">' + y + "</td>" +
      "</tr>";
  });

  html += "</tbody>";
  tabel.innerHTML = html;
}

/* ---------------- 5. KONVERTER BILANGAN ---------------- */
const inputDesimal = document.getElementById("desimal");
const convHint = document.getElementById("conv-hint");
const outBiner = document.getElementById("out-biner");
const outOktal = document.getElementById("out-oktal");
const outHeks = document.getElementById("out-heks");
const outBit = document.getElementById("out-bit");

function kosongkanHasil() {
  outBiner.textContent = "—";
  outOktal.textContent = "—";
  outHeks.textContent = "—";
  outBit.textContent = "—";
}

function gambarKonversi() {
  const mentah = inputDesimal.value.trim();
  const angka = Number(mentah);

  const valid =
    mentah !== "" && Number.isInteger(angka) && angka >= 0 && angka <= 65535;

  if (!valid) {
    kosongkanHasil();
    convHint.textContent =
      "Masukkan bilangan bulat antara 0 dan 65535 (bilangan negatif dan desimal belum didukung).";
    convHint.classList.add("is-error");
    return;
  }

  convHint.textContent = "Rentang 0–65535 (setara 16 bit).";
  convHint.classList.remove("is-error");

  const biner = angka.toString(2).padStart(4, "0");
  const binerKelompok = biner.replace(/\B(?=(\d{4})+(?!\d))/g, " ");

  outBiner.textContent = binerKelompok;
  outOktal.textContent = angka.toString(8);
  outHeks.textContent = angka.toString(16).toUpperCase();
  outBit.textContent = biner.length + " bit";
}

inputDesimal.addEventListener("input", gambarKonversi);

/* ---------------- 6. KUIS ---------------- */
const stage = document.getElementById("quiz-stage");
const langkahKuis = document.getElementById("quiz-step");
const barKuis = document.getElementById("quiz-bar");

let indeksSoal = 0;
let jumlahBenar = 0;
let sudahDijawab = false;

const HURUF = ["A", "B", "C", "D"];

function mulaiKuis() {
  indeksSoal = 0;
  jumlahBenar = 0;
  sudahDijawab = false;
  tampilkanSoal();
}

function tampilkanSoal() {
  const soal = SOAL[indeksSoal];
  sudahDijawab = false;

  langkahKuis.textContent = "Soal " + (indeksSoal + 1) + " dari " + SOAL.length;
  barKuis.style.width = ((indeksSoal / SOAL.length) * 100).toFixed(1) + "%";

  let html = '<h3 class="quiz-question">' + escapeHtml(soal.tanya) + "</h3>";
  html += '<ul class="options">';
  soal.pilihan.forEach(function (teks, i) {
    html +=
      "<li>" +
      '<button class="option" type="button" data-index="' + i + '">' +
      '<span class="option-key">' + HURUF[i] + "</span>" +
      "<span>" + escapeHtml(teks) + "</span>" +
      "</button>" +
      "</li>";
  });
  html += "</ul>";
  html += '<div class="feedback" id="quiz-feedback" hidden></div>';
  html +=
    '<div class="quiz-actions">' +
    '<button class="btn btn-primary" id="quiz-next" type="button" hidden>Soal berikutnya</button>' +
    "</div>";

  stage.innerHTML = html;

  const tombolPilihan = stage.querySelectorAll(".option");
  const feedback = stage.querySelector("#quiz-feedback");
  const tombolLanjut = stage.querySelector("#quiz-next");

  tombolPilihan.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      if (sudahDijawab) return;
      sudahDijawab = true;
      jawab(Number(tombol.dataset.index), tombolPilihan, feedback, tombolLanjut);
    });
  });
}

function jawab(pilihan, tombolPilihan, feedback, tombolLanjut) {
  const soal = SOAL[indeksSoal];
  const benar = pilihan === soal.jawaban;

  if (benar) jumlahBenar += 1;

  tombolPilihan.forEach(function (tombol) {
    const i = Number(tombol.dataset.index);
    tombol.disabled = true;
    if (i === soal.jawaban) tombol.classList.add("is-correct");
    else if (i === pilihan) tombol.classList.add("is-wrong");
    else tombol.classList.add("is-muted");
  });

  feedback.hidden = false;
  feedback.innerHTML =
    "<strong>" + (benar ? "Tepat sekali!" : "Belum tepat.") + "</strong>" +
    escapeHtml(soal.penjelasan);

  tombolLanjut.hidden = false;
  tombolLanjut.textContent =
    indeksSoal === SOAL.length - 1 ? "Lihat hasil" : "Soal berikutnya";

  tombolLanjut.addEventListener("click", function () {
    indeksSoal += 1;
    if (indeksSoal < SOAL.length) tampilkanSoal();
    else tampilkanHasil();
  });
}

function tampilkanHasil() {
  langkahKuis.textContent = "Selesai";
  barKuis.style.width = "100%";

  const persen = Math.round((jumlahBenar / SOAL.length) * 100);

  if (skorTerbaik === null || jumlahBenar > skorTerbaik) {
    skorTerbaik = jumlahBenar;
    simpanPenyimpanan(KUNCI_SKOR, skorTerbaik);
  }
  gambarProgres();

  let judul = "Kerja bagus!";
  let pesan =
    "Dasar sistem digitalnya sudah kamu pegang. Coba jelaskan ulang tabel kebenaran dengan kata-katamu sendiri — itu cara tercepat memastikan paham.";
  if (persen === 100) {
    judul = "Sempurna!";
    pesan =
      "Semua jawaban benar. Tantangan berikutnya: ubah satu topik di halaman ini jadi versimu sendiri, lalu jelaskan ke temanmu.";
  } else if (persen < 50) {
    judul = "Masih boleh diulang";
    pesan =
      "Tidak apa-apa. Buka lagi bagian Materi, mainkan simulatornya sebentar, lalu ulangi kuis — biasanya langsung naik.";
  }

  stage.innerHTML =
    '<div class="quiz-result">' +
    '<p class="quiz-score">' + jumlahBenar + "/" + SOAL.length + "</p>" +
    "<h3>" + judul + "</h3>" +
    "<p>" + pesan + "</p>" +
    '<button class="btn btn-primary" type="button" id="quiz-ulang">Ulangi kuis</button>' +
    "</div>";

  stage.querySelector("#quiz-ulang").addEventListener("click", mulaiKuis);
}

// Teks soal tidak boleh merusak HTML (misalnya berisi tanda < atau &).
function escapeHtml(teks) {
  return String(teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------------- 7. PROGRES & INISIALISASI ---------------- */
function gambarProgres() {
  const labelMateri = document.getElementById("progress-materi-label");
  const barMateri = document.getElementById("progress-materi-bar");
  labelMateri.textContent = materiSelesai.length + " / " + TOTAL_MATERI;
  barMateri.style.width = ((materiSelesai.length / TOTAL_MATERI) * 100).toFixed(1) + "%";

  const labelSkor = document.getElementById("progress-skor-label");
  const barSkor = document.getElementById("progress-skor-bar");
  if (skorTerbaik === null) {
    labelSkor.textContent = "Belum dikerjakan";
    barSkor.style.width = "0%";
  } else {
    labelSkor.textContent = skorTerbaik + " / " + SOAL.length + " benar";
    barSkor.style.width = ((skorTerbaik / SOAL.length) * 100).toFixed(1) + "%";
  }
}

document.getElementById("reset-progress").addEventListener("click", function () {
  materiSelesai = [];
  skorTerbaik = null;
  simpanPenyimpanan(KUNCI_MATERI, materiSelesai);
  try {
    localStorage.removeItem(KUNCI_SKOR);
  } catch (e) {
    /* diabaikan */
  }
  gambarStatusMateri();
  gambarProgres();
});

gambarStatusMateri();
gambarProgres();
gambarSimulator();
gambarKonversi();
mulaiKuis();
