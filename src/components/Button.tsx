import React, { FC } from 'react';

const colorClasses = {
  primary: 'bg-primary hover:bg-primary-600 text-generic-white',
  secondary: 'bg-generic-white hover:bg-neutral-50 border border-neutral-300',
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
}

const Button: FC<ButtonProps> = ({
  color = 'primary',
  size = 'medium',
  icon,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${colorClasses[color]} ${sizeClasses[size]} flex h-fit w-fit items-center justify-center rounded-md font-medium transition duration-200 ease-in-out ${className}`}
    >
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};

export default Button;
