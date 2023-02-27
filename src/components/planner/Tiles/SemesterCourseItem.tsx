import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import React, { ComponentPropsWithoutRef, FC, forwardRef, useState } from 'react';

import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';
import CheckIcon from '@mui/icons-material/Check';
import Checkbox from '@/components/Checkbox';
import SemesterCourseItemDropdown from './SemesterCourseItemDropdown';
import { tagColors } from '../utils';
import { Popover, Typography } from '@mui/material';
import { trpc } from '@/utils/trpc';
import useSearch from '@/components/search/search';
import { ObjectID } from 'bson';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  isSelected?: boolean;
  onSelectCourse?: () => void;
  onDeselectCourse?: () => void;
  onDeleteCourse?: () => void;
  onColorChange?: (color: keyof typeof tagColors) => void;
}

/** UI implementation of a semester course */
/* eslint-disable react/prop-types */
export const MemoizedSemesterCourseItem = React.memo(
  forwardRef<HTMLDivElement, SemesterCourseItemProps>(function SemesterCourseItem(
    {
      course,
      onSelectCourse,
      onDeselectCourse,
      isSelected,
      onDeleteCourse,
      onColorChange,
      ...props
    },
    ref,
  ) {
    const defaultQuery = 'CS';
    const [finalPrereqs, setFinalprereqs] = useState<string[]>();
    var prereqs: string[] = [];
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      (data?.find(function(cNum) {
        if (cNum.subject_prefix + " " + cNum.course_number === course.code) {
          (cNum.prerequisites as Record<string, any>).options.map((elem: any) => {
            if (elem.type !== "course" && elem.type !== "other") {
              elem.options.map((elem2: any) => {
                if (elem2.type !== "course" && elem2.type !== "other") {
                  elem2.options.map((elem3: any) => {
                    data?.map((elem4) => {
                      if (elem4.id === elem3.class_reference) {
                        prereqs.push(elem4.subject_prefix+ " " + elem4.course_number)
                      }
                    })
                  })
                } else if (elem2.type === "other") {
                    prereqs.push(elem2.description)
                } else {
                  data?.map((elem4) => {
                    if (elem4.id === elem2.class_reference) {
                      prereqs.push(elem4.subject_prefix+ " " + elem4.course_number)
                    }
                    
                  })
                }
              })
            } else if (elem.type === "other") {
                prereqs.push(elem.description)
            } else {
              data?.map((elem4) => {
                if (elem4.id === elem.class_reference) {
                  prereqs.push(elem4.subject_prefix+ " " + elem4.course_number)
                }
                
              })
            }
            })
          return course.code
        }
      }))

      console.log(prereqs)
      setFinalprereqs(
        prereqs.map((val) => val),
      );
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
      prereqs = [];
    };

    const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });
    
    const {data, isLoading} = q;

    React.useEffect(() => {
      updateQuery(defaultQuery);
    }, [isLoading]);

    const { results, updateQuery } = useSearch({
      getData: async () =>
        data ? data.map((c) => ({ code: `${c.subject_prefix} ${c.course_number}` })) : [],
      initialQuery: defaultQuery,
      filterFn: (elm, query) => elm['code'].toLowerCase().includes(query.toLowerCase()),
      constraints: [0, 5],
    });

    const open = Boolean(anchorEl);
    return (
      <div
        ref={ref}
        {...props}
        data-tip="Drag!"
        className={` tooltip tooltip-left flex h-min w-full cursor-grab flex-row items-center overflow-hidden rounded-md border border-neutral-200 bg-generic-white`}
        onClick={() => setDropdownOpen((prev) => !prev)}
        onMouseOver={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {anchorEl && <div>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
            width: "500rem"
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          
        >
          {
            finalPrereqs == null || data == null ? "Loading..." : (
              finalPrereqs.length === 0 ? (
                <Typography sx={{ p: 5}}>
                  Prerequisites: None
                </Typography>
              ) :
              <Typography sx={{ p: 5,  }}>
                Prerequisites: {
                  finalPrereqs.map((elem, idx) => elem).join(", ")
                }
              </Typography>
            )
          }
        </Popover>
      </div>}
        <div className={`h-full w-2 transition-all ${tagColors[course.color]}`}></div>
        <div className="p-1">
          <div className="flex items-center justify-center">
            <div className="flex flex-row items-center gap-x-3">
              <SemesterCourseItemDropdown
                open={dropdownOpen}
                onOpenChange={(open) => setDropdownOpen(open)}
                changeColor={(color) => onColorChange && onColorChange(color)}
                deleteCourse={() => onDeleteCourse && onDeleteCourse()}
              />
              <Checkbox
                style={{ width: '20px', height: '20px' }}
                checked={isSelected}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={(checked) => {
                  if (checked && onSelectCourse) {
                    onSelectCourse();
                  }

                  if (!checked && onDeselectCourse) {
                    onDeselectCourse();
                  }
                }}
              />
              <span className="text-sm text-[#1C2A6D]">{course.code}</span>
            </div>
          </div>
          <div className="ml-auto flex text-xs font-semibold">
            {course.taken && (
              <span className=" tooltip text-[#22C55E]" data-tip="Completed">
                <CheckIcon fontSize="small" />
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }),
);

export const SemesterCourseItem = MemoizedSemesterCourseItem;

export interface DraggableSemesterCourseItemProps {
  dragId: UniqueIdentifier;
  isSelected: boolean;
  semester: Semester;
  course: DraggableCourse;
  onSelectCourse: () => void;
  onDeselectCourse: () => void;
  onDeleteCourse: () => void;
  onColorChange: (color: keyof typeof tagColors) => void;
}

/** Compositional wrapper around SemesterCourseItem */
const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  dragId,
  semester,
  course,
  onSelectCourse,
  onDeselectCourse,
  onDeleteCourse,
  isSelected,
  onColorChange,
}) => {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
  });

  return (
    <SemesterCourseItem
      ref={setNodeRef}
      style={{
        visibility: isDragging ? 'hidden' : 'unset',
      }}
      {...attributes}
      {...listeners}
      course={course}
      onSelectCourse={onSelectCourse}
      onDeselectCourse={onDeselectCourse}
      onDeleteCourse={onDeleteCourse}
      isSelected={isSelected}
      onColorChange={onColorChange}
    />
  );
};

export default React.memo(DraggableSemesterCourseItem);
