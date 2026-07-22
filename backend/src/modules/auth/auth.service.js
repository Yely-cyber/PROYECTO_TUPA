const crypto = require('crypto');

let mysql = null;
try {
	mysql = require('mysql2/promise');
} catch (error) {
	mysql = null;
}

const {
	DB_HOST = 'localhost',
	DB_PORT = '3306',
	DB_USER = 'root',
	DB_PASSWORD = '',
	DB_NAME = 'tupa_unsaac',
	AUTH_ADMIN_USER = 'admin',
	AUTH_ADMIN_PASSWORD = 'admin123',
} = process.env;

const createDbDependencyError = () => {
	const error = new Error('Falta instalar la dependencia mysql2 en backend. Ejecuta npm install dentro de la carpeta backend.');
	error.statusCode = 500;
	return error;
};

const pool = mysql
	? mysql.createPool({
		host: DB_HOST,
		port: Number(DB_PORT),
		user: DB_USER,
		password: String(DB_PASSWORD).trim(),
		database: DB_NAME,
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
	})
	: null;

const PROFILE_SCHEMAS = {
	estudiante: {
		label: 'Estudiante',
		fields: {
			codigo: { required: true, type: 'code' },
			nombre_completo: { required: true, type: 'text' },
			facultad: { required: true, type: 'text' },
			carrera_profesional: { required: true, type: 'text' },
			telefono: { required: true, type: 'phone' },
			direccion: { required: true, type: 'text' },
			email: { required: true, type: 'email' },
		},
	},
	docente: {
		label: 'Docente',
		fields: {
			dni: { required: true, type: 'dni' },
			nombre_completo: { required: true, type: 'text' },
			categoria: { required: true, type: 'text' },
			dependencia: { required: true, type: 'text' },
			telefono: { required: true, type: 'phone' },
			direccion: { required: true, type: 'text' },
			email: { required: true, type: 'email' },
		},
	},
	dependencia: {
		label: 'Dependencia',
		fields: {
			dependencia: { required: true, type: 'text' },
			telefono: { required: true, type: 'phone' },
			email: { required: true, type: 'email' },
		},
	},
	institucion: {
		label: 'Institución',
		fields: {
			ruc: { required: true, type: 'ruc' },
			entidad: { required: true, type: 'text' },
			telefono: { required: true, type: 'phone' },
			direccion: { required: true, type: 'text' },
			email: { required: true, type: 'email' },
		},
	},
	general: {
		label: 'Público General',
		fields: {
			dni: { required: true, type: 'dni' },
			nombre_completo: { required: true, type: 'text' },
			telefono: { required: true, type: 'phone' },
			direccion: { required: true, type: 'text' },
			email: { required: true, type: 'email' },
		},
	},
	externo: {
		label: 'Usuario Externo',
		fields: {
			documento: { required: true, type: 'document' },
			nombres: { required: true, type: 'text' },
			telefono: { required: true, type: 'phone' },
			direccion: { required: true, type: 'text' },
			email: { required: true, type: 'email' },
		},
	},
};

const normalizarTexto = (value) => String(value ?? '').trim();

const esCorreo = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(normalizarTexto(value));
const esTelefono = (value) => /^\+?[0-9\s()-]{7,20}$/.test(normalizarTexto(value));
const esDni = (value) => /^\d{8}$/.test(normalizarTexto(value));
const esRuc = (value) => /^\d{11}$/.test(normalizarTexto(value));
const esCodigo = (value) => /^[A-Za-z0-9-]{3,20}$/.test(normalizarTexto(value));
const esDocumento = (value) => esDni(value) || /^[A-Z0-9-]{6,20}$/i.test(normalizarTexto(value));

const validadores = {
	text: (value) => normalizarTexto(value).length > 0,
	email: esCorreo,
	phone: esTelefono,
	dni: esDni,
	ruc: esRuc,
	code: esCodigo,
	document: esDocumento,
};

const perfilPorTipoUsuario = {
	estudiante: 'estudiante',
	docente: 'docente',
	dependencia: 'administrativo',
	institucion: 'institucional',
	general: 'general',
	externo: 'externo',
};

const crearError = (statusCode, message, errors = null) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	error.errors = errors;
	return error;
};

const normalizarPerfil = (profile) => {
	const profileKey = normalizarTexto(profile).toLowerCase();
	if (!PROFILE_SCHEMAS[profileKey]) {
		throw crearError(400, 'Perfil no válido.');
	}
	return profileKey;
};

