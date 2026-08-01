const express = require('express');
const controller = require('./comunicaciones.controller');

const router = express.Router();

router.post('/', controller.registrarComunicacion);

module.exports = router;
