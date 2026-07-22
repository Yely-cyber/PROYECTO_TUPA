import { BrowserRouter, useRoutes } from 'react-router-dom';
import { authRoutes } from './modules/auth';

const AppRoutes = () => useRoutes(authRoutes);

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
