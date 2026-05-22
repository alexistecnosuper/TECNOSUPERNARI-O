async function cargarPedidos() {
    try {
        const res = await fetch("http://localhost:3000/api/pedidos");
        const data = await res.json();

        const contenedor = document.getElementById("lista-pedidos");
        contenedor.innerHTML = "";

        const pedidos = {};

        //AGRUPAR BIEN
        data.forEach(item => {

            if (!pedidos[item.id]) {
                pedidos[item.id] = {
                    id: item.id,
                    fecha: item.fecha,
                    total: item.total,
                    ciudad: item.ciudad,
                    cliente: item.nombre_cliente,
                    direccion: item.direccion,
                    telefono: item.telefono,
                    productos: []
                };
            }

            pedidos[item.id].productos.push({
                nombre: item.producto,
                cantidad: item.cantidad,
                precio: item.precio
            });
        });

        //PINTAR
        Object.values(pedidos).forEach(pedido => {

            const div = document.createElement("div");
            div.classList.add("pedido");

            div.innerHTML = `
                <h3>Pedido #${pedido.id}</h3>
                <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString()}</p>
                <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                <p><strong>Dirección:</strong> ${pedido.direccion}</p>
                <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
                <p><strong>Ciudad:</strong> ${pedido.ciudad}</p>
                <p><strong>Total:</strong> $${pedido.total}</p>
                <hr>
            `;

            pedido.productos.forEach(p => {
                const prod = document.createElement("p");
                prod.textContent = `${p.nombre} x${p.cantidad} - $${p.precio}`;
                div.appendChild(prod);
            });

            contenedor.appendChild(div);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarPedidos);