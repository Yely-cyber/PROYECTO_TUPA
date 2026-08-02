import React from 'react';
import { Eye, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import AdminDataTable from '../components/AdminDataTable';
import ExpedienteStatusBadge from '../components/ExpedienteStatusBadge';
import TramiteReviewModal from '../components/TramiteReviewModal';
import useExpedientes, { ESTADOS_EXPEDIENTE } from '../hooks/useExpedientes';

/**
 * Fig. 26 — Gestión de Expedientes (solicitudes recibidas), sobre `expedientes`
 * + estado derivado del último `movimientos_expediente`.
 */
export default function ExpedientesManagerPage() {
	const {
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
	} = useExpedientes();

	const puedeGestionar = (estado) => !['Aprobado', 'Observado', 'Rechazado'].includes(estado);
	const columns = [
		{ key: 'numero_expediente', header: 'N.° Expediente' },
		{ key: 'tramite', header: 'Tipo de Trámite' },
		{ key: 'estado', header: 'Estado', render: (r) => <ExpedienteStatusBadge estado={r.estado} /> },
		{
			key: 'fecha_registro',
			header: 'Fecha',
			render: (r) => new Date(r.fecha_registro).toLocaleDateString('es-PE'),
		},
		{
			key: 'acciones',
			header: 'Acciones',
			render: (r) => (
				<div className="admin-table-actions">
					<button className="admin-btn-icon neutral" onClick={() => verDetalle(r)}>
						<Eye size={15} />
					</button>
					<button className="admin-btn-icon success" disabled={!puedeGestionar(r.estado)} onClick={() => aprobar(r.id_expediente)}>
						<CheckCircle2 size={15} />
					</button>
					<button className="admin-btn-icon warn" disabled={!puedeGestionar(r.estado)} onClick={() => observar(r.id_expediente)}>
						<AlertTriangle size={15} />
					</button>
					<button className="admin-btn-icon danger" disabled={!puedeGestionar(r.estado)} onClick={() => rechazar(r.id_expediente)}>
						<XCircle size={15} />
					</button>
				</div>
			),
		},
	];

	return (
		<AdminLayout>
			<h1 className="admin-page-title">Expedientes y Solicitudes</h1>
			<p className="admin-page-sub">Revise y gestione las solicitudes de trámites</p>

			{error && <div className="admin-error-banner">{error}</div>}

			<div className="admin-card">
				<div className="admin-table-toolbar">
					<input
						className="admin-search"
						placeholder="Buscar por N.°, trámite o usuario..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<select className="admin-select" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
						<option value="">Todos los estados</option>
						{ESTADOS_EXPEDIENTE.map((e) => (
							<option key={e} value={e}>
								{e}
							</option>
						))}
					</select>
				</div>
				{loading ? (
					<div className="admin-loading">Cargando expedientes...</div>
				) : (
					<AdminDataTable columns={columns} data={expedientes} pageSize={10} getRowKey={(r) => r.id_expediente} />
				)}
			</div>

			<TramiteReviewModal
				expediente={expedienteSeleccionado}
				onClose={cerrarDetalle}
				onAprobar={async (id, comentario) => {
					await aprobar(id, comentario);
					cerrarDetalle();
				}}
				onObservar={async (id, comentario) => {
					await observar(id, comentario);
					cerrarDetalle();
				}}
				onRechazar={async (id, comentario) => {
					await rechazar(id, comentario);
					cerrarDetalle();
				}}
			/>
		</AdminLayout>
	);
}
