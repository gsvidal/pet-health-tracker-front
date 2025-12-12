import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useVerifyEmail } from '../../../../hooks/useVerifyEmail';
import { Loader } from '../../../../components/Loader/Loader';
import { PUBLIC_ROUTES } from '../../../../config/routes';
import './VerifyEmailPage.scss';

export const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get('token');
  const { verifyEmail, loading, successMessage, errorMessage } =
    useVerifyEmail();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (successMessage && !errorMessage) {
      // El toast ya se muestra en el store, solo redirigir después de un delay
      const id = setTimeout(() => {
        navigate(PUBLIC_ROUTES.LOGIN);
      }, 3000);
      return () => {
        clearTimeout(id);
      };
    }
    // No mostrar toast de error aquí porque el store ya lo maneja
  }, [successMessage, errorMessage, navigate]);

  if (!token) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className="verify-email-icon">
            <FaTimesCircle size={48} />
          </div>
          <h2>{t('auth.verifyEmail.invalidToken')}</h2>
          <p className="verify-email-error">
            {t('auth.verifyEmail.invalidTokenMessage')}
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
              <Loader text={t('auth.verifyEmail.verifying')} />
            </div>
            <h2>{t('auth.verifyEmail.verifying')}</h2>
            <p className="verify-email-loading">
              {t('auth.verifyEmail.verifyingMessage')}
            </p>
          </>
        )}

        {!loading && successMessage && !errorMessage && (
          <>
            <div
              className="verify-email-icon"
              style={{ color: 'var(--color-success)' }}
            >
              <FaCheckCircle size={48} />
            </div>
            <h2>{t('auth.verifyEmail.success')}</h2>
            <p className="verify-email-message">{successMessage}</p>
            <p className="verify-email-loading">
              {t('auth.verifyEmail.redirecting')}
            </p>
          </>
        )}

        {!loading && errorMessage && !successMessage && (
          <>
            <div
              className="verify-email-icon"
              style={{ color: 'var(--color-error)' }}
            >
              <FaTimesCircle size={48} />
            </div>
            <h2>{t('auth.verifyEmail.error')}</h2>
            <p className="verify-email-error">{errorMessage}</p>
          </>
        )}
      </div>
    </div>
  );
};
