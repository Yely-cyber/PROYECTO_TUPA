const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const registrarComunicacion = async (comunicacion) => {
	const response = await fetch(`${API_BASE}/comunicaciones`, {
		method: 'POST',
		body: comunicacion instanceof FormData ? comunicacion : JSON.stringify(comunicacion),
		headers: comunicacion instanceof FormData ? {} : { 'Content-Type': 'application/json' },
	});
	const data = await response.json().catch(() => null);
	if (!response.ok || !data?.success) {
		throw new Error(data?.message || 'No se pudo registrar la comunicación.');
	}
	return data.comunicacion;
};
