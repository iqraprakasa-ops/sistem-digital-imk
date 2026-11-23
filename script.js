/* =========================================================
   SISTEM DIGITAL INTERAKTIF — LOGIKA
   Bagian:
   1. Data: gerbang, latihan topik, soal kuis, glosarium
   2. Penyimpanan progres (localStorage)
   3. Materi: buka/tutup + tandai selesai
   4. Latihan kilat per topik
   5. Simulator gerbang logika
   6. Simulator full adder
   7. Konverter bilangan dua arah
   8. Kuis + rekap jawaban
   9. Glosarium dengan pencarian
   10. Progres, bilah baca, inisialisasi
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

/* ---------------- 1b. LATIHAN KILAT PER TOPIK ---------------- */
const LATIHAN = {
  bilangan: {
    tanya: "Bilangan biner 10110 sama dengan berapa dalam desimal?",
    pilihan: ["18", "20", "22", "24"],
    jawaban: 2,
    penjelasan: "16 + 0 + 4 + 2 + 0 = 22. Bobot dari kiri: 16, 8, 4, 2, 1."
  },
  gerbang: {
    tanya: "Berapa output Y = A · B′ jika A = 1 dan B = 1?",
    pilihan: ["0", "1", "A", "B"],
    jawaban: 0,
    penjelasan: "B′ = 0, jadi Y = 1 · 0 = 0. Andalkan tanda negasi dulu sebelum AND."
  },
  turunan: {
    tanya: "Gerbang NAND yang kedua inputnya disatukan (NAND dengan A, A) berfungsi sebagai…",
    pilihan: ["Buffer", "NOT", "AND", "OR"],
    jawaban: 1,
    penjelasan: "(A · A)′ = A′, jadi hasilnya persis inverter atau NOT."
  },
  boolean: {
    tanya: "Menurut hukum De Morgan, (A + B)′ sama dengan…",
    pilihan: ["A′ + B′", "A′ · B′", "A · B", "A + B"],
    jawaban: 1,
    penjelasan: "Negasi membalik operasinya: OR menjadi AND, dan setiap variabel ikut dinegasi."
  },
  rangkaian: {
    tanya: "Full adder dengan A = 0, B = 1, dan Cin = 1 menghasilkan…",
    pilihan: ["Sum 0, Cout 0", "Sum 1, Cout 0", "Sum 0, Cout 1", "Sum 1, Cout 1"],
    jawaban: 2,
    penjelasan: "0 + 1 + 1 = 2 = 10₂, jadi Sum = 0 dan Cout = 1."
  }
};

