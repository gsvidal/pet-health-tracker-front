import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResetPassword } from '../../hooks/useResetPassword';
import './ResetPasswordForm.scss';
import { FaLock, FaEye } from 'react-icons/fa';
import { GrFormViewHide } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../config/routes';

interface Props {
  token: string;
}
const ResetPasswordForm: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    errors,
    watch,
    loading,
    serverError,
    success,
    onSubmit,
  } = useResetPassword(token);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      // setTimeout(() => {
      navigate(PUBLIC_ROUTES.LOGIN);
      // }, 3000);
    }
  }, [success]);

  return (
    <div className="reset-container">
      <div className={`reset-card ${loading ? 'loading' : ''}`}>
        <h2>{t('auth.resetPassword.title')}</h2>
        <p className="subtitle">{t('auth.resetPassword.subtitle')}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="reset-form">
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
              {...register('password', {
                required: t('auth.resetPassword.passwordRequired'),
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                  message: t('auth.resetPassword.passwordPattern'),
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
              placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
              {...register('confirmPassword', {
                required: t('auth.resetPassword.confirmPasswordRequired'),
                validate: (value) =>
                  value === watch('password') ||
                  t('auth.resetPassword.passwordsMismatch'),
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
          {success && (
            <p className="success">{t('auth.resetPassword.success')}</p>
          )}

          <button
            type="submit"
            className="btn-reset"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <FaLock className="locked-icon" />{' '}
                {t('auth.resetPassword.processing')}
              </>
            ) : (
              t('auth.resetPassword.submit')
            )}
          </button>
        </form>
        <p className="back-login">
          <a href={PUBLIC_ROUTES.LOGIN}>
            {t('auth.resetPassword.backToLogin')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
