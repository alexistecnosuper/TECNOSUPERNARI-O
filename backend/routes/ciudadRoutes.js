const express = require("express");

const router = express.Router();

const {
    obtenerCiudades,
    crearCiudad
} = require("../controllers/ciudadController");

router.get("/", obtenerCiudades);

router.post("/", crearCiudad);

module.exports = router;