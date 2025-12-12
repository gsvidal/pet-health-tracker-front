import { useThemeStore } from '../../store/theme.store';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.scss';

interface ThemeToggleProps {
  onToggle?: () => void;
}

export const ThemeToggle = ({ onToggle }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useThemeStore();

  const handleClick = () => {
    toggleTheme();
    onToggle?.();
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleClick}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <div className={`theme-toggle-track ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="theme-toggle-thumb">
          {theme === 'light' ? <Sun size={10} /> : <Moon size={10} />}
        </div>
      </div>
    </button>
  );
};
