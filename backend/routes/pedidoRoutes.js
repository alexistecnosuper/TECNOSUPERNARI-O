const express = require("express");
const router = express.Router();

const { obtenerPedidos } = require("../controllers/pedidoController");

router.get("/", obtenerPedidos);

module.exports = router;