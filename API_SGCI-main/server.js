const express = require('express');
const conectarDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes'); // Importar rutas de productos
const pedidosRoutes = require('./routes/pedidosRoutes');  // Importar rutas de pedidos

// Conectar a la base de datos
conectarDB();

// Crear una instancia de Express
const app = express();

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Usar rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de productos
app.use('/api', productosRoutes); // Usar rutas de productos

// Rutas de pedidos
app.use('/api', pedidosRoutes);  // Usar rutas de pedidos

// Configurar el puerto en el que escuchará el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 