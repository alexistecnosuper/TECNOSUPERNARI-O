const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { verificarToken, soloAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

//Crear
router.post("/", verificarToken, soloAdmin, upload.single("imagen"), productController.crearProducto);

//leer
router.get("/", productController.obtenerProductos);

//Eliminar
router.delete("/:id", verificarToken, soloAdmin, productController.eliminarProducto);

//Actualizar
router.put("/:id", verificarToken, soloAdmin, upload.single("imagen"), productController.actualizarProducto);

module.exports = router;