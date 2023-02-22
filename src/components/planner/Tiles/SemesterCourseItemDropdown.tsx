import { FC } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ClipboardListIcon from '@/icons/ClipboardListIcon';
import ColorSwatchIcon from '@/icons/ColorSwatchIcon';
import ChevronIcon from '@/icons/ChevronIcon';
import DeleteIcon from '@/icons/DeleteIcon';

const itemClasses =
  'flex items-center gap-x-3 border-b border-neutral-300 px-3 py-2 hover:bg-neutral-200 cursor-pointer';

const contentClasses = 'w-64 rounded-md border border-neutral-300 bg-generic-white';

export interface SemesterTileDropdownProps {
  deleteCourse: () => void;
}

const SemesterCourseItemDropdown: FC<SemesterTileDropdownProps> = ({ deleteCourse }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="cursor-pointer rounded-md py-[2px] transition-all duration-300 hover:bg-neutral-100">
          <DragIndicatorIcon fontSize="inherit" className="text-[16px] text-neutral-300" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={contentClasses + ' animate-[slideUpAndFade_0.3s]'}
          sideOffset={10}
          align="start"
        >
          <DropdownMenu.Item className={itemClasses} onClick={deleteCourse}>
            <DeleteIcon />
            <span>Delete</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClasses}>
            <ClipboardListIcon />
            <span>Lock course</span>
          </DropdownMenu.Item>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={itemClasses + ' justify-between border-none'}>
              <div className="flex items-center gap-x-3">
                <ColorSwatchIcon />
                <span>Move to</span>
              </div>
              <ChevronIcon className="h-3 w-3" />
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className={contentClasses + ' animate-[slideLeftAndFade_0.3s]'}
                sideOffset={-10}
                alignOffset={0}
              >
                <DropdownMenu.Item className={itemClasses}>
                  <div className="h-5 w-5 rounded-sm bg-red-400"></div>
                  <span>Red</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item className={itemClasses}>
                  <div className="h-5 w-5 rounded-sm bg-yellow-400"></div>
                  <span>Yellow</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item className={itemClasses}>
                  <div className="h-5 w-5 rounded-sm bg-green-400"></div>
                  <span>Green</span>
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SemesterCourseItemDropdown;
