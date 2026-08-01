/**
 * adminService.js
 * Cliente HTTP del panel administrativo, con el MISMO patrón que tu
 * authService.js (fetch + requestJson + manejo de { success, message }).
 * No duplica login: reutiliza la sesión que ya guarda authService.js.
 *
 * AJUSTA este import a la ruta real de tu authService.js:
 */
import { getSession } from '../../auth/services/authService'; // <-- corrige la ruta si tu authService.js vive en otro lugar

const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3000/api/admin';
const FALLBACK_ADMIN_ID = String(import.meta.env.VITE_ADMIN_ID || import.meta.env.VITE_DEMO_ADMIN_ID || '1');

const getActiveAdminId = () => {
	const session = getSession();
	if (session?.idAdmin) {
		return String(session.idAdmin);
	}

	return FALLBACK_ADMIN_ID;
};

const requestJson = async (endpoint, options = {}) => {
	const adminId = getActiveAdminId();

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		method: options.method || 'GET',
		headers: {
			...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
			...(adminId ? { 'x-admin-id': adminId } : {}),
			...(options.headers || {}),
		},
		...options,
	});

	const body = await response.json().catch(() => ({}));
	if (!response.ok) {
		return { success: false, message: body.message || 'Error al comunicar con el servidor', errors: body.errors || null };
	}

	return body;
};

const adminService = {
	// ---------- Dashboard ----------
	getDashboardMetrics: () => requestJson('/dashboard'),

	// ---------- Trámites (catálogo TUPA) ----------
	getTramites: (params = {}) => {
		const qs = new URLSearchParams(params).toString();
		return requestJson(`/tramites${qs ? `?${qs}` : ''}`);
	},
	getTramite: (id) => requestJson(`/tramites/${id}`),
	createTramite: (data) => requestJson('/tramites', { method: 'POST', body: JSON.stringify(data) }),
	updateTramite: (id, data) => requestJson(`/tramites/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
	deleteTramite: (id) => requestJson(`/tramites/${id}`, { method: 'DELETE' }),

	// ---------- Categorías (derivadas de tramites.categoria) ----------
	getCategorias: () => requestJson('/categorias'),
	renombrarCategoria: (nombreActual, nombreNuevo) =>
		requestJson('/categorias', { method: 'PUT', body: JSON.stringify({ nombreActual, nombreNuevo }) }),
	eliminarCategoria: (nombre) => requestJson(`/categorias/${encodeURIComponent(nombre)}`, { method: 'DELETE' }),

	// ---------- Expedientes / Solicitudes ----------
	getExpedientes: (params = {}) => {
		const qs = new URLSearchParams(params).toString();
		return requestJson(`/expedientes${qs ? `?${qs}` : ''}`);
	},
	getExpediente: (id) => requestJson(`/expedientes/${id}`),
	aprobarExpediente: (id, comentario) =>
		requestJson(`/expedientes/${id}/aprobar`, { method: 'PATCH', body: JSON.stringify({ comentario }) }),
	observarExpediente: (id, comentario) =>
		requestJson(`/expedientes/${id}/observar`, { method: 'PATCH', body: JSON.stringify({ comentario }) }),
	rechazarExpediente: (id, comentario) =>
		requestJson(`/expedientes/${id}/rechazar`, { method: 'PATCH', body: JSON.stringify({ comentario }) }),

	// ---------- Gestión documental (filesystem) ----------
	getDocumentos: () => requestJson('/documentos'),
	subirDocumento: (file) => {
		const formData = new FormData();
		formData.append('file', file);
		return requestJson('/documentos', { method: 'POST', body: formData });
	},
	eliminarDocumento: (id) => requestJson(`/documentos/${id}`, { method: 'DELETE' }),
	descargarDocumentoUrl: (id) => `${API_BASE_URL}/documentos/${id}/descargar`,
};

export default adminService;
