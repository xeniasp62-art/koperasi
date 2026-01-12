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
   LOAD SIMPANAN
===================== */
function loadSimpanan(){
  const simpanan = getSimpanan();
  const anggota = getAnggota();
  const tbody = document.getElementById("listSimpanan");
  tbody.innerHTML = "";

  simpanan.forEach((s,i)=>{
    const a = anggota.find(x=>x.id === s.anggota_id);

    tbody.innerHTML += `
      <tr>
        <td>${s.tanggal}</td>
        <td>${a ? a.nama : "-"}</td>
        <td>${s.jenis}</td>
        <td>Rp ${Number(s.jumlah).toLocaleString("id-ID")}</td>
        <td>
          <button onclick="hapusSimpanan(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/* =====================
   SIMPAN SIMPANAN
===================== */
function simpanSimpanan(e){
  e.preventDefault();

  const anggota_id = document.getElementById("anggota").value;
  const jenis = document.getElementById("jenis").value;
  const jumlah = Number(document.getElementById("jumlah").value);
  const tanggal = document.getElementById("tanggal").value;

  if(!anggota_id || !jumlah || !tanggal){
    alert("Data belum lengkap");
    return;
  }

  const simpanan = getSimpanan();

  simpanan.push({
    id: "SP" + String(simpanan.length + 1).padStart(3,"0"),
    anggota_id,
    jenis,
    jumlah,
    tanggal
  });

  saveSimpanan(simpanan);

  e.target.reset();
  loadSimpanan();
}

/* =====================
   HAPUS SIMPANAN
===================== */
function hapusSimpanan(index){
  if(confirm("Hapus data simpanan ini?")){
    const simpanan = getSimpanan();
    simpanan.splice(index,1);
    saveSimpanan(simpanan);
    loadSimpanan();
  }
}