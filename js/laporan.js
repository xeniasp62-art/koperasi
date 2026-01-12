/* =====================
   UTIL
===================== */
function rupiah(n){
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

/* =====================
   LOAD FILTER ANGGOTA
===================== */
function loadFilter(){
  const db = getDB();
  db.anggota = db.anggota || [];

  const sel = document.getElementById("filterAnggota");
  if(!sel) return;

  sel.innerHTML = `<option value="">-- Semua Anggota --</option>`;

  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   LOAD LAPORAN
===================== */
function loadLaporan(){
  const db = getDB();
  db.anggota  = db.anggota  || [];
  db.simpanan = db.simpanan || [];
  db.pinjaman = db.pinjaman || [];

  const filter = document.getElementById("filterAnggota")?.value || "";

  /* ===== SIMPANAN ===== */
  let totalS = 0;
  const listS = document.getElementById("listSimpanan");
  if(listS) listS.innerHTML = "";

  db.simpanan
    .filter(s => !filter || s.anggota_id === filter)
    .forEach(s=>{
      const a = db.anggota.find(x=>x.id === s.anggota_id);
      const j = Number(s.jumlah) || 0;
      totalS += j;

      if(listS){
        listS.innerHTML += `
          <tr>
            <td>${a ? a.nama : "-"}</td>
            <td>${s.jenis || "-"}</td>
            <td>${rupiah(j)}</td>
          </tr>
        `;
      }
    });

  const totalSimpanan = document.getElementById("totalSimpanan");
  if(totalSimpanan){
    totalSimpanan.innerText = "Total Simpanan: " + rupiah(totalS);
  }

  /* ===== PINJAMAN ===== */
  let totalP = 0;
  const listP = document.getElementById("listPinjaman");
  if(listP) listP.innerHTML = "";

  db.pinjaman
    .filter(p => !filter || p.anggota_id === filter)
    .forEach(p=>{
      const a = db.anggota.find(x=>x.id === p.anggota_id);
      const sisa = Number(p.sisa) || 0;
      totalP += sisa;

      if(listP){
        listP.innerHTML += `
          <tr>
            <td>${a ? a.nama : "-"}</td>
            <td>${rupiah(p.jumlah)}</td>
            <td>${rupiah(sisa)}</td>
            <td>${p.status || "-"}</td>
          </tr>
        `;
      }
    });

  const totalPinjaman = document.getElementById("totalPinjaman");
  if(totalPinjaman){
    totalPinjaman.innerText =
      "Total Sisa Pinjaman: " + rupiah(totalP);
  }
}

/* =====================
   SIMPANAN → EXCEL
===================== */
function exportSimpananExcel(){
  const db = getDB();
  const filter = document.getElementById("filterAnggota")?.value || "";

  const data = (db.simpanan || [])
    .filter(s => !filter || s.anggota_id === filter)
    .map(s=>{
      const a = (db.anggota || []).find(x=>x.id === s.anggota_id);
      return {
        Tanggal: s.tanggal || "-",
        Anggota: a ? a.nama : "-",
        Jenis: s.jenis || "-",
        Jumlah: s.jumlah || 0
      };
    });

  if(data.length === 0){
    alert("Tidak ada data simpanan");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Simpanan");
  XLSX.writeFile(wb, "laporan_simpanan.xlsx");
}

/* =====================
   PINJAMAN → EXCEL
===================== */
function exportPinjamanExcel(){
  const db = getDB();
  const filter = document.getElementById("filterAnggota")?.value || "";

  const data = (db.pinjaman || [])
    .filter(p => !filter || p.anggota_id === filter)
    .map(p=>{
      const a = (db.anggota || []).find(x=>x.id === p.anggota_id);
      return {
        Anggota: a ? a.nama : "-",
        Tanggal: p.tanggal || "-",
        Jumlah: p.jumlah || 0,
        Sisa: p.sisa || 0,
        Status: p.status || "-"
      };
    });

  if(data.length === 0){
    alert("Tidak ada data pinjaman");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pinjaman");
  XLSX.writeFile(wb, "laporan_pinjaman.xlsx");
}

/* =====================
   SIMPANAN → PDF
===================== */
function exportSimpananPDF(){
  if(!window.jspdf || !window.jspdf.jsPDF){
    alert("Library PDF belum dimuat");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const db = getDB();
  const filter = document.getElementById("filterAnggota")?.value || "";

  let y = 15;
  doc.setFontSize(14);
  doc.text("Laporan Simpanan", 10, y);
  y += 10;

  (db.simpanan || [])
    .filter(s => !filter || s.anggota_id === filter)
    .forEach((s,i)=>{
      const a = (db.anggota || []).find(x=>x.id === s.anggota_id);
      doc.setFontSize(10);
      doc.text(
        `${i+1}. ${s.tanggal || "-"} | ${a ? a.nama : "-"} | ${s.jenis || "-"} | ${rupiah(s.jumlah)}`,
        10, y
      );
      y += 7;
      if(y > 280){
        doc.addPage();
        y = 15;
      }
    });

  doc.save("laporan_simpanan.pdf");
}

/* =====================
   PINJAMAN → PDF
===================== */
function exportPinjamanPDF(){
  if(!window.jspdf || !window.jspdf.jsPDF){
    alert("Library PDF belum dimuat");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const db = getDB();
  const filter = document.getElementById("filterAnggota")?.value || "";

  let y = 15;
  doc.setFontSize(14);
  doc.text("Laporan Pinjaman", 10, y);
  y += 10;

  (db.pinjaman || [])
    .filter(p => !filter || p.anggota_id === filter)
    .forEach((p,i)=>{
      const a = (db.anggota || []).find(x=>x.id === p.anggota_id);
      doc.setFontSize(10);
      doc.text(
        `${i+1}. ${a ? a.nama : "-"} | ${p.tanggal || "-"} | ${rupiah(p.jumlah)} | Sisa ${rupiah(p.sisa)} | ${p.status}`,
        10, y
      );
      y += 7;
      if(y > 280){
        doc.addPage();
        y = 15;
      }
    });

  doc.save("laporan_pinjaman.pdf");
}