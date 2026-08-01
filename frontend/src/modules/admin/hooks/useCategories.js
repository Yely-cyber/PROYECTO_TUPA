import { useCallback, useEffect, useState } from 'react';
import adminService from '../services/adminService';

/**
 * Hook para la gestión de categorías.
 * IMPORTANTE: no existe tabla `categorias` en tu base de datos — es un valor
 * de texto libre en `tramites.categoria`. Por eso este hook solo permite
 * listar (agrupado), renombrar (afecta a todos los trámites con ese texto)
 * y "eliminar" (deja esos trámites sin categoría). No hay "crear categoría"
 * suelta: una categoría nueva aparece al crear/editar un trámite con ese texto.
 */
export default function useCategories() {
	const [categorias, setCategorias] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const cargar = useCallback(async () => {
		setLoading(true);
		setError('');
		const response = await adminService.getCategorias();
		if (!response.success) {
			setError(response.message || 'No se pudieron cargar las categorías.');
			setCategorias([]);
		} else {
			setCategorias(response.data || []);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		cargar();
	}, [cargar]);

	async function renombrarCategoria(nombreActual, nombreNuevo) {
		const response = await adminService.renombrarCategoria(nombreActual, nombreNuevo);
		if (response.success) await cargar();
		return response;
	}

	async function eliminarCategoria(nombre) {
		const response = await adminService.eliminarCategoria(nombre);
		if (response.success) await cargar();
		return response;
	}

	return { categorias, loading, error, renombrarCategoria, eliminarCategoria, recargar: cargar };
}
