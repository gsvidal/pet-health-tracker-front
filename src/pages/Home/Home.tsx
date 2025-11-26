import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { Features } from './Features';

import { Hero } from './Hero';
// import './Home.scss';
import './Home.scss';
import { HomeUs } from './HomeUs';


export const Home = () => {
  return (
    <div className="home">
      <Header />
      <Hero />
      <Features />
      <HomeUs />
      <Footer />
    </div>
  );
};
