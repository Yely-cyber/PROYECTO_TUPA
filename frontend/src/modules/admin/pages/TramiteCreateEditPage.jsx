import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import TramiteEditModal, { emptyTramite } from '../components/TramiteEditModal';
import adminService from '../services/adminService';

/**
 * Fig. 25 — Vista/Modal de Registro y Edición de Trámites, accesible como
 * ruta propia (/admin/tramites/nuevo o /admin/tramites/:id/editar).
 *
 * `dependencias` debería venir de tu catálogo real de dependencias.
 */
export default function TramiteCreateEditPage({ dependencias = [] }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const [tramite, setTramite] = useState(id ? null : emptyTramite);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!id) return;
		adminService.getTramite(id).then((response) => {
			if (response.success) setTramite(response.data);
			else setError(response.message);
		});
	}, [id]);

	async function handleSave(data) {
		const response = data.id_tramite
			? await adminService.updateTramite(data.id_tramite, data)
			: await adminService.createTramite(data);
		if (response.success) navigate('/admin/tramites');
		else setError(response.message);
	}

	return (
		<AdminLayout>
			<h1 className="admin-page-title">{id ? 'Editar Trámite' : 'Nuevo Trámite'}</h1>
			<p className="admin-page-sub">Registra o modifica un trámite del catálogo TUPA</p>

			{error && <div className="admin-error-banner">{error}</div>}

			{tramite && (
				<TramiteEditModal
					tramite={tramite}
					dependencias={dependencias}
					onClose={() => navigate('/admin/tramites')}
					onSave={handleSave}
				/>
			)}
		</AdminLayout>
	);
}
