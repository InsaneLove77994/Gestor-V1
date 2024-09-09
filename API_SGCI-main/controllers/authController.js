const bcrypt = require('bcryptjs');
const Joi = require('joi');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'El usuario ya existe' });

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10)
    });

    await user.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};



const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  
  exports.login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });
  
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (error) {
      res.status(500).json({ error: 'Error del servidor' });
    }
  };


  const updateUserSchema = Joi.object({
    username: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(6)
  });

  exports.updateUser = async (req, res) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    const updates = req.body;
  
    try {
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
  
      const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  
      res.status(200).json({ mensaje: 'Datos del usuario actualizados exitosamente', user });
    } catch (error) {
      res.status(500).json({ error: 'Error del servidor' });
    }
  };