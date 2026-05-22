const express = require("express");
const router = express.Router();

const { procesarCompra } = require("../controllers/compraController");

router.post("/", procesarCompra);

module.exports = router;