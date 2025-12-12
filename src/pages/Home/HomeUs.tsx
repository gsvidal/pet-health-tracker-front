import { ArrowRight, CircleCheck } from 'lucide-react';
import './Home.scss';
//import './HomeUs.scss';
import { Button } from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../config/routes';
import { useTranslation } from 'react-i18next';

export const HomeUs = () => {
  const { t } = useTranslation();
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
            <div className="badge">{t('home.about.badge')}</div>
            <h2 className="content-title">{t('home.about.title')}</h2>
            <p>{t('home.about.description1')}</p>
            <p>{t('home.about.description2')}</p>
            <ul className="home__us-feats">
              <li className="home__us-feat">
                <span className="home__us-icon">
                  <CircleCheck color="#be185d" />
                </span>
                <strong>{t('home.about.features.devices.title')}</strong>
                <p>{t('home.about.features.devices.description')}</p>
              </li>
              <li className="home__us-feat">
                <span className="home__us-icon">
                  <CircleCheck color="#be185d" />
                </span>
                <strong>{t('home.about.features.performance.title')}</strong>
                <p>{t('home.about.features.performance.description')}</p>
              </li>
              <li className="home__us-feat">
                <span className="home__us-icon">
                  <CircleCheck color="#be185d" />
                </span>
                <strong>{t('home.about.features.scalability.title')}</strong>
                <p>{t('home.about.features.scalability.description')}</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section-2">
        <div className="section-container container">
          <div className="content-2">
            <h2 className="content-title-2">{t('home.about.cta.title')}</h2>
            <p>{t('home.about.cta.description')}</p>
            <div className="buttons-container">
              <Button
                variant="secondary"
                onClick={() => navigate(PUBLIC_ROUTES.REGISTER)}
              >
                {t('home.about.cta.button')}
                <ArrowRight style={{ marginLeft: 8, width: 20, height: 20 }} />
              </Button>
              {/* <Button>Explorar Demo</Button> */}
            </div>
            <div className="avatars">
              <span className="avatar avatar--1"></span>
              <span className="avatar avatar--2"></span>
              <span className="avatar avatar--3"></span>
              <span className="avatar avatar--4"></span>
              <span className="avatars-text">{t('home.about.cta.users')}</span>
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
