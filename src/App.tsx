import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { RegisterPage } from './features/dashboard/pages/Register/RegisterPage';
import { MainLayout } from './layouts/MainLayout';
import { FullLayout } from './layouts/FullLayout';
import { RecoverPasswordPage } from './features/dashboard/pages/RecoverPassword/RecoverPasswordPage';
import { Home } from './pages/Home/Home';
import { Dashboard } from './features/dashboard/pages/Dashboard/Dashboard';
import { Modal } from './components/Modal/ModalText';
import { ExamplePage } from './features/example/pages/ExamplePage/ExamplePage';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './config/routes';
import { PrivateGuard } from './components/guards/PrivateGuard';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './features/dashboard/pages/Login/LoginPage';
import { NotFound } from './components/NotFound/NotFound';

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={PUBLIC_ROUTES.HOME} element={<Home />} />
          </Route>
          <Route path={PUBLIC_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={PUBLIC_ROUTES.EXAMPLE} element={<ExamplePage />} />
          <Route element={<FullLayout />}>
            <Route path={PUBLIC_ROUTES.REGISTER} element={<RegisterPage />} />
            <Route
              path={PUBLIC_ROUTES.RECOVER_PSW}
              element={<RecoverPasswordPage />}
            />
          </Route>

          <Route element={<PrivateGuard />}>
            <Route element={<MainLayout />}>
              <Route path={PRIVATE_ROUTES.DASHBOARD} element={<Dashboard />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* // <Footer /> Todo: Crear Footer */}
      <Modal />
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
    </>
  );
}

export default App;
