import { BrowserRouter, useRoutes } from 'react-router-dom';

import { authRoutes } from './modules/auth';

import { TramitesConfirmationPage } from './modules/tracking/pages/TramitesConfirmationPage';
import { HistoryPage } from './modules/tracking/pages/HistoryPage';
import { TrackingTimelinePage } from './modules/tracking/pages/TrackingTimelinePage';
import { DocumentsPage } from './modules/tracking/pages/DocumentsPage';
import { UserManualPage } from './modules/tracking/pages/UserManualPage';
import { ComplaintsBookPage } from './modules/tracking/pages/ComplaintsBookPage';
import { ContactPage } from './modules/tracking/pages/ContactPage';


const AppRoutes = () =>
  useRoutes([
    ...authRoutes,

    // Confirmación de trámite
    {
      path: '/tramite/confirmacion/:codigo',
      element: <TramitesConfirmationPage />
    },

    // Historial de trámites
    {
      path: '/mis-tramites',
      element: <HistoryPage />
    },

    // Seguimiento de trámite
    {
      path: '/seguimiento/:expedienteId',
      element: <TrackingTimelinePage />
    },

    // Mis documentos
    {
      path: '/documentos',
      element: <DocumentsPage />
    },

    // Manual de usuario / Ayuda
    {
      path: '/ayuda',
      element: <UserManualPage />
    },

    // Libro de reclamaciones
    {
      path: '/libro-reclamaciones',
      element: <ComplaintsBookPage />
    },

    // Contacto institucional
    {
      path: '/contacto',
      element: <ContactPage />
    }
  ]);


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
