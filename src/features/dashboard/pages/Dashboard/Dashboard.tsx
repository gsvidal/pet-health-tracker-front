import './Dashboard.scss';
import { useAuthStore } from '../../../../store/auth.store';
import { Button } from '../../../../components/Button/Button';

export const Dashboard = () => {
  const { user, logout, loading } = useAuthStore();

  return (
    <section className="dashboard">
      <div className="container container--dashboard">
        <h1 className="example__title">This is Dashboard page</h1>
        <p>Welcome {user?.username}</p>
        <p>Role: {user?.role}</p>
        <p>Member since: {user?.createdAt}</p>
        <div className="dashboard__actions">
          <Button variant="outline" onClick={logout} disabled={loading}>
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
};
