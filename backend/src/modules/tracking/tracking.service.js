const pool = require('../../config/db');

const crearError = (status, message) => {
	const error = new Error(message);
	error.status = status;
	return error;
};

const normalizarEmail = (email) => String(email || '').trim().toLowerCase();

const validarEmail = (email) => {
	const correo = normalizarEmail(email);
	if (!correo) throw crearError(400, 'Debes indicar el correo del usuario.');
	return correo;
};

const listarExpedientesUsuario = async (email) => {
	const correo = validarEmail(email);
	const [rows] = await pool.execute(
		`SELECT e.id_expediente, e.numero_expediente, e.asunto, e.fecha_registro,
		        t.nombre AS tramite, m.estado, m.observaciones, m.fecha_envio, m.fecha_recepcion
		 FROM expedientes e
		 JOIN usuarios u ON u.id_usuario = e.id_usuario
		 JOIN tramites t ON t.id_tramite = e.id_tramite
		 LEFT JOIN movimientos_expediente m ON m.id_movimiento = (
		   SELECT m2.id_movimiento FROM movimientos_expediente m2
		   WHERE m2.id_expediente = e.id_expediente
		   ORDER BY m2.fecha_envio DESC, m2.id_movimiento DESC LIMIT 1
		 )
		 WHERE LOWER(u.email) = ?
		 ORDER BY e.fecha_registro DESC`,
		[correo],
	);
	return rows;
};

const obtenerExpedienteUsuario = async (numeroExpediente, email) => {
	const correo = validarEmail(email);
	const [rows] = await pool.execute(
		`SELECT e.id_expediente, e.numero_expediente, e.asunto, e.peticion, e.fecha_registro,
		        t.nombre AS tramite
		 FROM expedientes e
		 JOIN usuarios u ON u.id_usuario = e.id_usuario
		 JOIN tramites t ON t.id_tramite = e.id_tramite
		 WHERE e.numero_expediente = ? AND LOWER(u.email) = ? LIMIT 1`,
		[numeroExpediente, correo],
	);
	if (!rows[0]) throw crearError(404, 'Expediente no encontrado.');

	const [movimientos] = await pool.execute(
		`SELECT id_movimiento, estado, observaciones, fecha_envio, fecha_recepcion
		 FROM movimientos_expediente
		 WHERE id_expediente = ?
		 ORDER BY fecha_envio ASC, id_movimiento ASC`,
		[rows[0].id_expediente],
	);

	return { ...rows[0], movimientos };
};

module.exports = { listarExpedientesUsuario, obtenerExpedienteUsuario };
