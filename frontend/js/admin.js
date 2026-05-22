let productoEditando = null;

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (!token || rol !== "admin") {
        alert("Acceso denegado");
        window.location.href = "login.html";
    }

});

const token = localStorage.getItem("token");

if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
}

//CREAR / ACTUALIZAR PRODUCTO
async function crearProducto() {

    const formData = new FormData();

    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("precio", document.getElementById("precio").value);
    formData.append("stock", document.getElementById("stock").value);
    formData.append("categoria_id", document.getElementById("categoria").value);

    const imagen = document.getElementById("imagen").files[0];
    if (imagen) {
        formData.append("imagen", imagen);
    }

    //VALIDACIONES
    if (!formData.get("nombre") || !formData.get("precio")) {
        alert("Nombre y precio son obligatorios");
        return;
    }

    if (!formData.get("categoria_id")) {
        alert("Selecciona una categoría");
        return;
    }

    try {
        let url = "http://localhost:3000/api/productos";
        let method = "POST";

//MODO EDICIÓN
if (productoEditando !== null) {

    url += "/" + productoEditando;

    method = "PUT";
}

        const res = await fetch(url, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error al guardar producto");
            return;
        }

        alert(data.message);

        //LIMPIAR FORMULARIO
        document.getElementById("nombre").value = "";
        document.getElementById("descripcion").value = "";
        document.getElementById("precio").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("categoria").value = "";
        document.getElementById("imagen").value = "";

        //RESET PREVIEW
        document.getElementById("preview").src = "https://dummyimage.com/150x150/cccccc/000000.jpg&text=Sin+Imagen0";

        //RESET MODO EDICIÓN
        productoEditando = null;
        document.getElementById("btnCrear")
        .textContent = "Crear Producto";

        //BOTÓN NORMAL
        document.getElementById("btnCrear").textContent = "Crear Producto";

        //RECARGAR LISTA
        cargarProductosAdmin();

    } catch (error) {
        console.error("ERROR:", error);
    }
}

// 📦 CARGAR CATEGORÍAS EN SELECT
async function cargarCategoriasSelect() {

    try {

        const res =
            await fetch(
                "http://localhost:3000/api/categorias"
            );

        const categorias = await res.json();

        const select =
            document.getElementById("categoria");

        if (!select) return;

        // limpiar
        select.innerHTML = `
            <option value="">
                Selecciona categoría
            </option>
        `;

        categorias.forEach(c => {

            select.innerHTML += `
                <option value="${c.id}">
                    ${c.nombre}
                </option>
            `;
        });

    } catch (error) {

        console.error(
            "Error cargando categorías:",
            error
        );
    }
}


//CARGAR CATEGORÍAS
async function cargarCategorias() {
    try {
        const res = await fetch("http://localhost:3000/api/categorias");
        const categorias = await res.json();

        const select = document.getElementById("categoria");

        select.innerHTML = '<option value="">Seleccionar categoría</option>';

        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.nombre;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}


//PREVIEW IMAGEN
function mostrarPreview() {
    const input = document.getElementById("imagen");
    const preview = document.getElementById("preview");

    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        preview.src = "https://dummyimage.com/150x150/cccccc/000000.jpg&text=Sin+Imagen";
    }
}

// 📂 MOSTRAR SECCIONES
function mostrarSeccion(id) {

    const secciones =
        document.querySelectorAll(".seccion-admin");

    secciones.forEach(sec => {
        sec.classList.add("hidden");
    });

    document.getElementById(id)
        .classList.remove("hidden");
}