/* ---------------- 1c. DATA KUIS (12 soal) ---------------- */
const SOAL = [
  {
    topik: "Sistem bilangan",
    tanya: "Bilangan biner 1011 sama dengan berapa dalam desimal?",
    pilihan: ["9", "11", "13", "15"],
    jawaban: 1,
    penjelasan: "1011 = 8 + 0 + 2 + 1 = 11. Bobot dari kanan: 1, 2, 4, 8."
  },
  {
    topik: "Sistem bilangan",
    tanya: "Bilangan desimal 255 dalam heksadesimal adalah…",
    pilihan: ["EE", "FF", "F0", "1F"],
    jawaban: 1,
    penjelasan: "255 = 15 × 16 + 15, dan 15 ditulis F. Jadi FF."
  },
  {
    topik: "Sistem bilangan",
    tanya: "Bilangan biner 1101 0110 dalam heksadesimal adalah…",
    pilihan: ["D6", "B6", "6D", "C6"],
    jawaban: 0,
    penjelasan: "Kelompokkan 4 bit dari kanan: 1101 = D, 0110 = 6, jadi D6."
  },
  {
    topik: "Sistem bilangan",
    tanya: "Desimal 214 dalam oktal adalah…",
    pilihan: ["326", "236", "362", "316"],
    jawaban: 0,
    penjelasan: "Biner 214 = 11010110 → kelompok 3 bit dari kanan: 11 010 110 = 3 2 6."
  },
  {
    topik: "Gerbang dasar",
    tanya: "Gerbang yang outputnya 1 hanya jika semua input bernilai 1 adalah…",
    pilihan: ["OR", "AND", "XOR", "NOR"],
    jawaban: 1,
    penjelasan: "AND butuh semua input 1. OR cukup salah satu, XOR butuh input berbeda."
  },
  {
    topik: "Gerbang dasar",
    tanya: "Rangkaian Y = (A · B) + C dengan A = 1, B = 0, C = 0 menghasilkan…",
    pilihan: ["0", "1", "A", "C"],
    jawaban: 0,
    penjelasan: "A · B = 1 · 0 = 0, lalu 0 + 0 = 0. Tanda kurung dan AND dikerjakan lebih dulu."
  },
  {
    topik: "Gerbang turunan",
    tanya: "Berapa output gerbang NAND jika A = 1 dan B = 1?",
    pilihan: ["0", "1", "A", "B"],
    jawaban: 0,
    penjelasan: "NAND kebalikan AND. AND(1,1) = 1, jadi NAND(1,1) = 0."
  },
  {
    topik: "Gerbang turunan",
    tanya: "Gerbang XOR menghasilkan output 1 ketika…",
    pilihan: ["Kedua input sama", "Kedua input berbeda", "Semua input 0", "Semua input 1"],
    jawaban: 1,
    penjelasan: "XOR (exclusive OR) aktif saat input berbeda: 0,1 atau 1,0."
  },
  {
    topik: "Aljabar Boolean",
    tanya: "Menurut hukum De Morgan, (A · B)′ sama dengan…",
    pilihan: ["A′ · B′", "A′ + B′", "A + B", "A · B"],
    jawaban: 1,
    penjelasan: "De Morgan: (A · B)′ = A′ + B′. Operasi berbalik saat seluruh ekspresi dinegasi."
  },
  {
    topik: "Aljabar Boolean",
    tanya: "Ekspresi A + A′·B paling sederhana menjadi…",
    pilihan: ["A", "B", "A + B", "A · B"],
    jawaban: 2,
    penjelasan: "A + A′B = (A + A′)(A + B) = 1 · (A + B) = A + B."
  },
  {
    topik: "Rangkaian kombinasional",
    tanya: "Pada half adder, sinyal carry dihasilkan oleh gerbang…",
    pilihan: ["XOR", "AND", "NOT", "OR"],
    jawaban: 1,
    penjelasan: "Half adder: Sum = A ⊕ B (XOR) dan Carry = A · B (AND)."
  },
  {
    topik: "Rangkaian kombinasional",
    tanya: "Multiplexer 2:1 dengan sinyal pemilih S = 1 akan meneruskan…",
    pilihan: ["Input A", "Input B", "Keduanya", "Tidak keduanya"],
    jawaban: 1,
    penjelasan: "Y = A·S′ + B·S. Saat S = 1, suku B·S aktif sehingga output = B."
  }
];

