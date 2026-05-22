-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-05-2026 a las 07:14:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tecnosuper`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(1, 'Celulares');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id`, `nombre`) VALUES
(1, 'Ipiales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

CREATE TABLE `detalle_pedidos` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedidos`
--

INSERT INTO `detalle_pedidos` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio`) VALUES
(1, 1, 5, 1, 1200000.00),
(2, 2, 7, 1, 1200000.00),
(3, 3, 5, 1, 1200000.00),
(4, 4, 5, 1, 1200000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `stock` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id`, `producto_id`, `ciudad`, `stock`) VALUES
(1, 5, 'Ipiales', 8),
(2, 7, 'Ipiales', 7),
(3, 10, 'Ipiales', 9),
(4, 11, 'Ipiales', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `tipo` enum('entrada','salida') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `producto_id`, `tipo`, `cantidad`, `ciudad`, `fecha`) VALUES
(1, 5, 'entrada', 5, 'Ipiales', '2026-04-21 04:46:20'),
(2, 5, 'salida', 2, 'Ipiales', '2026-04-21 04:46:42'),
(3, 5, 'entrada', 10, 'Ipiales', '2026-04-21 04:59:25'),
(4, 5, 'salida', 3, 'Ipiales', '2026-04-21 05:00:07'),
(5, 5, 'salida', 3, 'Ipiales', '2026-04-21 05:00:17'),
(6, 5, 'salida', 3, 'Ipiales', '2026-04-21 05:00:18'),
(7, 5, 'entrada', 10, 'Ipiales', '2026-04-21 05:01:35'),
(8, 7, 'entrada', 8, 'Ipiales', '2026-05-04 02:59:35'),
(9, 10, 'entrada', 10, 'Ipiales', '2026-05-04 02:59:55'),
(10, 11, 'entrada', 8, 'Ipiales', '2026-05-04 03:00:10'),
(11, 10, 'salida', 1, 'Ipiales', '2026-05-04 03:15:55'),
(12, 5, 'salida', 1, 'Ipiales', '2026-05-05 01:42:30'),
(13, 7, 'salida', 1, 'Ipiales', '2026-05-05 01:43:31'),
(14, 5, 'salida', 1, 'Ipiales', '2026-05-05 01:57:13'),
(15, 5, 'salida', 1, 'Ipiales', '2026-05-05 02:07:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) DEFAULT NULL,
  `ciudad` varchar(50) DEFAULT NULL,
  `nombre_cliente` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `fecha`, `total`, `ciudad`, `nombre_cliente`, `direccion`, `telefono`) VALUES
(1, '2026-05-05 01:42:30', 1200000.00, 'Ipiales', NULL, NULL, NULL),
(2, '2026-05-05 01:43:31', 1200000.00, 'Ipiales', NULL, NULL, NULL),
(3, '2026-05-05 01:57:13', 1200000.00, 'Ipiales', 'Alexis prueba 1', 'Cra 1a #31-00', '3232955018'),
(4, '2026-05-05 02:07:11', 1200000.00, 'Ipiales', 'Alexis prueba 2', 'Cra 1a #31-00', '3013431611');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `categoria_id`, `imagen`, `disponible`, `creado_en`) VALUES
(5, 'Samsung S21', 'Excelente estado', 1200000.00, 3, 1, '1775538723482-samsung-galaxy-s21-2.png', 1, '2026-04-07 05:12:03'),
(7, 'iPhone 11', 'Nuevo', 1200000.00, 15, 1, '1775543216301-iphone-11-.png', 1, '2026-04-07 06:26:56'),
(10, 'Redmi 15C', 'Nuevo', 560000.00, 10, 1, '1776398774437-b5592353b1231d9dfdb9229ad23cad81.png', 1, '2026-04-17 04:06:14'),
(11, 'Xiaomi 15T', 'Nuevo 512gb/12Ram', 2400000.00, 8, 1, '1776741091943-Xiaomi-15T-PRo-color-options.jpg', 1, '2026-04-21 03:11:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` enum('admin','cliente') DEFAULT 'cliente',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `creado_en`) VALUES
(1, 'Admin', 'admin@test.com', '$2b$10$3.zJVAahudUR24S04krNQughdroNGmWADCAlN60HnfxnRFVtUiPQm', 'admin', '2026-04-07 03:35:50'),
(4, 'Admin1', 'admin1@test.com', '$2b$10$CgZ9SzNZppA4oUPHvHUP9OdnocXSivyXRDm1Bl1OatKSUw.5MtuBG', 'admin', '2026-04-07 05:39:15'),
(5, 'alexis', 'alexis@gmail.com', '$2b$10$vOkSjorr2X8Ch4LhJ9Zjs.3xFU3Fasq3ITPp.BrL6dFZV.JEbk17a', 'cliente', '2026-05-05 02:46:12'),
(6, 'PEPITO', 'pepito@gmail.com', '$2b$10$GnPoPEiawTXs56h5zecJv.kVZMeg22rgD/3JbUQ38016pkXIjfxxS', 'cliente', '2026-05-14 04:17:22');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD CONSTRAINT `detalle_pedidos_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`),
  ADD CONSTRAINT `detalle_pedidos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
