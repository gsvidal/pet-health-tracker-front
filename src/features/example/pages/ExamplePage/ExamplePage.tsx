import './ExamplePage.scss';
import { useState } from 'react';
import { useAuthStore } from '../../../../store/auth.store';
import { Button } from '../../../../components/Button/Button';
import { Example } from '../../components/Example/Example';
import { useModalStore } from '../../../../store/modal.store';
import { PRIVATE_ROUTES } from '../../../../config/routes';
import { useNavigate } from 'react-router-dom';

export const ExamplePage = () => {
  const {
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated,
    mockLogin,
  } = useAuthStore();
  const { openModal } = useModalStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error ya manejado en el store
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password });
    } catch (err) {
      // Error ya manejado en el store
    }
  };

  const handleOpenTestModal = () => {
    openModal({
      title: 'Este es el titulo del modal',
      content: 'Este es el contenido (texto) del modal',
    });
  };

  const handleOpenConfirmModal = () => {
    openModal({
      title: '¿Estás seguro?',
      content: 'Esta acción no se puede deshacer',
      variant: 'confirm',
      onConfirm: () => {
        console.log('Confirmado');
      },
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
    });
  };

  const navigate = useNavigate();

  return (
    <>
      <section className="example-page">
        <div className="example-page__container">
          <div className="example-page__section">
            <h2>{isRegister ? 'Register Test' : 'Login Test'}</h2>
            {error && <p className="example-page__error">Error: {error}</p>}
            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
              </Button>
            </form>
            <div className="example-page__actions">
              <Button
                variant="secondary"
                onClick={() => setIsRegister(!isRegister)}
                disabled={loading}
              >
                Switch to {isRegister ? 'Login' : 'Register'}
              </Button>
              {isAuthenticated ? (
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    mockLogin();
                    navigate(PRIVATE_ROUTES.DASHBOARD);
                  }}
                  size="md"
                >
                  Mock Login
                </Button>
              )}
            </div>
          </div>

          <div className="example-page__section">
            <h2>Modal text tests (Text and Confirmacion)</h2>
            <div className="example-page__modal-actions">
              <Button onClick={handleOpenTestModal} disabled={loading}>
                Modal Text (Informative)
              </Button>
              <Button
                onClick={handleOpenConfirmModal}
                disabled={loading}
                variant="secondary"
              >
                Confirmation Modal
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
