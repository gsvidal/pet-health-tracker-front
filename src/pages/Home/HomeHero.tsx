import { Button } from "../../components/Button/Button";
import "./HomeHero.scss";
import { ArrowRight } from "lucide-react";

export function HomeHero() {
  const imgUrl =
    "https://images.unsplash.com/photo-1728661631084-5f44797184e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

  const fallbackImg =
    "https://placehold.co/600x600?text=Imagen+no+disponible";

  return (
    <section id="inicio" className="hero">
      <div className="grid">

        {/* Texto */}
        <div className="content">
          <div className="badge">
            Plataforma digital de gestión de salud para mascotas
          </div>

          <h1>Gestiona la salud y bienestar de tus mascotas desde un solo lugar</h1>

          <p>
            Crea perfiles completos, registra vacunaciones y visitas veterinarias,
            controla su alimentación y recibe recordatorios automáticos para nunca
            olvidar un evento médico o nutricional importante.
          </p>

          <div className="actions">
            <Button size="lg" variant="primary">
              Registrarse Gratis
              <ArrowRight style={{ marginLeft: 8, width: 20, height: 20 }} />
            </Button>
            <Button size="lg" variant="outline">Ver Prototipo Demo</Button>
          </div>

          <div className="stats">
            <div className="stat">
              <div>15,000+</div>
              <div>Mascotas registradas</div>
            </div>
            <div className="stat">
              <div>8,500+</div>
              <div>Usuarios activos</div>
            </div>
            <div className="stat">
              <div>25,000+</div>
              <div>Recordatorios enviados</div>
            </div>
          </div>
        </div>

        {/* Imagen */}
        <div className="visual">
          <div className="image-wrapper">
            <img
              src={imgUrl}
              alt="Perro y gato felices"
              onError={(e) => (e.currentTarget.src = fallbackImg)}
            />
          </div>

          {/* Decoración */}
          <div className="decor-circle one"></div>
          <div className="decor-circle two"></div>
        </div>

      </div>
    </section>
  );
}
