import { useNavigate } from 'react-router-dom';
import { CatalogLayout } from '../../catalog/components/CatalogLayout';
import { useCurrentUser } from '../../catalog/hooks/useCurrentUser';

export const UserDashboardPageLayout = ({ active, children }) => {
  const navigate = useNavigate();
  const { user, checked, logout } = useCurrentUser();

  if (!checked || !user) return null;

  return (
    <CatalogLayout user={user} active={active} onNavigate={navigate} onLogout={logout}>
      <div className="tracking-page-content">{children}</div>
    </CatalogLayout>
  );
};
