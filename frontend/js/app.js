let productosGlobal = [];

//CARGAR PRODUCTOS
async function cargarProductos() {
    const res = await fetch("http://localhost:3000/api/productos");
    productosGlobal = await res.json();
    aplicarFiltros();
}

//MOSTRAR PRODUCTOS
function mostrarProductos(productos) {
    const contenedor = document.getElementById("lista-productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    productos.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <img src="${p.imagen ? `http://localhost:3000/uploads/${p.imagen}` : 'https://via.placeholder.com/150'}">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <strong>$${Number(p.precio)}</strong>
            <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
        `;

        contenedor.appendChild(div);
    });
}

//AGREGAR AL CARRITO
function agregarAlCarrito(id) {
    const producto = productosGlobal.find(p => p.id === id);

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existe = carrito.find(p => p.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado 🛒");

    actualizarContador();
}

//CONTADOR
function actualizarContador() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    const contador = document.getElementById("contadorCarrito");
    if (contador) contador.textContent = total;
}

//FILTROS
function aplicarFiltros() {
    let lista = [...productosGlobal];

    const buscador = document.getElementById("buscador");
    const orden = document.getElementById("orden");

    if (buscador) {
        const texto = buscador.value.toLowerCase();
        lista = lista.filter(p => p.nombre.toLowerCase().includes(texto));
    }

    if (orden) {
        if (orden.value === "precio_asc") {
            lista.sort((a, b) => Number(a.precio) - Number(b.precio));
        }
        if (orden.value === "precio_desc") {
            lista.sort((a, b) => Number(b.precio) - Number(a.precio));
        }
        if (orden.value === "nombre") {
            lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }
    }

    mostrarProductos(lista);
}

//LOGOUT
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    actualizarUI();
}

//UI SEGÚN LOGIN
function actualizarUI() {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    const userInfo = document.getElementById("userInfo");
    const btnLogin = document.getElementById("btnLoginNav");
    const btnLogout = document.getElementById("btnLogoutNav");

    if (token) {
        if (userInfo) userInfo.textContent = rol === "admin" ? "Admin 👑" : "Usuario 👤";
        if (btnLogin) btnLogin.style.display = "none";
        if (btnLogout) btnLogout.style.display = "inline-block";
    } else {
        if (userInfo) userInfo.textContent = "Invitado";
        if (btnLogin) btnLogin.style.display = "inline-block";
        if (btnLogout) btnLogout.style.display = "none";
    }
}

//INIT
document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();
    actualizarUI();
    actualizarContador();

    const buscador = document.getElementById("buscador");
    const orden = document.getElementById("orden");
    const btnLogout = document.getElementById("btnLogoutNav");

    if (buscador) buscador.addEventListener("input", aplicarFiltros);
    if (orden) orden.addEventListener("change", aplicarFiltros);
    if (btnLogout) btnLogout.addEventListener("click", logout);

});