const normalizarCarga = (payload = {}) => {
	return Object.entries(payload).reduce((accumulator, [key, value]) => {
		if (typeof value === 'string') {
			accumulator[key] = value.trim();
			return accumulator;
		}

		accumulator[key] = value;
		return accumulator;
	}, {});
};

const validarCargaPerfil = (profileKey, payload, { parcial = false } = {}) => {
	const schema = PROFILE_SCHEMAS[profileKey];
	const errors = {};

	Object.entries(schema.fields).forEach(([fieldName, rules]) => {
		const currentValue = payload[fieldName];
		const hasValue = normalizarTexto(currentValue).length > 0;

		if (!parcial && rules.required && !hasValue) {
			errors[fieldName] = 'Este campo es obligatorio.';
			return;
		}

		if (!hasValue) {
			return;
		}

		const validator = validadores[rules.type] || validadores.text;
		if (!validator(currentValue)) {
			errors[fieldName] = 'El valor ingresado no es válido.';
		}
	});

	return errors;
};

const construirRespuestaRegistro = (registration) => {
	return {
		id: registration.id,
		profile: registration.profile,
		status: registration.status,
		stepKey: registration.stepKey,
		payload: registration.payload,
		createdAt: registration.createdAt,
		updatedAt: registration.updatedAt,
		completedAt: registration.completedAt || null,
	};
};

const obtenerConexion = async () => {
	if (!pool) {
		throw createDbDependencyError();
	}

	return pool.getConnection();
};

const obtenerOCrearDependencia = async (conexion, nombre) => {
	const nombreNormalizado = normalizarTexto(nombre);
	const [filas] = await conexion.execute('SELECT id_dependencia FROM dependencias WHERE nombre = ?', [nombreNormalizado]);
	if (filas.length > 0) {
		return filas[0].id_dependencia;
	}

	const [resultado] = await conexion.execute('INSERT INTO dependencias (nombre) VALUES (?)', [nombreNormalizado]);
	return resultado.insertId;
};

