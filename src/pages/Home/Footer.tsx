import { Heart } from 'lucide-react';
import { LuFacebook, LuInstagram, LuLinkedin, LuTwitter } from 'react-icons/lu';
import "./Home.scss";
//import './Footer.scss';

export const Footer = () => {
  return (
    <>
      <div id="contacto" className="footer">
        <div className="footer__left">
          <div className="logo">
            <div className="logo-icon">
              <Heart className="h-6 w-6 text-white" fill="white" />
            </div>
            <span className="logo-text">Pet Health Tracker</span>
          </div>
          <p>
            La plataforma líder en gestión de salud para mascotas. Cuidamos lo
            que más quieres.
          </p>
          <div className="footer__social-icons">
            {/* Todo: Logos redes sociales */}
            <span className="footer__social-icon">
              <LuFacebook size={16} />
            </span>
            <span className="footer__social-icon">
              <LuInstagram size={16} />
            </span>
            <span className="footer__social-icon">
              <LuTwitter size={16} />
            </span>
            <span className="footer__social-icon">
              <LuLinkedin size={16} />
            </span>
          </div>
        </div>
        {/* <nav className="footer_nav"> */}
        <div className="footer_nav_column">
          <strong className="footer_nav_title">Producto</strong>
          <ul className="footer__nav_links">
            <li>Caracteristicas</li>
            <li>Precios</li>
            <li>Demo</li>
            <li>Actualizaciones</li>
          </ul>
        </div>
        <div className="footer_nav_column">
          <strong className="footer_nav_title">Empresa</strong>
          <ul className="footer__nav_links">
            <li>Sobre Nosotros</li>
            <li>Blog</li>
            <li>Carreras</li>
            <li>Contacto</li>
          </ul>
        </div>
        <div className="footer_nav_column">
          <strong className="footer_nav_title">Legal</strong>
          <ul className="footer__nav_links">
            <li>Privacidad</li>
            <li>Términos de Uso</li>
            <li>Cookies</li>
            <li>Licencias</li>
          </ul>
        </div>
        {/* </nav> */}
      </div>
      <hr />
      <p className="footer-copyright">
        © 2025 Pet Health Tracker. Todos los derechos reservados.
      </p>
    </>
  );
};
