import { ArrowRight, CircleCheck } from 'lucide-react';
import './Home.scss';
//import './HomeUs.scss';
import { Button } from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../config/routes';

export const HomeUs = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="section-1" id="nosotros">
        <div className="container container--homeus">
          <div className="image-container">
            <img
              src="https://images.unsplash.com/photo-1710322928695-c7fb49886cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwY2FyZXxlbnwxfHx8fDE3NjI4MDQwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              width="500"
              alt="Un gato pardo mirando en el veterinario"
            />
          </div>
          <div className="content">
            <div className="badge">Sobre Nosotros</div>
            <h2 className="content-title">
              Gestiona la salud y bienestar de tus mascotas desde un solo lugar
            </h2>
            <p>
              Pet Health Tracker nació para resolver la necesidad de los dueños
              de mascotas de tener un control centralizado sobre la salud y
              bienestar de sus compañeros. Desarrollamos una solución digital
              completa que simplifica el registro de vacunación, alimentación,
              citas veterinarias y recordatorios.
            </p>
            <p>
              Nuestra plataforma está construida con estándares de seguridad
              robustos, arquitectura escalable y una experiencia de usuario
              mobile-first que prioriza la simplicidad y la eficiencia en cada
              interacción.
            </p>
            <ul className="home__us-feats">
              <li className="home__us-feat">
                <span className="home__us-icon">
                  <CircleCheck color="#be185d" />
                </span>
                <strong>Estamos en todos tus dispositivos</strong>
                <p>
                  Diseño intuito para tu smartphone, tablet, laptop o
                  computadora de escritorio
                </p>
              </li>
              <li className="home__us-feat">
                <span className="home__us-icon">
                  <CircleCheck color="#be185d" />
                </span>
                <strong>Performance Superior</strong>
                <p>
                  Respuesta ágil incluso con múltiples registros y perfiles de
                  mascotas
                </p>
              </li>
              <li className="home__us-feat">
                <span className="home__us-icon">
                  <CircleCheck color="#be185d" />
                </span>
                <strong>Escalabilidad Garantizada</strong>
                <p>
                  Preparado para integrar wearables y seguimiento de actividad
                  física
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section-2">
        <div className="section-container container">
          <div className="content-2">
            <h2 className="content-title-2">
              Comienza a gestionar la salud de tus mascotas hoy
            </h2>
            <p>
              Regístrate gratis y crea perfiles completos para tus mascotas.
              Empieza a registrar vacunas, controlar su alimentación y recibir
              recordatorios automáticos. Únete a miles de dueños que ya confían
              en Pet Health Tracker.
            </p>
            <div className="buttons-container">
              <Button
                variant="secondary"
                onClick={() => navigate(PUBLIC_ROUTES.REGISTER)}
              >
                Crear Cuenta Gratuita
                <ArrowRight style={{ marginLeft: 8, width: 20, height: 20 }} />
              </Button>
              {/* <Button>Explorar Demo</Button> */}
            </div>
            <div className="avatars">
              <span className="avatar avatar--1"></span>
              <span className="avatar avatar--2"></span>
              <span className="avatar avatar--3"></span>
              <span className="avatar avatar--4"></span>
              <span className="avatars-text">
                Más de 8,500 usuarios activos confían en nosotros
              </span>
            </div>
          </div>
          <div className="image-container-2">
            <img
              src="https://images.unsplash.com/photo-1562782441-fdc53369e894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBoZWFsdGh8ZW58MXx8fHwxNzYyODcyMDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              width="500"
              alt="Perrito Husky tomando su medicina"
            />
          </div>
        </div>
      </section>
    </>
  );
};
