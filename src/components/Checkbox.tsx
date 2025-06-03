import * as RCheckbox from '@radix-ui/react-checkbox';
import React, { FC } from 'react';

import CheckIcon from '@/icons/CheckIcon';

export type CheckboxProps = RCheckbox.CheckboxProps;

const Checkbox: FC<CheckboxProps> = ({ className = '', ...props }) => (
  <RCheckbox.Root
    className={`h-5 w-5 overflow-hidden rounded-md border-1.25 border-neutral-300 bg-generic-white ${className}`}
    {...props}
  >
    <RCheckbox.Indicator>
      <div className="flex h-full w-full animate-[checkboxCheckmark_0.2s] items-center justify-center bg-primary">
        <CheckIcon className="h-3 w-3 text-generic-white" />
      </div>
    </RCheckbox.Indicator>
  </RCheckbox.Root>
);

export default Checkbox;
