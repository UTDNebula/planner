import { ComponentPropsWithoutRef, FC } from 'react';

export type InputProps = ComponentPropsWithoutRef<'input'>;

const Input: FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`rounded-md border border-neutral-300 px-5 py-3 outline-none focus:border-primary ${className}`}
    type="text"
    {...props}
  />
);

export default Input;
