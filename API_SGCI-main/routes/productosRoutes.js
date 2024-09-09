const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Nuevos productos
router.post('/productos', 
    productosController.subirArchivo,
    productosController.nuevoProducto
);

// Muestra todos los productos
router.get('/productos', 
    productosController.mostrarProductos);

// Muestra un producto específico por su ID
router.get('/productos/:idProducto', 
    productosController.mostrarProducto);

// Actualizar Productos
router.put('/productos/:idProducto', 
    productosController.subirArchivo,
    productosController.actualizarProducto
);

// Eliminar Productos
router.delete('/productos/:idProducto', 
    productosController.eliminarProducto
);

// Búsqueda de Productos
router.post('/productos/busqueda/:query',
    productosController.buscarProducto);

module.exports = router;