import { LayoutGrid, Plus, FileText, BookOpen, FileWarning, Phone, LogOut } from 'lucide-react';
import { getDisplayName, getProfileLabel } from '../utils/catalogHelpers';

const NAV_ITEMS = [
	{ key: 'inicio', label: 'Inicio', icon: LayoutGrid, path: '/dashboard' },
	{ key: 'nuevo-tramite', label: 'Nuevo Trámite', icon: Plus, path: '/nuevo-tramite' },
	{ key: 'mis-tramites', label: 'Mis Trámites', icon: FileText, path: '/historial' },
	{ key: 'ayuda', label: 'Ayuda', icon: BookOpen, path: '/ayuda' },
	{ key: 'libro-reclamaciones', label: 'Libro de Reclamaciones', icon: FileWarning, path: '/libro-reclamaciones' },
	{ key: 'contacto', label: 'Contáctanos', icon: Phone, path: '/contacto' },
];

const getInitial = (name) => name.trim().charAt(0).toUpperCase() || 'U';

export const CatalogLayout = ({ user, active, onNavigate, onLogout, children }) => {
	const displayName = getDisplayName(user);
	const profileLabel = getProfileLabel(user);
	const initial = getInitial(displayName);

	return (
		<div className="flex min-h-screen flex-col bg-[#f7f2ef]">
			<header className="flex items-center justify-between bg-[#7a1220] px-6 py-3 text-white">
				<div className="flex items-center gap-3">
					<span className="text-base font-semibold">UNSAAC · TUPA Digital</span>
				</div>

				<div className="flex items-center gap-4">
					<div className="text-right leading-tight">
						<p className="text-sm font-semibold">{displayName}</p>
						<p className="text-xs text-white/70">{profileLabel}</p>
					</div>
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9a441] text-sm font-bold text-white">
						{initial}
					</div>
				</div>
			</header>

			<div className="flex flex-1 flex-col lg:flex-row">
				<aside className="flex w-full flex-row items-center justify-between gap-3 border-b border-[#ecd9d3] bg-white px-4 py-3 lg:w-64 lg:flex-col lg:items-stretch lg:justify-start lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
					<nav className="flex flex-1 flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
						{NAV_ITEMS.map((item) => {
							const Icon = item.icon;
							const isActive = item.key === active;

							return (
								<button
									key={item.key}
									type="button"
									onClick={() => onNavigate(item.path)}
									className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${
										isActive
											? 'border border-[#e7c9a9] bg-[#fbf1e6] text-[#7a1220]'
											: 'text-slate-600 hover:bg-slate-50'
									}`}
								>
									<Icon size={18} />
									<span className="hidden sm:inline lg:inline">{item.label}</span>
								</button>
							);
						})}
					</nav>

					<button
						type="button"
						onClick={onLogout}
						className="hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#be1e2d] transition hover:bg-red-50 lg:mt-auto lg:flex"
					>
						<LogOut size={18} />
						Cerrar sesión
					</button>
				</aside>

				<main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
			</div>
		</div>
	);
};
