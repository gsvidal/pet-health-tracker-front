import './Home.scss';
import { HomeFeatures } from './HomeFeatures';
import { HomeHeader } from './HomeHeader';
import { HomeHero } from './HomeHero';

export const Home = () => {
  return (
    <div className="home">
      <HomeHeader />
      <HomeHero />
      <HomeFeatures />
    </div>
  );
};
