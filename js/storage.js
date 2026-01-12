/* =====================
   STORAGE KOPERASI (FIX)
===================== */

function getUser(){
  return JSON.parse(localStorage.getItem("koperasi_user_data") || "null");
}
function setUser(data){
  localStorage.setItem("koperasi_user_data", JSON.stringify(data));
}

/* ===== ANGGOTA ===== */
function getAnggota(){
  return JSON.parse(localStorage.getItem("koperasi_anggota") || "[]");
}
function saveAnggota(data){
  localStorage.setItem("koperasi_anggota", JSON.stringify(data));
}

/* ===== SIMPANAN ===== */
function getSimpanan(){
  return JSON.parse(localStorage.getItem("koperasi_simpanan") || "[]");
}
function saveSimpanan(data){
  localStorage.setItem("koperasi_simpanan", JSON.stringify(data));
}

/* ===== PINJAMAN ===== */
function getPinjaman(){
  return JSON.parse(localStorage.getItem("koperasi_pinjaman") || "[]");
}
function savePinjaman(data){
  localStorage.setItem("koperasi_pinjaman", JSON.stringify(data));
}

/* ===== TRANSAKSI ===== */
function getTransaksi(){
  return JSON.parse(localStorage.getItem("koperasi_transaksi") || "[]");
}
function saveTransaksi(data){
  localStorage.setItem("koperasi_transaksi", JSON.stringify(data));
}

/* ===== KAS ===== */
function getKas(){
  return JSON.parse(localStorage.getItem("koperasi_kas") || "[]");
}
function saveKas(data){
  localStorage.setItem("koperasi_kas", JSON.stringify(data));
}