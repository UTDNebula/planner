import { FC, useMemo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Button from '../Button';
import SwitchVerticalIcon from '@/icons/SwitchVerticalIcon';
import ColorSwatchIcon from '@/icons/ColorSwatchIcon';
import ChevronIcon from '@/icons/ChevronIcon';
import { tagColors } from './utils';
import { useSemestersContext } from './SemesterContext';
import { displaySemesterCode, isSemCodeEqual } from '@/utils/utilFunctions';
import DotFilledIcon from '@/icons/DotFilledIcon';

const itemClasses =
  'flex items-center gap-x-3 border-b border-neutral-300 px-3 py-2 hover:bg-neutral-200 cursor-pointer';

const contentClasses = 'w-64 rounded-md border border-neutral-300 bg-generic-white z-[9999]';

const SortByDropdown: FC = () => {
  const { toggleColorFilter, toggleSemesterFilter, toggleYearFilter, allSemesters, filters } =
    useSemestersContext();

  const allYears = useMemo(
    () => new Set(allSemesters.map((semester) => semester.code.year)),
    [allSemesters],
  );
  const allSemesterCodes = useMemo(
    () => allSemesters.map((semester) => semester.code),
    [allSemesters],
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          aria-label="Sort by options"
          size="medium"
          color="tertiary"
          icon={<SwitchVerticalIcon />}
        >
          <span className="whitespace-nowrap">Sort By</span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={contentClasses + ' animate-[slideUpAndFade_0.3s]'}
          sideOffset={10}
          align="start"
        >
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={itemClasses + ' justify-between border-none'}>
              <div className="flex items-center gap-x-3">
                <ColorSwatchIcon />
                <span>Sort by color</span>
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
                  <DropdownMenu.CheckboxItem
                    key={`${color}-${classes}`}
                    className={itemClasses}
                    checked={filters.some(
                      (filter) => filter.type === 'color' && filter.color === color,
                    )}
                    onCheckedChange={() => toggleColorFilter(color as keyof typeof tagColors)}
                  >
                    <DropdownMenu.ItemIndicator>
                      <DotFilledIcon />
                    </DropdownMenu.ItemIndicator>
                    <div className={`h-5 w-5 rounded-sm border ${classes}`}></div>
                    <span>
                      {color.substring(0, 1).toUpperCase() + color.substring(1) || 'None'}
                    </span>
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={itemClasses + ' justify-between border-none'}>
              <div className="flex items-center gap-x-3">
                <ColorSwatchIcon />
                <span>Sort by year</span>
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
                {Array.from(allYears).map((year) => (
                  <DropdownMenu.CheckboxItem
                    key={year}
                    className={itemClasses}
                    checked={filters.some(
                      (filter) => filter.type === 'year' && filter.year === year,
                    )}
                    onCheckedChange={() => toggleYearFilter(year)}
                  >
                    <DropdownMenu.ItemIndicator>
                      <DotFilledIcon />
                    </DropdownMenu.ItemIndicator>
                    {year}
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={itemClasses + ' justify-between border-none'}>
              <div className="flex items-center gap-x-3">
                <ColorSwatchIcon />
                <span>Sort by semester</span>
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
                {allSemesterCodes.map((semesterCode) => (
                  <DropdownMenu.CheckboxItem
                    key={displaySemesterCode(semesterCode)}
                    className={itemClasses}
                    checked={filters.some(
                      (filter) =>
                        filter.type === 'semester' && isSemCodeEqual(filter.code, semesterCode),
                    )}
                    onCheckedChange={() => toggleSemesterFilter(semesterCode)}
                  >
                    <DropdownMenu.ItemIndicator>
                      <DotFilledIcon />
                    </DropdownMenu.ItemIndicator>
                    {displaySemesterCode(semesterCode)}
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SortByDropdown;
