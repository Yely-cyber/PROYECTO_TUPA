const authService = require('./auth.service');

const enviarError = (res, error) => {
	const status = error.statusCode || error.status || 500;
	return res.status(status).json({
		success: false,
		message: error.message || 'Error interno del servidor',
		errors: error.errors || null,
	});
};

const obtenerPerfiles = (_req, res) => {
	return res.json({
		success: true,
		profiles: authService.obtenerPerfilesAutenticacion(),
	});
};

const guardarPasoRegistro = async (req, res) => {
	try {
		const result = await authService.guardarPasoRegistro(req.body || {});

		return res.status(result.created ? 201 : 200).json({
			success: true,
			message: 'Paso guardado correctamente.',
			registration: result.registration,
		});
	} catch (error) {
		return enviarError(res, error);
	}
};

const completarRegistro = async (req, res) => {
	try {
		const result = await authService.completarRegistro(req.body || {});

		return res.status(200).json({
			success: true,
			message: 'Registro completado correctamente.',
			registration: result.registration,
		});
	} catch (error) {
		return enviarError(res, error);
	}
};

const obtenerRegistroPorId = async (req, res) => {
	try {
		const registration = await authService.obtenerRegistroPorId(req.params.registrationId);

		return res.status(200).json({
			success: true,
			registration,
		});
	} catch (error) {
		return enviarError(res, error);
	}
};

const iniciarSesionAdministrador = async (req, res) => {
	try {
		const result = await authService.iniciarSesionAdministrador(req.body || {});

		return res.status(200).json({
			success: true,
			message: 'Inicio de sesión correcto.',
			session: result.session,
		});
	} catch (error) {
		return enviarError(res, error);
	}
};

module.exports = {
	obtenerPerfiles,
	guardarPasoRegistro,
	completarRegistro,
	obtenerRegistroPorId,
	iniciarSesionAdministrador,
};
