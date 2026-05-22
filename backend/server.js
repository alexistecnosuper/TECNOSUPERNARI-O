const express = require("express");
const cors = require("cors");

const app = express();
const path = require("path");

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rutas
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const movimientoRoutes = require("./routes/movimientoRoutes");
const inventarioRoutes = require("./routes/inventarioRoutes");
const compraRoutes = require("./routes/compraRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const userRoutes = require("./routes/userRoutes");
const ciudadRoutes = require("./routes/ciudadRoutes");

app.use("/api/users", userRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/ciudades", ciudadRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/productos", productRoutes);


const dashboardRoutes = 
    require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Ruta base
app.get("/", (req, res) => {
    res.send("API TecnoSuper Nariño funcionando");
});


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});