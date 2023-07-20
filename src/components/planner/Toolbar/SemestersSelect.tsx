import * as Select from '@radix-ui/react-select';
import React, { FC } from 'react';

import ChevronIcon from '@/icons/ChevronIcon';
import { displaySemesterCode } from '@/utils/utilFunctions';
import { SemesterCode } from 'prisma/utils';

const SemestersSelect: FC<
  Select.SelectProps & { id?: string; placeholder?: string; semesterCodes: SemesterCode[] }
> = ({ id, placeholder, semesterCodes, ...props }) => (
  <Select.Root {...props}>
    <Select.Trigger
      id={id}
      className={`flex w-full items-center justify-between rounded-md border border-neutral-300 px-5 py-3 outline-none focus:border-primary ${
        props.open ? 'border-primary' : ''
      }`}
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronIcon className="rotate-90 transform" />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal className="z-[9999]">
      <Select.Content
        position="popper"
        className="cursor-pointer select-none overflow-hidden rounded-md border border-neutral-100 bg-generic-white shadow-sm"
        sideOffset={10}
      >
        <Select.Viewport className="max-h-52 overflow-y-scroll">
          <Select.Group>
            {semesterCodes.map((semesterCode, i) => (
              <SelectItem key={i} value={JSON.stringify(semesterCode)}>
                {displaySemesterCode(semesterCode)}
              </SelectItem>
            ))}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const SelectItem: FC<Select.SelectItemProps> = ({ children, ...props }) => {
  return (
    <Select.Item
      onFocus={(e) => e.stopPropagation()}
      className="border border-b-neutral-100 px-3 py-3 hover:bg-neutral-50"
      style={{ width: 'calc(var(--radix-select-trigger-width) * 0.99)' }}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
};

export default SemestersSelect;
