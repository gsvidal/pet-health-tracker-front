import { useLocation, Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { PUBLIC_ROUTES } from '../../../../config/routes';
import './RegisterSuccessPage.scss';

export const RegisterSuccessPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const email = location.state?.email as string | undefined;

  return (
    <div className="register-success-container">
      <div className="register-success-card">
        <div className="register-success-icon">
          <FaEnvelope size={48} />
        </div>
        <h2>{t('auth.registerSuccess.title')}</h2>
        <p className="register-success-message">
          {email ? (
            <>{t('auth.registerSuccess.message', { email: email })}</>
          ) : (
            t('auth.registerSuccess.messageGeneric')
          )}
        </p>
        <p className="register-success-instruction">
          {t('auth.registerSuccess.instruction')}
        </p>
        <div className="register-success-actions">
          <Link to={PUBLIC_ROUTES.LOGIN} className="register-success-link">
            <FaArrowLeft style={{ marginRight: '8px' }} />
            {t('auth.registerSuccess.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};
