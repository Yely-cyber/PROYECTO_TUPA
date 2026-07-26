import { BrowserRouter, useRoutes } from 'react-router-dom';
import { authRoutes } from './modules/auth';
import { catalogRoutes } from './modules/catalog';

const AppRoutes = () => useRoutes([...authRoutes, ...catalogRoutes]);

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
