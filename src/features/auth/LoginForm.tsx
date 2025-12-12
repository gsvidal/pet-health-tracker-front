import { FaEnvelope, FaLock, FaEye } from 'react-icons/fa';
import { GrFormViewHide } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../../hooks/useLogin';
import './LoginForm.scss';
import { useState } from 'react';

export const LoginForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    errors,
    loading,
    serverError,
    success,
    onSubmit,
  } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className={`login-card ${loading ? 'loading' : ''}`}>
        <h2>{t('auth.login.title')}</h2>
        <p className="subtitle">{t('auth.login.subtitle')}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* Email */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder={t('auth.login.email')}
              aria-label={t('auth.login.email')}
              {...register('email', {
                required: t('auth.validation.emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('auth.validation.emailInvalid'),
                },
              })}
            />
            <p className={`error ${errors.email ? 'visible' : ''}`}>
              {errors.email?.message}
            </p>
          </div>

          {/* Contraseña */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.login.password')}
              aria-label={t('auth.login.password')}
              {...register('password', {
                required: t('auth.validation.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('auth.validation.passwordMinLength'),
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
              {errors.password?.message}
            </p>
          </div>

          {/* Enlace Recover Password */}
          <p className="forgot-password">
            <a href="/request-password-reset">
              {t('auth.login.forgotPassword')}
            </a>
          </p>

          {/* Errores y éxito */}
          {serverError && <p className="error server">{serverError}</p>}
          {success && <p className="success">{t('common.successfulLogin')}</p>}

          {/* Botón Login */}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <FaLock className="locked-icon" /> {t('common.signingIn')}
              </>
            ) : (
              t('auth.login.submit')
            )}
          </button>

          {/* Divider */}
          {/* <div className="separator">{t('common.orContinueWith')}</div> */}

          {/* Login con Google */}
          {/* <button
            type="button"
            className="btn-google"
            onClick={() => alert('Google Login próximamente')}
          >
            <FaGoogle /> {t('common.signInWithGoogle')}
          </button> */}

          {/* Link para registrarse */}
          <p className="register-link">
            {t('auth.login.noAccount')}{' '}
            <a href="/register">{t('auth.login.register')}</a>
          </p>
        </form>
      </div>
    </div>
  );
};