/* ---------------- 1d. GLOSARIUM ---------------- */
const GLOSARIUM = [
  { istilah: "Bit", arti: "Satu digit biner, bernilai 0 atau 1. Satuan terkecil informasi digital." },
  { istilah: "Byte", arti: "Delapan bit. Satu byte mewakili 256 nilai berbeda (2⁸)." },
  { istilah: "Basis", arti: "Jumlah digit yang dipakai sebuah sistem bilangan. Desimal basis 10, biner basis 2." },
  { istilah: "Biner", arti: "Sistem bilangan basis 2 dengan digit 0 dan 1, dipakai seluruh rangkaian digital." },
  { istilah: "Oktal", arti: "Sistem bilangan basis 8 dengan digit 0–7. Satu digit oktal = 3 bit." },
  { istilah: "Heksadesimal", arti: "Sistem bilangan basis 16 dengan digit 0–9 dan A–F. Satu digit = 4 bit." },
  { istilah: "LSB", arti: "Least Significant Bit — bit paling kanan, bobotnya paling kecil (1)." },
  { istilah: "MSB", arti: "Most Significant Bit — bit paling kiri, bobotnya paling besar." },
  { istilah: "Gerbang logika", arti: "Blok rangkaian yang menerima input biner dan menghasilkan satu output biner menurut aturan tetap." },
  { istilah: "Tabel kebenaran", arti: "Daftar semua kombinasi input beserta outputnya. Untuk n input ada 2ⁿ baris." },
  { istilah: "AND", arti: "Output 1 hanya jika semua input 1. Ditulis A · B. Analogi saklar seri." },
  { istilah: "OR", arti: "Output 1 jika minimal satu input 1. Ditulis A + B. Analogi saklar paralel." },
  { istilah: "NOT", arti: "Inverter satu input: membalik 0 menjadi 1 dan sebaliknya. Ditulis A′." },
  { istilah: "NAND", arti: "Kebalikan AND, ditulis (A · B)′. Disebut gerbang universal." },
  { istilah: "NOR", arti: "Kebalikan OR, ditulis (A + B)′. Juga gerbang universal." },
  { istilah: "XOR", arti: "Exclusive OR: output 1 jika kedua input berbeda. Ditulis A ⊕ B." },
  { istilah: "XNOR", arti: "Kebalikan XOR: output 1 jika kedua input sama. Dipakai sebagai pembanding bit." },
  { istilah: "Gerbang universal", arti: "Gerbang yang sendirian bisa membentuk semua gerbang lain, yaitu NAND atau NOR." },
  { istilah: "Aljabar Boolean", arti: "Aturan matematika untuk mengolah ekspresi logika 0 dan 1 agar rangkaian lebih sederhana." },
  { istilah: "Hukum De Morgan", arti: "(A · B)′ = A′ + B′ dan (A + B)′ = A′ · B′. Negasi membalik operasi." },
  { istilah: "Carry", arti: "Simpanan ke posisi bit berikutnya saat penjumlahan biner melebihi 1." },
  { istilah: "Half adder", arti: "Rangkaian penjumlah dua bit: Sum = A ⊕ B, Carry = A · B." },
  { istilah: "Full adder", arti: "Penjumlah tiga input (A, B, Cin). Sum = A ⊕ B ⊕ Cin, Cout = A·B + Cin·(A ⊕ B)." },
  { istilah: "Multiplexer (MUX)", arti: "Pemilih data: meneruskan satu dari beberapa input ke output sesuai sinyal pemilih." },
  { istilah: "Decoder", arti: "Kebalikan MUX: dari n bit input menyalakan satu dari 2ⁿ jalur output." },
  { istilah: "Rangkaian kombinasional", arti: "Rangkaian yang outputnya hanya bergantung pada input saat itu, tanpa memori." },
  { istilah: "Rangkaian sekuensial", arti: "Rangkaian yang outputnya juga bergantung pada keadaan sebelumnya (flip-flop, counter)." },
  { istilah: "Parity", arti: "Bit tambahan hasil XOR seluruh bit data, dipakai mendeteksi data yang rusak." }
];

/* ---------------- 2. PENYIMPANAN PROGRES ---------------- */
const KUNCI_MATERI = "sistemdigital.materi";
const KUNCI_LATIHAN = "sistemdigital.latihan";
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
let latihanBenar = bacaPenyimpanan(KUNCI_LATIHAN, []);
let skorTerbaik = bacaPenyimpanan(KUNCI_SKOR, null);

const semuaMateri = Array.from(document.querySelectorAll(".lesson"));
// Jumlah topik materi tetap 5. Kartunya hanya ada di materi.html, jadi tidak
// boleh dihitung dari DOM — halaman Progres perlu angka yang sama.
const TOTAL_MATERI = 5;
const TOTAL_LATIHAN = Object.keys(LATIHAN).length;

/* ---------------- 3. MATERI ---------------- */
semuaMateri.forEach(function (kartu) {
  const id = kartu.dataset.lesson;
  const tombolBuka = kartu.querySelector(".lesson-toggle");
  const isi = kartu.querySelector(".lesson-body");
  const tombolSelesai = kartu.querySelector(".done-btn");

  // Halaman lain tidak punya kartu materi: lewati saja.
  if (!tombolBuka || !isi || !tombolSelesai) return;

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
    if (!tombol) return;
    kartu.classList.toggle("is-done", selesai);
    tombol.setAttribute("aria-pressed", String(selesai));
    tombol.textContent = selesai ? "✓ Sudah selesai" : "Tandai selesai";
  });
}

/* ---------------- 4. LATIHAN KILAT ---------------- */
const HURUF = ["A", "B", "C", "D"];

document.querySelectorAll(".mini-quiz").forEach(function (kotak) {
  const id = kotak.dataset.latihan;
  gambarLatihan(kotak, id);
});

