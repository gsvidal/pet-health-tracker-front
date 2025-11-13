import './Home.scss';
import { HomeFeatures } from './HomeFeatures';
import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';
import { HomeHero } from './HomeHero';
import { HomeUs } from './HomeUs';

export const Home = () => {
  return (
    <div className="home">
      <HomeHeader />
      <HomeHero />
      <HomeFeatures />
      <HomeUs />
      <HomeFooter />
    </div>
  );
};
