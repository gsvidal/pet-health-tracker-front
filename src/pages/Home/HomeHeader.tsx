import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { Heart } from "lucide-react";
import "./HomeHeader.scss";

export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky-header">
      <div className="container">

        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">
            <Heart className="h-6 w-6 text-white" fill="white" />
          </div>
          <span className="logo-text">Pet Health Tracker</span>

          {/* Botón Hamburguesa */}
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Navegación */}
        <nav className={menuOpen ? "open" : ""}>
          <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
          <a href="#caracteristicas" onClick={() => setMenuOpen(false)}>Características</a>
          <a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a>
          <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>

          <div className="btn-wrapper">
            <Button size="lg" variant="primary" onClick={() => setMenuOpen(false)}>
              Registrarse
            </Button>
          </div>
        </nav>

      </div>
    </header>
  );
}
