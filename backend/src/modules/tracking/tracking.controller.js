const trackingService = require('./tracking.service');

const enviarError = (res, error) =>
	res.status(error.status || 500).json({ success: false, message: error.message || 'Error interno del servidor.' });

const listarExpedientes = async (req, res) => {
	try {
		const expedientes = await trackingService.listarExpedientesUsuario(req.query.email);
		return res.json({ success: true, expedientes });
	} catch (error) {
		return enviarError(res, error);
	}
};

const obtenerExpediente = async (req, res) => {
	try {
		const expediente = await trackingService.obtenerExpedienteUsuario(req.params.numeroExpediente, req.query.email);
		return res.json({ success: true, expediente });
	} catch (error) {
		return enviarError(res, error);
	}
};

module.exports = { listarExpedientes, obtenerExpediente };
