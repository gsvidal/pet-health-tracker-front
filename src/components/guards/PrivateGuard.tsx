import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { PUBLIC_ROUTES } from '../../config/routes';

export const PrivateGuard = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="guard-loading">
        <p>Validando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={PUBLIC_ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
