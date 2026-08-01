import { formatTiempoEstimado, formatCosto, getIconForCategoria } from '../utils/catalogHelpers';

// Ajusta esto en un .env del frontend (VITE_API_BASE_URL) si tu backend
// no corre en localhost:3000.
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const solicitarJSON = async (path, options = {}) => {
	const response = await fetch(`${API_BASE}${path}`, options);
	const data = await response.json().catch(() => null);

	if (!response.ok || !data?.success) {
		throw new Error(data?.message || 'Ocurrió un error al comunicarse con el servidor.');
	}

	return data;
};

// El backend devuelve datos "crudos" (tiempo en días, costo numérico, sin
// ícono). Este adaptador los deja en la misma forma que ya esperan
// CatalogCard, CatalogGrid y NewTramitePage, para no tener que tocarlos.
const adaptarTramite = (tramite) => ({
	id: tramite.id,
	nombre: tramite.nombre,
	descripcion: tramite.descripcion,
	categoria: tramite.categoria,
	tiempoEstimado: formatTiempoEstimado(tramite.tiempoEstimado),
	costoLabel: formatCosto(tramite.costo),
	icon: getIconForCategoria(tramite.categoria),
});

export const getCategories = async (role) => {
	const data = await solicitarJSON(`/catalog/categorias?perfil=${encodeURIComponent(role)}`);
	return data.categorias;
};

export const getTramitesByRole = async (role) => {
	const data = await solicitarJSON(`/catalog/tramites?perfil=${encodeURIComponent(role)}`);
	return data.tramites.map(adaptarTramite);
};

export const getTramiteById = async (id) => {
	const data = await solicitarJSON(`/catalog/tramites/${id}`);
	return { ...adaptarTramite(data.tramite), requisitos: data.tramite.requisitos };
};

// `formData` ya viene armado desde NewTramitePage (incluye archivos, por
// eso es FormData y no JSON). No se define Content-Type a propósito: el
// navegador arma el boundary multipart automáticamente.
export const crearExpediente = async (formData) => {
	const data = await solicitarJSON('/catalog/expedientes', {
		method: 'POST',
		body: formData,
	});

	return data.expediente;
};