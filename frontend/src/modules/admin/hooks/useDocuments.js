import { useCallback, useEffect, useState } from 'react';
import adminService from '../services/adminService';

/**
 * Hook para Gestión Documental. Sin tabla propia en tu base de
 * datos: el backend lista/guarda los archivos directamente en disco
 * (uploads/admin-documentos), así que aquí solo consumimos esos endpoints.
 */
export default function useDocuments() {
	const [documentos, setDocumentos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const cargar = useCallback(async () => {
		setLoading(true);
		setError('');
		const response = await adminService.getDocumentos();
		if (!response.success) {
			setError(response.message || 'No se pudieron cargar los documentos.');
			setDocumentos([]);
		} else {
			setDocumentos(response.data || []);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		cargar();
	}, [cargar]);

	async function subirDocumento(file) {
		const response = await adminService.subirDocumento(file);
		if (response.success) await cargar();
		return response;
	}

	async function eliminarDocumento(id) {
		const response = await adminService.eliminarDocumento(id);
		if (response.success) await cargar();
		return response;
	}

	return { documentos, loading, error, subirDocumento, eliminarDocumento, recargar: cargar };
}
