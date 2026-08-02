/**
 * admin.service.js
 * Lógica de negocio del panel administrativo TUPA Digital.
 * Reescrito sobre tu esquema real (tupa_unsaac) usando mysql2 puro,
 * con el mismo estilo que ya usas en authService.js
 * (pool.execute, crearError(status, message), normalizarTexto).
 *
 * AJUSTA esta línea a donde definas tu pool real (la misma instancia
 * que usa tu authService.js):
 */
const pool = require('../../config/db'); // <-- cambia la ruta si tu pool vive en otro archivo

// ---------------------------------------------------------------------------
// Helpers (mismo estilo que tu authService.js)
// ---------------------------------------------------------------------------
const normalizarTexto = (value) => String(value ?? '').trim();

const crearError = (status, message) => {
	const error = new Error(message);
	error.status = status;
	return error;
};

const createDbDependencyError = () => crearError(500, 'No hay conexión configurada con la base de datos.');

// Mapea el estado de negocio (lo que ve el admin) al ENUM real de
// movimientos_expediente: enviado | recibido | en_proceso | finalizado | observado
// El ENUM no tiene 'aprobado' ni 'rechazado', así que:
//   Aprobar   -> 'finalizado'
//   Observar  -> 'observado'
//   Rechazar  -> 'observado' + prefijo "[RECHAZADO]" en observaciones
const ACCION_A_ESTADO_MOVIMIENTO = {
	aprobar: 'finalizado',
	observar: 'observado',
	rechazar: 'observado',
};

/** Traduce el estado crudo del último movimiento a una etiqueta legible para el admin. */
function estadoParaAdmin(movimiento) {
	if (!movimiento) return 'Sin movimientos';
	if (movimiento.estado === 'observado' && movimiento.observaciones?.startsWith('[RECHAZADO]')) {
		return 'Rechazado';
	}
	const labels = {
		enviado: 'Iniciado',
		recibido: 'En revisión',
		en_proceso: 'En revisión',
		finalizado: 'Aprobado',
		observado: 'Observado',
		rechazado: 'Rechazado',
	};
	return labels[movimiento.estado] || movimiento.estado;
}

// ---------------------------------------------------------------------------
// Trámites (catálogo TUPA) — tabla real: tramites
// ---------------------------------------------------------------------------
async function getTramites({ search, categoria } = {}) {
	if (!pool) throw createDbDependencyError();

	const condiciones = [];
	const params = [];

	if (search) {
		condiciones.push('t.nombre LIKE ?');
		params.push(`%${normalizarTexto(search)}%`);
	}
	if (categoria) {
		condiciones.push('t.categoria = ?');
		params.push(normalizarTexto(categoria));
	}

	const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

	const [rows] = await pool.execute(
		`SELECT t.id_tramite, t.codigo_tupa, t.nombre, t.descripcion, t.categoria, t.costo,
		        t.id_dependencia_destino, d.nombre AS dependencia_destino, t.tiempo, t.id_admin
		 FROM tramites t
		 LEFT JOIN dependencias d ON d.id_dependencia = t.id_dependencia_destino
		 ${where}
		 ORDER BY t.id_tramite DESC`,
		params
	);
	return rows;
}

async function getTramiteById(id) {
	if (!pool) throw createDbDependencyError();

	const [rows] = await pool.execute(
		`SELECT t.id_tramite, t.codigo_tupa, t.nombre, t.descripcion, t.categoria, t.costo,
		        t.id_dependencia_destino, d.nombre AS dependencia_destino, t.tiempo, t.id_admin
		 FROM tramites t
		 LEFT JOIN dependencias d ON d.id_dependencia = t.id_dependencia_destino
		 WHERE t.id_tramite = ?
		 LIMIT 1`,
		[id]
	);
	if (!rows[0]) throw crearError(404, 'Trámite no encontrado.');

	const [requisitos] = await pool.execute(
		`SELECT id_requisito, descripcion, obligatorio FROM requisitos_tramite WHERE id_tramite = ?`,
		[id]
	);
	return { ...rows[0], requisitos };
}

