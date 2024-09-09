const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imagen: {
        type: String
    }
}, {
    timestamps: true // Esta línea habilita createdAt y updatedAt
});

module.exports = mongoose.model('Producto', ProductoSchema);