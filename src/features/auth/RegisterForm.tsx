import { FaEnvelope, FaLock, FaHeart, FaEye } from 'react-icons/fa';
import { GrFormViewHide } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../../hooks/useRegister';
import { useState } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { LoginForm } from './LoginForm';
import './RegisterForm.scss';

export const Register = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    errors,
    watch,
    loading,
    serverError,
    localError,
    success,
    onSubmit,
  } = useRegister();
  const [openLogin, setOpenLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      {/* Modal de Login */}
      <Modal isOpen={openLogin} onClose={() => setOpenLogin(false)}>
        <LoginForm />
      </Modal>

      <div className="register-container">
        <div className={`register-card ${loading ? 'loading' : ''}`}>
          <div className="register-icon">
            <span>
              <FaHeart className="heart-icon" size={33} />
            </span>
          </div>

          <h2>{t('auth.register.title')}</h2>
          <p className="subtitle">{t('auth.register.subtitle')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder={t('auth.register.emailPlaceholder')}
                {...register('email', {
                  required: t('auth.validation.emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('auth.validation.emailInvalid'),
                  },
                })}
              />
              <p className={`error ${errors.email ? 'visible' : ''}`}>
                {errors.email?.message || ''}
              </p>
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.register.password')}
                {...register('password', {
                  required: t('auth.validation.passwordRequired'),
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message: t('auth.validation.passwordPattern'),
                  },
                })}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <GrFormViewHide /> : <FaEye />}
              </span>

              <p className={`error ${errors.password ? 'visible' : ''}`}>
                {errors.password?.message || ''}
              </p>
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('auth.register.confirmPassword')}
                {...register('confirmPassword', {
                  required: t('auth.validation.confirmPasswordRequired'),
                  validate: (value) =>
                    value === watch('password') ||
                    t('auth.validation.passwordMismatch'),
                })}
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <GrFormViewHide /> : <FaEye />}
              </span>

              <p className={`error ${errors.confirmPassword ? 'visible' : ''}`}>
                {errors.confirmPassword?.message || ''}
              </p>
            </div>

            {serverError && <p className="error server">{serverError}</p>}
            {localError && <p className="error server">{localError}</p>}
            {success && (
              <p className="success">{t('common.successfulRegistration')}</p>
            )}

            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? (
                <>
                  <FaLock className="locked-icon" /> {t('common.registering')}
                </>
              ) : (
                t('auth.register.submit')
              )}
            </button>

            <p className="login-link">
              {t('auth.register.hasAccount')}{' '}
              <button
                type="button"
                className="open-login-btn"
                onClick={() => setOpenLogin(true)}
              >
                {t('auth.register.login')}
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
