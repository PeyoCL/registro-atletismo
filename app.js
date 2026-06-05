const SUPABASE_URL = 'https://gqnpifjiqrnogvwyvowp.supabase.co';
const SUPABASE_KEY = 'sb_publishable__XW0a236It7jN1zUvh0UYQ_Cu-zqUg3';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const formBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSefzqFH89j9THSO5N2yVygkleVbilCDPJuNxOs7SF0cojBkpw/viewform";

const _0x4f = ["","ZW50cnkuNTMzMzg5NjUz","ZW50cnkuNzcxODQwMDM0","ZW50cnkuMTU3NDIwNzIxMg==","ZW50cnkuMTUzNTI1NjI1Ng==","ZW50cnkuMTA3MDk2MjQ4Nw==","ZW50cnkuMTM1OTg2NDI5OA==","ZW50cnkuNTI0NzE3OTgw"];
const _v = (i) => atob(_0x4f[i]);

const _b64 = {
  club: "Q29sZWdpbyBNb250ZXNzb3Jp", // Colegio Montessori
  prof: "THVrYXMgU2F6bw==", // Lukas Sazo
  disc: "QXRsZXRpc21v", // Atletismo
  cat: "VVNVQVJJTyBQQVJUSUNVTEFSIChObyBwZXJ0ZW5lY2UgYSBsb3MgcHJvZ3JhbWFzIGFudGVyaW9yZXMp", // Usuario Particular
  rec: "UGlzdGEgQXRsw6l0aWNh" // Pista Atlética
};
const _d64 = (str) => decodeURIComponent(escape(atob(str)));

function setDefaults() {
  document.getElementById('club').value = _d64(_b64.club);
  document.getElementById('profesor').value = _d64(_b64.prof);
  document.getElementById('disciplina').value = _d64(_b64.disc);
  document.getElementById('categoria').value = _d64(_b64.cat);
  document.getElementById('recinto').value = _d64(_b64.rec);
  
  document.getElementById('otra_disc_txt').value = "";
  document.getElementById('div_otra_disc').style.display = 'none';
  document.getElementById('otro_rec_txt').value = "";
  document.getElementById('div_otro_rec').style.display = 'none';
}

window.onload = setDefaults;

// Interacción del panel
window.toggleAdvanced = function() {
  const p = document.getElementById('adv_panel'); 
  const b = document.getElementById('toggle_adv');
  if (p.style.display === 'block') { 
    p.style.display = 'none'; 
    b.innerText = "⚙️ Opciones Avanzadas"; 
    setDefaults(); 
  } else { 
    p.style.display = 'block'; 
    b.innerText = "✖️ Ocultar y Restaurar a Atletismo"; 
  }
};

window.checkOtros = function(sId, pId) {
  const v = document.getElementById(sId).value; 
  document.getElementById(pId).style.display = (v === 'Otros' || v === 'Otra actividad o deporte') ? 'block' : 'none';
};

// Validación y formateo de RUT
function vR(r) {
  var v = r.replace(/[^0-9kK]/g, ""); if (v.length < 8 || v.length > 9) return false;
  var c = v.slice(0, -1); var d = v.slice(-1).toUpperCase(); var s = 0; var m = 2;
  for (var i = 1; i <= c.length; i++) { s = s + (m * c.charAt(c.length - i)); m = (m < 7) ? m + 1 : 2; }
  var de = 11 - (s % 11); return d == ((de == 11) ? 0 : ((de == 10) ? "K" : de));
}

// Lógica principal y conexión a Base de Datos
window.generarLink = async function() {
  const nVal = document.getElementById('nombre').value.trim(); 
  const rVal = document.getElementById('rut').value.trim();
  
  if (nVal.length < 3) { alert("Ingresa el nombre del atleta."); return; }
  if (!vR(rVal)) { alert("El RUT ingresado no es válido."); return; }
  
  const cleanRut = rVal.replace(/[^0-9kK]/g, "").toUpperCase();
  const enc = (val) => encodeURIComponent(val).replace(/%20/g, "+");
  
  let p = [];
  p.push(_v(1) + "=" + enc(nVal));
  p.push(_v(2) + "=" + enc(cleanRut));
  p.push(_v(3) + "=" + enc(document.getElementById('club').value.trim()));
  p.push(_v(4) + "=" + enc(document.getElementById('profesor').value.trim()));
  p.push(_v(6) + "=" + enc(document.getElementById('categoria').value));

  let dVal = document.getElementById('disciplina').value;
  if (dVal === 'Otros' || dVal === 'Otra actividad o deporte') {
    let dTxt = document.getElementById('otra_disc_txt').value.trim();
    p.push(_v(5) + "=__other_option__");
    p.push(_v(5) + ".other_option_response=" + enc(dTxt));
    dVal = dTxt; 
  } else { 
    p.push(_v(5) + "=" + enc(dVal)); 
  }

  let reVal = document.getElementById('recinto').value;
  if (reVal === 'Otros') {
    let reTxt = document.getElementById('otro_rec_txt').value.trim();
    p.push(_v(7) + "=__other_option__");
    p.push(_v(7) + ".other_option_response=" + enc(reTxt));
  } else { 
    p.push(_v(7) + "=" + enc(reVal)); 
  }

  document.getElementById("urlFinal").innerText = formBaseUrl + "?" + p.join("&"); 
  document.getElementById("resultado").style.display = "block";
  document.getElementById("copy-toast").style.display = "none"; 
  
  try {
    await supabase
      .from('registros')
      .insert([
        { nombre: nVal, rut: cleanRut, disciplina: dVal }
      ]);
  } catch (error) {
    console.error("Error silencioso DB"); 
  }
};

window.copiarLink = function() {
  const t = document.getElementById("urlFinal").innerText; const x = document.createElement("textarea"); 
  document.body.appendChild(x); x.value = t; x.select(); document.execCommand("copy"); 
  document.body.removeChild(x); document.getElementById("copy-toast").style.display = "block";
};