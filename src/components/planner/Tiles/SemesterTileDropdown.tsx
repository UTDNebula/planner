import { FC } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import DotsHorizontalIcon from '@/icons/DotsHorizontalIcon';
import ArchiveIcon from '@/icons/ArchiveIcon';
import ClipboardListIcon from '@/icons/ClipboardListIcon';
import ColorSwatchIcon from '@/icons/ColorSwatchIcon';
import ChevronIcon from '@/icons/ChevronIcon';
import { tagColors } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import LockIcon from '@/icons/LockIcon';

const itemClasses =
  'flex items-center gap-x-3 border-b border-neutral-300 px-2 py-2 hover:bg-neutral-200 cursor-pointer text-sm';

const contentClasses = 'w-64 rounded-md border border-neutral-300 bg-generic-white z-[9999]';

const disabledClasses = 'text-black/25 cursor-default';

export interface SemesterTileDropdownProps {
  deleteAllCourses: () => void;
  selectAllCourses: () => void;
  changeColor: (color: keyof typeof tagColors) => void;
  locked: boolean;
  toggleLock: () => void;
}

const SemesterTileDropdown: FC<SemesterTileDropdownProps> = ({
  deleteAllCourses,
  selectAllCourses,
  changeColor,
  locked,
  toggleLock,
}) => {
  const id = uuidv4();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label="Customise options" className="self-stretch">
          <DotsHorizontalIcon className="m-auto" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={contentClasses + ' animate-[slideUpAndFade_0.3s]'}
          sideOffset={10}
          align="start"
        >
          <DropdownMenu.Item
            className={!locked ? itemClasses : `${itemClasses} ${disabledClasses}`}
            onClick={!locked ? deleteAllCourses : undefined}
            disabled={locked}
          >
            <ArchiveIcon />
            <span>Clear courses</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClasses} onClick={toggleLock}>
            <LockIcon />
            <span>{locked ? 'Unlock' : 'Lock'} semester</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={!locked ? itemClasses : `${itemClasses} ${disabledClasses}`}
            onClick={!locked ? selectAllCourses : undefined}
            disabled={locked}
          >
            <ClipboardListIcon />
            <span>Select all courses</span>
          </DropdownMenu.Item>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className={`${
                !locked ? itemClasses : `${itemClasses} ${disabledClasses}`
              } justify-between border-none`}
              disabled={locked}
            >
              <div className="flex items-center gap-x-3">
                <ColorSwatchIcon />
                <span>Change color</span>
              </div>
              <ChevronIcon className="h-3 w-3" />
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className={contentClasses + ' animate-[slideLeftAndFade_0.3s]'}
                sideOffset={-10}
                alignOffset={0}
              >
                {Object.entries(tagColors).map(([color, classes]) => (
                  <DropdownMenu.Item
                    className={itemClasses}
                    key={`${id}-tag-${color}`}
                    onClick={() => changeColor(color as keyof typeof tagColors)}
                  >
                    <div className={`h-5 w-5 rounded-sm border ${classes}`}></div>
                    <span>
                      {color.substring(0, 1).toUpperCase() + color.substring(1) || 'None'}
                    </span>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SemesterTileDropdown;
