const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');


// Nuevos pedidos
router.post('/pedidos/nuevo', pedidosController.nuevoPedido);

// Muestra todos los pedidos
router.get('/pedidos', pedidosController.mostrarPedidos);

// Muestra un pedido por su ID
router.get('/pedidos/:idPedido', pedidosController.mostrarPedido);


// Actualizar pedidos
router.put('/pedidos/:idPedido', pedidosController.actualizarPedido);

// Elimina un pedido
router.delete('/pedidos/:idPedido', pedidosController.eliminarPedido);

module.exports = router;
