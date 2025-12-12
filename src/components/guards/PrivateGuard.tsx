import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { PUBLIC_ROUTES } from '../../config/routes';
import { Loader } from '../Loader/Loader';
import { Header } from '../../pages/Header/Header';

// En PrivateGuard.tsx
export const PrivateGuard = () => {
  const { isAuthenticated, loading, accessToken } = useAuthStore();

  // Solo bloquear si estamos cargando Y no tenemos token (autenticación inicial)
  // Si ya tenemos token pero loading es true (por getUserData), no bloquear
  if (loading && !accessToken) {
    return (
      <div className="guard-loading">
        <Loader text="Validando sesión..." size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={PUBLIC_ROUTES.LOGIN} replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
