import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import './App.scss';
import { RegisterPage } from './features/dashboard/pages/Register/RegisterPage';
import { FullLayout } from './layouts/FullLayout';
import { RecoverPasswordPage } from './features/dashboard/pages/RecoverPassword/RecoverPasswordPage';
import { Home } from './pages/Home/Home';
import { Dashboard } from './features/dashboard/pages/Dashboard/Dashboard';
// import { ExamplePage } from './features/example/pages/ExamplePage/ExamplePage';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './config/routes';
import { PrivateGuard } from './components/guards/PrivateGuard';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { LoginPage } from './features/dashboard/pages/Login/LoginPage';
import { NotFound } from './components/NotFound/NotFound';
import { ModalText } from './components/Modal/ModalText';
import { useModalStore } from './store/modal.store';
import { VerifyEmailPage } from './features/dashboard/pages/VerifyEmail/VerifyEmailPage';
import { CreatePetForm } from './features/dashboard/pages/PetForm/PetFormPage';
import { DetailsPage } from './features/dashboard/pages/Details/DetailsPage';
import ResetPasswordPage from './features/dashboard/pages/Reset/ResetPage';
import { ActivityLogs } from './features/audit-logs/pages/ActivityLogs/ActivityLogs';
import { useThemeStore } from './store/theme.store';
import { CheckEmailPage } from './features/dashboard/pages/CheckEmail/CheckEmailPage';
import { RegisterSuccessPage } from './features/dashboard/pages/RegisterSuccess/RegisterSuccessPage';
import { NotificationsView } from './features/dashboard/pages/Notifications/NotificationsView';
import { CalendarView } from './features/dashboard/pages/Calendar/CalendarView';

function App() {
  const { theme } = useThemeStore();

  // Verificar si hay un mensaje de sesión expirada al cargar
  useEffect(() => {
    const expiredMessage = sessionStorage.getItem('session-expired-message');
    if (expiredMessage) {
      toast.error(expiredMessage, {
        duration: 4000,
      });
      // Limpiar el mensaje después de mostrarlo
      sessionStorage.removeItem('session-expired-message');
    }
  }, []);

  // Aplicar el tema al cargar la aplicación (solo una vez)
  useEffect(() => {
    // El tema ya se aplica automáticamente desde el store al rehidratar
    // Este useEffect solo asegura que se aplique si hay algún problema
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []); // Solo se ejecuta una vez al montar
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
          <Route path={PUBLIC_ROUTES.HOME} element={<Home />} />
          <Route path={PUBLIC_ROUTES.LOGIN} element={<LoginPage />} />
          <Route element={<FullLayout />}>
            <Route path={PUBLIC_ROUTES.REGISTER} element={<RegisterPage />} />
            <Route
              path={PUBLIC_ROUTES.RECOVER_PSW}
              element={<RecoverPasswordPage />}
            />
            <Route
              path={PUBLIC_ROUTES.RESET_PSW}
              element={<ResetPasswordPage />}
            />
            <Route
              path={PUBLIC_ROUTES.VERIFY_EMAIL}
              element={<VerifyEmailPage />}
            />
            <Route
              path={PUBLIC_ROUTES.CHECK_EMAIL_RESET_PASSWORD}
              element={<CheckEmailPage />}
            />
            <Route
              path={PUBLIC_ROUTES.CHECK_EMAIL_VERIFY}
              element={<RegisterSuccessPage />}
            />
          </Route>

          <Route element={<PrivateGuard />}>
            <Route path={PRIVATE_ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route
              path={PRIVATE_ROUTES.CREATE_PET}
              element={<CreatePetForm />}
            />
            <Route path={PRIVATE_ROUTES.PET_DETAIL} element={<DetailsPage />} />
            <Route
              path={PRIVATE_ROUTES.ACTIVITY_LOGS}
              element={<ActivityLogs />}
            />
            <Route
              path={PRIVATE_ROUTES.NOTIFICATIONS}
              element={<NotificationsView />}
            />
            <Route
              path={PRIVATE_ROUTES.CALENDAR}
              element={<CalendarView />}
            />
          </Route>
          <Route element={<PrivateGuard />}>
            <Route element={<FullLayout />}>
              <Route
                path={PRIVATE_ROUTES.PET_DETAIL}
                element={<DetailsPage />}
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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 8000,
          style: { backgroundColor: theme === 'dark' ? '#a0a0a0' : '#ede9fe', fontSize: '1.5rem' },
          
        }}
      />
    </>
  );
}

export default App;
