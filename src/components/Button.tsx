import React, { Children, FC } from 'react';
import Spinner from './Spinner';

const colorClasses = {
  primary: 'bg-primary hover:bg-primary-600 disabled:bg-primary text-generic-white',
  secondary:
    'bg-generic-white hover:bg-neutral-50 disabled:bg-generic-white border border-neutral-300',
  tertiary: 'bg-primary-100 text-primary-900',
};

const sizeClasses = {
  large: 'px-5 py-3 gap-x-2 text-base',
  medium: 'px-4 py-2.5 gap-x-1.5 text-sm',
  small: 'px-3 py-1.5 gap-x-1.5 text-xs',
};

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  color?: keyof typeof colorClasses;
  size?: keyof typeof sizeClasses;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  color = 'primary',
  size = 'medium',
  icon,
  className = '',
  isLoading,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${colorClasses[color]} ${sizeClasses[size]} flex h-fit w-fit items-center justify-center rounded-md font-medium transition duration-200 ease-in-out ${className} disabled:opacity-50`}
    >
      {icon && <span className={isLoading ? 'opacity-0' : ''}>{icon}</span>}
      {Children.count(children) > 0 && (
        <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      )}
      {isLoading && <Spinner className="absolute" size={size} />}
    </button>
  );
};

export default Button;
