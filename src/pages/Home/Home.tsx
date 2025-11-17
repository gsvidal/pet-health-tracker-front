import { Features } from './Features';
import { Footer } from './Footer';
import { Header } from './Header';
import { Hero } from './Hero';
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
