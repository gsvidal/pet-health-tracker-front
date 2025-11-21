import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { RegisterPage } from './features/dashboard/pages/Register/RegisterPage';
import { MainLayout } from './layouts/MainLayout';
import { FullLayout } from './layouts/FullLayout';
import { RecoverPasswordPage } from './features/dashboard/pages/RecoverPassword/RecoverPasswordPage';
import { Home } from './pages/Home/Home';
import { Dashboard } from './features/dashboard/pages/Dashboard/Dashboard';
import { ExamplePage } from './features/example/pages/ExamplePage/ExamplePage';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './config/routes';
import { PrivateGuard } from './components/guards/PrivateGuard';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './features/dashboard/pages/Login/LoginPage';
import { NotFound } from './components/NotFound/NotFound';
import { ModalText } from './components/Modal/ModalText';
import { useModalStore } from './store/modal.store';
import { VerifyEmailPage } from './features/dashboard/pages/VerifyEmail/VerifyEmailPage';
import { CreatePetForm } from './features/dashboard/pages/PetForm/PetFormPage';

function App() {
  const {
    isOpen,
    title,
    content,
    variant,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
    closeModal,
  } = useModalStore();

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
            <Route
              path={PUBLIC_ROUTES.VERIFY_EMAIL}
              element={<VerifyEmailPage />}
            />
          </Route>

          <Route element={<PrivateGuard />}>
            <Route element={<MainLayout />}>
              <Route path={PRIVATE_ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route
                path={PRIVATE_ROUTES.CREATE_PET}
                element={<CreatePetForm />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* // <Footer /> Todo: Crear Footer */}
      <ModalText
        isOpen={isOpen}
        onClose={closeModal}
        title={title || undefined}
        content={content}
        variant={variant}
        onConfirm={onConfirm || undefined}
        onCancel={onCancel || undefined}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
      />
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
    </>
  );
}

export default App;
