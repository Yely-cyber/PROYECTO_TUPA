const express = require('express');
const multer = require('multer');
const controller = require('./comunicaciones.controller');

const router = express.Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/', upload.array('archivos', 5), controller.registrarComunicacion);

module.exports = router;
