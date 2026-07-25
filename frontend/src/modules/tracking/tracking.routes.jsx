// src/modules/tracking/tracking.routes.jsx
import { TramitesConfirmationPage } from './pages/TramitesConfirmationPage';
import { HistoryPage } from './pages/HistoryPage';
import { TrackingTimelinePage } from './pages/TrackingTimelinePage';
import { UserManualPage } from './pages/UserManualPage';
import { ComplaintsBookPage } from './pages/ComplaintsBookPage';
import { ContactPage } from './pages/ContactPage';
import { DocumentsPage } from './pages/DocumentsPage';

export const trackingRoutes = [
  { path: '/tramite/confirmacion/:codigo', element: <TramitesConfirmationPage /> },
  { path: '/mis-tramites', element: <HistoryPage /> },
  { path: '/seguimiento/:expedienteId', element: <TrackingTimelinePage /> },
  { path: '/ayuda', element: <UserManualPage /> },
  { path: '/libro-de-reclamaciones', element: <ComplaintsBookPage /> },
  { path: '/contacto', element: <ContactPage /> },
  { path: '/mis-documentos', element: <DocumentsPage /> },
  //temporal
];