import { ArrowRight, Clock } from 'lucide-react';

export const CatalogCard = ({ tramite, onSolicitar }) => (
	<article className="flex flex-col justify-between rounded-2xl border border-[#ecd9d3] bg-white p-5 shadow-sm transition hover:border-[#be1e2d] hover:shadow-md">
		<div>
			<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fbf1e6] text-xl">
				{tramite.icon}
			</div>
			<h3 className="mt-4 text-base font-semibold text-slate-900">{tramite.nombre}</h3>
			<p className="mt-1 text-sm leading-6 text-slate-500">{tramite.descripcion}</p>
			{tramite.costoLabel ? (
				<p className="mt-2 text-xs font-semibold text-[#7a1220]">{tramite.costoLabel}</p>
			) : null}
		</div>

		<div className="mt-5 flex items-center justify-between">
			<span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
				<Clock size={14} />
				{tramite.tiempoEstimado}
			</span>
			<button
				type="button"
				onClick={() => onSolicitar(tramite)}
				className="flex items-center gap-1.5 rounded-lg bg-[#be1e2d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#a71825]"
			>
				Solicitar
				<ArrowRight size={14} />
			</button>
		</div>
	</article>
);
