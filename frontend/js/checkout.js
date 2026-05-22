//RESUMEN DEL CARRITO
function cargarResumen() {

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const contenedor = document.getElementById("resumen");
    contenedor.innerHTML = "";

    let total = 0;

    carrito.forEach(p => {

        const precio = Number(p.precio);
        const subtotal = precio * p.cantidad;
        total += subtotal;

        const div = document.createElement("div");

        div.innerHTML = `
            <p>${p.nombre} x${p.cantidad} - $${subtotal}</p>
        `;

        contenedor.appendChild(div);
    });

    document.getElementById("total").textContent = "Total: $" + total;
}


//CONFIRMAR COMPRA (AHORA REAL)
async function confirmarCompra() {

    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    //VALIDACIONES
    if (!nombre || !direccion || !telefono) {
        alert("Completa todos los campos");
        return;
    }

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
                ciudad: "Ipiales",
                cliente: {
                    nombre,
                    direccion,
                    telefono
                }
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error en la compra");
            return;
        }

        alert("Compra realizada con éxito 🎉");

        //limpiar carrito
        localStorage.removeItem("carrito");

        //volver al inicio
        window.location.href = "index.html";

    } catch (error) {
        console.error("Error:", error);
        alert("Error conectando con el servidor");
    }
}


//INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {

    cargarResumen();

    const btn = document.getElementById("btnConfirmar");

    if (btn) {
        btn.addEventListener("click", confirmarCompra);
    }

});