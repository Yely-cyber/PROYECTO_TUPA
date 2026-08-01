import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import TramiteReviewModal from '../components/TramiteReviewModal';
import adminService from '../services/adminService';

/**
 * Fig. 27 — Vista/Modal de Revisión de Expedientes, accesible como ruta
 * propia (/admin/expedientes/:id).
 */
export default function ExpedienteReviewPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [expediente, setExpediente] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		adminService.getExpediente(id).then((response) => {
			if (response.success) setExpediente(response.data);
			else setError(response.message);
		});
	}, [id]);

	function volver() {
		navigate('/admin/expedientes');
	}

	async function accion(fn, comentario) {
		const response = await fn(id, comentario);
		if (response.success) volver();
		else setError(response.message);
	}

	return (
		<AdminLayout>
			<h1 className="admin-page-title">Revisión de Expediente</h1>
			<p className="admin-page-sub">Información completa del trámite solicitado</p>

			{error && <div className="admin-error-banner">{error}</div>}

			{expediente ? (
				<TramiteReviewModal
					expediente={expediente}
					onClose={volver}
					onAprobar={(eId, comentario) => accion(adminService.aprobarExpediente, comentario)}
					onObservar={(eId, comentario) => accion(adminService.observarExpediente, comentario)}
					onRechazar={(eId, comentario) => accion(adminService.rechazarExpediente, comentario)}
				/>
			) : (
				!error && <div className="admin-card admin-loading">Cargando expediente...</div>
			)}
		</AdminLayout>
	);
}
