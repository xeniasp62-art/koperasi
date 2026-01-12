let editIndex = null;

/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const db = getDB();
  const sel = document.getElementById("anggota");
  sel.innerHTML = "<option value=''>-- Pilih Anggota --</option>";

  if(!db.anggota) return;

  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   UBAH JENIS
===================== */
function ubahJenis(){
  const jenis = jenisEl.value;
  pinjamanEl.style.display = jenis === "BAYAR" ? "block" : "none";

  if(jenis === "BAYAR") loadPinjamanAnggota();
}

/* =====================
   LOAD PINJAMAN
===================== */
function loadPinjamanAnggota(){
  const db = getDB();
  const anggota = anggotaEl.value;

  pinjamanEl.innerHTML = "<option value=''>-- Pilih Pinjaman --</option>";

  if(!anggota) return;

  db.pinjaman
    .filter(p=>p.anggota_id===anggota && p.status==="Aktif")
    .forEach(p=>{
      pinjamanEl.innerHTML += `
        <option value="${p.id}">
          ${p.id} - Sisa Rp ${p.sisa.toLocaleString("id-ID")}
        </option>`;
    });
}

/* =====================
   SIMPAN / UPDATE
===================== */
function simpanTransaksi(e){
  e.preventDefault();
  const db = getDB();

  const jenis = jenisEl.value;
  const anggota = anggotaEl.value;
  const jumlah = Number(jumlahEl.value);
  const tanggal = tanggalEl.value;

  if(!jenis || !anggota || !jumlah || !tanggal){
    alert("Data belum lengkap");
    return;
  }

  if(jenis === "BAYAR" && !pinjamanEl.value){
    alert("Pilih pinjaman");
    return;
  }

  // ===== EDIT MODE =====
  if(editIndex !== null){
    batalkanEfek(db.transaksi[editIndex], db);
    db.transaksi.splice(editIndex,1);
    editIndex = null;
  }

  // ===== SETOR =====
  if(jenis === "SETOR"){
    db.simpanan.push({
      id: "SP" + Date.now(),
      anggota_id: anggota,
      jenis: "Sukarela",
      jumlah,
      tanggal
    });
  }

  // ===== BAYAR =====
  let pid = null;
  if(jenis === "BAYAR"){
    pid = pinjamanEl.value;
    const p = db.pinjaman.find(x=>x.id===pid);
    if(!p) return alert("Pinjaman tidak ditemukan");

    p.sisa -= jumlah;
    if(p.sisa <= 0){
      p.sisa = 0;
      p.status = "Lunas";
    }
  }

  // ===== SIMPAN TRANSAKSI =====
  db.transaksi.push({
    id: "TR" + Date.now(),
    anggota_id: anggota,
    jenis,
    jumlah,
    tanggal,
    pinjaman_id: pid
  });

  saveDB(db);
  e.target.reset();
  loadTransaksi();
}

/* =====================
   BATALKAN EFEK (FIX)
===================== */
function batalkanEfek(tr, db){
  if(tr.jenis === "SETOR"){
    db.simpanan = db.simpanan.filter(
      s=>!(s.anggota_id===tr.anggota_id &&
           s.jumlah===tr.jumlah &&
           s.tanggal===tr.tanggal)
    );
  }

  if(tr.jenis === "BAYAR"){
    const p = db.pinjaman.find(x=>x.id===tr.pinjaman_id);
    if(p){
      p.sisa += tr.jumlah;
      p.status = "Aktif";
    }
  }
}

/* =====================
   EDIT
===================== */
function editTransaksi(i){
  const db = getDB();
  const t = db.transaksi[i];

  jenisEl.value = t.jenis;
  anggotaEl.value = t.anggota_id;
  jumlahEl.value = t.jumlah;
  tanggalEl.value = t.tanggal;

  if(t.jenis === "BAYAR"){
    ubahJenis();
    setTimeout(()=>{
      pinjamanEl.value = t.pinjaman_id;
    },100);
  }

  editIndex = i;
}

/* =====================
   HAPUS
===================== */
function hapusTransaksi(i){
  if(confirm("Batalkan transaksi ini?")){
    const db = getDB();
    batalkanEfek(db.transaksi[i], db);
    db.transaksi.splice(i,1);
    saveDB(db);
    loadTransaksi();
  }
}

/* =====================
   LOAD RIWAYAT
===================== */
function loadTransaksi(){
  const db = getDB();
  const tbody = document.getElementById("listTransaksi");
  tbody.innerHTML = "";

  db.transaksi.forEach((t,i)=>{
    const a = db.anggota.find(x=>x.id===t.anggota_id);

    tbody.innerHTML += `
      <tr>
        <td>${t.tanggal}</td>
        <td>${a ? a.nama : "-"}</td>
        <td>${t.jenis}</td>
        <td>Rp ${t.jumlah.toLocaleString("id-ID")}</td>
        <td>${t.jenis==="SETOR" ? "Setor simpanan" : "Bayar angsuran"}</td>
        <td>
          <button onclick="editTransaksi(${i})">✏️</button>
          <button onclick="hapusTransaksi(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/* =====================
   ELEMENT
===================== */
const jenisEl = document.getElementById("jenis");
const anggotaEl = document.getElementById("anggota");
const pinjamanEl = document.getElementById("pinjaman");
const jumlahEl = document.getElementById("jumlah");
const tanggalEl = document.getElementById("tanggal");