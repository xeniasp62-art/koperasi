/* =====================
   UTIL
===================== */
function rupiah(n){
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

/* =====================
   LOAD KAS
===================== */
function loadKas(){
  const db = getDB();

  // proteksi jika key belum ada
  db.simpanan  = db.simpanan  || [];
  db.transaksi = db.transaksi || [];
  db.pinjaman  = db.pinjaman  || [];

  const tbody = document.getElementById("listKas");
  if(!tbody) return;

  tbody.innerHTML = "";

  let kasMasuk = 0;
  let kasKeluar = 0;
  const rows = [];

  /* ===== SIMPANAN (MASUK) ===== */
  db.simpanan.forEach(s=>{
    const j = Number(s.jumlah) || 0;
    kasMasuk += j;
    rows.push({
      tgl: s.tanggal || "-",
      ket: `Simpanan (${s.jenis || "-"})`,
      masuk: j,
      keluar: 0
    });
  });

  /* ===== ANGSURAN (MASUK) ===== */
  db.transaksi
    .filter(t => t.jenis === "BAYAR")
    .forEach(t=>{
      const j = Number(t.jumlah) || 0;
      kasMasuk += j;
      rows.push({
        tgl: t.tanggal || "-",
        ket: "Angsuran Pinjaman",
        masuk: j,
        keluar: 0
      });
    });

  /* ===== PINJAMAN (KELUAR) ===== */
  db.pinjaman.forEach(p=>{
    const j = Number(p.jumlah) || 0;
    kasKeluar += j;
    rows.push({
      tgl: p.tanggal || "-",
      ket: "Pencairan Pinjaman",
      masuk: 0,
      keluar: j
    });
  });

  /* ===== SORT TANGGAL ===== */
  rows.sort((a,b)=>{
    if(a.tgl === "-" || b.tgl === "-") return 0;
    return new Date(a.tgl) - new Date(b.tgl);
  });

  /* ===== RENDER ===== */
  rows.forEach(r=>{
    tbody.innerHTML += `
      <tr>
        <td>${r.tgl}</td>
        <td>${r.ket}</td>
        <td>${r.masuk ? rupiah(r.masuk) : "-"}</td>
        <td>${r.keluar ? rupiah(r.keluar) : "-"}</td>
      </tr>
    `;
  });

  const elMasuk  = document.getElementById("kasMasuk");
  const elKeluar = document.getElementById("kasKeluar");
  const elSaldo  = document.getElementById("saldoKas");

  if(elMasuk)  elMasuk.innerText  = rupiah(kasMasuk);
  if(elKeluar) elKeluar.innerText = rupiah(kasKeluar);
  if(elSaldo)  elSaldo.innerText  = rupiah(kasMasuk - kasKeluar);
}

/* =====================
   EXPORT PDF
===================== */
function exportPDF(){
  if(!window.jspdf || !window.jspdf.jsPDF){
    alert("Library PDF belum dimuat");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Rekap Kas Masuk & Keluar", 14, 20);

  const masuk  = document.getElementById("kasMasuk")?.innerText || "-";
  const keluar = document.getElementById("kasKeluar")?.innerText || "-";
  const saldo  = document.getElementById("saldoKas")?.innerText || "-";

  doc.setFontSize(12);
  doc.text(`Kas Masuk : ${masuk}`, 14, 30);
  doc.text(`Kas Keluar: ${keluar}`, 14, 38);
  doc.text(`Saldo Kas : ${saldo}`, 14, 46);

  const rows = [];
  document.querySelectorAll("#listKas tr").forEach(tr=>{
    const cols = Array.from(tr.querySelectorAll("td")).map(td=>td.innerText);
    rows.push(cols);
  });

  if(doc.autoTable){
    doc.autoTable({
      startY: 55,
      head: [["Tanggal","Keterangan","Masuk","Keluar"]],
      body: rows,
      theme: "grid"
    });
  }

  doc.save("rekap_kas.pdf");
}

/* =====================
   EXPORT WHATSAPP
===================== */
function exportWA(){
  const trs = document.querySelectorAll("#listKas tr");
  if(trs.length === 0){
    alert("Tidak ada data!");
    return;
  }

  let text = "Rekap Kas Masuk & Keluar\n";
  text += `Kas Masuk : ${document.getElementById("kasMasuk")?.innerText || "-"}\n`;
  text += `Kas Keluar: ${document.getElementById("kasKeluar")?.innerText || "-"}\n`;
  text += `Saldo Kas : ${document.getElementById("saldoKas")?.innerText || "-"}\n\n`;
  text += "Tanggal | Keterangan | Masuk | Keluar\n";

  trs.forEach(tr=>{
    const tds = tr.querySelectorAll("td");
    text += `${tds[0].innerText} | ${tds[1].innerText} | ${tds[2].innerText} | ${tds[3].innerText}\n`;
  });

  window.open(
    `https://wa.me/?text=${encodeURIComponent(text)}`,
    "_blank"
  );
}