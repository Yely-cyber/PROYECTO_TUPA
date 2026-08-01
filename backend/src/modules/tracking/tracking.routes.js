const express = require('express');
const controller = require('./tracking.controller');

const router = express.Router();

router.get('/expedientes', controller.listarExpedientes);
router.get('/expedientes/:numeroExpediente', controller.obtenerExpediente);

module.exports = router;
