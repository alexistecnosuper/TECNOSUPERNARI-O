const express = require("express");
const router = express.Router();

const { registrarMovimiento, obtenerMovimientos } = require("../controllers/movimientoController");

// POST = registrar movimiento
router.post("/", registrarMovimiento);

// GET = historial
router.get("/", obtenerMovimientos);

module.exports = router;