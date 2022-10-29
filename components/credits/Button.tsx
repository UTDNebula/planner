import React, { FC } from 'react';

const colorClasses = {
  primary: 'bg-[#3E61ED] hover:bg-[#3552C9]',
};

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  color?: keyof typeof colorClasses;
  icon?: React.ReactNode;
}

const Button: FC<ButtonProps> = ({
  color = 'primary',
  icon,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${colorClasses[color]} flex items-center justify-center h-[50px] w-[200px] transition duration-200 ease-in-out rounded-[10px] ${className} font-medium text-white gap-x-2`}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
