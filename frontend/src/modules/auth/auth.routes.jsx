// src/modules/auth/auth.routes.jsx
import { ProfileSelectionPage } from './pages/ProfileSelectionPage';
import { RegisterEstudiantePage } from './pages/RegisterEstudiantePage';
import { RegisterDocentePage } from './pages/RegisterDocentePage';
import { RegisterDependenciaPage } from './pages/RegisterDependenciaPage';
import { RegisterInstitucionPage } from './pages/RegisterInstitucionPage';
import { RegisterGeneralPage } from './pages/RegisterGeneralPage';
import { RegisterExternoPage } from './pages/RegisterExternoPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

export const authRoutes = [
  { path: '/', element: <ProfileSelectionPage /> },
  { path: '/registro/estudiante', element: <RegisterEstudiantePage /> },
  { path: '/registro/docente', element: <RegisterDocentePage /> },
  { path: '/registro/dependencia', element: <RegisterDependenciaPage /> },
  { path: '/registro/institucion', element: <RegisterInstitucionPage /> },
  { path: '/registro/general', element: <RegisterGeneralPage /> },
  { path: '/registro/externo', element: <RegisterExternoPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
];