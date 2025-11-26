import { Calendar, Syringe, UtensilsCrossed, Bell, FileText, Heart, LayoutDashboard, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../../components/Card/Card";
import "./Home.scss";
// import "./Features.scss";

const features = [
  { icon: Heart, title: "Perfiles Completos de Mascotas", description: "Crea y gestiona perfiles con nombre, especie, raza, edad, peso y foto. Edita o elimina información cuando lo necesites." },
  { icon: Syringe, title: "Registro de Salud Integral", description: "Documenta vacunaciones, desparasitaciones y visitas veterinarias. Adjunta imágenes y documentos médicos." },
  { icon: UtensilsCrossed, title: "Seguimiento Nutricional", description: "Registra dietas, horarios de comidas y porciones. Configura recordatorios para mantener una alimentación saludable." },
  { icon: Bell, title: "Recordatorios Automáticos", description: "Alertas por correo y notificaciones in-app para vacunas, medicamentos, citas y horarios de alimentación." },
  { icon: Calendar, title: "Calendario de Eventos", description: "Visualiza todas las citas, vacunas y eventos próximos en un calendario organizado y fácil de consultar." },
  { icon: LayoutDashboard, title: "Dashboard Intuitivo", description: "Vista general con resumen del estado de salud, próximas vacunas y alertas activas de todas tus mascotas." },
  { icon: Shield, title: "Seguridad y Privacidad", description: "Cifrado de contraseñas, validación de datos y protección total de la información de tus mascotas." },
  { icon: FileText, title: "Historial Médico Completo", description: "Acceso instantáneo al historial médico completo con todos los registros de salud organizados." },
];

export function Features() {
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
