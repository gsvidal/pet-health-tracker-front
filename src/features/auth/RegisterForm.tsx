import { FaEnvelope, FaLock, FaHeart, FaEye } from 'react-icons/fa';
import { GrFormViewHide } from 'react-icons/gr';

import { useRegister } from '../../hooks/useRegister';
import { useState } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { LoginForm } from './LoginForm';
import './RegisterForm.scss';

export const Register = () => {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    loading,
    serverError,
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
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
                  required: 'Debe confirmar la contraseña',
                  validate: (value) =>
                    value === watch('password') ||
                    'Las contraseñas no coinciden',
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
            {success && <p className="success">✅ Registro exitoso</p>}

            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? (
                <>
                  <FaLock className="locked-icon" /> Registrando...
                </>
              ) : (
                'Registrarse'
              )}
            </button>

            <p className="login-link">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="open-login-btn"
                onClick={() => setOpenLogin(true)}
              >
                Iniciar sesión
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
