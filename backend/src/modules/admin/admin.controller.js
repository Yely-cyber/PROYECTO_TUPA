/**
 * admin.controller.js
 * Controladores HTTP del panel administrativo TUPA Digital.
 * NO incluye login (eso ya vive en tu auth.controller.js / auth.service.js).
 * Responde con { success, message, ... } igual que tu iniciarSesionAdministrador
 * para que el frontend use el mismo requestJson sin adaptar nada.
 */

const adminService = require('./admin.service');

function enviarError(res, error) {
	const status = error.status || 500;
	return res.status(status).json({ success: false, message: error.message || 'Error interno del servidor.' });
}

function asyncHandler(fn) {
	return (req, res) => Promise.resolve(fn(req, res)).catch((error) => enviarError(res, error));
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
const getDashboard = asyncHandler(async (req, res) => {
	const data = await adminService.getDashboardMetrics();
	res.status(200).json({ success: true, data });
});

// ---------------------------------------------------------------------------
// Trámites
// ---------------------------------------------------------------------------
const listTramites = asyncHandler(async (req, res) => {
	const { search, categoria } = req.query;
	const data = await adminService.getTramites({ search, categoria });
	res.status(200).json({ success: true, data });
});

const getTramite = asyncHandler(async (req, res) => {
	const data = await adminService.getTramiteById(req.params.id);
	res.status(200).json({ success: true, data });
});

const createTramite = asyncHandler(async (req, res) => {
	const data = await adminService.createTramite(req.body, req.admin?.id_admin);
	res.status(201).json({ success: true, message: 'Trámite creado correctamente.', data });
});

const updateTramite = asyncHandler(async (req, res) => {
	const data = await adminService.updateTramite(req.params.id, req.body);
	res.status(200).json({ success: true, message: 'Trámite actualizado correctamente.', data });
});

const deleteTramite = asyncHandler(async (req, res) => {
	await adminService.deleteTramite(req.params.id);
	res.status(200).json({ success: true, message: 'Trámite eliminado correctamente.' });
});

// ---------------------------------------------------------------------------
// Categorías (derivadas de tramites.categoria)
// ---------------------------------------------------------------------------
const listCategorias = asyncHandler(async (req, res) => {
	const data = await adminService.getCategorias();
	res.status(200).json({ success: true, data });
});

const renombrarCategoria = asyncHandler(async (req, res) => {
	const { nombreActual, nombreNuevo } = req.body;
	const data = await adminService.renombrarCategoria(nombreActual, nombreNuevo);
	res.status(200).json({ success: true, message: 'Categoría actualizada correctamente.', data });
});

const eliminarCategoria = asyncHandler(async (req, res) => {
	const data = await adminService.eliminarCategoria(req.params.nombre);
	res.status(200).json({ success: true, message: 'Categoría eliminada correctamente.', data });
});

// ---------------------------------------------------------------------------
// Expedientes / Solicitudes
// ---------------------------------------------------------------------------
const listExpedientes = asyncHandler(async (req, res) => {
	const { search, estado } = req.query;
	const data = await adminService.getExpedientes({ search, estado });
	res.status(200).json({ success: true, data });
});

const getExpediente = asyncHandler(async (req, res) => {
	const data = await adminService.getExpedienteById(req.params.id);
	res.status(200).json({ success: true, data });
});

const aprobarExpediente = asyncHandler(async (req, res) => {
	const data = await adminService.aprobarExpediente(req.params.id, req.body.comentario, req.admin?.id_admin);
	res.status(200).json({ success: true, message: 'Expediente aprobado.', data });
});

const observarExpediente = asyncHandler(async (req, res) => {
	const data = await adminService.observarExpediente(req.params.id, req.body.comentario, req.admin?.id_admin);
	res.status(200).json({ success: true, message: 'Expediente observado.', data });
});

const rechazarExpediente = asyncHandler(async (req, res) => {
	const data = await adminService.rechazarExpediente(req.params.id, req.body.comentario, req.admin?.id_admin);
	res.status(200).json({ success: true, message: 'Expediente rechazado.', data });
});

// ---------------------------------------------------------------------------
// Gestión documental (filesystem)
// ---------------------------------------------------------------------------
const listDocumentos = asyncHandler(async (req, res) => {
	const data = adminService.getDocumentos();
	res.status(200).json({ success: true, data });
});

const subirDocumento = asyncHandler(async (req, res) => {
	const data = adminService.guardarDocumento(req.file);
	res.status(201).json({ success: true, message: 'Documento subido correctamente.', data });
});

const eliminarDocumento = asyncHandler(async (req, res) => {
	adminService.eliminarDocumento(req.params.id);
	res.status(200).json({ success: true, message: 'Documento eliminado correctamente.' });
});

const descargarDocumento = asyncHandler(async (req, res) => {
	const { ruta, nombreArchivo } = adminService.getRutaDocumento(req.params.id);
	res.download(ruta, nombreArchivo);
});

module.exports = {
	getDashboard,
	listTramites,
	getTramite,
	createTramite,
	updateTramite,
	deleteTramite,
	listCategorias,
	renombrarCategoria,
	eliminarCategoria,
	listExpedientes,
	getExpediente,
	aprobarExpediente,
	observarExpediente,
	rechazarExpediente,
	listDocumentos,
	subirDocumento,
	eliminarDocumento,
	descargarDocumento,
};
