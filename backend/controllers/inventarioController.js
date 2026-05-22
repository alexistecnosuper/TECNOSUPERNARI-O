const db = require("../db");

exports.obtenerInventario = (req, res) => {

    const sql = `
        SELECT 
            i.id,

            p.nombre AS producto,

            i.ciudad,

            i.stock

        FROM inventario i

        JOIN productos p 
            ON i.producto_id = p.id

        ORDER BY p.nombre
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
};

// 📦 INVENTARIO PRO
exports.obtenerInventarioPro = (req, res) => {

    const sql = `
        SELECT

            p.id,

            p.nombre,

            p.stock AS stock_total,

            IFNULL(SUM(i.stock), 0)
                AS stock_distribuido,

            (
                p.stock -
                IFNULL(SUM(i.stock), 0)
            ) AS stock_disponible

        FROM productos p

        LEFT JOIN inventario i
            ON p.id = i.producto_id

        GROUP BY p.id

        ORDER BY p.nombre
    `;

    db.query(sql, (err, results) => {

        if (err)
            return res.status(500).json(err);

        res.json(results);
    });
};

// ➕ ASIGNAR STOCK
exports.asignarStock = (req, res) => {

    const {
        producto_id,
        ciudad,
        cantidad
    } = req.body;

    // verificar si ya existe
    db.query(`
        SELECT * FROM inventario
        WHERE producto_id = ?
        AND ciudad = ?
    `,
    [producto_id, ciudad],

    (err, results) => {

        if (results.length > 0) {

            // actualizar
            db.query(`
                UPDATE inventario
                SET stock = stock + ?
                WHERE producto_id = ?
                AND ciudad = ?
            `,
            [cantidad, producto_id, ciudad],

            (err2) => {

                if (err2)
                    return res.status(500).json(err2);

                res.json({
                    message: "Stock actualizado"
                });
            });

        } else {

            // crear
            db.query(`
                INSERT INTO inventario
                (producto_id, ciudad, stock)

                VALUES (?, ?, ?)
            `,
            [producto_id, ciudad, cantidad],

            (err3) => {

                if (err3)
                    return res.status(500).json(err3);

                res.json({
                    message: "Stock asignado"
                });
            });
        }
    });
};