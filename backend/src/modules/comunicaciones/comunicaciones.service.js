const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const pool = require('../../config/db');

const CATEGORIAS_PERMITIDAS = new Set(['Reclamo', 'Consulta', 'Ayuda']);
const UPLOADS_ROOT = path.join(__dirname, '..', '..', '..', 'uploads', 'comunicaciones');

const crearError = (status, message) => {
	const error = new Error(message);
	error.status = status;
	return error;
};

const normalizarTexto = (value) => String(value ?? '').trim();
const esCorreo = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const asegurarTablas = async () => {
	await pool.execute(`
		CREATE TABLE IF NOT EXISTS comunicaciones_adjuntos (
			id_adjunto INT AUTO_INCREMENT PRIMARY KEY,
			id_comunicacion INT NOT NULL,
			nombre_archivo VARCHAR(255) NOT NULL,
			ruta_archivo VARCHAR(500) NOT NULL,
			tipo_mime VARCHAR(120),
			tamano_bytes INT NOT NULL DEFAULT 0,
			creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (id_comunicacion) REFERENCES comunicaciones(id_comunicacion) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
	`);
};

const asegurarDirectorioUploads = async () => {
	await fs.mkdir(UPLOADS_ROOT, { recursive: true });
};

const guardarArchivos = async (idComunicacion, archivos = []) => {
	if (!Array.isArray(archivos) || archivos.length === 0) {
		return [];
	}

	await asegurarDirectorioUploads();
	await asegurarTablas();

	const adjuntos = [];
	for (const archivo of archivos) {
		if (!archivo?.buffer || !archivo?.originalname) {
			continue;
		}

		const extension = path.extname(archivo.originalname || '').replace('.', '').toLowerCase();
		const nombreSeguro = `${Date.now()}-${crypto.randomUUID()}${extension ? `.${extension}` : ''}`;
		const rutaAbsoluta = path.join(UPLOADS_ROOT, nombreSeguro);
		await fs.writeFile(rutaAbsoluta, archivo.buffer);

		const rutaArchivo = `/uploads/comunicaciones/${nombreSeguro}`;
		await pool.execute(
			`INSERT INTO comunicaciones_adjuntos (id_comunicacion, nombre_archivo, ruta_archivo, tipo_mime, tamano_bytes)
			 VALUES (?, ?, ?, ?, ?)`,
			[idComunicacion, archivo.originalname, rutaArchivo, archivo.mimetype || null, archivo.size || 0],
		);

		adjuntos.push({
			id: null,
			nombreArchivo: archivo.originalname,
			rutaArchivo,
			tipoMime: archivo.mimetype || null,
			tamanoBytes: archivo.size || 0,
		});
	}

	return adjuntos;
};

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

	await asegurarTablas();
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

	const archivos = await guardarArchivos(result.insertId, data.archivos || []);

	const [[comunicacion]] = await pool.execute(
		`SELECT id_comunicacion, categoria, nombre_completo, correo, telefono, servicio_relacionado, asunto, mensaje, estado, fecha_registro
		 FROM comunicaciones WHERE id_comunicacion = ?`,
		[result.insertId],
	);

	return {
		id: comunicacion.id_comunicacion,
		categoria: comunicacion.categoria,
		nombreCompleto: comunicacion.nombre_completo,
		correo: comunicacion.correo,
		telefono: comunicacion.telefono,
		servicioRelacionado: comunicacion.servicio_relacionado,
		asunto: comunicacion.asunto,
		mensaje: comunicacion.mensaje,
		estado: comunicacion.estado,
		fechaRegistro: comunicacion.fecha_registro,
		archivos,
	};
};

module.exports = { registrarComunicacion };
