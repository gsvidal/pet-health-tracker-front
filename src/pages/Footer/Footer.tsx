import { LuFacebook, LuInstagram, LuLinkedin, LuTwitter } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <div id="contacto" className="container footer">
        <div className="footer__left">
          <div className="logo">
            <div className="logo-icon">
              <img src="/paw.svg" alt="Pet Health Tracker" />
            </div>
            <span className="logo-text">Pet Health Tracker</span>
          </div>
          <p>{t('home.footer.description')}</p>
          <div className="footer__social-icons">
            {/* Todo: Logos redes sociales */}
            <span className="footer__social-icon">
              <LuFacebook size={16} />
            </span>
            <span className="footer__social-icon">
              <LuInstagram size={16} />
            </span>
            <span className="footer__social-icon">
              <LuTwitter size={16} />
            </span>
            <span className="footer__social-icon">
              <LuLinkedin size={16} />
            </span>
          </div>
        </div>
        {/* <nav className="footer_nav"> */}
        <div className="footer_nav_column">
          <strong className="footer_nav_title">
            {t('home.footer.product.title')}
          </strong>
          <ul className="footer__nav_links">
            <li>{t('home.footer.product.features')}</li>
            <li>{t('home.footer.product.pricing')}</li>
            <li>{t('home.footer.product.demo')}</li>
            <li>{t('home.footer.product.updates')}</li>
          </ul>
        </div>
        <div className="footer_nav_column">
          <strong className="footer_nav_title">
            {t('home.footer.company.title')}
          </strong>
          <ul className="footer__nav_links">
            <li>{t('home.footer.company.about')}</li>
            <li>{t('home.footer.company.blog')}</li>
            <li>{t('home.footer.company.careers')}</li>
            <li>{t('home.footer.company.contact')}</li>
          </ul>
        </div>
        <div className="footer_nav_column">
          <strong className="footer_nav_title">
            {t('home.footer.legal.title')}
          </strong>
          <ul className="footer__nav_links">
            <li>{t('home.footer.legal.privacy')}</li>
            <li>{t('home.footer.legal.terms')}</li>
            <li>{t('home.footer.legal.cookies')}</li>
            <li>{t('home.footer.legal.licenses')}</li>
          </ul>
        </div>
        {/* </nav> */}
      </div>
      <hr />
      <p className="footer-copyright">{t('home.footer.copyright')}</p>
    </>
  );
};
