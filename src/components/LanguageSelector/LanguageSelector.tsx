import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './LanguageSelector.scss';
import { Button } from '../Button/Button';

interface LanguageSelectorProps {
  onToggle?: () => void;
}

export const LanguageSelector = ({ onToggle }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    onToggle?.();
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="language-selector" ref={dropdownRef}>
      <Button
        // className="language-selector__button"
        variant='outline'
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Seleccionar idioma"
        title="Seleccionar idioma"
      >
        <Globe size={15} style={{marginRight: '1.2rem'}}/>
        <span className="language-selector__current">
          {currentLanguage.code.toUpperCase()}
        </span>
      </Button>

      {isOpen && (
        <div className="language-selector__dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-selector__option ${
                i18n.language === lang.code ? 'active' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-selector__flag">{lang.flag}</span>
              <span className="language-selector__name">{lang.name}</span>
              {i18n.language === lang.code && (
                <span className="language-selector__check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
