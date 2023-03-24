import { FC } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ColorSwatchIcon from '@/icons/ColorSwatchIcon';
import ChevronIcon from '@/icons/ChevronIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import { tagColors } from '../utils';
import { ObjectID } from 'bson';
import LockIcon from '@/icons/LockIcon';
import UnfilledWarningIcon from '@/icons/UnfilledWarningIcon';

const itemClasses =
  'flex items-center gap-x-3 border-b border-neutral-300 px-2 py-2 hover:bg-neutral-200 cursor-pointer text-sm';

const contentClasses = 'w-64 rounded-md border border-neutral-300 bg-generic-white';

const disabledClasses = 'text-black/25 cursor-default';

export interface SemesterTileDropdownProps {
  deleteCourse: () => void;
  changeColor: (color: keyof typeof tagColors) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toggleLock: () => void;
  locked: boolean;
  semesterLocked: boolean;
  prereqOverriden: boolean;
  onPrereqOverrideChange: () => void;
}

const SemesterCourseItemDropdown: FC<SemesterTileDropdownProps> = ({
  deleteCourse,
  changeColor,
  open,
  onOpenChange,
  semesterLocked,
  children,
  toggleLock,
  locked,
  prereqOverriden,
  onPrereqOverrideChange,
}) => {
  const id = new ObjectID().toString();
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger data-no-dnd="true" asChild>
        {children}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          data-no-dnd="true"
          className={contentClasses + ' animate-[slideUpAndFade_0.3s]'}
          sideOffset={10}
          align="start"
        >
          <DropdownMenu.Item
            className={
              !(locked || semesterLocked) ? itemClasses : `${itemClasses} ${disabledClasses}`
            }
            onClick={!(locked || semesterLocked) ? deleteCourse : undefined}
            disabled={locked || semesterLocked}
          >
            <DeleteIcon />
            <span>Delete</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item className={itemClasses} onClick={onPrereqOverrideChange}>
            <UnfilledWarningIcon />
            <span>{prereqOverriden ? 'Show Pre-reqs Warning' : 'Dismiss Pre-reqs Warning'}</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={!semesterLocked ? itemClasses : itemClasses + ' ' + disabledClasses}
            onClick={!semesterLocked ? toggleLock : undefined}
            disabled={semesterLocked}
          >
            <LockIcon />
            <span>{locked ? 'Unlock' : 'Lock'} course</span>
          </DropdownMenu.Item>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className={`${
                !(locked || semesterLocked) ? itemClasses : `${itemClasses} ${disabledClasses}`
              } justify-between border-none`}
              disabled={locked || semesterLocked}
            >
              <div className="flex items-center gap-x-3">
                <ColorSwatchIcon />
                <span>Change color</span>
              </div>
              <ChevronIcon className="h-3 w-3" />
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                data-no-dnd="true"
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

export default SemesterCourseItemDropdown;
