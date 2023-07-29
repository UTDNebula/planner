import React, { Children, FC } from 'react';

import Spinner from './Spinner';

const colorClasses = {
  primary: 'bg-primary hover:bg-[#EEF2FF] hover:text-[#312E81]  text-generic-white',
  secondary: 'bg-generic-white hover:bg-neutral-50 border border-neutral-300',
  tertiary: 'bg-primary-100 text-primary-900',
  border: 'border-1 border-[#E5E5E5] bg-white',
};

const sizeClasses = {
  large: 'px-5 py-3 gap-x-2 text-base',
  medium: 'px-4 py-2.5 gap-x-1.5 text-sm',
  small: 'px-3 py-1.5 gap-x-1.5 text-xs',
};

const widthClasses = {
  full: 'w-full',
  default: 'w-fit',
};

const fontClasses = {
  large: 'text-base font-semibold',
  default: 'text-sm font-medium',
};

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  color?: keyof typeof colorClasses;
  size?: keyof typeof sizeClasses;
  width?: keyof typeof widthClasses;
  font?: keyof typeof fontClasses;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  color = 'primary',
  size = 'medium',
  width = 'default',
  font = 'default',
  icon,
  className = '',
  isLoading,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`relative ${colorClasses[color]} ${sizeClasses[size]} flex h-fit ${widthClasses[width]} ${fontClasses[font]} items-center justify-center rounded-md transition duration-200 ease-in-out ${className} disabled:opacity-50`}
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
