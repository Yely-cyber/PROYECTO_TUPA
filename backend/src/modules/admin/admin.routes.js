/**
 * admin.routes.js
 * Rutas HTTP del panel administrativo bajo /api/admin.
 * El login sigue viviendo en tu módulo de auth (/api/auth/admin/login);
 * aquí solo protegemos con requireAdmin (ver admin.middleware.js).
 *
 * Montar en el servidor principal con:
 *   const adminRoutes = require('./modules/admin/admin.routes');
 *   app.use('/api/admin', adminRoutes);
 */

const express = require('express');
const multer = require('multer'); // npm install multer
const controller = require('./admin.controller');
const { requireAdmin } = require('./admin.middleware');
const { DOCS_DIR } = require('./admin.service');

const fs = require('fs');
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

const upload = multer({ dest: DOCS_DIR });

const router = express.Router();

// Todas las rutas de este módulo requieren sesión de administrador
router.use(requireAdmin);

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
router.get('/dashboard', controller.getDashboard);

// ---------------------------------------------------------------------------
// Comunicaciones / solicitudes del usuario
// ---------------------------------------------------------------------------
router.get('/comunicaciones', controller.listComunicaciones);
router.get('/comunicaciones/:id', controller.getComunicacion);
router.patch('/comunicaciones/:id/estado', controller.actualizarEstadoComunicacion);

// ---------------------------------------------------------------------------
// Trámites (catálogo TUPA)
// ---------------------------------------------------------------------------
router.get('/tramites', controller.listTramites);
router.get('/tramites/:id', controller.getTramite);
router.post('/tramites', controller.createTramite);
router.put('/tramites/:id', controller.updateTramite);
router.delete('/tramites/:id', controller.deleteTramite);

// ---------------------------------------------------------------------------
// Categorías (derivadas de tramites.categoria — sin tabla propia)
// ---------------------------------------------------------------------------
router.get('/categorias', controller.listCategorias);
router.put('/categorias', controller.renombrarCategoria); // body: { nombreActual, nombreNuevo }
router.delete('/categorias/:nombre', controller.eliminarCategoria);

// ---------------------------------------------------------------------------
// Expedientes / Solicitudes
// ---------------------------------------------------------------------------
router.get('/expedientes', controller.listExpedientes);
router.get('/expedientes/:id', controller.getExpediente);
router.patch('/expedientes/:id/aprobar', controller.aprobarExpediente);
router.patch('/expedientes/:id/observar', controller.observarExpediente);
router.patch('/expedientes/:id/rechazar', controller.rechazarExpediente);

// ---------------------------------------------------------------------------
// Gestión documental (filesystem, sin tabla propia)
// ---------------------------------------------------------------------------
router.get('/documentos', controller.listDocumentos);
router.post('/documentos', upload.single('file'), controller.subirDocumento);
router.delete('/documentos/:id', controller.eliminarDocumento);
router.get('/documentos/:id/descargar', controller.descargarDocumento);

module.exports = router;
