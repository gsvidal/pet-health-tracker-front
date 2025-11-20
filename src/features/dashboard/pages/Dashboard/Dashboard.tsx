import './Dashboard.scss';
import { useAuthStore } from '../../../../store/auth.store';
import { Button } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from '../../../../config/routes';

export const Dashboard = () => {
  const { user, logout, loading } = useAuthStore();
  const navigate = useNavigate();

  return (
    <section className="dashboard">
      <div className="container container--dashboard">
        <h1 className="example__title">This is Dashboard page</h1>
        <p>Welcome {user?.username}</p>
        <p>Role: {user?.role}</p>
        <p>Member since: {user?.createdAt}</p>

        <div className="dashboard__actions">
          <Button
            variant="outline"
            onClick={() => navigate(PRIVATE_ROUTES.CREATE_PET)}>
            Crear Mascota
          </Button>
          <Button variant="outline" onClick={logout} disabled={loading}>
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
};
