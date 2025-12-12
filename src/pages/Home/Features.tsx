import {
  Calendar,
  Syringe,
  UtensilsCrossed,
  Bell,
  FileText,
  Heart,
  LayoutDashboard,
  Shield,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/Card/Card';
import './Home.scss';
// import "./Features.scss";
import { useTranslation } from 'react-i18next';

export function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Heart,
      title: t('home.features.items.profiles.title'),
      description: t('home.features.items.profiles.description'),
    },
    {
      icon: Syringe,
      title: t('home.features.items.health.title'),
      description: t('home.features.items.health.description'),
    },
    {
      icon: UtensilsCrossed,
      title: t('home.features.items.nutrition.title'),
      description: t('home.features.items.nutrition.description'),
    },
    {
      icon: Bell,
      title: t('home.features.items.reminders.title'),
      description: t('home.features.items.reminders.description'),
    },
    {
      icon: Calendar,
      title: t('home.features.items.calendar.title'),
      description: t('home.features.items.calendar.description'),
    },
    {
      icon: LayoutDashboard,
      title: t('home.features.items.dashboard.title'),
      description: t('home.features.items.dashboard.description'),
    },
    {
      icon: Shield,
      title: t('home.features.items.security.title'),
      description: t('home.features.items.security.description'),
    },
    {
      icon: FileText,
      title: t('home.features.items.history.title'),
      description: t('home.features.items.history.description'),
    },
  ];

  return (
    <section id="caracteristicas" className="home-features">
      <div className="container">
        <div className="header">
          <span className="badge">{t('home.features.badge')}</span>
          <h2>{t('home.features.title')}</h2>
          <p>{t('home.features.subtitle')}</p>
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
