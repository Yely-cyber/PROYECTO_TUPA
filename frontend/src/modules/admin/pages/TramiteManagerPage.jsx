import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import AdminDataTable from '../components/AdminDataTable';
import TramiteEditModal, { emptyTramite } from '../components/TramiteEditModal';
import useTramitesManager from '../hooks/useTramitesManager';
import { formatSoles } from '../utils/adminHelpers';

/**
 * Fig. 24 — Gestión de Trámites (tabla general TUPA), sobre la tabla real `tramites`.
 *
 * NOTA: `dependencias` debería venir de tu propio catálogo (endpoint /api/dependencias
 * o el que ya tengas). Aquí se deja como prop vacía por defecto — pásala desde el
 * componente padre o crea un hook useDependencias() análogo a los demás.
 */
export default function TramitesManagerPage({ dependencias = [] }) {
	const { tramites, loading, error, search, setSearch, crearTramite, actualizarTramite, eliminarTramite } =
		useTramitesManager();
	const [modalTramite, setModalTramite] = useState(null); // null = cerrado
	const [accionError, setAccionError] = useState('');

	const categoriasSugeridas = [...new Set(tramites.map((t) => t.categoria).filter(Boolean))];

	async function handleSave(data) {
		setAccionError('');
		const response = data.id_tramite ? await actualizarTramite(data.id_tramite, data) : await crearTramite(data);
		if (!response.success) {
			setAccionError(response.message);
			return;
		}
		setModalTramite(null);
	}

	async function handleDelete(id) {
		if (!window.confirm('¿Eliminar este trámite? Esta acción no se puede deshacer.')) return;
		const response = await eliminarTramite(id);
		if (!response.success) setAccionError(response.message);
	}

	const columns = [
		{ key: 'codigo_tupa', header: 'Código TUPA' },
		{ key: 'nombre', header: 'Título' },
		{ key: 'categoria', header: 'Categoría', render: (r) => r.categoria || '—' },
		{ key: 'costo', header: 'Costo', render: (r) => formatSoles(r.costo) },
		{ key: 'tiempo', header: 'Tiempo', render: (r) => (r.tiempo ? `${r.tiempo} días` : '—') },
		{ key: 'dependencia_destino', header: 'Dependencia' },
		{
			key: 'acciones',
			header: 'Acciones',
			render: (r) => (
				<div className="admin-table-actions">
					<button className="admin-btn-icon neutral" onClick={() => setModalTramite(r)}>
						<Pencil size={15} />
					</button>
					<button className="admin-btn-icon danger" onClick={() => handleDelete(r.id_tramite)}>
						<Trash2 size={15} />
					</button>
				</div>
			),
		},
	];

	return (
		<AdminLayout>
			<div className="admin-page-header">
				<div>
					<h1 className="admin-page-title">Gestión de Trámites</h1>
					<p className="admin-page-sub">Administre los trámites disponibles en el sistema</p>
				</div>
				<button className="admin-btn admin-btn-primary" onClick={() => setModalTramite(emptyTramite)}>
					<Plus size={16} /> Nuevo Trámite
				</button>
			</div>

			{(error || accionError) && <div className="admin-error-banner">{error || accionError}</div>}

			<div className="admin-card">
				<div className="admin-table-toolbar">
					<input
						className="admin-search"
						placeholder="Buscar trámite..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				{loading ? (
					<div className="admin-loading">Cargando trámites...</div>
				) : (
					<AdminDataTable columns={columns} data={tramites} getRowKey={(r) => r.id_tramite} />
				)}
			</div>

			{modalTramite && (
				<TramiteEditModal
					tramite={modalTramite}
					dependencias={dependencias}
					categoriasSugeridas={categoriasSugeridas}
					onClose={() => setModalTramite(null)}
					onSave={handleSave}
				/>
			)}
		</AdminLayout>
	);
}
