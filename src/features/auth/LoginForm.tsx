import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useLogin } from '../../hooks/useLogin';
import './LoginForm.scss';
import { useState } from 'react';

export const LoginForm = () => {
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
        <h2>Iniciar Sesión</h2>
        <p className="subtitle">Accedé al panel y gestiona todo fácilmente</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* Email */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Correo electrónico"
              aria-label="Correo electrónico"
              {...register('email', {
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Correo inválido',
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
              placeholder="Contraseña"
              aria-label="Contraseña"
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'Debe tener al menos 6 caracteres',
                },
              })}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <p className={`error ${errors.password ? 'visible' : ''}`}>
              {errors.password?.message}
            </p>
          </div>

          {/* Enlace Recover Password */}
          <p className="forgot-password">
            <a href="/recover-password">¿Olvidaste la contraseña?</a>
          </p>

          {/* Errores y éxito */}
          {serverError && <p className="error server">{serverError}</p>}
          {success && <p className="success">Ingreso exitoso</p>}

          {/* Botón Login */}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <FaLock className="locked-icon" /> Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>

          {/* Divider */}
          <div className="separator">o</div>

          {/* Login con Google */}
          <button
            type="button"
            className="btn-google"
            onClick={() => alert('Google Login próximamente')}
          >
            <FaGoogle /> Ingresar con Google
          </button>
        </form>
      </div>
    </div>
  );
};
