import { useLocation, Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { PUBLIC_ROUTES } from '../../../../config/routes';
import './RegisterSuccessPage.scss';

export const RegisterSuccessPage = () => {
  const location = useLocation();
  const email = location.state?.email as string | undefined;

  return (
    <div className="register-success-container">
      <div className="register-success-card">
        <div className="register-success-icon">
          <FaEnvelope size={48} />
        </div>
        <h2>Revisa tu correo</h2>
        <p className="register-success-message">
          {email ? (
            <>
              Hemos enviado un enlace de verificación a{' '}
              <strong>{email}</strong>
            </>
          ) : (
            'Hemos enviado un enlace de verificación a tu correo electrónico'
          )}
        </p>
        <p className="register-success-instruction">
          Ve a tu correo y dale click al enlace para verificar tu cuenta y
          completar el registro
        </p>
        <div className="register-success-actions">
          <Link to={PUBLIC_ROUTES.LOGIN} className="register-success-link">
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

