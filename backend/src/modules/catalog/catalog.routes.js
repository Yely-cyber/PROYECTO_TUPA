const express = require('express');
const multer = require('multer');
const catalogController = require('./catalog.controller');

const router = express.Router();

// Los archivos se reciben en memoria; catalog.service.js los escribe a
// disco recién cuando ya conoce el id_expediente (necesario para armar
// la ruta /uploads/expedientes/{id}/...).
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB por archivo
});

// GET /api/catalog/categorias?perfil=estudiante
router.get('/categorias', catalogController.listarCategorias);

// GET /api/catalog/tramites?perfil=estudiante&categoria=...&search=...
router.get('/tramites', catalogController.listarTramites);

// GET /api/catalog/tramites/:id
router.get('/tramites/:id', catalogController.obtenerTramite);

// POST /api/catalog/expedientes  (multipart/form-data)
// Campos: tramiteId, email, peticion, codigoPago, idTipoDocumento? (opcional)
// Archivos: campo "archivos" (hasta 10)
router.post('/expedientes', upload.array('archivos', 10), catalogController.crearExpediente);

module.exports = router;