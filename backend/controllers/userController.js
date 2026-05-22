const db = require("../db");

exports.obtenerUsuarios = (req, res) => {

    db.query("SELECT id, nombre, email, rol, creado_en FROM usuarios", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.cambiarRol = (req, res) => {

    const { userId, rol } = req.body;

    if (!userId || !rol) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    db.query(
        "UPDATE usuarios SET rol = ? WHERE id = ?",
        [rol, userId],
        (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: "Rol actualizado" });
        }
    );
};