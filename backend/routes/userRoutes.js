const express = require("express");
const router = express.Router();

const {
    obtenerUsuarios,
    cambiarRol
} = require("../controllers/userController");

const {
    verificarToken,
    soloAdmin
} = require("../middlewares/authMiddleware");

// 👥 VER USUARIOS
router.get("/", verificarToken, soloAdmin, obtenerUsuarios);

// 🔄 CAMBIAR ROL
router.put("/rol", verificarToken, soloAdmin, cambiarRol);

module.exports = router;