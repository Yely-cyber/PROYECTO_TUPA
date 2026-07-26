import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { CatalogLayout } from '../components/CatalogLayout';
import { useCurrentUser } from '../hooks/useCurrentUser';

export const ComingSoonPage = ({ title, active }) => {
	const navigate = useNavigate();
	const { user, checked, logout } = useCurrentUser();

	if (!checked || !user) {
		return null;
	}

	return (
		<CatalogLayout user={user} active={active} onNavigate={navigate} onLogout={logout}>
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-center rounded-2xl border border-[#ecd9d3] bg-white px-6 py-24 text-center shadow-sm">
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fbf1e6] text-[#b3791f]">
					<Construction size={26} />
				</div>
				<h1 className="mt-5 text-2xl font-semibold text-slate-900">{title}</h1>
				<p className="mt-2 text-sm text-slate-500">Próximamente...</p>

				<button
					type="button"
					onClick={() => navigate('/dashboard')}
					className="mt-8 rounded-lg bg-[#7a1220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#621019]"
				>
					Volver al inicio
				</button>
			</div>
		</CatalogLayout>
	);
};
