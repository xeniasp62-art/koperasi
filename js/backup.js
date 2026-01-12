let editIndex = null;

/* =====================
   LOAD DATA
===================== */
function loadAnggota(){
  const db = getDB();
  const tbody = document.getElementById("listAnggota");
  tbody.innerHTML = "";

  if(!db.anggota) return;

  db.anggota.forEach((a, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${a.id}</td>
        <td>${a.nama}</td>
        <td>${a.alamat}</td>
        <td>${a.telp}</td>
        <td class="action">
          <button onclick="editAnggota(${i})">✏️</button>
          <button onclick="hapusAnggota(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/* =====================
   SIMPAN / UPDATE
===================== */
function simpanAnggota(e){
  e.preventDefault();
  const db = getDB();

  const nama = document.getElementById("nama").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const telp = document.getElementById("telp").value.trim();

  if(!nama || !alamat || !telp){
    alert("Semua data wajib diisi");
    return;
  }

  if(editIndex !== null){
    db.anggota[editIndex].nama = nama;
    db.anggota[editIndex].alamat = alamat;
    db.anggota[editIndex].telp = telp;
    editIndex = null;
  }else{
    db.anggota.push({
      id: "AG" + Date.now(),
      nama,
      alamat,
      telp
    });
  }

  saveDB(db);
  resetForm();
  loadAnggota();
}

/* =====================
   EDIT
===================== */
function editAnggota(index){
  const db = getDB();
  const a = db.anggota[index];

  document.getElementById("nama").value = a.nama;
  document.getElementById("alamat").value = a.alamat;
  document.getElementById("telp").value = a.telp;

  editIndex = index;
}

/* =====================
   HAPUS
===================== */
function hapusAnggota(index){
  if(confirm("Hapus anggota ini?")){
    const db = getDB();
    db.anggota.splice(index,1);
    saveDB(db);
    loadAnggota();
  }
}

/* =====================
   RESET
===================== */
function resetForm(){
  document.getElementById("nama").value = "";
  document.getElementById("alamat").value = "";
  document.getElementById("telp").value = "";
  editIndex = null;
}