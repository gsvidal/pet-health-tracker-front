import { Register } from '../../features/auth/RegisterForm';
import './RegisterPage.scss';
import { MdPets } from 'react-icons/md';

export const RegisterPage = () => {
  return (
    <section className="register-page">
      <div className="register-left">
        <div className="branding">
          <h1 id="pet-title">
            <MdPets className="MdPets-icon" />
            Pet Health Tracker
          </h1>
          <p id="pet-subtitle">
            Gestioná fácilmente la salud, alimentación y bienestar de tus
            mascotas.
          </p>
        </div>
      </div>

      <div className="register-right">
        <Register />
      </div>
    </section>
  );
};
