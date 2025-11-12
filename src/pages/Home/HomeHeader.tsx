import { Button } from '../../components/Button/Button';
import './HomeHeader.scss';
import { Heart } from "lucide-react";

export function HomeHeader() {
  return (
    <header className="sticky-header">
      <div className="container">

        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">
            <Heart className="h-6 w-6 text-white" fill="white" />
          </div>
          <span className="logo-text">Pet Health Tracker</span>
        </div>

        {/* Navigation */}
        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#caracteristicas">Características</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>

          <div className="btn-wrapper">
            <Button size="lg" variant="primary">
              Registrarse
            </Button>
          </div>
        </nav>

      </div>
    </header>
  );
}
