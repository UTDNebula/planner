import { FC, useMemo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ColorSwatchIcon from '@/icons/ColorSwatchIcon';
import ChevronIcon from '@/icons/ChevronIcon';
import { tagColors } from '../utils';
import { useSemestersContext } from '../SemesterContext';
import { SemesterType } from '@prisma/client';
import Checkbox from '../../Checkbox';
import CalendarIcon from '@/icons/CalendarIcon';
import ClockIcon from '@/icons/ClockIcon';

const itemClasses =
  'flex items-center gap-x-3 border-b border-neutral-300 px-3 py-2 hover:bg-neutral-100 cursor-pointer group';

const contentClasses = 'w-64 rounded-md border border-neutral-300 bg-generic-white z-[9999]';

const FilterByDropdown: FC = ({ children }) => {
  const {
    toggleColorFilter,
    toggleSemesterFilter,
    toggleYearFilter,
    toggleOffAllColorFilters,
    toggleOffAllSemesterFilters,
    toggleOffAllYearFilters,
    allSemesters,
    filters,
  } = useSemestersContext();

  const allYears = useMemo(
    () => new Set(allSemesters.map((semester) => semester.code.year)),
    [allSemesters],
  );

  const semestersDisplayMap = {
    [SemesterType.f]: 'Fall',
    [SemesterType.s]: 'Spring',
    [SemesterType.u]: 'Summer',
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={contentClasses + ' animate-[slideUpAndFade_0.3s]'}
          sideOffset={10}
          align="start"
        >
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className={itemClasses + ' justify-between border-none'}
              onClick={toggleOffAllColorFilters}
            >
              <div className="flex items-center gap-x-3">
                <Checkbox
                  className="group-hover:!bg-neutral-100"
                  checked={filters.some((filter) => filter.type === 'color')}
                />
                <ColorSwatchIcon />
                <span>Filter by color</span>
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
                  <DropdownMenu.Item key={`${color}-${classes}`}>
                    <div
                      className={itemClasses}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleColorFilter(color as keyof typeof tagColors);
                      }}
                    >
                      <Checkbox
                        className="group-hover:!bg-neutral-100"
                        checked={filters.some(
                          (filter) => filter.type === 'color' && filter.color === color,
                        )}
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => toggleColorFilter(color as keyof typeof tagColors)}
                      />
                      <div className={`h-5 w-5 rounded-sm border ${classes}`}></div>
                      <span>
                        {color.substring(0, 1).toUpperCase() + color.substring(1) || 'None'}
                      </span>
                    </div>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className={itemClasses + ' justify-between border-none'}
              onClick={toggleOffAllYearFilters}
            >
              <div className="flex items-center gap-x-3">
                <Checkbox
                  className="group-hover:!bg-neutral-100"
                  checked={filters.some((filter) => filter.type === 'year')}
                />
                <CalendarIcon />
                <span>Filter by year</span>
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
                  <DropdownMenu.Item key={year}>
                    <div
                      className={itemClasses}
                      onClick={(e) => {
                        toggleYearFilter(year);
                        e.stopPropagation();
                      }}
                    >
                      <Checkbox
                        className="group-hover:!bg-neutral-100"
                        onClick={(e) => e.stopPropagation()}
                        checked={filters.some(
                          (filter) => filter.type === 'year' && filter.year === year,
                        )}
                        onCheckedChange={() => toggleYearFilter(year)}
                      />
                      {year}
                    </div>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className={itemClasses + ' justify-between border-none'}
              onClick={toggleOffAllSemesterFilters}
            >
              <div className="flex items-center gap-x-3">
                <Checkbox
                  className="group-hover:!bg-neutral-100"
                  checked={filters.some((filter) => filter.type === 'semester')}
                />
                <ClockIcon />
                <span>Filter by semester</span>
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
                {Object.keys(semestersDisplayMap).map((semesterType) => (
                  <DropdownMenu.Item key={semesterType}>
                    <div
                      className={itemClasses}
                      onClick={(e) => {
                        toggleSemesterFilter(semesterType as SemesterType);
                        e.stopPropagation();
                      }}
                    >
                      <Checkbox
                        className="group-hover:!bg-neutral-100"
                        onClick={(e) => e.stopPropagation()}
                        checked={filters.some(
                          (filter) =>
                            filter.type === 'semester' && semesterType === filter.semester,
                        )}
                        onCheckedChange={() => toggleSemesterFilter(semesterType as SemesterType)}
                      />
                      {semestersDisplayMap[semesterType as SemesterType] + ' semester'}
                    </div>
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

export default FilterByDropdown;
