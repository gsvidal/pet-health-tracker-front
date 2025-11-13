import { Register } from '../../features/auth/RegisterForm';
import './RegisterPage.scss';

export const RegisterPage = () => {
  return (
    <section className="register-page">
      <div className="register-left">
        <div className="branding">
          <h1>🐾 Pet Health Tracker</h1>
          <p>
            Gestioná fácilmente la salud, alimentación y bienestar de tus
            mascotas desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="register-right">
        <Register />
      </div>
    </section>
  );
};
