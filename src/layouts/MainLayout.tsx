import { Outlet } from 'react-router-dom';
import '../App.scss';

export const MainLayout = () => {
  return (
    <>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};
