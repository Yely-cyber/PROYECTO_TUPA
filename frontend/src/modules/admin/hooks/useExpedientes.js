import { useCallback, useEffect, useState } from 'react';
import adminService from '../services/adminService';

export const ESTADOS_EXPEDIENTE = ['Iniciado', 'En revisión', 'Aprobado', 'Observado', 'Sin movimientos'];

/**
 * Hook para listar, filtrar y revisar expedientes/solicitudes (Fig. 26 / Fig. 27).
 * El "estado" no es un campo propio de `expedientes`: lo calcula el backend
 * a partir del ÚLTIMO registro de `movimientos_expediente` para ese expediente.
 */
export default function useExpedientes() {
	const [expedientes, setExpedientes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');
	const [estadoFiltro, setEstadoFiltro] = useState('');
	const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);

	const cargar = useCallback(async () => {
		setLoading(true);
		setError('');
		const response = await adminService.getExpedientes({
			...(search ? { search } : {}),
			...(estadoFiltro ? { estado: estadoFiltro } : {}),
		});
		if (!response.success) {
			setError(response.message || 'No se pudieron cargar los expedientes.');
			setExpedientes([]);
		} else {
			setExpedientes(response.data || []);
		}
		setLoading(false);
	}, [search, estadoFiltro]);

	useEffect(() => {
		cargar();
	}, [cargar]);

	async function verDetalle(expediente) {
		const response = await adminService.getExpediente(expediente.id_expediente);
		if (response.success) setExpedienteSeleccionado(response.data);
		return response;
	}

	function cerrarDetalle() {
		setExpedienteSeleccionado(null);
	}

	async function aprobar(id, comentario) {
		const response = await adminService.aprobarExpediente(id, comentario);
		if (response.success) await cargar();
		return response;
	}

	async function observar(id, comentario) {
		const response = await adminService.observarExpediente(id, comentario);
		if (response.success) await cargar();
		return response;
	}

	async function rechazar(id, comentario) {
		const response = await adminService.rechazarExpediente(id, comentario);
		if (response.success) await cargar();
		return response;
	}

	return {
		expedientes,
		loading,
		error,
		search,
		setSearch,
		estadoFiltro,
		setEstadoFiltro,
		expedienteSeleccionado,
		verDetalle,
		cerrarDetalle,
		aprobar,
		observar,
		rechazar,
		recargar: cargar,
	};
}
