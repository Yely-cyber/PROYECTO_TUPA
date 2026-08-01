const pool = require('../../config/db');

const CATEGORIAS_PERMITIDAS = new Set(['Reclamo', 'Consulta', 'Ayuda']);

const crearError = (status, message) => {
	const error = new Error(message);
	error.status = status;
	return error;
};

const normalizarTexto = (value) => String(value ?? '').trim();
const esCorreo = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const registrarComunicacion = async (data = {}) => {
	const categoria = normalizarTexto(data.categoria);
	const nombreCompleto = normalizarTexto(data.nombreCompleto);
	const correo = normalizarTexto(data.correo).toLowerCase();
	const mensaje = normalizarTexto(data.mensaje);

	if (!CATEGORIAS_PERMITIDAS.has(categoria)) {
		throw crearError(400, 'La categoría debe ser Reclamo, Consulta o Ayuda.');
	}
	if (!nombreCompleto || !correo || !mensaje) {
		throw crearError(400, 'Nombre, correo y mensaje son obligatorios.');
	}
	if (!esCorreo(correo)) {
		throw crearError(400, 'El correo electrónico no es válido.');
	}

	const [result] = await pool.execute(
		`INSERT INTO comunicaciones
		   (categoria, nombre_completo, correo, telefono, servicio_relacionado, asunto, mensaje)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[
			categoria,
			nombreCompleto,
			correo,
			normalizarTexto(data.telefono) || null,
			normalizarTexto(data.servicioRelacionado) || null,
			normalizarTexto(data.asunto) || null,
			mensaje,
		],
	);

	const [[comunicacion]] = await pool.execute(
		`SELECT id_comunicacion, categoria, estado, fecha_registro
		 FROM comunicaciones WHERE id_comunicacion = ?`,
		[result.insertId],
	);
	return comunicacion;
};

module.exports = { registrarComunicacion };
