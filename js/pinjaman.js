/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const anggota = getAnggota();
  const sel = document.getElementById("anggota");
  sel.innerHTML = "<option value=''>-- Pilih Anggota --</option>";

  anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   HITUNG ANGSURAN
===================== */
["jumlah","bunga","tenor"].forEach(id=>{
  document.getElementById(id).addEventListener("input", hitungAngsuran);
});

function hitungAngsuran(){
  const jumlah = Number(document.getElementById("jumlah").value);
  const bunga = Number(document.getElementById("bunga").value);
  const tenor = Number(document.getElementById("tenor").value);

  if(jumlah > 0 && bunga >= 0 && tenor > 0){
    const totalBunga = jumlah * (bunga/100) * tenor;
    const total = jumlah + totalBunga;
    const angsuran = total / tenor;

    document.getElementById("angsuran").value =
      "Rp " + Math.round(angsuran).toLocaleString("id-ID");
  }else{
    document.getElementById("angsuran").value = "";
  }
}

/* =====================
   SIMPAN PINJAMAN
===================== */
function simpanPinjaman(e){
  e.preventDefault();

  const pinjaman = getPinjaman();

  const data = {
    id: "PJ" + String(pinjaman.length + 1).padStart(3,"0"),
    anggota_id: document.getElementById("anggota").value,
    tanggal: new Date().toISOString().split("T")[0],
    jumlah: Number(document.getElementById("jumlah").value),
    bunga: Number(document.getElementById("bunga").value),
    tenor: Number(document.getElementById("tenor").value),
    sisa: Number(document.getElementById("jumlah").value),
    status: "Aktif"
  };

  pinjaman.push(data);
  savePinjaman(pinjaman);

  e.target.reset();
  document.getElementById("angsuran").value = "";

  loadPinjaman();
}

/* =====================
   LOAD PINJAMAN
===================== */
function loadPinjaman(){
  const pinjaman = getPinjaman();
  const anggota = getAnggota();
  const tbody = document.getElementById("listPinjaman");
  tbody.innerHTML = "";

  pinjaman.forEach((p,i)=>{
    const a = anggota.find(x=>x.id === p.anggota_id);

    tbody.innerHTML += `
      <tr>
        <td>${a ? a.nama : "-"}</td>
        <td>Rp ${p.jumlah.toLocaleString("id-ID")}</td>
        <td>${p.bunga}%</td>
        <td>${p.tenor}</td>
        <td>Rp ${p.sisa.toLocaleString("id-ID")}</td>
        <td>${p.status}</td>
        <td>
          <button onclick="bayarAngsuran(${i})">💳 Bayar</button>
        </td>
      </tr>
    `;
  });
}

/* =====================
   BAYAR ANGSURAN
===================== */
function bayarAngsuran(index){
  const pinjaman = getPinjaman();
  const transaksi = getTransaksi();

  const p = pinjaman[index];
  if(!p || p.status === "Lunas"){
    alert("Pinjaman sudah lunas");
    return;
  }

  const total = p.jumlah + (p.jumlah * (p.bunga/100) * p.tenor);
  const angsuran = Math.round(total / p.tenor);

  p.sisa -= angsuran;

  if(p.sisa <= 0){
    p.sisa = 0;
    p.status = "Lunas";
  }

  transaksi.push({
    tanggal: new Date().toISOString().split("T")[0],
    jenis: "BAYAR",
    pinjaman_id: p.id,
    jumlah: angsuran
  });

  savePinjaman(pinjaman);
  saveTransaksi(transaksi);

  loadPinjaman();
}