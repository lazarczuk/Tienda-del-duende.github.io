let total = 0;
let intentos = parseInt(localStorage.getItem("intentos") || "0", 10);
let carrito = JSON.parse(localStorage.getItem("fantasy_carrito") || "[]");
total = carrito.reduce((s, it) => s + it.precio, 0);
document.addEventListener("DOMContentLoaded", () => { actualizarUI(); });

function agregar(nombre, precio) {
  carrito.push({ nombre, precio });
  total += precio;
  localStorage.setItem("fantasy_carrito", JSON.stringify(carrito));
  actualizarUI();
}
function vaciarCarrito() {
  carrito = []; total = 0;
  localStorage.setItem("fantasy_carrito", JSON.stringify(carrito));
  actualizarUI();
}
function actualizarUI() {
  const lista = document.getElementById("lista");
  const totalSpan = document.getElementById("total");
  if (lista) {
    lista.innerHTML = "";
    if (carrito.length === 0) lista.innerHTML = "<p style='opacity:.8'>Tu bolsa está vacía</p>";
    else carrito.forEach(it => { const p = document.createElement("p"); p.textContent = `${it.nombre} - ${it.precio} monedas`; p.style.margin="6px 0"; lista.appendChild(p); });
  }
  if (totalSpan) totalSpan.textContent = total;
}
function mostrarFeedback(msg, isError = true) {
  const fb = document.getElementById("registro-feedback");
  if (!fb) { alert(msg); return; }
  fb.textContent = msg; fb.style.color = isError ? "#ffcc00" : "#8cff9a";
}
function validarRegistro() {
  const clave = document.getElementById("clave").value || "";
  const confirmar = document.getElementById("confirmar").value || "";
  const email = document.getElementById("email").value || "";
  const usuario = document.getElementById("usuario").value || "";
  if (intentos >= 3) { mostrarFeedback("Máximo de intentos alcanzado. Contacta soporte.", true); return false; }
  const mayuscula = /[A-Z]/.test(clave);
  const numero = /\d/.test(clave);
  const especial = /[!@#$%^&*(),.?\":{}|<>]/.test(clave);
  if (clave.length < 8) { intentos++; localStorage.setItem("intentos", intentos); mostrarFeedback("La contraseña debe tener al menos 8 caracteres.", true); return false; }
  if (!mayuscula || !numero || !especial) { intentos++; localStorage.setItem("intentos", intentos); mostrarFeedback("La contraseña debe incluir mayúscula, número y carácter especial.", true); return false; }
  if (clave !== confirmar) { intentos++; localStorage.setItem("intentos", intentos); mostrarFeedback("Las contraseñas no coinciden.", true); return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { intentos++; localStorage.setItem("intentos", intentos); mostrarFeedback("Ingresa un correo electrónico válido.", true); return false; }
  if (usuario.length < 2) { intentos++; localStorage.setItem("intentos", intentos); mostrarFeedback("El nombre debe tener al menos 2 caracteres.", true); return false; }
  const usuarios = JSON.parse(localStorage.getItem("fantasy_usuarios") || "[]");
  if (usuarios.some(u => u.email === email)) { mostrarFeedback("Ya existe una cuenta con ese correo.", true); return false; }
  usuarios.push({ usuario, email, claveHash: btoa(clave) });
  localStorage.setItem("fantasy_usuarios", JSON.stringify(usuarios));
  localStorage.setItem("intentos", "0"); intentos = 0;
  mostrarFeedback("Registro exitoso. Bienvenido al reino.", false);
  document.getElementById("form-registro").reset();
  return false;
}