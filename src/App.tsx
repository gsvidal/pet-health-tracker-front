import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { RegisterPage } from './pages/Home/RegisterPage';
import { Home } from './pages/Home/Home';
import { Dashboard } from './features/dashboard/pages/Dashboard/Dashboard';
import { Modal } from './components/Modal/Modal';
import { ExamplePage } from './features/example/pages/ExamplePage/ExamplePage';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './config/routes';
import { PrivateGuard } from './components/guards/PrivateGuard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      {/* // <Header /> Todo: Crear Header */}
      <main>
        <Routes>
          <Route path={PUBLIC_ROUTES.HOME} element={<Home />} />
          <Route path={PUBLIC_ROUTES.LOGIN} element={<ExamplePage />} />
          <Route path={PUBLIC_ROUTES.EXAMPLE} element={<ExamplePage />} />
          <Route path={PUBLIC_ROUTES.REGISTER} element={<RegisterPage />} />

          <Route element={<PrivateGuard />}>
            <Route path={PRIVATE_ROUTES.DASHBOARD} element={<Dashboard />} />
          </Route>
        </Routes>
      </main>
      {/* // <Footer /> Todo: Crear Footer */}
      <Modal />
      {/* <Toaster position="top-center" toastOptions={{ duration: 5000 }} /> */}
    </>
  );
}

export default App;
