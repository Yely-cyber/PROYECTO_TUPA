const fs = require('fs/promises');
const path = require('path');
const pool = require('../../config/db');

const UPLOADS_ROOT = path.join(__dirname, '..', '..', '..', 'uploads', 'expedientes');

const crearError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

// Mismo vocabulario que usuarios.tipo_usuario / perfil_objetivo (ver
// auth.service.js -> perfilPorTipoUsuario). Se duplica aquí a propósito
// para mantener los módulos desacoplados, tal como pide el README.
const TIPO_USUARIO_POR_PERFIL = {
	estudiante: 'estudiante',
	docente: 'docente',
	dependencia: 'administrativo',
	institucion: 'institucional',
	general: 'general',
	externo: 'externo',
};

const normalizarPerfil = (perfilFrontend) => {
	const tipoUsuario = TIPO_USUARIO_POR_PERFIL[String(perfilFrontend || '').toLowerCase()];
	if (!tipoUsuario) {
		throw crearError(400, 'Perfil no válido.');
	}
	return tipoUsuario;
};

const mapearTramite = (fila) => ({
	id: fila.id_tramite,
	codigoTupa: fila.codigo_tupa,
	nombre: fila.nombre,
	descripcion: fila.descripcion,
	categoria: fila.categoria,
	costo: Number(fila.costo),
	tiempoEstimado: fila.tiempo,
	dependenciaDestino: fila.dependencia_destino,
	perfil: fila.perfil_objetivo,
});

const obtenerCategorias = async (perfilFrontend) => {
	const tipoUsuario = normalizarPerfil(perfilFrontend);

	const [filas] = await pool.execute(
		`SELECT DISTINCT categoria
		 FROM tramites
		 WHERE perfil_objetivo = ?
		 ORDER BY categoria ASC`,
		[tipoUsuario],
	);

	return filas.map((fila) => fila.categoria);
};

const obtenerTramites = async ({ perfil, categoria, search }) => {
	const tipoUsuario = normalizarPerfil(perfil);

	const condiciones = ['t.perfil_objetivo = ?'];
	const parametros = [tipoUsuario];

	if (categoria && categoria.toUpperCase() !== 'TODOS') {
		condiciones.push('t.categoria = ?');
		parametros.push(categoria);
	}

	if (search) {
		condiciones.push('(t.nombre LIKE ? OR t.descripcion LIKE ?)');
		const termino = `%${search}%`;
		parametros.push(termino, termino);
	}

	const [filas] = await pool.execute(
		`SELECT t.id_tramite, t.codigo_tupa, t.nombre, t.descripcion, t.categoria,
		        t.costo, t.tiempo, t.perfil_objetivo, d.nombre AS dependencia_destino
		 FROM tramites t
		 JOIN dependencias d ON d.id_dependencia = t.id_dependencia_destino
		 WHERE ${condiciones.join(' AND ')}
		 ORDER BY t.categoria ASC, t.nombre ASC`,
		parametros,
	);

	return filas.map(mapearTramite);
};

const obtenerTramitePorId = async (idTramite) => {
	const [filas] = await pool.execute(
		`SELECT t.id_tramite, t.codigo_tupa, t.nombre, t.descripcion, t.categoria,
		        t.costo, t.tiempo, t.perfil_objetivo, d.nombre AS dependencia_destino
		 FROM tramites t
		 JOIN dependencias d ON d.id_dependencia = t.id_dependencia_destino
		 WHERE t.id_tramite = ?
		 LIMIT 1`,
		[idTramite],
	);

	const tramite = filas[0];
	if (!tramite) {
		throw crearError(404, 'Trámite no encontrado.');
	}

	const [requisitos] = await pool.execute(
		`SELECT id_requisito, descripcion, obligatorio
		 FROM requisitos_tramite
		 WHERE id_tramite = ?
		 ORDER BY id_requisito ASC`,
		[idTramite],
	);

	return {
		...mapearTramite(tramite),
		requisitos: requisitos.map((requisito) => ({
			id: requisito.id_requisito,
			descripcion: requisito.descripcion,
			obligatorio: Boolean(requisito.obligatorio),
		})),
	};
};

// ─────────────────────────────────────────────────────────────────
// Crear expediente (envío del formulario "Nuevo Trámite")
// ─────────────────────────────────────────────────────────────────

const EXTENSION_A_TIPO_DOCUMENTO = {
	pdf: 'pdf',
	jpg: 'imagen',
	jpeg: 'imagen',
	png: 'imagen',
	gif: 'imagen',
	webp: 'imagen',
	doc: 'word',
	docx: 'word',
	xls: 'excel',
	xlsx: 'excel',
};

const obtenerTipoDocumentoPorExtension = (extension) =>
	EXTENSION_A_TIPO_DOCUMENTO[String(extension).toLowerCase()] || 'otro';

// El frontend guarda `email` en la sesión local para todos los perfiles
// (es el único campo común a los 6 formularios de registro). Se usa para
// resolver el id_usuario real sin que catalog tenga que conocer nada más
// de cómo auth maneja la sesión.
const obtenerUsuarioIdPorEmail = async (conexion, email) => {
	const correo = String(email || '').trim().toLowerCase();
	if (!correo) {
		throw crearError(400, 'Debes indicar el correo del usuario que envía el trámite.');
	}

	const [filas] = await conexion.execute('SELECT id_usuario FROM usuarios WHERE LOWER(email) = ? LIMIT 1', [correo]);

	if (!filas[0]) {
		throw crearError(
			404,
			'No se encontró un usuario registrado con ese correo. Verifica que el registro se haya guardado en la base de datos.',
		);
	}

	return filas[0].id_usuario;
};

