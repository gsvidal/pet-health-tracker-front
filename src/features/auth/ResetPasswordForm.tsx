import React from 'react';
import { useResetPassword } from '../../hooks/useResetPassword';

interface Props {
  token: string;
}
const ResetPasswordForm: React.FC<Props> = ({ token }) => {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    serverError,
    success,
    onSubmit,
  } = useResetPassword(token);
  return (
    <div className="reset-container">
      <h2 className="title">Restablecer contraseña</h2>
      <form className="reset-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Password */}
        <div className="form-group">
          <label>Nueva contraseña</label>
          <input
            type="password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
            })}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>
        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Debes confirmar la contraseña',
            })}
            className={errors.confirmPassword ? 'input-error' : ''}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword.message}</p>
          )}
        </div>
        {/* Error desde el servidor */}
        {serverError && <p className="server-error">{serverError}</p>}
        {/* Mensaje de éxito */}
        {success && (
          <p className="success-message">
            ¡Contraseña actualizada con éxito! 🎉
          </p>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
