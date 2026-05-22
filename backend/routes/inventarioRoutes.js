const express = require("express");

const router = express.Router();

const inventarioController =
    require("../controllers/inventarioController");

const {
    obtenerInventario,
    obtenerInventarioPro
} = inventarioController;


// 📦 INVENTARIO NORMAL
router.get(
    "/",
    obtenerInventario
);


// 🔥 INVENTARIO PRO
router.get(
    "/pro",
    obtenerInventarioPro
);


// ➕ ASIGNAR STOCK
router.post(
    "/asignar",
    inventarioController.asignarStock
);


module.exports = router;