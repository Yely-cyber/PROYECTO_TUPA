const catalogService = require('./catalog.service');

const enviarError = (res, error) => {
	const status = error.statusCode || error.status || 500;
	return res.status(status).json({
		success: false,
		message: error.message || 'Error interno del servidor',
	});
};

const listarCategorias = async (req, res) => {
	try {
		const categorias = await catalogService.obtenerCategorias(req.query.perfil);
		return res.json({ success: true, categorias });
	} catch (error) {
		return enviarError(res, error);
	}
};

const listarTramites = async (req, res) => {
	try {
		const tramites = await catalogService.obtenerTramites({
			perfil: req.query.perfil,
			categoria: req.query.categoria,
			search: req.query.search,
		});

		return res.json({ success: true, tramites });
	} catch (error) {
		return enviarError(res, error);
	}
};

const obtenerTramite = async (req, res) => {
	try {
		const tramite = await catalogService.obtenerTramitePorId(req.params.id);
		return res.json({ success: true, tramite });
	} catch (error) {
		return enviarError(res, error);
	}
};

const crearExpediente = async (req, res) => {
	try {
		const expediente = await catalogService.crearExpediente({
			tramiteId: req.body.tramiteId,
			email: req.body.email,
			peticion: req.body.peticion,
			codigoPago: req.body.codigoPago,
			idTipoDocumento: req.body.idTipoDocumento,
			archivos: req.files || [],
		});

		return res.status(201).json({
			success: true,
			message: 'Trámite enviado correctamente.',
			expediente,
		});
	} catch (error) {
		return enviarError(res, error);
	}
};

module.exports = {
	listarCategorias,
	listarTramites,
	obtenerTramite,
	crearExpediente,
};