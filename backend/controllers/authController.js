const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "secreto_super_seguro";

//REGISTRO (SIEMPRE CLIENTE)
exports.register = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({
            message: "Todos los campos son obligatorios"
        });
    }

    try {
        //Verificar si el usuario ya existe
        db.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email],
            async (err, results) => {

                if (err) return res.status(500).json(err);

                if (results.length > 0) {
                    return res.status(400).json({
                        message: "El usuario ya existe"
                    });
                }

                //Encriptar contraseña
                const hashedPassword = await bcrypt.hash(password, 10);

                //SIEMPRE cliente
                const rol = "cliente";

                db.query(
                    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
                    [nombre, email, hashedPassword, rol],
                    (err) => {
                        if (err) return res.status(500).json(err);

                        res.json({ message: "Usuario registrado correctamente" });
                    }
                );
            }
        );

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};


//LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email y contraseña son obligatorios"
        });
    }

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (err, results) => {

            if (err) return res.status(500).json(err);

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }

            const user = results[0];

            //Comparar contraseña
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({
                    message: "Contraseña incorrecta"
                });
            }

            //Token
            const token = jwt.sign(
                {
                    id: user.id,
                    rol: user.rol
                },
                SECRET,
                { expiresIn: "8h" }
            );

            res.json({
                message: "Login exitoso",
                token,
                rol: user.rol,
                usuario: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email
                }
            });
        }
    );
};