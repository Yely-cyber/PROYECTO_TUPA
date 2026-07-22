const express = require('express');
const authController = require('./auth.controller');

const routerAutenticacion = express.Router();

routerAutenticacion.get('/profiles', authController.obtenerPerfiles);
routerAutenticacion.post('/register/step', authController.guardarPasoRegistro);
routerAutenticacion.post('/register/complete', authController.completarRegistro);
routerAutenticacion.get('/register/:registrationId', authController.obtenerRegistroPorId);
routerAutenticacion.post('/admin/login', authController.iniciarSesionAdministrador);

module.exports = routerAutenticacion;
