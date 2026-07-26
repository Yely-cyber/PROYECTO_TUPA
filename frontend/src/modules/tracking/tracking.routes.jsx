import { TramitesConfirmationPage } from './pages/TramitesConfirmationPage';
import { HistoryPage } from './pages/HistoryPage';
import { TrackingTimelinePage } from './pages/TrackingTimelinePage';
import { DocumentsPage } from './pages/DocumentsPage';
import { UserManualPage } from './pages/UserManualPage';
import { ComplaintsBookPage } from './pages/ComplaintsBookPage';
import { ContactPage } from './pages/ContactPage';
import { UserDashboardPageLayout } from './components/UserDashboardPageLayout';

export const trackingRoutes = [
  {
    path: '/tramite/confirmacion/:solicitudId',
    element: <UserDashboardPageLayout active="nuevo-tramite"><TramitesConfirmationPage /></UserDashboardPageLayout>,
  },
  {
    path: '/historial',
    element: <UserDashboardPageLayout active="mis-tramites"><HistoryPage /></UserDashboardPageLayout>,
  },
  {
    path: '/mis-tramites',
    element: <UserDashboardPageLayout active="mis-tramites"><HistoryPage /></UserDashboardPageLayout>,
  },
  {
    path: '/seguimiento/:expedienteId',
    element: <UserDashboardPageLayout active="mis-tramites"><TrackingTimelinePage /></UserDashboardPageLayout>,
  },
  {
    path: '/documentos',
    element: <UserDashboardPageLayout><DocumentsPage /></UserDashboardPageLayout>,
  },
  {
    path: '/mis-documentos',
    element: <UserDashboardPageLayout><DocumentsPage /></UserDashboardPageLayout>,
  },
  {
    path: '/ayuda',
    element: <UserDashboardPageLayout active="ayuda"><UserManualPage /></UserDashboardPageLayout>,
  },
  {
    path: '/libro-reclamaciones',
    element: <UserDashboardPageLayout active="libro-reclamaciones"><ComplaintsBookPage /></UserDashboardPageLayout>,
  },
  {
    path: '/contacto',
    element: <UserDashboardPageLayout active="contacto"><ContactPage /></UserDashboardPageLayout>,
  },
];
