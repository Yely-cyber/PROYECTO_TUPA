const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const solicitarJSON = async (path) => {
	const response = await fetch(`${API_BASE}${path}`);
	const data = await response.json().catch(() => null);
	if (!response.ok || !data?.success) {
		throw new Error(data?.message || 'No se pudo consultar el seguimiento.');
	}
	return data;
};

export const listarExpedientesUsuario = async (email) => {
	const data = await solicitarJSON(`/tracking/expedientes?email=${encodeURIComponent(email)}`);
	return data.expedientes;
};

export const obtenerExpedienteUsuario = async (numeroExpediente, email) => {
	const data = await solicitarJSON(
		`/tracking/expedientes/${encodeURIComponent(numeroExpediente)}?email=${encodeURIComponent(email)}`,
	);
	return data.expediente;
};
