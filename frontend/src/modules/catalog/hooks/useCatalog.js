import { useEffect, useMemo, useState } from 'react';
import { getCategories, getTramitesByRole } from '../services/catalogService';
import { filterTramites } from '../utils/catalogHelpers';

// El catálogo siempre muestra los trámites del `role` del usuario
// autenticado; dentro de ese conjunto se puede filtrar por categoría y
// buscar por texto, pero no se cambia de perfil.
export const useCatalog = (role) => {
	const [categories, setCategories] = useState([]);
	const [allTramites, setAllTramites] = useState([]);
	const [loading, setLoading] = useState(true);
	const [categoria, setCategoria] = useState('TODOS');
	const [search, setSearch] = useState('');

	useEffect(() => {
		if (!role) return;

		let isMounted = true;
		setLoading(true);

		Promise.all([getCategories(role), getTramitesByRole(role)]).then(([categoriesData, tramitesData]) => {
			if (!isMounted) return;
			setCategories(categoriesData);
			setAllTramites(tramitesData);
			setLoading(false);
		});

		return () => {
			isMounted = false;
		};
	}, [role]);

	const tramites = useMemo(
		() => filterTramites(allTramites, { categoria, search }),
		[allTramites, categoria, search],
	);

	return { categories, tramites, loading, categoria, setCategoria, search, setSearch };
};