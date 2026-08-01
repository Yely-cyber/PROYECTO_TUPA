// Almacenamiento local temporal del usuario recién registrado.
// Sirve como puente mientras el módulo `auth` no exponga una sesión
// genérica (por ahora `useAuth` solo maneja sesión de administrador).
// Si el Desarrollador 1 implementa un mecanismo oficial de sesión para
// estudiantes/docentes/etc., este helper debe reemplazarse por ese servicio.

const CURRENT_USER_KEY = 'tupa_current_user';

export const saveCurrentUser = (data) => {
	try {
		window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data));
	} catch (error) {
		console.error('No se pudo guardar la sesión local del usuario', error);
	}
};

export const getCurrentUser = () => {
	try {
		const raw = window.localStorage.getItem(CURRENT_USER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (error) {
		console.error('No se pudo leer la sesión local del usuario', error);
		return null;
	}
};

export const clearCurrentUser = () => {
	try {
		window.localStorage.removeItem(CURRENT_USER_KEY);
	} catch (error) {
		console.error('No se pudo limpiar la sesión local del usuario', error);
	}
};

// Cada flujo de registro (registrationFlows.js) guarda el nombre bajo un
// campo distinto según el perfil: personas usan nombre_completo/nombres,
// mientras que dependencia/institución usan el nombre de la entidad.
const DISPLAY_NAME_FIELDS_BY_PROFILE = {
	estudiante: 'nombre_completo',
	docente: 'nombre_completo',
	general: 'nombre_completo',
	externo: 'nombres',
	institucion: 'entidad',
	dependencia: 'dependencia',
};

export const getDisplayName = (user) => {
	if (!user) return 'Usuario';

	const field = DISPLAY_NAME_FIELDS_BY_PROFILE[user.profile];
	const value = field ? user[field] : null;

	return value?.trim() || 'Usuario';
};

export const PROFILE_LABELS = {
	estudiante: 'Estudiante',
	docente: 'Docente / Administrativo / Cesante',
	dependencia: 'Dependencia Administrativa',
	institucion: 'Institución Pública o Privada',
	general: 'Público General',
	externo: 'Usuario Externo',
};

export const getProfileLabel = (user) => PROFILE_LABELS[user?.profile] || 'Usuario registrado';

export const formatFileSize = (bytes) => {
	if (bytes === null || bytes === undefined) return '';
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// El backend devuelve `tiempo` en días (número) y `costo` en soles
// (número). Estos helpers los convierten al formato legible que ya
// esperan los componentes (CatalogCard, NewTramitePage, etc.).
export const formatTiempoEstimado = (dias) => {
	const numero = Number(dias);
	if (!Number.isFinite(numero) || numero <= 0) return 'Consultar';
	return numero === 1 ? '1 día hábil' : `${numero} días hábiles`;
};

export const formatCosto = (costo) => {
	const numero = Number(costo);
	if (!Number.isFinite(numero) || numero <= 0) return 'Gratuito';
	return `S/ ${numero.toFixed(2)}`;
};

// El backend no guarda íconos por trámite; se asignan en el frontend
// según la categoría oficial (ver database/catalog_perfiles.sql).
const ICONOS_POR_CATEGORIA = {
	'ESCUELA DE POSTGRADO ESTUDIANTES': '🎓',
	'FACULTADES ESTUDIANTES': '📄',
	'UNIDAD DE BIBLIOTECA ESTUDIANTES': '📖',
	'CENTRO DE CÓMPUTO': '💻',
	'DIRECCIÓN DE BIENESTAR UNIVERSITARIO': '🩺',
	'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS': '🪪',
	'INSTITUTO DE IDIOMAS': '🌐',
	'UNIDAD DE BIBLIOTECA DOCENTES Y ADMINISTRATIVOS': '📖',
	'RECTORADO - SECRETARIA GENERAL': '🏛️',
	'FACULTADES OTROS': '🏟️',
	'DIRECCIÓN GENERAL DE ADMISIÓN': '📝',
	'ESCUELA DE POSTGRADO ADMISIÓN Y TRASLADO EXTERNO': '🎓',
	'RESIDENTADO MEDICO': '🩺',
};

export const getIconForCategoria = (categoria) => ICONOS_POR_CATEGORIA[categoria] || '📄';

// ─────────────────────────────────────────────────────────────────
// Puente temporal hacia el módulo `tracking` (Desarrollador 3).
// Cada solicitud enviada desde "Nuevo Trámite" se guarda aquí para que
// las pantallas de confirmación/historial puedan leerla sin que ambos
// módulos tengan que importarse entre sí — solo comparten esta "llave"
// de localStorage y la forma del objeto `solicitud` (ver README/chat).
// Reemplazar por el servicio real cuando el backend exponga el endpoint.
// ─────────────────────────────────────────────────────────────────
const SOLICITUDES_KEY = 'tupa_solicitudes';

const ESTADO_VISIBLE = {
	enviado: 'Iniciado',
	iniciado: 'Iniciado',
	recibido: 'En revisión',
	en_proceso: 'En revisión',
	finalizado: 'Aprobado',
	observado: 'Observado',
	rechazado: 'Observado',
};

export const getEstadoVisible = (estado) => ESTADO_VISIBLE[String(estado || '').toLowerCase()] || estado;

export const saveSolicitud = (record) => {
	try {
		const solicitudes = getSolicitudes();
		const solicitud = {
			id: `sol-${Date.now()}`,
			estado: 'Iniciado',
			fecha: new Date().toISOString(),
			...record,
		};

		window.localStorage.setItem(SOLICITUDES_KEY, JSON.stringify([...solicitudes, solicitud]));
		return solicitud;
	} catch (error) {
		console.error('No se pudo guardar la solicitud local', error);
		return null;
	}
};

export const getSolicitudes = () => {
	try {
		const raw = window.localStorage.getItem(SOLICITUDES_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch (error) {
		console.error('No se pudieron leer las solicitudes locales', error);
		return [];
	}
};

export const getSolicitudById = (id) => getSolicitudes().find((item) => item.id === id) || null;

// Llamada por TramitesConfirmationPage.jsx (tracking) al presionar
// "Confirmar trámite". Actualiza el estado de la solicitud ya guardada y
// devuelve el registro actualizado (o null si no se encontró / falló el
// guardado, para que la página pueda cortar el flujo si algo sale mal).
export const saveTramiteConfirmado = (solicitud) => {
	if (!solicitud?.id) return null;

	try {
		const solicitudes = getSolicitudes();
		const index = solicitudes.findIndex((item) => item.id === solicitud.id);

		if (index === -1) return null;

		const actualizado = {
			...solicitudes[index],
			estado: 'Iniciado',
			confirmadoEn: new Date().toISOString(),
		};

		solicitudes[index] = actualizado;
		window.localStorage.setItem(SOLICITUDES_KEY, JSON.stringify(solicitudes));

		return actualizado;
	} catch (error) {
		console.error('No se pudo confirmar la solicitud local', error);
		return null;
	}
};

// Llamada por HistoryPage.jsx (tracking) para armar "Mis Trámites". Solo
// devuelve las solicitudes que el usuario ya confirmó explícitamente
// (pasaron por saveTramiteConfirmado, es decir tienen `confirmadoEn`) —
// las que quedaron a medio enviar no aparecen en el historial.
export const getTramitesConfirmados = () =>
	getSolicitudes()
		.filter((item) => Boolean(item.confirmadoEn))
		.map((item) => ({
			id: item.numeroExpediente || item.id,
			tipo: item.tramiteNombre,
			estado: getEstadoVisible(item.estado),
			fecha: item.fechaCreacion || item.fecha,
			fechaCreacion: item.fechaCreacion || item.fecha,
		}));

export const filterTramites = (tramites, { categoria, search } = {}) => {
	const term = search?.trim().toLowerCase();

	return tramites.filter((tramite) => {
		const matchesCategoria = !categoria || categoria === 'TODOS' || tramite.categoria === categoria;
		const matchesSearch =
			!term ||
			tramite.nombre.toLowerCase().includes(term) ||
			tramite.descripcion.toLowerCase().includes(term);

		return matchesCategoria && matchesSearch;
	});
};
