import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { PUBLIC_ROUTES } from '../../../../config/routes';
import './CheckEmailPage.scss';

export const CheckEmailPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const email = location.state?.email as string | undefined;

  return (
    <div className="check-email-container">
      <div className="check-email-card">
        <div className="check-email-icon">
          <FaEnvelope size={48} />
        </div>
        <h2>{t('auth.checkEmail.title')}</h2>
        <p className="check-email-message">
          {email
            ? t('auth.checkEmail.message', { email })
            : t('auth.checkEmail.messageGeneric')}
        </p>
        <p className="check-email-instruction">
          {t('auth.checkEmail.instruction')}
        </p>
        <div className="check-email-actions">
          <Link to={PUBLIC_ROUTES.LOGIN} className="check-email-link">
            <FaArrowLeft style={{ marginRight: '8px' }} />
            {t('auth.checkEmail.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

