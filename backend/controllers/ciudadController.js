const db = require("../db");

// 📋 OBTENER
exports.obtenerCiudades = (req, res) => {

    db.query(
        "SELECT * FROM ciudades ORDER BY nombre",
        (err, results) => {

            if (err)
                return res.status(500).json(err);

            res.json(results);
        }
    );
};


// ➕ CREAR
exports.crearCiudad = (req, res) => {

    const { nombre } = req.body;

    db.query(
        "INSERT INTO ciudades (nombre) VALUES (?)",
        [nombre],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Ciudad creada"
            });
        }
    );
};