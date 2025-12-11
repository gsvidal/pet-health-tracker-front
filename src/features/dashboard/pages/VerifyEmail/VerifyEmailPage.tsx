import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useVerifyEmail } from '../../../../hooks/useVerifyEmail';
import { Loader } from '../../../../components/Loader/Loader';
import toast from 'react-hot-toast';
import { PUBLIC_ROUTES } from '../../../../config/routes';
import './VerifyEmailPage.scss';

export const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { verifyEmail, loading, successMessage, errorMessage } =
    useVerifyEmail();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) verifyEmail(token);
    console.log('token from verify email page.tsx: ', token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      const id = setTimeout(() => {
        navigate(PUBLIC_ROUTES.LOGIN);
      }, 3000);
      return () => {
        clearTimeout(id);
      };
    }
    if (errorMessage) toast.error(errorMessage);
  }, [successMessage, errorMessage, navigate]);

  if (!token) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className="verify-email-icon">
            <FaTimesCircle size={48} />
          </div>
          <h2>Token inválido</h2>
          <p className="verify-email-error">
            El enlace de verificación no es válido o ha expirado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {loading && (
          <>
            <div className="verify-email-icon">
              <Loader text="Verificando email…" />
            </div>
            <h2>Verificando email...</h2>
            <p className="verify-email-loading">
              Por favor espera mientras verificamos tu cuenta
            </p>
          </>
        )}

        {!loading && successMessage && (
          <>
            <div className="verify-email-icon" style={{ color: 'var(--color-success)' }}>
              <FaCheckCircle size={48} />
            </div>
            <h2>¡Email verificado!</h2>
            <p className="verify-email-message">{successMessage}</p>
            <p className="verify-email-loading">
              Redirigiendo al inicio de sesión...
            </p>
          </>
        )}

        {!loading && errorMessage && (
          <>
            <div className="verify-email-icon" style={{ color: 'var(--color-error)' }}>
              <FaTimesCircle size={48} />
            </div>
            <h2>Error al verificar</h2>
            <p className="verify-email-error">{errorMessage}</p>
          </>
        )}
      </div>
    </div>
  );
};
