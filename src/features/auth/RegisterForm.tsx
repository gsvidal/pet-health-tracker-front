import { FaEnvelope, FaLock, FaHeart } from 'react-icons/fa';
import { useRegister } from '../../hooks/useRegister';
import './RegisterForm.scss';

export const Register = () => {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    serverError,
    success,
    onSubmit,
  } = useRegister();
  return (
    <div className="register-container">
      <div className={`register-card ${loading ? 'loading' : ''}`}>
        <div className="register-icon">
          <span>
            <FaHeart className="heart-icon" size={33} />
          </span>
        </div>
        <h2>Crear Cuenta</h2>
        <p className="subtitle">
          Comienza a gestionar la salud de tus mascotas
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="tu@email.com"
              {...register('email', {
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Correo inválido',
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
              type="password"
              placeholder="Contraseña"
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'Debe tener al menos 6 caracteres',
                },
              })}
            />
            <p className={`error ${errors.password ? 'visible' : ''}`}>
              {errors.password?.message || ''}
            </p>
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              {...register('confirmPassword', {
                required: 'Debe confirmar la contraseña',
              })}
            />
            <p className={`error ${errors.confirmPassword ? 'visible' : ''}`}>
              {errors.confirmPassword?.message || ''}
            </p>
          </div>
          {serverError && <p className="error server">{serverError}</p>}
          {success && <p className="success">✅ Registro exitoso</p>}
          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          <p className="login-link">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </form>
      </div>
    </div>
  );
};
