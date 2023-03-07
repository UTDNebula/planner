import { FC } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import DeleteIcon from '@/icons/DeleteIcon';
import DuplicateIcon from '@/icons/DuplicateIcon';

export interface PlanCardDropdownProps {
  deletePlan: () => void;
  duplicatePlan: () => void;
}

const PlanCardDropdown: FC<PlanCardDropdownProps> = ({ duplicatePlan, deletePlan, children }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-32 animate-[slideUpAndFade_0.3s] rounded-md border border-neutral-300 bg-generic-white"
          sideOffset={10}
          align="start"
        >
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-x-3 border-b border-neutral-300 px-2 py-2 text-sm hover:bg-neutral-200"
            onClick={(e) => {
              e.stopPropagation();
              duplicatePlan();
            }}
          >
            <DuplicateIcon />
            <span>Duplicate</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-x-3 border-b border-neutral-300 px-2 py-2 text-sm hover:bg-neutral-200"
            onClick={(e) => {
              e.stopPropagation();
              deletePlan();
            }}
          >
            <DeleteIcon />
            <span>Delete</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default PlanCardDropdown;
