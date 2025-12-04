import './Loader.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const Loader = ({ size = 'medium', text }: LoaderProps) => {
  return (
    <div className="loader-container">
      <div className={`loader loader--${size}`}>
        <div className="loader__spinner"></div>
      </div>
      {text && <p className="loader__text">{text}</p>}
    </div>
  );
};
