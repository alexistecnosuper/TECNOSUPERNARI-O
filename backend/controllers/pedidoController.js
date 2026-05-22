const db = require("../db");

exports.obtenerPedidos = (req, res) => {

    const sql = `
        SELECT 
            p.id,
            p.fecha,
            p.total,
            p.ciudad,
            p.nombre_cliente,
            p.direccion,
            p.telefono,

            dp.producto_id,
            pr.nombre AS producto,
            dp.cantidad,
            dp.precio

        FROM pedidos p
        JOIN detalle_pedidos dp ON p.id = dp.pedido_id
        JOIN productos pr ON dp.producto_id = pr.id

        ORDER BY p.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};