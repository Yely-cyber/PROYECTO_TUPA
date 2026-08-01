const comunicacionesService = require('./comunicaciones.service');

const registrarComunicacion = async (req, res) => {
	try {
		const comunicacion = await comunicacionesService.registrarComunicacion(req.body);
		return res.status(201).json({
			success: true,
			message: 'Comunicación registrada correctamente.',
			comunicacion,
		});
	} catch (error) {
		return res.status(error.status || 500).json({
			success: false,
			message: error.message || 'Error interno del servidor.',
		});
	}
};

module.exports = { registrarComunicacion };
