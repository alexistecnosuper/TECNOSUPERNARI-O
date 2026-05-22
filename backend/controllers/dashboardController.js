const db = require("../db");

exports.obtenerDashboard = async (req, res) => {

    try {

        // 📦 TOTAL PRODUCTOS
        const [productos] = await db.promise().query(`
            SELECT COUNT(*) AS total
            FROM productos
        `);

        // 👥 TOTAL USUARIOS
        const [usuarios] = await db.promise().query(`
            SELECT COUNT(*) AS total
            FROM usuarios
        `);

        // 🧾 TOTAL PEDIDOS
        const [pedidos] = await db.promise().query(`
            SELECT COUNT(*) AS total
            FROM pedidos
        `);

        // 💰 TOTAL VENTAS
        const [ventas] = await db.promise().query(`
            SELECT IFNULL(SUM(total), 0) AS total
            FROM pedidos
        `);

        // ⚠️ STOCK BAJO
        const [stockBajo] = await db.promise().query(`
            SELECT 
                p.nombre AS producto,
                i.ciudad,
                i.stock

            FROM inventario i

            JOIN productos p
                ON i.producto_id = p.id

            WHERE i.stock < 5

            ORDER BY i.stock ASC
        `);

        // 🧾 ÚLTIMOS PEDIDOS
        const [ultimosPedidos] = await db.promise().query(`
            SELECT
                id,
                total,
                fecha

            FROM pedidos

            ORDER BY fecha DESC

            LIMIT 5
        `);

        // ✅ RESPUESTA
        res.json({

            productos: productos[0].total,

            usuarios: usuarios[0].total,

            pedidos: pedidos[0].total,

            ventas: ventas[0].total,

            stockBajo,

            ultimosPedidos
        });

    } catch (error) {

        console.error("Error dashboard:", error);

        res.status(500).json({
            message: error.message
        });
    }
};