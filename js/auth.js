/* =====================
   AUTH SESSION (FIX)
===================== */

// LOGIN
function login(e){
  if(e) e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if(!user || !pass){
    alert("Username & password wajib diisi");
    return;
  }

  // USER DEFAULT
  if(user === "admin" && pass === "1234"){
    localStorage.setItem("koperasi_login", "1");
    location.replace("dashboard.html"); // PENTING
  }else{
    alert("Username / Password salah");
  }
}

/* =====================
   CEK LOGIN
===================== */
function cekLogin(){
  if(localStorage.getItem("koperasi_login") !== "1"){
    location.replace("index.html");
  }
}

/* =====================
   LOGOUT (FIX APK)
===================== */
function logout(){
  if(confirm("Yakin ingin logout?")){
    localStorage.clear();
    location.replace("index.html"); // BUKAN href
  }
}