import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'text-white hover:bg-white/10 border border-white/20',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export const Card = ({ children, className, interactive = false }: CardProps) => {
  return (
    <div
      className={clsx(
        'card',
        interactive && 'hover:border-blue-500/50 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  const variants = {
    primary: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
    danger: 'bg-red-500/20 border-red-500/50 text-red-200',
  };

  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  );
};

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string | number;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-slate-300">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx('input-field', error && 'border-red-500/50', className)}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Select = ({
  options,
  value,
  onChange,
  label,
  disabled,
  className,
}: SelectProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-slate-300">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={clsx(
          'input-field',
          'appearance-none cursor-pointer',
          className
        )}
      >
        <option value="">Select an option...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