function validarTramite(data) {
	if (!normalizarTexto(data.codigo_tupa)) throw crearError(400, 'El código TUPA es obligatorio.');
	if (!normalizarTexto(data.nombre)) throw crearError(400, 'El nombre del trámite es obligatorio.');
	if (!data.id_dependencia_destino) throw crearError(400, 'La dependencia destino es obligatoria.');
	if (data.costo === undefined || data.costo === null || Number(data.costo) < 0) {
		throw crearError(400, 'El costo debe ser un número válido.');
	}
}

async function createTramite(data, idAdmin) {
	if (!pool) throw createDbDependencyError();
	validarTramite(data);

	const [result] = await pool.execute(
		`INSERT INTO tramites (codigo_tupa, nombre, descripcion, categoria, costo, id_dependencia_destino, tiempo, id_admin)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			normalizarTexto(data.codigo_tupa),
			normalizarTexto(data.nombre),
			data.descripcion || null,
			data.categoria || null,
			Number(data.costo),
			data.id_dependencia_destino,
			data.tiempo ?? null,
			idAdmin || null,
		]
	);
	return getTramiteById(result.insertId);
}

async function updateTramite(id, data) {
	if (!pool) throw createDbDependencyError();
	const existente = await getTramiteById(id); // valida existencia (lanza 404)
	validarTramite({ ...existente, ...data });

	await pool.execute(
		`UPDATE tramites
		 SET codigo_tupa = ?, nombre = ?, descripcion = ?, categoria = ?, costo = ?, id_dependencia_destino = ?, tiempo = ?
		 WHERE id_tramite = ?`,
		[
			normalizarTexto(data.codigo_tupa ?? existente.codigo_tupa),
			normalizarTexto(data.nombre ?? existente.nombre),
			data.descripcion ?? existente.descripcion,
			data.categoria ?? existente.categoria,
			Number(data.costo ?? existente.costo),
			data.id_dependencia_destino ?? existente.id_dependencia_destino,
			data.tiempo ?? existente.tiempo,
			id,
		]
	);
	return getTramiteById(id);
}

async function deleteTramite(id) {
	if (!pool) throw createDbDependencyError();
	const [result] = await pool.execute('DELETE FROM tramites WHERE id_tramite = ?', [id]);
	if (result.affectedRows === 0) throw crearError(404, 'Trámite no encontrado.');
	return { success: true };
}

// ---------------------------------------------------------------------------
// Categorías — NO existe tabla propia: son valores de tramites.categoria
// ---------------------------------------------------------------------------
async function getCategorias() {
	if (!pool) throw createDbDependencyError();
	const [rows] = await pool.execute(
		`SELECT categoria AS nombre, COUNT(*) AS tramitesAsociados
		 FROM tramites
		 WHERE categoria IS NOT NULL AND categoria <> ''
		 GROUP BY categoria
		 ORDER BY categoria ASC`
	);
	return rows;
}

async function renombrarCategoria(nombreActual, nombreNuevo) {
	if (!pool) throw createDbDependencyError();
	const actual = normalizarTexto(nombreActual);
	const nuevo = normalizarTexto(nombreNuevo);
	if (!actual || !nuevo) throw crearError(400, 'Debes indicar el nombre actual y el nuevo.');

	const [result] = await pool.execute('UPDATE tramites SET categoria = ? WHERE categoria = ?', [nuevo, actual]);
	return { success: true, tramitesActualizados: result.affectedRows };
}

async function eliminarCategoria(nombre) {
	if (!pool) throw createDbDependencyError();
	const actual = normalizarTexto(nombre);
	if (!actual) throw crearError(400, 'Debes indicar la categoría a eliminar.');

	const [result] = await pool.execute('UPDATE tramites SET categoria = NULL WHERE categoria = ?', [actual]);
	return { success: true, tramitesActualizados: result.affectedRows };
}

// ---------------------------------------------------------------------------
// Expedientes — tabla real: expedientes + estado derivado de movimientos_expediente
// ---------------------------------------------------------------------------
async function getExpedientes({ search, estado } = {}) {
	if (!pool) throw createDbDependencyError();

	const condiciones = [];
	const params = [];

	if (search) {
		condiciones.push('(e.numero_expediente LIKE ? OR t.nombre LIKE ? OR u.nombre_completo LIKE ?)');
		const q = `%${normalizarTexto(search)}%`;
		params.push(q, q, q);
	}

	const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

	// Último movimiento por expediente vía subconsulta correlacionada
	const [rows] = await pool.execute(
		`SELECT e.id_expediente, e.numero_expediente, e.asunto, e.fecha_registro,
		        t.nombre AS tramite, u.nombre_completo AS usuario_responsable,
		        m.estado AS estado_movimiento, m.observaciones, m.fecha_envio, m.fecha_recepcion
		 FROM expedientes e
		 JOIN tramites t ON t.id_tramite = e.id_tramite
		 JOIN usuarios u ON u.id_usuario = e.id_usuario
		 LEFT JOIN movimientos_expediente m
		        ON m.id_movimiento = (
		            SELECT m2.id_movimiento FROM movimientos_expediente m2
		            WHERE m2.id_expediente = e.id_expediente
		            ORDER BY m2.fecha_envio DESC, m2.id_movimiento DESC LIMIT 1
		        )
		 ${where}
		 ORDER BY e.fecha_registro DESC`,
		params
	);

	let expedientes = rows.map((r) => ({
		...r,
		estado: estadoParaAdmin(r.estado_movimiento ? { estado: r.estado_movimiento, observaciones: r.observaciones } : null),
	}));

	if (estado) {
		expedientes = expedientes.filter((e) => e.estado.toLowerCase() === normalizarTexto(estado).toLowerCase());
	}

	return expedientes;
}

async function getExpedienteById(id) {
	if (!pool) throw createDbDependencyError();

	const [rows] = await pool.execute(
		`SELECT e.id_expediente, e.numero_expediente, e.asunto, e.peticion, e.folios, e.fecha_registro,
		        t.nombre AS tramite, u.nombre_completo AS usuario_responsable, u.email AS usuario_email
		 FROM expedientes e
		 JOIN tramites t ON t.id_tramite = e.id_tramite
		 JOIN usuarios u ON u.id_usuario = e.id_usuario
		 WHERE e.id_expediente = ?
		 LIMIT 1`,
		[id]
	);
	if (!rows[0]) throw crearError(404, 'Expediente no encontrado.');

	const [movimientos] = await pool.execute(
		`SELECT id_movimiento, dependencia_origen, dependencia_destino, usuario_responsable,
		        fecha_envio, fecha_recepcion, estado, observaciones, id_admin
		 FROM movimientos_expediente
		 WHERE id_expediente = ?
		 ORDER BY fecha_envio DESC, id_movimiento DESC`,
		[id]
	);

	const ultimo = movimientos[0] || null;
	return { ...rows[0], estado: estadoParaAdmin(ultimo), movimientos };
}

/** Aprueba, observa o rechaza un expediente actualizando su ÚLTIMO movimiento existente. */
async function actualizarEstadoExpediente(idExpediente, accion, comentario, idAdmin) {
	if (!pool) throw createDbDependencyError();
	const nuevoEstado = ACCION_A_ESTADO_MOVIMIENTO[accion];
	if (!nuevoEstado) throw crearError(400, 'Acción de revisión no reconocida.');

	const [movimientos] = await pool.execute(
		`SELECT id_movimiento FROM movimientos_expediente
		 WHERE id_expediente = ? ORDER BY fecha_envio DESC, id_movimiento DESC LIMIT 1`,
		[idExpediente]
	);
	const ultimo = movimientos[0];
	if (!ultimo) {
		throw crearError(409, 'Este expediente aún no tiene un movimiento registrado para actualizar.');
	}

	const observacionFinal =
		accion === 'rechazar' && comentario
			? `[RECHAZADO] ${comentario}`
			: accion === 'rechazar'
			? '[RECHAZADO]'
			: comentario || null;

	await pool.execute(
		`UPDATE movimientos_expediente
		 SET estado = ?, observaciones = ?, id_admin = ?,
		     fecha_recepcion = CASE WHEN ? = 'finalizado' OR ? = 'observar' THEN NOW() ELSE fecha_recepcion END
		 WHERE id_movimiento = ?`,
		[nuevoEstado, observacionFinal, idAdmin || null, nuevoEstado, accion, ultimo.id_movimiento]
	);

	return getExpedienteById(idExpediente);
}

const aprobarExpediente = (id, comentario, idAdmin) => actualizarEstadoExpediente(id, 'aprobar', comentario, idAdmin);
const observarExpediente = (id, comentario, idAdmin) => actualizarEstadoExpediente(id, 'observar', comentario, idAdmin);
const rechazarExpediente = (id, comentario, idAdmin) => actualizarEstadoExpediente(id, 'rechazar', comentario, idAdmin);

// ---------------------------------------------------------------------------
// Dashboard — agregados sobre expedientes + movimientos_expediente reales
// ---------------------------------------------------------------------------
async function getDashboardMetrics() {
	if (!pool) throw createDbDependencyError();

	const [[{ total }]] = await pool.execute('SELECT COUNT(*) AS total FROM expedientes');

	const [[{ aprobados }]] = await pool.execute(
		`SELECT COUNT(*) AS aprobados FROM movimientos_expediente m
		 WHERE m.estado = 'finalizado'
		 AND m.id_movimiento = (SELECT id_movimiento FROM movimientos_expediente m2 WHERE m2.id_expediente = m.id_expediente ORDER BY fecha_envio DESC LIMIT 1)`
	);

	const [[{ pendientes }]] = await pool.execute(
		`SELECT COUNT(*) AS pendientes FROM expedientes e
		 WHERE NOT EXISTS (
		   SELECT 1 FROM movimientos_expediente m WHERE m.id_expediente = e.id_expediente AND m.estado = 'finalizado'
		 )`
	);

	return {
		totalTramites: total,
		tramitesAprobados: aprobados,
		pendientesRevision: pendientes,
	};
}

// ---------------------------------------------------------------------------
// Gestión Documental — SIN tabla propia: se maneja por filesystem
// ---------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const DOCS_DIR = path.join(__dirname, '../../../uploads/admin-documentos');

function tipoPorExtension(ext) {
	if (ext === '.pdf') return 'PDF';
	if (['.mp4', '.mov', '.avi'].includes(ext)) return 'Video';
	return 'DOC';
}

function getDocumentos() {
	if (!fs.existsSync(DOCS_DIR)) return [];
	return fs.readdirSync(DOCS_DIR).map((nombre) => {
		const stats = fs.statSync(path.join(DOCS_DIR, nombre));
		return {
			id: encodeURIComponent(nombre),
			nombre,
			tipo: tipoPorExtension(path.extname(nombre).toLowerCase()),
			tamano: stats.size,
			fecha: stats.mtime.toISOString().slice(0, 10),
		};
	});
}

function guardarDocumento(file) {
	if (!file) throw crearError(400, 'No se recibió ningún archivo.');
	// multer ya lo dejó en DOCS_DIR (ver admin.routes.js); solo devolvemos su info
	const stats = fs.statSync(file.path);
	return {
		id: encodeURIComponent(file.filename),
		nombre: file.originalname,
		tipo: tipoPorExtension(path.extname(file.originalname).toLowerCase()),
		tamano: stats.size,
		fecha: new Date().toISOString().slice(0, 10),
	};
}

function eliminarDocumento(id) {
	const nombreArchivo = decodeURIComponent(id);
	const ruta = path.join(DOCS_DIR, nombreArchivo);
	if (!fs.existsSync(ruta)) throw crearError(404, 'Documento no encontrado.');
	fs.unlinkSync(ruta);
	return { success: true };
}

function getRutaDocumento(id) {
	const nombreArchivo = decodeURIComponent(id);
	const ruta = path.join(DOCS_DIR, nombreArchivo);
	if (!fs.existsSync(ruta)) throw crearError(404, 'Documento no encontrado.');
	return { ruta, nombreArchivo };
}

module.exports = {
	getTramites,
	getTramiteById,
	createTramite,
	updateTramite,
	deleteTramite,
	getCategorias,
	renombrarCategoria,
	eliminarCategoria,
	getExpedientes,
	getExpedienteById,
	aprobarExpediente,
	observarExpediente,
	rechazarExpediente,
	getDashboardMetrics,
	getDocumentos,
	guardarDocumento,
	eliminarDocumento,
	getRutaDocumento,
	DOCS_DIR,
};
