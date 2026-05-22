const jwt = require("jsonwebtoken");

const SECRET = "secreto_super_seguro";

// 🔐 VERIFICAR TOKEN
exports.verificarToken = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            message: "Token requerido"
        });
    }

    const token = authHeader.replace("Bearer ", "");

    try {

        const decoded = jwt.verify(token, SECRET);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message: "Token inválido"
        });
    }
};


// 👑 SOLO ADMIN
exports.soloAdmin = (req, res, next) => {

    if (req.user.rol !== "admin") {
        return res.status(403).json({
            message: "Solo admin"
        });
    }

    next();
};