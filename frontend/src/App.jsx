import { BrowserRouter, useRoutes } from 'react-router-dom';
import { authRoutes } from './modules/auth';
import { AdminRoutes } from './modules/admin';
import { catalogRoutes } from './modules/catalog';
import { trackingRoutes } from './modules/tracking';

const AppRoutes = () => useRoutes([...authRoutes, ...AdminRoutes, ...catalogRoutes, ...trackingRoutes]);

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
