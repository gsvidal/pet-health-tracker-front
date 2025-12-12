import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useRecoverPassword } from '../../hooks/useReqPasswordReset';
import './RecoverPasswordForm.scss';

export const RecoverPasswordForm = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, errors, loading, onSubmit } =
    useRecoverPassword();
  return (
    <div className="recover-container">
      <div className={`recover-card ${loading ? 'loading' : ''}`}>
        <h2>{t('auth.recoverPassword.title')}</h2>
        <p className="subtitle">{t('auth.recoverPassword.subtitle')}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="recover-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder={t('auth.recoverPassword.emailPlaceholder')}
              {...register('email', {
                required: t('auth.recoverPassword.emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('auth.recoverPassword.emailInvalid'),
                },
              })}
            />
            <p className={`error ${errors.email ? 'visible' : ''}`}>
              {errors.email?.message}
            </p>
          </div>
          <button type="submit" className="btn-recover" disabled={loading}>
            {loading ? (
              <>
                <FaLock className="locked-icon" />{' '}
                {t('auth.recoverPassword.sending')}
              </>
            ) : (
              t('auth.recoverPassword.submit')
            )}
          </button>
        </form>
        <p className="back-login">
          <a href="/register">{t('auth.recoverPassword.backToRegister')}</a>
        </p>
      </div>
    </div>
  );
};