function gambarLatihan(kotak, id) {
  const soal = LATIHAN[id];
  if (!soal) return;

  let html = '<p class="mq-label">Latihan kilat</p>';
  html += '<p class="mq-q">' + escapeHtml(soal.tanya) + "</p>";
  html += '<ul class="mq-options">';
  soal.pilihan.forEach(function (teks, i) {
    html +=
      "<li>" +
      '<button class="mq-option" type="button" data-index="' + i + '">' +
      '<span class="mq-key">' + HURUF[i] + "</span>" +
      "<span>" + escapeHtml(teks) + "</span>" +
      "</button>" +
      "</li>";
  });
  html += "</ul>";
  html += '<div class="mq-feedback" hidden></div>';

  kotak.innerHTML = html;

  const tombol = kotak.querySelectorAll(".mq-option");
  const umpan = kotak.querySelector(".mq-feedback");

  tombol.forEach(function (pilihan) {
    pilihan.addEventListener("click", function () {
      if (pilihan.disabled) return;
      const indeks = Number(pilihan.dataset.index);
      const benar = indeks === soal.jawaban;

      tombol.forEach(function (t) {
        const i = Number(t.dataset.index);
        t.disabled = true;
        if (i === soal.jawaban) t.classList.add("is-correct");
        else if (i === indeks) t.classList.add("is-wrong");
      });

      umpan.hidden = false;
      umpan.innerHTML =
        "<strong>" + (benar ? "Benar!" : "Belum tepat.") + "</strong>" +
        escapeHtml(soal.penjelasan);

      if (benar && !latihanBenar.includes(id)) {
        latihanBenar.push(id);
        simpanPenyimpanan(KUNCI_LATIHAN, latihanBenar);
        gambarProgres();
      }

      const ulang = document.createElement("button");
      ulang.type = "button";
      ulang.className = "mq-again";
      ulang.textContent = "Coba lagi";
      ulang.addEventListener("click", function () {
        gambarLatihan(kotak, id);
        kotak.scrollIntoView({ block: "center" });
      });
      umpan.appendChild(ulang);
    });
  });
}

/* ---------------- 5. SIMULATOR GERBANG ---------------- */
let gerbangAktif = "AND";
let nilaiA = 0;
let nilaiB = 0;

const chips = document.querySelectorAll(".gate-chip[data-gate]");
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

if (inputA && inputB) {
  inputA.addEventListener("change", function () {
    nilaiA = inputA.checked ? 1 : 0;
    gambarSimulator();
  });

  inputB.addEventListener("change", function () {
    nilaiB = inputB.checked ? 1 : 0;
    gambarSimulator();
  });
}

function gambarSimulator() {
  if (!tabel || !switchB) return; // halaman ini tidak punya simulator
  const g = GERBANG[gerbangAktif];
  const jumlahInput = g.input;

  chips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", String(chip.dataset.gate === gerbangAktif));
  });

  switchB.hidden = jumlahInput === 1;

  labelA.textContent = String(nilaiA);
  labelB.textContent = String(nilaiB);
  simFormula.textContent = g.rumus;
  simNote.textContent = g.catatan;

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

/* ---------------- 6. SIMULATOR FULL ADDER ---------------- */
const addInputs = {
  a: document.getElementById("add-a"),
  b: document.getElementById("add-b"),
  cin: document.getElementById("add-cin")
};
const addVals = {
  a: document.getElementById("add-val-a"),
  b: document.getElementById("add-val-b"),
  cin: document.getElementById("add-val-cin")
};
const addSumLamp = document.getElementById("lamp-sum");
const addCoutLamp = document.getElementById("lamp-cout");
const addSumVal = document.getElementById("lamp-sum-val");
const addCoutVal = document.getElementById("lamp-cout-val");
const addFormula = document.getElementById("adder-formula");
const addNote = document.getElementById("adder-note");
const addSteps = document.getElementById("adder-steps");
const addTable = document.getElementById("adder-table");

if (addInputs.a && addInputs.b && addInputs.cin) {
  Object.keys(addInputs).forEach(function (kunci) {
    addInputs[kunci].addEventListener("change", gambarAdder);
  });
}

function xor(a, b) {
  return a !== b ? 1 : 0;
}

