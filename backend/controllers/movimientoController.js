const db = require("../db");

exports.registrarMovimiento = (req, res) => {
    const { producto_id, tipo, cantidad, ciudad } = req.body;

    if (!producto_id || !tipo || !cantidad || !ciudad) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    //Buscar inventario actual
    db.query(
        "SELECT * FROM inventario WHERE producto_id = ? AND ciudad = ?",
        [producto_id, ciudad],
        (err, result) => {
            if (err) return res.status(500).json(err);

            let stockActual = 0;

            if (result.length > 0) {
                stockActual = result[0].stock;
            }

            //VALIDAR SALIDA
            if (tipo === "salida" && cantidad > stockActual) {
                return res.status(400).json({
                    message: "Stock insuficiente"
                });
            }

            //GUARDAR MOVIMIENTO
            db.query(
                "INSERT INTO movimientos (producto_id, tipo, cantidad, ciudad) VALUES (?, ?, ?, ?)",
                [producto_id, tipo, cantidad, ciudad],
                (err) => {
                    if (err) return res.status(500).json(err);

                    //ACTUALIZAR INVENTARIO
                    let nuevoStock =
                        tipo === "entrada"
                            ? stockActual + cantidad
                            : stockActual - cantidad;

                    if (result.length > 0) {
                        // actualizar
                        db.query(
                            "UPDATE inventario SET stock = ? WHERE producto_id = ? AND ciudad = ?",
                            [nuevoStock, producto_id, ciudad]
                        );
                    } else {
                        // crear nuevo registro
                        db.query(
                            "INSERT INTO inventario (producto_id, ciudad, stock) VALUES (?, ?, ?)",
                            [producto_id, ciudad, nuevoStock]
                        );
                    }

                    res.json({
                        message: "Movimiento registrado",
                        stock: nuevoStock
                    });
                }
            );
        }
    );
};

exports.obtenerMovimientos = (req, res) => {

    const sql = `
        SELECT 
            m.id,
            p.nombre AS producto,
            m.tipo,
            m.cantidad,
            m.ciudad,
            m.fecha
        FROM movimientos m
        JOIN productos p ON m.producto_id = p.id
        ORDER BY m.fecha DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};