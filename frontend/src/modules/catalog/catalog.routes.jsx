// src/modules/catalog/catalog.routes.jsx
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { NewTramitePage } from './pages/NewTramitePage';
import { ComingSoonPage } from './pages/ComingSoonPage';

export const catalogRoutes = [
	{ path: '/dashboard', element: <DashboardPage /> },
	{ path: '/nuevo-tramite', element: <CatalogPage /> },
	{ path: '/solicitud/:tramiteId', element: <NewTramitePage /> },
	{
		path: '/solicitud/:tramiteId/confirmacion',
		element: <ComingSoonPage title="Confirmación de Trámite" active="nuevo-tramite" />,
	},
	{ path: '/historial', element: <ComingSoonPage title="Mis Trámites" active="mis-tramites" /> },
	{ path: '/ayuda', element: <ComingSoonPage title="Ayuda" active="ayuda" /> },
	{
		path: '/libro-reclamaciones',
		element: <ComingSoonPage title="Libro de Reclamaciones" active="libro-reclamaciones" />,
	},
	{ path: '/contacto', element: <ComingSoonPage title="Contáctanos" active="contacto" /> },
];