function gambarAdder() {
  if (!addTable) return; // halaman ini tidak punya full adder
  const a = addInputs.a.checked ? 1 : 0;
  const b = addInputs.b.checked ? 1 : 0;
  const cin = addInputs.cin.checked ? 1 : 0;

  addVals.a.textContent = String(a);
  addVals.b.textContent = String(b);
  addVals.cin.textContent = String(cin);

  const s1 = xor(a, b);        // hasil XOR tingkat pertama
  const c1 = a === 1 && b === 1 ? 1 : 0; // carry tingkat pertama
  const sum = xor(s1, cin);
  const cout = c1 === 1 || (s1 === 1 && cin === 1) ? 1 : 0;
  const total = a + b + cin;

  addSumVal.textContent = String(sum);
  addCoutVal.textContent = String(cout);
  addSumLamp.classList.toggle("is-on", sum === 1);
  addCoutLamp.classList.toggle("is-on", cout === 1);

  addFormula.textContent = "Sum = " + a + " ⊕ " + b + " ⊕ " + cin + " = " + sum;
  addNote.textContent =
    "Jumlah ketiga input: " + a + " + " + b + " + " + cin + " = " + total +
    " → biner " + total.toString(2).padStart(2, "0") + " (Cout " + cout + ", Sum " + sum + ").";

  let langkah = "";
  langkah += "<span>S1 = A ⊕ B = " + a + " ⊕ " + b + " = <strong>" + s1 + "</strong></span>";
  langkah += "<span>C1 = A · B = " + a + " · " + b + " = <strong>" + c1 + "</strong></span>";
  langkah += "<span>Sum = S1 ⊕ Cin = " + s1 + " ⊕ " + cin + " = <strong>" + sum + "</strong></span>";
  langkah += "<span>Cout = C1 + (S1 · Cin) = " + c1 + " + (" + s1 + " · " + cin + ") = <strong>" + cout + "</strong></span>";
  addSteps.innerHTML = langkah;

  gambarTabelAdder(a, b, cin, sum, cout);
}

function gambarTabelAdder(a, b, cin, sum, cout) {
  let html =
    "<caption>Tabel kebenaran full adder</caption>" +
    "<thead><tr><th>A</th><th>B</th><th>Cin</th>" +
    '<th class="col-y">Cout</th><th class="col-y">Sum</th></tr></thead><tbody>';

  for (let i = 0; i < 8; i++) {
    const ta = (i >> 2) & 1;
    const tb = (i >> 1) & 1;
    const tc = i & 1;
    const ts1 = xor(ta, tb);
    const tsum = xor(ts1, tc);
    const tcout = ta === 1 && tb === 1 ? 1 : ts1 === 1 && tc === 1 ? 1 : 0;
    const aktif = ta === a && tb === b && tc === cin;

    html +=
      '<tr class="' + (aktif ? "is-active" : "") + '">' +
      "<td>" + ta + "</td><td>" + tb + "</td><td>" + tc + "</td>" +
      '<td class="col-y">' + tcout + "</td>" +
      '<td class="col-y">' + tsum + "</td>" +
      "</tr>";
  }

  html += "</tbody>";
  addTable.innerHTML = html;
}

/* ---------------- 7. KONVERTER DUA ARAH ---------------- */
const BASIS = {
  desimal: { label: "Bilangan desimal", angka: 10, pola: /^[0-9]+$/, contoh: "13",
    hint: "Rentang 0–65535 (setara 16 bit)." },
  biner: { label: "Bilangan biner", angka: 2, pola: /^[01]+$/, contoh: "1101",
    hint: "Hanya digit 0 dan 1. Spasi diabaikan." },
  oktal: { label: "Bilangan oktal", angka: 8, pola: /^[0-7]+$/, contoh: "15",
    hint: "Hanya digit 0–7." },
  heks: { label: "Bilangan heksadesimal", angka: 16, pola: /^[0-9a-fA-F]+$/, contoh: "D",
    hint: "Digit 0–9 dan A–F." }
};

const modeChips = document.querySelectorAll("#mode-chips .gate-chip");
const inputAngka = document.getElementById("angka");
const convLabel = document.getElementById("conv-label");
const convHint = document.getElementById("conv-hint");
const outDesimal = document.getElementById("out-desimal");
const outBiner = document.getElementById("out-biner");
const outOktal = document.getElementById("out-oktal");
const outHeks = document.getElementById("out-heks");
const outBit = document.getElementById("out-bit");

let modeBasis = "desimal";
let desimalTerakhir = 13;

