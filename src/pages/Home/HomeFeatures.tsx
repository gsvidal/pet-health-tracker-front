import { Calendar, Syringe, UtensilsCrossed, Bell, FileText, Heart, LayoutDashboard, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../../components/Card/Card";
import "./HomeFeatures.scss";

const features = [
  { icon: Heart, title: "Perfiles Completos de Mascotas", description: "Crea y gestiona perfiles con nombre, especie, raza, edad, peso y foto." },
  { icon: Syringe, title: "Registro de Salud Integral", description: "Documenta vacunaciones, desparasitaciones y visitas veterinarias." },
  { icon: UtensilsCrossed, title: "Seguimiento Nutricional", description: "Registra dietas, horarios de comidas y porciones." },
  { icon: Bell, title: "Recordatorios Automáticos", description: "Alertas por correo y notificaciones in-app para vacunas." },
  { icon: Calendar, title: "Calendario de Eventos", description: "Visualiza citas, vacunas y eventos próximos." },
  { icon: LayoutDashboard, title: "Dashboard Intuitivo", description: "Resumen del estado de salud y alertas activas." },
  { icon: Shield, title: "Seguridad y Privacidad", description: "Protección total de la información de tus mascotas." },
  { icon: FileText, title: "Historial Médico Completo", description: "Acceso al historial médico organizado." },
];

export function HomeFeatures() {
  return (
    <section id="caracteristicas" className="home-features">
      <div className="container">
        <div className="header">
          <span className="badge">Características Principales</span>
          <h2>Gestión centralizada de la salud de tus mascotas</h2>
          <p>Una plataforma mobile-first con interfaz intuitiva para el control de salud de tus mascotas.</p>
        </div>

        <div className="grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="feature-card">
                <CardHeader>
                  <div className="icon-box">
                    <Icon />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
