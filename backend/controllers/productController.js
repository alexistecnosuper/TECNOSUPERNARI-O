const db = require("../db");
const fs = require("fs");
const path = require("path");


//CREAR PRODUCTO
exports.crearProducto = (req, res) => {
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    db.query(
        "INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, descripcion, precio, stock, categoria_id, imagen],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                message: "Producto creado correctamente",
                id: result.insertId
            });
        }
    );
};


//OBTENER TODOS LOS PRODUCTOS
exports.obtenerProductos = (req, res) => {
    db.query("SELECT * FROM productos", (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};


//ELIMINAR PRODUCTO + IMAGEN
exports.eliminarProducto = (req, res) => {
    const { id } = req.params;

    //Buscar producto
    db.query(
        "SELECT imagen FROM productos WHERE id = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Producto no encontrado"
                });
            }

            const imagen = result[0].imagen;

            //Eliminar imagen si existe
            if (imagen) {
                const ruta = path.join(__dirname, "../../uploads", imagen);

                if (fs.existsSync(ruta)) {
                    fs.unlink(ruta, (err) => {
                        if (err) {
                            console.log("Error eliminando imagen:", err.message);
                        } else {
                            console.log("Imagen eliminada:", imagen);
                        }
                    });
                }
            }

            //Eliminar producto de la DB
            db.query(
                "DELETE FROM productos WHERE id = ?",
                [id],
                (err) => {
                    if (err) return res.status(500).json(err);

                    res.json({
                        message: "Producto eliminado correctamente"
                    });
                }
            );
        }
    );
};

exports.actualizarProducto = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    let query = `
        UPDATE productos 
        SET nombre=?, descripcion=?, precio=?, stock=?, categoria_id=?
    `;

    const params = [nombre, descripcion, precio, stock, categoria_id];

    //si viene nueva imagen
    if (imagen) {
        query += ", imagen=?";
        params.push(imagen);
    }

    query += " WHERE id=?";
    params.push(id);

    db.query(query, params, (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Producto actualizado correctamente" });
    });
};