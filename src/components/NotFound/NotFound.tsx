import { Link } from 'react-router-dom';
import { Button } from '../Button/Button';
import { PUBLIC_ROUTES } from '../../config/routes';
import './NotFound.scss';

export const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__content">
          <h1 className="not-found__title">404</h1>
          <h2 className="not-found__subtitle">Página no encontrada</h2>
          <p className="not-found__message">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <div className="not-found__image">
            <img
              src="https://www.blackhillsinfosec.com/wp-content/uploads/2016/07/66619265.jpg"
              alt="Obi Wan Kenobi's most famous phrase scene with droids"
              width={500}
              className="not-found__img"
            />
          </div>
          <div className="not-found__actions">
            <Link to={PUBLIC_ROUTES.HOME}>
              <Button variant="primary" size="lg">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
