//CARGAR CARRITO
function cargarCarrito() {

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const contenedor = document.getElementById("lista-carrito");
    contenedor.innerHTML = "";

    let total = 0;

    // 🚨 CARRITO VACÍO
    if (carrito.length === 0) {

        contenedor.innerHTML = `
            <p style="text-align:center;">
                Tu carrito está vacío 🛒
            </p>
        `;

        document.getElementById("total").textContent = "";

        return;
    }

    carrito.forEach(p => {

        const precio = Number(p.precio);
        const subtotal = precio * p.cantidad;

        total += subtotal;

        const div = document.createElement("div");

        div.classList.add("item-carrito");

        div.innerHTML = `
            <img 
                src="http://localhost:3000/uploads/${p.imagen}" 
                alt="${p.nombre}"
            >

            <div class="info">
                <h4>${p.nombre}</h4>

                <p>Cantidad: ${p.cantidad}</p>

                <p>$${subtotal}</p>
            </div>

            <button 
                class="eliminar"
                onclick="eliminarDelCarrito(${p.id})"
            >
                ❌
            </button>
        `;

        contenedor.appendChild(div);
    });

    document.getElementById("total").textContent =
        "Total: $" + total;
}


//ELIMINAR
function eliminarDelCarrito(id) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito = carrito.filter(p => p.id !== id);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    cargarCarrito();
}


//COMPRAR
async function comprar() {

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("Carrito vacío");
        return;
    }

    try {

        const res = await fetch("http://localhost:3000/api/compras", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                carrito,
                ciudad: "Ipiales"
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert(data.message);

        // 🧹 limpiar carrito
        localStorage.removeItem("carrito");

        // 🔄 refrescar
        cargarCarrito();

        // 🔙 volver
        window.location.href = "index.html";

    } catch (error) {

        console.error("Error:", error);
    }
}


//INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {

    cargarCarrito();

    const btn = document.getElementById("btnComprar");

    if (btn) {
        btn.addEventListener("click", comprar);
    }

});