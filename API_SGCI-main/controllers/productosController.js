const Producto = require('../models/Producto');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path'); // Asegúrate de importar 'path'

const configuracionMulter = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadsDir = path.join(__dirname, '../uploads'); // Usar path.join para asegurar compatibilidad SO
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato No válido'));
        }
    }
};

const upload = multer(configuracionMulter).single('imagen');

exports.subirArchivo = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: error.message });
        }
        return next();
    });
};

exports.nuevoProducto = async (req, res, next) => {
    const producto = new Producto(req.body);

    try {
        if (req.file) {
            producto.imagen = req.file.filename;
        }
        await producto.save();
        res.json({ mensaje: 'Se agregó un nuevo producto' });
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.mostrarProductos = async (req, res, next) => {
    try {
        const productos = await Producto.find({});
        res.json(productos);
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.mostrarProducto = async (req, res, next) => {
    try {
        const producto = await Producto.findById(req.params.idProducto);

        if (!producto) {
            res.json({ mensaje: 'Ese Producto no existe' });
            return next();
        }

        res.json(producto);
    } catch (error) {
        console.log('Error al buscar el producto:', error);
        next();
    }
};



exports.actualizarProducto = async (req, res, next) => {
    try {
        let nuevoProducto = req.body;

        if (req.file) {
            nuevoProducto.imagen = req.file.filename;
        } else {
            let productoAnterior = await Producto.findById(req.params.idProducto);
            nuevoProducto.imagen = productoAnterior.imagen;
        }

        let producto = await Producto.findOneAndUpdate({ _id: req.params.idProducto }, nuevoProducto, {
            new: true
        });

        res.json(producto);
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.eliminarProducto = async (req, res, next) => {
    try {
        await Producto.findByIdAndDelete({ _id: req.params.idProducto });
        res.json({ mensaje: 'El Producto se ha eliminado' });
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.buscarProducto = async (req, res, next) => {
    try {
        const { query } = req.params;
        const producto = await Producto.find({ nombre: new RegExp(query, 'i') });
        res.json(producto);
    } catch (error) {
        console.log(error);
        next();
    }
};
