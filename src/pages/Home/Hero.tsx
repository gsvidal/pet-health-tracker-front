import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import './Home.scss';
//import "./Hero.scss";
import { ArrowRight } from 'lucide-react';
import { PUBLIC_ROUTES } from '../../config/routes';
import { useTranslation } from 'react-i18next';

// Importar imágenes locales como fallback
import pexelsImg1 from '../../assets/pexels-arthousestudio.jpg';
import pexelsImg2 from '../../assets/pexels-pixabay.jpg';
import pexelsImg3 from '../../assets/pexels-anastasia-shuraeva.jpg';
import pexelsImg4 from '../../assets/pexels-sam-lion.jpg';
import pexelsImg5 from '../../assets/pexels-maksgelatin.jpg';

export function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // Array de imágenes: [URL en línea, fallback local]
  const images = [
    {
      online:
        'https://images.pexels.com/photos/4627265/pexels-photo-4627265.jpeg',
      fallback: pexelsImg1,
    },
    {
      online:
        'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      fallback: pexelsImg2,
    },
    {
      online:
        'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
      fallback: pexelsImg3,
    },
    {
      online:
        'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
      fallback: pexelsImg4,
    },
    {
      online:
        'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg',
      fallback: pexelsImg5,
    },
  ];

  const handleImageError = (
    index: number,
    e: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const img = e.currentTarget;
    // Si ya estamos usando el fallback y falla, no hacer nada más
    if (failedImages.has(index)) {
      return;
    }
    // Marcar como fallida y cambiar al fallback
    setFailedImages((prev) => new Set(prev).add(index));
    img.src = images[index].fallback;
  };

  const getImageSrc = (index: number) => {
    return failedImages.has(index)
      ? images[index].fallback
      : images[index].online;
  };

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="inicio" className="hero">
      <div className="container grid">
        {/* Texto */}
        <div className="content">
          <div className="badge">{t('home.hero.subtitle')}</div>

          <h1>{t('home.hero.title')}</h1>

          <p>{t('home.hero.description')}</p>

          <div className="actions">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate(PUBLIC_ROUTES.REGISTER)}
            >
              {t('home.hero.cta')}
              <ArrowRight style={{ marginLeft: 8, width: 20, height: 20 }} />
            </Button>
            {/* <Button size="lg" variant="outline">Ver Prototipo Demo</Button> */}
          </div>

          <div className="stats">
            <div className="stat">
              <div>15,000+</div>
              <div>{t('home.hero.stats.pets')}</div>
            </div>
            <div className="stat">
              <div>8,500+</div>
              <div>{t('home.hero.stats.users')}</div>
            </div>
            <div className="stat">
              <div>25,000+</div>
              <div>{t('home.hero.stats.reminders')}</div>
            </div>
          </div>
        </div>

        {/* Carrusel de Imágenes */}
        <div className="visual">
          <div className="carousel-container">
            <div className="image-wrapper">
              {images.map((_, index) => (
                <img
                  key={index}
                  src={getImageSrc(index)}
                  alt={`Mascota ${index + 1}`}
                  className={index === currentIndex ? 'active' : ''}
                  onError={(e) => handleImageError(index, e)}
                />
              ))}
            </div>

            {/* Botones de navegación */}
            {/* <button
              className="carousel-btn carousel-btn--prev"
              onClick={goToPrevious}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="carousel-btn carousel-btn--next"
              onClick={goToNext}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={24} />
            </button> */}

            {/* Indicadores */}
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Decoración */}
          <div className="decor-circle one"></div>
          <div className="decor-circle two"></div>
        </div>
      </div>
    </section>
  );
}
