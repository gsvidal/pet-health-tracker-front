import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { useLogin } from '../../hooks/useLogin';
import './LoginForm.scss';

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

  return (
    <div className="login-container">
      <div className={`login-card ${loading ? 'loading' : ''}`}>
        <h2>Iniciar Sesión</h2>
        <p className="subtitle">Accedé al panel y gestiona todo fácilmente</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Correo electrónico"
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
              {errors.password?.message}
            </p>
          </div>

          <p className="forgot-password">
            <a
              href=""
              onClick={() => alert('Recuperar contraseña próximamente')}
            >
              ¿Olvidaste la contraseña?
            </a>
          </p>
          {serverError && <p className="error server">{serverError}</p>}
          {success && <p className="success">Ingreso exitoso</p>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <div className="separator">o</div>

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
