// src/modules/catalog/catalog.routes.jsx
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { NewTramitePage } from './pages/NewTramitePage';

export const catalogRoutes = [
	{ path: '/dashboard', element: <DashboardPage /> },
	{ path: '/nuevo-tramite', element: <CatalogPage /> },
	{ path: '/solicitud/:tramiteId', element: <NewTramitePage /> },
];
