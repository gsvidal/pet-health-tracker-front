import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useRecoverPassword } from '../../hooks/useRecoverPassword';
import './RecoverPasswordForm.scss';

export const RecoverPasswordForm = () => {
  const { register, handleSubmit, errors, loading, serverError, onSubmit } =
    useRecoverPassword();
  return (
    <div className="recover-container">
      <div className={`recover-card ${loading ? 'loading' : ''}`}>
        <h2>Recuperar contraseña</h2>
        <p className="subtitle">
          Ingresa correo y te enviaremos un enlace para restablecerla
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="recover-form">
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
          {serverError && <p className="error server">{serverError}</p>}

          <button type="submit" className="btn-recover" disabled={loading}>
            {loading ? (
              <>
                <FaLock className="locked-icon" /> Enviando...
              </>
            ) : (
              'Enviar enlace'
            )}
          </button>
        </form>
        <p className="back-login">
          <a href="/register">Volver a Registro</a>
        </p>
      </div>
    </div>
  );
};