//LISTAR PRODUCTOS
async function cargarProductosAdmin() {
    try {
        const res = await fetch("http://localhost:3000/api/productos");
        const productos = await res.json();

        const contenedor = document.getElementById("productos-admin");
        contenedor.innerHTML = "";

        productos.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("producto-admin");

            div.innerHTML = `
                <img src="${p.imagen ? `http://localhost:3000/uploads/${p.imagen}` : 'https://dummyimage.com/150x150/cccccc/000000.jpg&text=Sin+Imagen'}">
                <h4>${p.nombre}</h4>
                <p>$${p.precio}</p>
                <button onclick='editarProducto(${JSON.stringify(p)})'>
                    ✏️ Editar
                </button>
                <button onclick="eliminarProducto(${p.id})">Eliminar</button>
            `;

            contenedor.appendChild(div);
        });

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// 📊 DASHBOARD
async function cargarDashboard() {

    try {

        const res =
            await fetch("http://localhost:3000/api/dashboard");

        const data = await res.json();

        // CARDS
        document.getElementById("totalProductos")
            .textContent = data.productos;

        document.getElementById("totalUsuarios")
            .textContent = data.usuarios;

        document.getElementById("totalPedidos")
            .textContent = data.pedidos;

        document.getElementById("totalVentas")
            .textContent = "$" + data.ventas;

        // STOCK BAJO
        const stockDiv =
            document.getElementById("stockBajo");

        stockDiv.innerHTML = "";

        data.stockBajo.forEach(item => {

            stockDiv.innerHTML += `
                <p>
                    ${item.producto}
                    - ${item.ciudad}
                    (${item.stock})
                </p>
            `;
        });

        // PEDIDOS
        const pedidosDiv =
            document.getElementById("ultimosPedidos");

        pedidosDiv.innerHTML = "";

        data.ultimosPedidos.forEach(p => {

            pedidosDiv.innerHTML += `
                <p>
                    #${p.id}
                    - ${new Date(p.fecha).toLocaleDateString()}
                    - $${p.total}
                </p>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}

// 🏪 INVENTARIO PRO
async function cargarInventarioPro() {

    try {

        const res =
            await fetch(
                "http://localhost:3000/api/inventario/pro"
            );

        const productos = await res.json();

        const contenedor =
            document.getElementById("inventario-pro");

        if (!contenedor) return;

        contenedor.innerHTML = "";

        productos.forEach(p => {

            const div =
                document.createElement("div");

            div.classList.add("card-inventario");

            div.innerHTML = `

                <h3>${p.nombre}</h3>

                <p>
                    <strong>Stock total:</strong>
                    ${p.stock_total}
                </p>

                <p>
                    <strong>Distribuido:</strong>
                    ${p.stock_distribuido}
                </p>

                <p>
                    <strong>Disponible:</strong>
                    ${p.stock_disponible}
                </p>

                <hr>

                <select id="ciudad-${p.id}">
                </select>

                <input
                    type="number"
                    id="cantidad-${p.id}"
                    placeholder="Cantidad"
                >

                <button
                    onclick="asignarStock(${p.id})"
                >
                    Asignar
                </button>

            `;

            contenedor.appendChild(div);

            cargarCiudadesSelect(p.id);
        });

    } catch (error) {

        console.error(error);
    }
}

// 🏪 SELECT CIUDADES
async function cargarCiudadesSelect(productoId) {

    const res =
        await fetch("http://localhost:3000/api/ciudades");

    const ciudades = await res.json();

    const select =
        document.getElementById(`ciudad-${productoId}`);

    ciudades.forEach(c => {

        select.innerHTML += `
            <option value="${c.nombre}">
                ${c.nombre}
            </option>
        `;
    });
}

// ➕ ASIGNAR STOCK
async function asignarStock(productoId) {

    const ciudad =
        document.getElementById(
            `ciudad-${productoId}`
        ).value;

    const cantidad =
        document.getElementById(
            `cantidad-${productoId}`
        ).value;

    await fetch(
        "http://localhost:3000/api/inventario/asignar",
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                producto_id: productoId,

                ciudad,

                cantidad
            })
        }
    );

    cargarInventarioPro();
}


//ELIMINAR PRODUCTO
async function eliminarProducto(id) {

    if (!confirm("¿Eliminar producto?")) return;

    try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        alert(data.message);

        cargarProductosAdmin();

    } catch (error) {
        console.error("Error eliminando:", error);
    }
}