const generarNumeroExpediente = async (conexion) => {
	const anio = new Date().getFullYear();
	const [filas] = await conexion.execute('SELECT COUNT(*) AS total FROM expedientes WHERE numero_expediente LIKE ?', [
		`${anio}-%`,
	]);

	const siguiente = Number(filas[0].total) + 1;
	return `${anio}-${String(siguiente).padStart(6, '0')}`;
};

const crearExpediente = async ({ tramiteId, email, peticion, codigoPago, idTipoDocumento, archivos = [] }) => {
	const idTramite = Number(tramiteId);
	if (!Number.isInteger(idTramite)) {
		throw crearError(400, 'Debes indicar el trámite solicitado.');
	}

	if (!String(peticion || '').trim()) {
		throw crearError(400, 'Debes describir tu petición.');
	}

	if (!String(codigoPago || '').trim()) {
		throw crearError(400, 'Debes ingresar el código de pago.');
	}

	const conexion = await pool.getConnection();
	const rutasEscritas = [];

	try {
		await conexion.beginTransaction();

		const idUsuario = await obtenerUsuarioIdPorEmail(conexion, email);

		const [tramiteFilas] = await conexion.execute(
			'SELECT id_tramite, nombre, costo, id_dependencia_destino FROM tramites WHERE id_tramite = ? LIMIT 1',
			[idTramite],
		);
		const tramite = tramiteFilas[0];
		if (!tramite) {
			throw crearError(404, 'El trámite solicitado no existe.');
		}

		const numeroExpediente = await generarNumeroExpediente(conexion);

		const [resultadoExpediente] = await conexion.execute(
			`INSERT INTO expedientes
			   (numero_expediente, id_usuario, id_tramite, id_tipo_documento, asunto, peticion, folios, codigo_pago)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				numeroExpediente,
				idUsuario,
				tramite.id_tramite,
				Number(idTipoDocumento) || 1,
				tramite.nombre,
				String(peticion).trim(),
				archivos.length,
				String(codigoPago).trim(),
			],
		);
		const idExpediente = resultadoExpediente.insertId;

		const carpetaExpediente = path.join(UPLOADS_ROOT, String(idExpediente));
		if (archivos.length > 0) {
			await fs.mkdir(carpetaExpediente, { recursive: true });
		}

		for (const archivo of archivos) {
			const extension = path.extname(archivo.originalname).replace('.', '').toLowerCase();
			const nombreSeguro = `${Date.now()}-${archivo.originalname}`.replace(/[^\w.\-]/g, '_');
			const rutaAbsoluta = path.join(carpetaExpediente, nombreSeguro);
			const rutaPublica = `/uploads/expedientes/${idExpediente}/${nombreSeguro}`;

			await fs.writeFile(rutaAbsoluta, archivo.buffer);
			rutasEscritas.push(rutaAbsoluta);

			await conexion.execute(
				`INSERT INTO documentos_adjuntos (id_expediente, nombre_archivo, ruta_archivo, extension, tamano_mb, tipo_documento)
				 VALUES (?, ?, ?, ?, ?, ?)`,
				[
					idExpediente,
					archivo.originalname,
					rutaPublica,
					extension || null,
					Number((archivo.size / (1024 * 1024)).toFixed(2)),
					obtenerTipoDocumentoPorExtension(extension),
				],
			);
		}

		const estadoPago = Number(tramite.costo) > 0 ? 'pendiente' : 'pagado';
		await conexion.execute('INSERT INTO pagos (id_expediente, codigo_pago, monto, estado) VALUES (?, ?, ?, ?)', [
			idExpediente,
			String(codigoPago).trim(),
			tramite.costo,
			estadoPago,
		]);

		// Movimiento inicial: Mesa de Partes (dependencia 1) envía el
		// expediente hacia la dependencia destino del trámite. Este es el
		// único punto donde `catalog` escribe en una tabla que en adelante
		// le pertenece a `tracking` (Desarrollador 3) — solo para que el
		// expediente nazca con un estado visible ("enviado"); el resto del
		// ciclo de vida (recibido, en_proceso, finalizado, observado) lo
		// gestiona el módulo tracking.
		await conexion.execute(
			`INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, estado)
			 VALUES (?, 1, ?, 'enviado')`,
			[idExpediente, tramite.id_dependencia_destino],
		);

		await conexion.commit();

		return {
			id: idExpediente,
			numeroExpediente,
			tramite: { id: tramite.id_tramite, nombre: tramite.nombre },
			estado: 'enviado',
			codigoPago: String(codigoPago).trim(),
			archivosGuardados: archivos.length,
		};
	} catch (error) {
		await conexion.rollback();
		await Promise.all(rutasEscritas.map((ruta) => fs.unlink(ruta).catch(() => {})));
		throw error;
	} finally {
		conexion.release();
	}
};

module.exports = {
	obtenerCategorias,
	obtenerTramites,
	obtenerTramitePorId,
	crearExpediente,
	crearError,
};