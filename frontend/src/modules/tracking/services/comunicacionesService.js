const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const registrarComunicacion = async (comunicacion) => {
	const response = await fetch(`${API_BASE}/comunicaciones`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(comunicacion),
	});
	const data = await response.json().catch(() => null);
	if (!response.ok || !data?.success) {
		throw new Error(data?.message || 'No se pudo registrar la comunicación.');
	}
	return data.comunicacion;
};
