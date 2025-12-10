import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '../../config/routes';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import './Header.scss';
import { IoMdReturnLeft } from 'react-icons/io';
import { NotificationDropdown } from './NotificationDropdown';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, logout } = useAuthStore();

  const showBackButton = pathname.startsWith('/pets/:id');

  const needToGoBackToDashboard =
    pathname.includes('/pets') ||
    pathname.includes('/notifications') ||
    pathname.includes('/activity-logs');

  return (
    <header className="sticky-header">
      <div className="container">
        {/* Botón Volver */}
        {showBackButton && (
          <button
            className="header-back-btn"
            onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD)}
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
        )}

        {/* Logo */}
        <div className="logo" onClick={() => navigate(PUBLIC_ROUTES.HOME)}>
          <div className="logo-icon">
            <img src="/paw.svg" alt="Pet Health Tracker" />
          </div>
          <span className="logo-text">Pet Health Tracker</span>

          {/* Botón Hamburguesa */}
          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevenir que el click se propague al div logo
              setMenuOpen(!menuOpen);
            }}
            aria-label="Abrir menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Navegación */}
        <nav className={menuOpen ? 'open' : ''}>
          {pathname === '/' && (
            <>
              <a href="#inicio" onClick={() => setMenuOpen(false)}>
                Inicio
              </a>
              <a href="#caracteristicas" onClick={() => setMenuOpen(false)}>
                Características
              </a>
              <a href="#nosotros" onClick={() => setMenuOpen(false)}>
                Nosotros
              </a>
              <a href="#contacto" onClick={() => setMenuOpen(false)}>
                Contacto
              </a>
            </>
          )}

          {pathname === PUBLIC_ROUTES.HOME && isAuthenticated && (
            <Link to={PRIVATE_ROUTES.DASHBOARD} className="link--dashboard">
              Dashboard
            </Link>
          )}
          <ThemeToggle onToggle={() => setMenuOpen(false)} />
          <div className="btn-wrapper">
            {pathname === PRIVATE_ROUTES.DASHBOARD ||
            pathname === PRIVATE_ROUTES.NOTIFICATIONS ? (
              <>
                <NotificationDropdown />
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(PUBLIC_ROUTES.HOME);
                    logout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (pathname === PUBLIC_ROUTES.HOME && isAuthenticated) ? (
              <Button
                size="lg"
                variant="primary"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(PUBLIC_ROUTES.HOME);
                  logout();
                }}
              >
                Logout
              </Button>
            ) : (
              pathname === '/' && (
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(PUBLIC_ROUTES.REGISTER);
                  }}
                >
                  Registrarse
                </Button>
              )
            )}
            {/* TODO: agregar volver a pagina pet */}
            {needToGoBackToDashboard && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(PRIVATE_ROUTES.DASHBOARD);
                }}
              >
                <IoMdReturnLeft style={{ marginRight: '6px' }} />
                Volver al Dashboard
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
