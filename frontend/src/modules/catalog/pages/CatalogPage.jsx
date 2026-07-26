import { useNavigate } from 'react-router-dom';
import { CatalogLayout } from '../components/CatalogLayout';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { CatalogGrid } from '../components/CatalogGrid';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCatalog } from '../hooks/useCatalog';
import { getProfileLabel } from '../utils/catalogHelpers';

export const CatalogPage = () => {
	const navigate = useNavigate();
	const { user, checked, logout } = useCurrentUser();
	const { categories, tramites, loading, categoria, setCategoria, search, setSearch } = useCatalog(user?.profile);

	if (!checked || !user) {
		return null;
	}

	const handleSolicitar = (tramite) => {
		navigate(`/solicitud/${tramite.id}`);
	};

	return (
		<CatalogLayout user={user} active="nuevo-tramite" onNavigate={navigate} onLogout={logout}>
			<div className="mx-auto max-w-6xl">
				<div>
					<h1 className="text-3xl font-serif font-semibold text-[#7a1220] sm:text-4xl">Nuevo Trámite</h1>
					<p className="mt-1 text-sm text-slate-500">
						Trámites disponibles para tu perfil: <span className="font-medium">{getProfileLabel(user)}</span>
					</p>
				</div>

				<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
					<CategoryFilter categories={categories} value={categoria} onChange={setCategoria} />
					<div className="sm:w-96">
						<SearchBar value={search} onChange={setSearch} />
					</div>
				</div>

				<div className="mt-6">
					{loading ? (
						<p className="text-sm text-slate-400">Cargando trámites…</p>
					) : (
						<CatalogGrid tramites={tramites} onSolicitar={handleSolicitar} />
					)}
				</div>
			</div>
		</CatalogLayout>
	);
};
