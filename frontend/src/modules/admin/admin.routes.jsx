// src/modules/admin/admin.routes.jsx
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { TramitesManagerPage } from './pages/TramitesManagerPage';
import { TramiteCreateEditPage } from './pages/TramiteCreateEditPage';
import { ExpedientesManagerPage } from './pages/ExpedientesManagerPage';
import { ExpedienteReviewPage } from './pages/ExpedienteReviewPage';
import { CategoriesManagerPage } from './pages/CategoriesManagerPage';
import { DocumentManagerPage } from './pages/DocumentManagerPage';

export const adminRoutes = [
  { path: '/admin/dashboard', element: <AdminDashboardPage /> },
  { path: '/admin/tramites', element: <TramitesManagerPage /> },
  { path: '/admin/tramites/nuevo', element: <TramiteCreateEditPage /> },
  { path: '/admin/expedientes', element: <ExpedientesManagerPage /> },
  { path: '/admin/expedientes/:id/revisar', element: <ExpedienteReviewPage /> },
  { path: '/admin/categorias', element: <CategoriesManagerPage /> },
  { path: '/admin/documentos', element: <DocumentManagerPage /> },
];