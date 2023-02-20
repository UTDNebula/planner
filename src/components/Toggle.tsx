import * as Switch from '@radix-ui/react-switch';
import { FC } from 'react';

const rootSizeClasses = {
  small: 'h-[16px] w-[26px]',
};

const thumbSizeClasses = {
  small: 'h-[14px] w-[14px]',
};

export interface ToggleProps extends Switch.SwitchProps {
  size?: keyof typeof rootSizeClasses;
}

const Toggle: FC<ToggleProps> = ({ size = 'small', ...props }) => {
  return (
    <Switch.Root
      {...props}
      className={`${rootSizeClasses[size]} relative rounded-full bg-neutral-300 data-[state=checked]:bg-primary`}
    >
      <Switch.Thumb
        className={`${thumbSizeClasses[size]} duration-400 block h-[14px] w-[14px] translate-x-[1px] transform rounded-full bg-generic-white transition-transform will-change-transform data-[state=checked]:translate-x-[10px]`}
      />
    </Switch.Root>
  );
};

export default Toggle;