async function cargarUsuarios() {

    const token = localStorage.getItem("token");

    try {

        const res = await fetch("http://localhost:3000/api/users", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.message);
            return;
        }

        const usuarios = await res.json();

        const tabla = document.getElementById("tabla-usuarios");

        if (!tabla) return;

        tabla.innerHTML = "";

        usuarios.forEach(user => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>

                <td>
                    <select onchange="cambiarRol(${user.id}, this.value)">
                        <option value="cliente" ${user.rol === "cliente" ? "selected" : ""}>
                            Cliente
                        </option>

                        <option value="admin" ${user.rol === "admin" ? "selected" : ""}>
                            Admin
                        </option>
                    </select>
                </td>

                <td>
                    ${user.rol === "admin" ? "👑" : "👤"}
                </td>
            `;

            tabla.appendChild(tr);
        });

    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}

async function cambiarRol(userId, rol) {

    const token = localStorage.getItem("token");

    try {

        const res = await fetch("http://localhost:3000/api/users/rol", {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                userId,
                rol
            })
        });

        const data = await res.json();

        alert(data.message);

        cargarUsuarios();

    } catch (error) {
        console.error("Error cambiando rol:", error);
    }
}


// 📦 CARGAR INVENTARIO ADMIN
async function cargarInventarioAdmin() {

    try {

        const res =
            await fetch("http://localhost:3000/api/inventario");

        const inventario = await res.json();

        const tabla =
            document.getElementById("tabla-inventario-admin");

        if (!tabla) return;

        tabla.innerHTML = "";

        inventario.forEach(item => {

            const tr = document.createElement("tr");

            // 🎨 COLORES STOCK
            if (item.stock === 0) {
                tr.classList.add("stock-0");
            }
            else if (item.stock < 5) {
                tr.classList.add("stock-bajo");
            }
            else {
                tr.classList.add("stock-ok");
            }

            tr.innerHTML = `
                <td>${item.producto}</td>
                <td>${item.ciudad}</td>
                <td>${item.stock}</td>
            `;

            tabla.appendChild(tr);
        });

    } catch (error) {

        console.error("Error inventario:", error);
    }
}

// 📦 CATEGORÍAS
async function cargarCategorias() {

    const res =
        await fetch("http://localhost:3000/api/categorias");

    const categorias = await res.json();

    const lista =
        document.getElementById("listaCategorias");

    lista.innerHTML = "";

    categorias.forEach(c => {

        lista.innerHTML += `
            <p>${c.nombre}</p>
        `;
    });
}


async function crearCategoria() {

    const nombre =
        document.getElementById("nuevaCategoria").value;

    await fetch("http://localhost:3000/api/categorias", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ nombre })
    });

    document.getElementById("nuevaCategoria").value = "";

    cargarCategorias();
}



// 🏪 CIUDADES
async function cargarCiudades() {

    const res =
        await fetch("http://localhost:3000/api/ciudades");

    const ciudades = await res.json();

    const lista =
        document.getElementById("listaCiudades");

    lista.innerHTML = "";

    ciudades.forEach(c => {

        lista.innerHTML += `
            <p>${c.nombre}</p>
        `;
    });
}


async function crearCiudad() {

    const nombre =
        document.getElementById("nuevaCiudad").value;

    await fetch("http://localhost:3000/api/ciudades", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ nombre })
    });

    document.getElementById("nuevaCiudad").value = "";

    cargarCiudades();
}

// 🧾 CARGAR PEDIDOS ADMIN
async function cargarPedidosAdmin() {

    try {

        const res =
            await fetch("http://localhost:3000/api/pedidos");

        const pedidos = await res.json();

        const contenedor =
            document.getElementById("lista-pedidos-admin");

        if (!contenedor) return;

        contenedor.innerHTML = "";

        pedidos.forEach(p => {

            const div = document.createElement("div");

            div.classList.add("pedido-admin");

            div.innerHTML = `

                <h3>Pedido #${p.id}</h3>

                <p>
                    <strong>Fecha:</strong>
                    ${new Date(p.fecha).toLocaleString()}
                </p>

                <p>
                    <strong>Cliente:</strong>
                    ${p.nombre_cliente || "No registrado"}
                </p>

                <p>
                    <strong>Dirección:</strong>
                    ${p.direccion || "-"}
                </p>

                <p>
                    <strong>Teléfono:</strong>
                    ${p.telefono || "-"}
                </p>

                <p>
                    <strong>Ciudad:</strong>
                    ${p.ciudad}
                </p>

                <p>
                    <strong>Total:</strong>
                    $${p.total}
                </p>

                <div class="productos-pedido">

                    <p>
                        ${p.producto}
                        x${p.cantidad}
                    </p>

                </div>
            `;

            contenedor.appendChild(div);
        });

    } catch (error) {

        console.error(error);
    }
}

// ✏️ EDITAR PRODUCTO
function editarProducto(producto) {

    console.log("EDITANDO:", producto);

    // 🔥 GUARDAR ID
    productoEditando = producto.id;

    // 📝 LLENAR FORMULARIO
    document.getElementById("nombre").value =
        producto.nombre || "";

    document.getElementById("descripcion").value =
        producto.descripcion || "";

    document.getElementById("precio").value =
        producto.precio || "";

    document.getElementById("stock").value =
        producto.stock || "";

    document.getElementById("categoria").value =
        producto.categoria_id || "";

    // 🖼 PREVIEW
    const preview =
        document.getElementById("preview");

    if (producto.imagen) {

        preview.src =
            `http://localhost:3000/uploads/${producto.imagen}`;

    } else {

        preview.src =
            "https://dummyimage.com/150x150/cccccc/000000.jpg&text=Sin+Imagen";
    }

    // 🔥 BOTÓN
    document.getElementById("btnCrear")
        .textContent = "Guardar Cambios";
}

//Cerrar sesión
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    window.location.href = "login.html";
}

//INICIALIZAR
document.addEventListener("DOMContentLoaded", () => {
    console.log("ADMIN JS CARGADO");

    cargarUsuarios();
    cargarCategorias();
    cargarProductosAdmin();
    cargarInventarioAdmin();
    cargarDashboard();
    cargarPedidosAdmin();
    cargarCategorias();
    cargarCiudades();
    cargarInventarioPro();
    cargarCategoriasSelect();

    const btn = document.getElementById("btnCrear");
    if (btn) {
        btn.addEventListener("click", crearProducto);
    }

    const inputImagen = document.getElementById("imagen");
    if (inputImagen) {
        inputImagen.addEventListener("change", mostrarPreview);
    }
});

document.getElementById("btnLogout")
    .addEventListener("click", logout);


