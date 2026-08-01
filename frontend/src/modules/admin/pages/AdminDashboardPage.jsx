import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle2, Clock } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import adminService from '../services/adminService';

/**
 * Fig. 23 — Dashboard Administrativo del Sistema.
 * Los 3 totales vienen de admin.service.js -> getDashboardMetrics(), calculados
 * sobre `expedientes` + `movimientos_expediente` reales. Las secciones de
 * "Actividad Reciente", "Categorías más utilizadas" y "Estadísticas mensuales"
 * de las capturas originales no tienen un endpoint agregador propio todavía;
 * se dejan fuera hasta que definas esas consultas (o me digas qué agregar).
 */
export default function AdminDashboardPage() {
	const [metrics, setMetrics] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		adminService.getDashboardMetrics().then((response) => {
			if (response.success) setMetrics(response.data);
			else setError(response.message);
		});
	}, []);

	const items = metrics && [
		{ label: 'Total de Trámites', valor: metrics.totalTramites, Icon: FileText, bg: '#a91d3a' },
		{ label: 'Trámites Aprobados', valor: metrics.tramitesAprobados, Icon: CheckCircle2, bg: '#1f9d55' },
		{ label: 'Pendientes de Revisión', valor: metrics.pendientesRevision, Icon: Clock, bg: '#d98c1c' },
	];

	return (
		<AdminLayout>
			<h1 className="admin-page-title">Bienvenido, Administrador</h1>
			<p className="admin-page-sub">Resumen del sistema TUPA Digital</p>

			{error && <div className="admin-error-banner">{error}</div>}

			{!metrics && !error && <div className="admin-loading">Cargando métricas...</div>}

			{items && (
				<div className="admin-grid admin-grid-3">
					{items.map(({ label, valor, Icon, bg }) => (
						<div className="admin-card admin-metric-card" key={label}>
							<div className="admin-metric-top">
								<div className="admin-metric-icon" style={{ background: bg }}>
									<Icon size={18} />
								</div>
							</div>
							<div className="admin-metric-label">{label}</div>
							<div className="admin-metric-value">{valor}</div>
						</div>
					))}
				</div>
			)}
		</AdminLayout>
	);
}
