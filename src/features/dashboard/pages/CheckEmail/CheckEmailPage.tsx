import { useLocation, Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { PUBLIC_ROUTES } from '../../../../config/routes';
import './CheckEmailPage.scss';

export const CheckEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email as string | undefined;

  return (
    <div className="check-email-container">
      <div className="check-email-card">
        <div className="check-email-icon">
          <FaEnvelope size={48} />
        </div>
        <h2>Revisa tu correo</h2>
        <p className="check-email-message">
          {email ? (
            <>
              Hemos enviado un enlace de recuperación a{' '}
              <strong>{email}</strong>
            </>
          ) : (
            'Hemos enviado un enlace de recuperación a tu correo electrónico'
          )}
        </p>
        <p className="check-email-instruction">
          Ve a tu correo y dale click al enlace para continuar con el reseteo de
          contraseña
        </p>
        <div className="check-email-actions">
          <Link to={PUBLIC_ROUTES.LOGIN} className="check-email-link">
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

