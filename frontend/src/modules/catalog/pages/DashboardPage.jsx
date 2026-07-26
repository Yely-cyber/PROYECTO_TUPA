import { useNavigate } from 'react-router-dom';
import { BarChart3, Clock, CheckCircle2, AlertTriangle, Plus, Search, ChevronRight } from 'lucide-react';
import { CatalogLayout } from '../components/CatalogLayout';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { mockDashboardStats, mockRecentActivity } from '../data/mockDashboardActivity';
import { getDisplayName } from '../utils/catalogHelpers';

const STAT_ICONS = {
	chart: { Icon: BarChart3, bg: 'bg-[#7a1220]' },
	clock: { Icon: Clock, bg: 'bg-[#d9a441]' },
	check: { Icon: CheckCircle2, bg: 'bg-[#2e9e5b]' },
	alert: { Icon: AlertTriangle, bg: 'bg-[#e0475a]' },
};

const TREND_TONE = {
	positive: 'text-[#2e9e5b]',
	neutral: 'text-slate-400',
	negative: 'text-[#e0475a]',
};

const STATUS_STYLES = {
	Aprobado: 'bg-[#e7f7ec] text-[#2e9e5b]',
	'En revisión': 'bg-[#fdf1de] text-[#b3791f]',
	Iniciado: 'bg-[#e8f0fd] text-[#2f5fce]',
	Observado: 'bg-[#fde8ea] text-[#e0475a]',
};

const QUICK_ACTIONS = [
	{
		key: 'nuevo-tramite',
		title: 'Nuevo Trámite',
		description: 'Iniciar solicitud',
		icon: Plus,
		path: '/nuevo-tramite',
		enabled: true,
		emphasis: true,
	},
	{
		key: 'mis-tramites',
		title: 'Mis Trámites',
		description: 'Ver historial',
		icon: Search,
		path: '/historial',
		enabled: true,
	},
];

export const DashboardPage = () => {
	const navigate = useNavigate();
	const { user, checked, logout } = useCurrentUser();

	if (!checked || !user) {
		return null;
	}

	const displayName = getDisplayName(user);

	return (
		<CatalogLayout user={user} active="inicio" onNavigate={navigate} onLogout={logout}>
			<div className="mx-auto max-w-6xl">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<h1 className="text-3xl font-serif font-semibold text-[#7a1220] sm:text-4xl">
							Bienvenido, {displayName}
						</h1>
						<p className="mt-1 text-sm text-slate-500">Resumen de tus gestiones administrativas en UNSAAC.</p>
					</div>
				</div>

				<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{mockDashboardStats.map((stat) => {
						const { Icon, bg } = STAT_ICONS[stat.icon];

						return (
							<article key={stat.key} className="rounded-2xl border border-[#ecd9d3] bg-white p-5 shadow-sm">
								<div className="flex items-center justify-between">
									<div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${bg}`}>
										<Icon size={20} />
									</div>
									<span className={`text-xs font-semibold ${TREND_TONE[stat.trendTone]}`}>{stat.trend}</span>
								</div>
								<p className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</p>
								<p className="text-sm text-slate-500">{stat.label}</p>
							</article>
						);
					})}
				</section>

				<section className="mt-4 grid gap-4 sm:grid-cols-2">
					{QUICK_ACTIONS.map((action) => {
						const Icon = action.icon;

						return (
							<button
								key={action.key}
								type="button"
								disabled={!action.enabled}
								title={action.enabled ? undefined : 'Próximamente'}
								onClick={() => action.enabled && navigate(action.path)}
								className={`flex items-center gap-4 rounded-2xl border p-5 text-left shadow-sm transition ${
									action.emphasis
										? 'border-[#7a1220] bg-[#7a1220] text-white hover:bg-[#621019] disabled:opacity-90'
										: 'border-[#ecd9d3] bg-white text-slate-900 hover:border-[#be1e2d] disabled:hover:border-[#ecd9d3]'
								} ${!action.enabled ? 'cursor-not-allowed' : ''}`}
							>
								<div
									className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
										action.emphasis ? 'bg-white/15' : 'bg-[#fbf1e6] text-[#b3791f]'
									}`}
								>
									<Icon size={20} />
								</div>
								<div>
									<p className="font-semibold">{action.title}</p>
									<p className={`text-sm ${action.emphasis ? 'text-white/75' : 'text-slate-500'}`}>
										{action.description}
									</p>
								</div>
							</button>
						);
					})}
				</section>

				<section className="mt-4 rounded-2xl border border-[#ecd9d3] bg-white shadow-sm">
					<div className="flex items-center justify-between border-b border-[#ecd9d3] px-6 py-4">
						<h2 className="text-lg font-semibold text-slate-900">Actividad Reciente</h2>
						<button
							type="button"
							onClick={() => navigate('/historial')}
							className="text-sm font-medium text-[#7a1220] transition hover:underline"
						>
							Ver todo →
						</button>
					</div>

					<ul>
						{mockRecentActivity.map((item) => (
							<li
								key={item.id}
								className="flex items-center justify-between gap-4 border-b border-[#f3e8e4] px-6 py-4 last:border-b-0"
							>
								<div>
									<p className="text-sm font-semibold text-slate-900">{item.title}</p>
									<p className="text-xs text-slate-400">
										#{item.id} · {item.date}
									</p>
								</div>
								<div className="flex items-center gap-3">
									<span
										className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[item.status] || 'bg-slate-100 text-slate-600'}`}
									>
										{item.status}
									</span>
									<ChevronRight size={16} className="text-slate-300" />
								</div>
							</li>
						))}
					</ul>
				</section>
			</div>
		</CatalogLayout>
	);
};