modeChips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    const modeBaru = chip.dataset.mode;
    if (modeBaru === modeBasis) return;
    modeBasis = modeBaru;
    modeChips.forEach(function (c) {
      c.setAttribute("aria-pressed", String(c.dataset.mode === modeBasis));
    });
    const info = BASIS[modeBasis];
    convLabel.textContent = info.label;
    inputAngka.value = desimalTerakhir.toString(info.angka).toUpperCase();
    gambarKonversi();
  });
});

function kosongkanHasil() {
  outDesimal.textContent = "—";
  outBiner.textContent = "—";
  outOktal.textContent = "—";
  outHeks.textContent = "—";
  outBit.textContent = "—";
}

function gambarKonversi() {
  if (!inputAngka || !outDesimal) return; // halaman ini tidak punya konverter
  const info = BASIS[modeBasis];
  const mentah = inputAngka.value.trim().replace(/\s+/g, "");

  if (!info.pola.test(mentah)) {
    kosongkanHasil();
    convHint.textContent =
      modeBasis === "desimal"
        ? "Hanya angka 0–9 yang diterima, tanpa titik atau koma."
        : "Digit tidak sesuai untuk basis " + info.angka + ". " + info.hint;
    convHint.classList.add("is-error");
    return;
  }

  const angka = parseInt(mentah, info.angka);

  if (angka > 65535) {
    kosongkanHasil();
    convHint.textContent = "Nilai melebihi 65535. Gunakan bilangan yang lebih kecil.";
    convHint.classList.add("is-error");
    return;
  }

  convHint.textContent = info.hint;
  convHint.classList.remove("is-error");
  desimalTerakhir = angka;

  const binerAsli = angka.toString(2);
  const binerTampil = binerAsli.padStart(Math.max(4, Math.ceil(binerAsli.length / 4) * 4), "0");
  const binerKelompok = binerTampil.replace(/(\d{4})(?=\d)/g, "$1 ");

  outDesimal.textContent = angka.toString(10);
  outBiner.textContent = binerKelompok;
  outOktal.textContent = angka.toString(8);
  outHeks.textContent = angka.toString(16).toUpperCase();
  outBit.textContent = binerAsli.length + " bit";
}

if (inputAngka) inputAngka.addEventListener("input", gambarKonversi);

/* ---------------- 8. KUIS ---------------- */
const stage = document.getElementById("quiz-stage");
const langkahKuis = document.getElementById("quiz-step");
const barKuis = document.getElementById("quiz-bar");

let indeksSoal = 0;
let jumlahBenar = 0;
let sudahDijawab = false;
let catatanJawaban = [];

function mulaiKuis() {
  indeksSoal = 0;
  jumlahBenar = 0;
  sudahDijawab = false;
  catatanJawaban = [];
  tampilkanSoal();
}

function tampilkanSoal() {
  const soal = SOAL[indeksSoal];
  sudahDijawab = false;

  langkahKuis.textContent = "Soal " + (indeksSoal + 1) + " dari " + SOAL.length;
  barKuis.style.width = ((indeksSoal / SOAL.length) * 100).toFixed(1) + "%";

  let html = '<p class="mq-label">' + escapeHtml(soal.topik) + "</p>";
  html += '<h3 class="quiz-question">' + escapeHtml(soal.tanya) + "</h3>";
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
  catatanJawaban.push({ nomor: indeksSoal + 1, topik: soal.topik, benar: benar });

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

  let rekap = '<div class="quiz-review"><h4>Rekap jawaban</h4>';
  catatanJawaban.forEach(function (c) {
    rekap +=
      '<div class="review-item ' + (c.benar ? "ok" : "no") + '">' +
      '<span class="review-mark">' + (c.benar ? "✓" : "✗") + "</span>" +
      "<span>Soal " + c.nomor + " · " + escapeHtml(c.topik) + " — " +
      (c.benar ? "benar" : "salah") + "</span>" +
      "</div>";
  });
  rekap += "</div>";

  stage.innerHTML =
    '<div class="quiz-result">' +
    '<p class="quiz-score">' + jumlahBenar + "/" + SOAL.length + "</p>" +
    "<h3>" + judul + "</h3>" +
    "<p>" + pesan + "</p>" +
    '<button class="btn btn-primary" type="button" id="quiz-ulang">Ulangi kuis</button>' +
    rekap +
    "</div>";

  stage.querySelector("#quiz-ulang").addEventListener("click", mulaiKuis);
}

