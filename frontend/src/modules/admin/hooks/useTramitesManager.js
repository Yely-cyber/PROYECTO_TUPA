import { useCallback, useEffect, useState } from 'react';
import adminService from '../services/adminService';

/**
 * Hook para listar, crear, editar y eliminar trámites TUPA (Fig. 24 / Fig. 25),
 * ya contra tu tabla real `tramites` (codigo_tupa, nombre, categoria, costo,
 * id_dependencia_destino, tiempo).
 */
export default function useTramitesManager() {
	const [tramites, setTramites] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');
	const [categoriaFiltro, setCategoriaFiltro] = useState('');

	const cargar = useCallback(async () => {
		setLoading(true);
		setError('');
		const response = await adminService.getTramites({
			...(search ? { search } : {}),
			...(categoriaFiltro ? { categoria: categoriaFiltro } : {}),
		});
		if (!response.success) {
			setError(response.message || 'No se pudieron cargar los trámites.');
			setTramites([]);
		} else {
			setTramites(response.data || []);
		}
		setLoading(false);
	}, [search, categoriaFiltro]);

	useEffect(() => {
		cargar();
	}, [cargar]);

	async function crearTramite(data) {
		const response = await adminService.createTramite(data);
		if (response.success) await cargar();
		return response;
	}

	async function actualizarTramite(id, data) {
		const response = await adminService.updateTramite(id, data);
		if (response.success) await cargar();
		return response;
	}

	async function eliminarTramite(id) {
		const response = await adminService.deleteTramite(id);
		if (response.success) await cargar();
		return response;
	}

	return {
		tramites,
		loading,
		error,
		search,
		setSearch,
		categoriaFiltro,
		setCategoriaFiltro,
		crearTramite,
		actualizarTramite,
		eliminarTramite,
		recargar: cargar,
	};
}
