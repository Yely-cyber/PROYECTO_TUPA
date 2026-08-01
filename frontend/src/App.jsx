import { BrowserRouter, useRoutes } from 'react-router-dom';

import { authRoutes } from './modules/auth';
import { catalogRoutes } from './modules/catalog';
import { trackingRoutes } from './modules/tracking';
import { AdminRoutes } from './modules/admin';


const AppRoutes = () =>
  useRoutes([
    ...authRoutes,
    ...catalogRoutes,
    ...trackingRoutes,
    ...AdminRoutes,
  ]);

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;