const express = require("express");

const router = express.Router();

const categoriaController =
    require("../controllers/categoriaController");


// 📋 OBTENER
router.get(
    "/",
    categoriaController.obtenerCategorias
);


// ➕ CREAR
router.post(
    "/",
    categoriaController.crearCategoria
);


module.exports = router;