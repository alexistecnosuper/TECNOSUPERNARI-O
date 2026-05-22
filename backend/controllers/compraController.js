const db = require("../db");

exports.procesarCompra = async (req, res) => {
    const { carrito, ciudad, cliente } = req.body;

    if (!carrito || carrito.length === 0) {
        return res.status(400).json({ message: "Carrito vacío" });
    }

    try {

        let total = 0;

        //calcular total
        carrito.forEach(p => {
            total += Number(p.precio) * p.cantidad;
        });

        //CREAR PEDIDO
        const pedidoId = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO pedidos (total, ciudad, nombre_cliente, direccion, telefono) VALUES (?, ?, ?, ?, ?)",
                [total, ciudad, cliente.nombre, cliente.direccion, cliente.telefono],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.insertId);
                }
            );
        });

        //RECORRER CARRITO
        for (let item of carrito) {

            //VALIDAR STOCK
            const stockActual = await new Promise((resolve, reject) => {
                db.query(
                    "SELECT stock FROM inventario WHERE producto_id = ? AND ciudad = ?",
                    [item.id, ciudad],
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result[0]?.stock || 0);
                    }
                );
            });

            if (stockActual < item.cantidad) {
                return res.status(400).json({
                    message: `Stock insuficiente para ${item.nombre}`
                });
            }

            //GUARDAR DETALLE
            await new Promise((resolve, reject) => {
                db.query(
                    "INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)",
                    [pedidoId, item.id, item.cantidad, item.precio],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            //MOVIMIENTO (SALIDA)
            await new Promise((resolve, reject) => {
                db.query(
                    "INSERT INTO movimientos (producto_id, tipo, cantidad, ciudad) VALUES (?, 'salida', ?, ?)",
                    [item.id, item.cantidad, ciudad],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            //ACTUALIZAR INVENTARIO
            await new Promise((resolve, reject) => {
                db.query(
                    "UPDATE inventario SET stock = stock - ? WHERE producto_id = ? AND ciudad = ?",
                    [item.cantidad, item.id, ciudad],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        res.json({
            message: "Compra realizada y guardada exitosamente",
            pedido_id: pedidoId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en compra" });
    }
};