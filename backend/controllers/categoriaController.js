const db = require("../db");

// 📋 OBTENER
exports.obtenerCategorias = (req, res) => {

    db.query(
        "SELECT * FROM categorias ORDER BY nombre",
        (err, results) => {

            if (err)
                return res.status(500).json(err);

            res.json(results);
        }
    );
};


// ➕ CREAR
exports.crearCategoria = (req, res) => {

    const { nombre } = req.body;

    db.query(
        "INSERT INTO categorias (nombre) VALUES (?)",
        [nombre],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Categoría creada"
            });
        }
    );
};