import React, { useEffect, useState } from 'react';
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
        <h2>Restablecer contraseña</h2>
        <p className="subtitle">
          Ingresa tu nueva contraseña para restablecer tu cuenta.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="reset-form">
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              {...register('password', {
                required: 'La contraseña es obligatoria',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                  message: 'Mínimo 8 caracteres, 1 mayúscula y 1 número',
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
              placeholder="Confirmar contraseña"
              {...register('confirmPassword', {
                required: 'Debes confirmar la contraseña',
                validate: (value) =>
                  value === watch('password') || 'Las contraseñas no coinciden',
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
            <p className="success">
              ¡Contraseña actualizada con éxito! 🎉 Redirigiendo...
            </p>
          )}

          <button
            type="submit"
            className="btn-reset"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <FaLock className="locked-icon" /> Procesando...
              </>
            ) : (
              'Actualizar contraseña'
            )}
          </button>
        </form>
        <p className="back-login">
          <a href={PUBLIC_ROUTES.LOGIN}>Volver a Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