const generarIdEscuela = () => `ESC${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

const obtenerOCrearFacultad = async (conexion, nombre) => {
	const nombreNormalizado = normalizarTexto(nombre);
	const [filas] = await conexion.execute('SELECT id_facultad FROM facultades WHERE nombre = ?', [nombreNormalizado]);
	if (filas.length > 0) {
		return filas[0].id_facultad;
	}

	const [resultado] = await conexion.execute('INSERT INTO facultades (nombre) VALUES (?)', [nombreNormalizado]);
	return resultado.insertId;
};

const obtenerOCrearEscuela = async (conexion, nombre, idFacultad) => {
	const nombreNormalizado = normalizarTexto(nombre);
	const [filas] = await conexion.execute(
		'SELECT id_escuela FROM escuelas WHERE nombre = ? AND id_facultad = ?',
		[nombreNormalizado, idFacultad],
	);
	if (filas.length > 0) {
		return filas[0].id_escuela;
	}

	const idEscuela = generarIdEscuela();
	await conexion.execute('INSERT INTO escuelas (id_escuela, id_facultad, nombre) VALUES (?, ?, ?)', [idEscuela, idFacultad, nombreNormalizado]);
	return idEscuela;
};

const crearUsuarioBase = async (conexion, tipoUsuario, datos) => {
	const [resultado] = await conexion.execute(
		'INSERT INTO usuarios (tipo_usuario, nombre_completo, email, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
		[
			tipoUsuario,
			normalizarTexto(datos.nombre_completo || datos.nombres),
			normalizarTexto(datos.email),
			normalizarTexto(datos.telefono),
			normalizarTexto(datos.direccion),
		],
	);
	return resultado.insertId;
};

const completarRegistroBaseDeDatos = async (profileKey, registrationDraftId, datos) => {
	const conexion = await obtenerConexion();
	try {
		await conexion.beginTransaction();

		const tipoUsuario = perfilPorTipoUsuario[profileKey];
		if (!tipoUsuario) {
			throw crearError(400, 'Perfil no válido.');
		}

		const idUsuario = await crearUsuarioBase(conexion, tipoUsuario, datos);

		if (profileKey === 'estudiante') {
			const idFacultad = await obtenerOCrearFacultad(conexion, datos.facultad);
			const idEscuela = await obtenerOCrearEscuela(conexion, datos.carrera_profesional, idFacultad);
			await conexion.execute(
				'INSERT INTO datos_estudiante (id_usuario, codigo_estudiante, id_facultad, id_escuela) VALUES (?, ?, ?, ?)',
				[idUsuario, normalizarTexto(datos.codigo), idFacultad, idEscuela],
			);
		}

		if (profileKey === 'docente') {
			const idDependencia = await obtenerOCrearDependencia(conexion, datos.dependencia);
			await conexion.execute(
				'INSERT INTO datos_docente (id_usuario, dni, categoria, id_dependencia) VALUES (?, ?, ?, ?)',
				[idUsuario, normalizarTexto(datos.dni), normalizarTexto(datos.categoria), idDependencia],
			);
		}

		if (profileKey === 'dependencia') {
			const idDependencia = await obtenerOCrearDependencia(conexion, datos.dependencia);
			await conexion.execute('INSERT INTO datos_administrativo (id_usuario, id_dependencia) VALUES (?, ?)', [idUsuario, idDependencia]);
		}

		if (profileKey === 'institucion') {
			await conexion.execute('INSERT INTO datos_institucional (id_usuario, ruc, entidad) VALUES (?, ?, ?)', [idUsuario, normalizarTexto(datos.ruc), normalizarTexto(datos.entidad)]);
		}

		if (profileKey === 'general') {
			await conexion.execute('INSERT INTO datos_general (id_usuario, dni) VALUES (?, ?)', [idUsuario, normalizarTexto(datos.dni)]);
		}

		if (profileKey === 'externo') {
			await conexion.execute('INSERT INTO datos_externo (id_usuario, documento) VALUES (?, ?)', [idUsuario, normalizarTexto(datos.documento)]);
		}

		await conexion.execute(
			`UPDATE registro_formularios
			 SET estado = 'completado', completado_en = NOW()
			 WHERE id_registro = ? AND perfil = ?`,
			[registrationDraftId, profileKey],
		);

		await conexion.commit();
		return idUsuario;
	} catch (error) {
		await conexion.rollback();
		throw error;
	} finally {
		conexion.release();
	}
};

const asegurarTablas = async () => {
	if (!pool) {
		throw createDbDependencyError();
	}

	await pool.execute(`
		CREATE TABLE IF NOT EXISTS registro_formularios (
			id_registro INT AUTO_INCREMENT PRIMARY KEY,
			perfil ENUM('estudiante','docente','dependencia','institucion','general','externo') NOT NULL,
			estado ENUM('borrador','completado') NOT NULL DEFAULT 'borrador',
			paso_actual VARCHAR(80) NULL,
			datos_json JSON NOT NULL,
			creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			completado_en DATETIME NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
	`);
};

const obtenerRegistroPorIdInterno = async (registrationId) => {
	if (!pool) {
		throw createDbDependencyError();
	}

	const [rows] = await pool.execute(
		`SELECT id_registro, perfil, estado, paso_actual, datos_json, creado_en, actualizado_en, completado_en
		 FROM registro_formularios
		 WHERE id_registro = ?`,
		[registrationId],
	);

	return rows[0] || null;
};

const saveRegistration = async ({ registrationId, profile, stepKey, data = {}, finalize = false }) => {
	if (!pool) {
		throw createDbDependencyError();
	}

	const profileKey = normalizarPerfil(profile);
	const payload = normalizarCarga(data);
	await asegurarTablas();

	let existingRegistration = null;

	if (registrationId) {
		existingRegistration = await obtenerRegistroPorIdInterno(registrationId);
		if (!existingRegistration) {
			throw crearError(404, 'No existe un registro para actualizar.');
		}

		if (existingRegistration.perfil !== profileKey) {
			throw crearError(400, 'El perfil del registro no coincide.');
		}
	}

	const mergedPayload = {
		...((existingRegistration?.datos_json && typeof existingRegistration.datos_json === 'object') ? existingRegistration.datos_json : {}),
		...payload,
	};

	const validationErrors = validarCargaPerfil(profileKey, finalize ? mergedPayload : payload, {
		parcial: !finalize,
	});

	if (Object.keys(validationErrors).length > 0) {
		throw crearError(400, 'Hay campos inválidos en el formulario.', validationErrors);
	}

	if (!existingRegistration) {
		const [result] = await pool.execute(
			`INSERT INTO registro_formularios (perfil, estado, paso_actual, datos_json)
			 VALUES (?, 'borrador', ?, ?)`,
			[profileKey, stepKey, JSON.stringify(mergedPayload)],
		);

		const registration = await obtenerRegistroPorIdInterno(result.insertId);
		return {
			created: true,
			registration: construirRespuestaRegistro({
				id: registration.id_registro,
				profile: registration.perfil,
				status: registration.estado,
				stepKey: registration.paso_actual,
				payload: registration.datos_json,
				createdAt: registration.creado_en,
				updatedAt: registration.actualizado_en,
				completedAt: registration.completado_en,
			}),
		};
	}

	await pool.execute(
		`UPDATE registro_formularios
		 SET paso_actual = ?, datos_json = ?, estado = ?, completado_en = NOW()
		 WHERE id_registro = ?`,
		[stepKey, JSON.stringify(mergedPayload), finalize ? 'completado' : 'borrador', registrationId],
	);

	const updatedRegistration = await obtenerRegistroPorIdInterno(registrationId);

	return {
		created: false,
		registration: construirRespuestaRegistro({
			id: updatedRegistration.id_registro,
			profile: updatedRegistration.perfil,
			status: updatedRegistration.estado,
			stepKey: updatedRegistration.paso_actual,
			payload: updatedRegistration.datos_json,
			createdAt: updatedRegistration.creado_en,
			updatedAt: updatedRegistration.actualizado_en,
			completedAt: updatedRegistration.completado_en,
		}),
	};
};

const obtenerRegistroPorId = async (registrationId) => {
	if (!pool) {
		throw createDbDependencyError();
	}

	await asegurarTablas();
	const registration = await obtenerRegistroPorIdInterno(registrationId);

	if (!registration) {
		throw crearError(404, 'Registro no encontrado.');
	}

	return construirRespuestaRegistro({
		id: registration.id_registro,
		profile: registration.perfil,
		status: registration.estado,
		stepKey: registration.paso_actual,
		payload: registration.datos_json,
		createdAt: registration.creado_en,
		updatedAt: registration.actualizado_en,
		completedAt: registration.completado_en,
	});
};

const completarRegistro = async ({ registrationId, profile, stepKey, data = {} }) => {
	if (!registrationId && !profile) {
		throw crearError(400, 'Debes indicar el perfil o el identificador del registro.');
	}

	const result = await saveRegistration({
		registrationId,
		profile,
		stepKey,
		data,
		finalize: true,
	});

	const profileKey = normalizarPerfil(profile || result.registration.profile);
	await completarRegistroBaseDeDatos(profileKey, result.registration.id, {
		...(result.registration.payload || {}),
		...normalizarCarga(data),
	});

	const registroFinalizado = await obtenerRegistroPorId(result.registration.id);
	return {
		created: result.created,
		registration: registroFinalizado,
	};
};

const guardarPasoRegistro = async ({ registrationId, profile, stepKey, data = {} }) => {
	if (!profile) {
		throw crearError(400, 'Debes indicar el perfil del registro.');
	}

	if (!stepKey) {
		throw crearError(400, 'Debes indicar el paso del formulario.');
	}

	return saveRegistration({
		registrationId,
		profile,
		stepKey,
		data,
		finalize: false,
	});
};

const obtenerPerfilesAutenticacion = () => {
	return Object.entries(PROFILE_SCHEMAS).map(([profileKey, schema]) => ({
		key: profileKey,
		label: schema.label,
		fields: Object.keys(schema.fields),
	}));
};

const iniciarSesionAdministrador = async ({ email, codigoAcceso }) => {
	if (!pool) {
		throw createDbDependencyError();
	}

	const currentEmail = normalizarTexto(email).toLowerCase();
	const currentCodigo = normalizarTexto(codigoAcceso);

	if (!currentEmail || !currentCodigo) {
		throw crearError(400, 'Debes enviar correo institucional y código de verificación.');
	}

	const [rows] = await pool.execute(
		`SELECT id_admin, nombre_admin, email, codigo_acceso, telefono, estado, ultimo_acceso, fecha_creacion
		 FROM administradores
		 WHERE LOWER(email) = ? AND codigo_acceso = ? AND estado = 'activo'
		 LIMIT 1`,
		[currentEmail, currentCodigo],
	);

	const administrador = rows[0] || null;
	if (!administrador) {
		throw crearError(401, 'Credenciales inválidas.');
	}

	await pool.execute('UPDATE administradores SET ultimo_acceso = NOW() WHERE id_admin = ?', [administrador.id_admin]);

	return {
		session: {
			role: 'admin',
			idAdmin: administrador.id_admin,
			nombre: administrador.nombre_admin,
			email: administrador.email,
			token: crypto.randomUUID(),
			expiresAt: null,
		},
	};
};

module.exports = {
	obtenerPerfilesAutenticacion,
	guardarPasoRegistro,
	completarRegistro,
	obtenerRegistroPorId,
	iniciarSesionAdministrador,
	validarCargaPerfil,
	normalizarPerfil,
	crearError,
	asegurarTablas,
};
