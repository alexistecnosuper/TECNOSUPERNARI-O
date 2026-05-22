let inventarioGlobal = [];

//CARGAR INVENTARIO
async function cargarInventario() {
    try {
        const res = await fetch("http://localhost:3000/api/inventario");
        const data = await res.json();

        inventarioGlobal = data;

        mostrarInventario(data);

    } catch (error) {
        console.error("Error cargando inventario:", error);
    }
}

//MOSTRAR INVENTARIO
function mostrarInventario(lista) {
    const tabla = document.getElementById("tabla-inventario");
    tabla.innerHTML = "";

    //sin resultados
    if (lista.length === 0) {
        tabla.innerHTML = `<tr><td colspan="3">Sin resultados</td></tr>`;
        return;
    }

    lista.forEach(item => {
        const tr = document.createElement("tr");

        const stock = Number(item.stock);

        //COLORES
        if (stock === 0) {
            tr.classList.add("stock-0");
        } else if (stock < 5) {
            tr.classList.add("stock-bajo");
        } else {
            tr.classList.add("stock-ok");
        }

        tr.innerHTML = `
            <td>${item.producto}</td>
            <td>${item.ciudad}</td>
            <td>${stock}</td>
        `;

        tabla.appendChild(tr);
    });
}

//REGISTRAR MOVIMIENTO
async function registrarMovimiento(e) {
    e.preventDefault();

    const producto_id = document.getElementById("producto_id").value;
    const tipo = document.getElementById("tipo").value;
    const cantidad = document.getElementById("cantidad").value;
    const ciudad = document.getElementById("ciudad").value;

    //VALIDACIÓN
    if (!producto_id || !cantidad || !ciudad) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/movimientos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                producto_id: Number(producto_id),
                tipo,
                cantidad: Number(cantidad),
                ciudad
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error en movimiento");
            return;
        }

        alert(data.message);

        //actualizar tabla
        cargarInventario();

        //limpiar form
        document.getElementById("form-movimiento").reset();

    } catch (error) {
        console.error("Error:", error);
    }
}

//INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {

    //cargar inventario
    cargarInventario();

    //auto refresh
    setInterval(cargarInventario, 5000);

    //buscador
    document.getElementById("buscador")
        .addEventListener("input", () => {

            const texto = document.getElementById("buscador").value.toLowerCase();

            const filtrado = inventarioGlobal.filter(item =>
                item.producto.toLowerCase().includes(texto) ||
                item.ciudad.toLowerCase().includes(texto)
            );

            mostrarInventario(filtrado);
        });

    const form = document.getElementById("form-movimiento");

    if (form) {
        form.addEventListener("submit", registrarMovimiento);
    }

});