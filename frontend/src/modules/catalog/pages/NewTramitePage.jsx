import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { CatalogLayout } from '../components/CatalogLayout';
import { TramiteFormStep1 } from '../components/TramiteFormStep1';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useTramiteForm } from '../hooks/useTramiteForm';
import { mockTramites } from '../data/mockTramites';

export const NewTramitePage = () => {
	const { tramiteId } = useParams();
	const navigate = useNavigate();
	const { user, checked, logout } = useCurrentUser();
	const form = useTramiteForm();

	if (!checked || !user) {
		return null;
	}

	const tramite = mockTramites.find((item) => item.id === tramiteId);

	if (!tramite) {
		return (
			<CatalogLayout user={user} active="nuevo-tramite" onNavigate={navigate} onLogout={logout}>
				<div className="mx-auto max-w-2xl rounded-2xl border border-[#ecd9d3] bg-white p-10 text-center shadow-sm">
					<p className="text-sm text-slate-500">No encontramos el trámite solicitado.</p>
					<button
						type="button"
						onClick={() => navigate('/nuevo-tramite')}
						className="mt-6 rounded-lg bg-[#7a1220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#621019]"
					>
						Volver al catálogo
					</button>
				</div>
			</CatalogLayout>
		);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		form.submit(() => navigate(`/solicitud/${tramite.id}/confirmacion`));
	};

	return (
		<CatalogLayout user={user} active="nuevo-tramite" onNavigate={navigate} onLogout={logout}>
			<div className="mx-auto max-w-3xl">
				<button
					type="button"
					onClick={() => navigate('/nuevo-tramite')}
					className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-[#be1e2d]"
				>
					<ArrowLeft size={16} />
					Volver al catálogo
				</button>

				{/* Descripción del trámite solicitado */}
				<div className="mt-4 flex items-start gap-4 rounded-2xl border border-[#ecd9d3] bg-white p-5 shadow-sm">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fbf1e6] text-2xl">
						{tramite.icon}
					</div>
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-[#b3791f]">{tramite.categoria}</p>
						<h1 className="mt-1 text-xl font-semibold text-slate-900">{tramite.nombre}</h1>
						<p className="mt-1 text-sm leading-6 text-slate-500">{tramite.descripcion}</p>
						<p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
							<Clock size={14} />
							Tiempo estimado: {tramite.tiempoEstimado}
						</p>
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className="mt-6 space-y-6 rounded-2xl border border-[#ecd9d3] bg-white p-6 shadow-sm sm:p-8"
				>
					<TramiteFormStep1 form={form} />

					<div className="flex justify-end border-t border-[#f3e8e4] pt-6">
						<button
							type="submit"
							disabled={form.submitting}
							className="rounded-lg bg-[#be1e2d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a71825] disabled:opacity-70"
						>
							{form.submitting ? 'Enviando…' : 'Siguiente'}
						</button>
					</div>
				</form>
			</div>
		</CatalogLayout>
	);
};
