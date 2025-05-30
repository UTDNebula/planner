import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import React, { FC } from 'react';

import DeleteIcon from '@/icons/DeleteIcon';
import PencilIcon from '@/icons/PencilIcon';

const itemClasses =
  'flex items-center gap-x-3 border-b border-neutral-300 px-3 py-2 hover:bg-neutral-100 cursor-pointer group';

const contentClasses = 'rounded-md border border-neutral-300 bg-generic-white z-[9999]';

export interface SettingsDropdownProps {
  openDeletePlanModal: () => void;
  openEditSemesterModal: () => void;
  children: React.ReactNode;
}

const SettingsDropdown: FC<SettingsDropdownProps> = ({
  openDeletePlanModal,
  openEditSemesterModal,
  children,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={contentClasses + ' animate-[slideUpAndFade_0.3s]'}
          alignOffset={20}
          sideOffset={20}
          align="end"
        >
          <DropdownMenu.Item className={itemClasses} onClick={openDeletePlanModal}>
            <DeleteIcon />
            <span>Delete plan</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClasses} onClick={openEditSemesterModal}>
            <PencilIcon />
            <span>Edit semesters</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SettingsDropdown;
