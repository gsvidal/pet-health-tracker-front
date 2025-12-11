import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import './Select.scss';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Select = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Seleccionar...',
  className = '',
  disabled = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption
    ? selectedOption.label
    : placeholder || 'Seleccionar...';

  const handleSelect = (optionValue: string | null) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`select-wrapper ${className}`} ref={dropdownRef}>
      {label && <label className="select-label">{label}</label>}
      <div className="select">
        <button
          type="button"
          className="select-button"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
          disabled={disabled}
        >
          <span>{displayValue}</span>
          <span
            className={`select-arrow ${isOpen ? 'select-arrow--open' : ''}`}
          >
            ▼
          </span>
        </button>
        {isOpen && !disabled && (
          <div className="select-menu">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`select-item ${isSelected ? 'select-item--active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                >
                  {option.label}
                  {isSelected && <Check size={16} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
