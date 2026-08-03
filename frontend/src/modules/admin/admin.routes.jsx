import { Navigate } from 'react-router-dom';

import AdminDashboardPage from './pages/AdminDashboardPage';
import TramiteManagerPage from './pages/TramiteManagerPage';
import TramiteCreateEditPage from './pages/TramiteCreateEditPage';
import ExpedientesManagerPage from './pages/ExpedientesManagerPage';
import ExpedienteReviewPage from './pages/ExpedienteReviewPage';
import CategoriesManagerPage from './pages/CategoriesManagerPage';
import DocumentManagerPage from './pages/DocumentManagerPage';
import ComunicacionesAdminPage from './pages/ComunicacionesAdminPage';

import { getSession } from '../auth/services/authService';

function RequireAdminAuth({ children }) {
	const session = getSession();

	if (!session || session.role !== 'admin') {
		return <Navigate to="/admin/login" replace />;
	}

	return children;
}

export const AdminRoutes = [
	{
		path: '/admin/dashboard',
		element: (
			<RequireAdminAuth>
				<AdminDashboardPage />
			</RequireAdminAuth>
		),
	},
	{
		path: '/admin/tramites',
		element: (
			<RequireAdminAuth>
				<TramiteManagerPage />
			</RequireAdminAuth>
		),
	},
	{
		path: '/admin/tramites/nuevo',
		element: (
			<RequireAdminAuth>
				<TramiteCreateEditPage />
			</RequireAdminAuth>
		),
	},
	{
		path: '/admin/tramites/:id/editar',
		element: (
			<RequireAdminAuth>
				<TramiteCreateEditPage />
			</RequireAdminAuth>
		),
	},
	{
		path: '/admin/expedientes',
		element: (
			<RequireAdminAuth>
				<ExpedientesManagerPage />
			</RequireAdminAuth>
		),
	},
	{
		path: '/admin/expedientes/:id',
		element: (
			<RequireAdminAuth>
				<ExpedienteReviewPage />
			</RequireAdminAuth>
		),
	},
	{
		path: '/admin/categorias',
		element: (
			<RequireAdminAuth>
				<CategoriesManagerPage />
			</RequireAdminAuth>
		),
	},
	{
		path: '/admin/documentos',
		element: (
			<RequireAdminAuth>
				<DocumentManagerPage />
			</RequireAdminAuth>
		),
	},
	{
		path: '/admin/comunicaciones',
		element: (
			<RequireAdminAuth>
				<ComunicacionesAdminPage />
			</RequireAdminAuth>
		),
	},
	{
		path: '/admin',
		element: <Navigate to="/admin/dashboard" replace />,
	},
];