// Teks tidak boleh merusak HTML (misalnya berisi tanda < atau &).
function escapeHtml(teks) {
  return String(teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------------- 9. GLOSARIUM ---------------- */
const glosList = document.getElementById("glos-list");
const glosFilter = document.getElementById("glos-filter");
const glosCount = document.getElementById("glos-count");
const glosEmpty = document.getElementById("glos-empty");

function gambarGlosarium() {
  if (!glosList || !glosFilter) return; // halaman ini tidak punya glosarium
  const kunci = glosFilter.value.trim().toLowerCase();
  const cocok = GLOSARIUM.filter(function (item) {
    return (
      item.istilah.toLowerCase().includes(kunci) ||
      item.arti.toLowerCase().includes(kunci)
    );
  });

  let html = "";
  cocok.forEach(function (item) {
    html += "<dt>" + escapeHtml(item.istilah) + "</dt>";
    html += "<dd>" + escapeHtml(item.arti) + "</dd>";
  });
  glosList.innerHTML = html;

  glosCount.textContent =
    kunci === ""
      ? GLOSARIUM.length + " istilah"
      : "Menampilkan " + cocok.length + " dari " + GLOSARIUM.length + " istilah";
  glosEmpty.hidden = cocok.length !== 0;
}

if (glosFilter) glosFilter.addEventListener("input", gambarGlosarium);

/* ---------------- 10. PROGRES, BILAH BACA, INISIALISASI ---------------- */
function gambarProgres() {
  // Bar progres hanya ada di halaman Progres; halaman lain cukup melewatinya.
  const labelMateri = document.getElementById("progress-materi-label");
  const barMateri = document.getElementById("progress-materi-bar");
  if (labelMateri && barMateri) {
    labelMateri.textContent = materiSelesai.length + " / " + TOTAL_MATERI;
    barMateri.style.width = ((materiSelesai.length / TOTAL_MATERI) * 100).toFixed(1) + "%";
  }

  const labelLatihan = document.getElementById("progress-latihan-label");
  const barLatihan = document.getElementById("progress-latihan-bar");
  if (labelLatihan && barLatihan) {
    labelLatihan.textContent = latihanBenar.length + " / " + TOTAL_LATIHAN;
    barLatihan.style.width = ((latihanBenar.length / TOTAL_LATIHAN) * 100).toFixed(1) + "%";
  }

  const labelSkor = document.getElementById("progress-skor-label");
  const barSkor = document.getElementById("progress-skor-bar");
  if (!labelSkor || !barSkor) return;
  if (skorTerbaik === null) {
    labelSkor.textContent = "Belum dikerjakan";
    barSkor.style.width = "0%";
  } else {
    labelSkor.textContent = skorTerbaik + " / " + SOAL.length + " benar";
    barSkor.style.width = ((skorTerbaik / SOAL.length) * 100).toFixed(1) + "%";
  }
}

const tombolReset = document.getElementById("reset-progress");
if (tombolReset) tombolReset.addEventListener("click", function () {
  materiSelesai = [];
  latihanBenar = [];
  skorTerbaik = null;
  simpanPenyimpanan(KUNCI_MATERI, materiSelesai);
  simpanPenyimpanan(KUNCI_LATIHAN, latihanBenar);
  try {
    localStorage.removeItem(KUNCI_SKOR);
  } catch (e) {
    /* diabaikan */
  }
  gambarStatusMateri();
  gambarProgres();
  document.querySelectorAll(".mini-quiz").forEach(function (kotak) {
    gambarLatihan(kotak, kotak.dataset.latihan);
  });
});

const bacaFill = document.getElementById("baca-fill");

function gambarBilahBaca() {
  if (!bacaFill) return;
  const tinggi = document.documentElement.scrollHeight - window.innerHeight;
  const posisi = window.scrollY || document.documentElement.scrollTop;
  const persen = tinggi > 0 ? Math.min(100, (posisi / tinggi) * 100) : 0;
  bacaFill.style.width = persen.toFixed(2) + "%";
}

window.addEventListener("scroll", gambarBilahBaca, { passive: true });

/* Hanya jalankan alat yang memang ada di halaman yang sedang dibuka. */
gambarStatusMateri();
gambarProgres();
if (tabel) gambarSimulator();
if (addTable) gambarAdder();
if (inputAngka) gambarKonversi();
if (stage) mulaiKuis();
if (glosList) gambarGlosarium();
gambarBilahBaca();
