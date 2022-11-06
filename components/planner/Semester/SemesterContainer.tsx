import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Semester } from '../../../modules/common/data';
import CourseCard from '../../common/CourseCard';

export type SemesterContainerProps = {
  item: Semester;
  removeCourse: (itemId: string, droppableId: string) => void;
  updateOverride: (id: string) => void;
  potentialSemesters: any;
  addSemester: (index: number, isSummer: boolean) => void;
  removeSemester: (index: number) => void;
};

export default function SemesterContainer({
  item,
  removeCourse,
  updateOverride,
  potentialSemesters,
  addSemester,
  removeSemester,
}: SemesterContainerProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddSemester = (isSummer) => {
    const semesterIndex = potentialSemesters['semIndex'];
    addSemester(semesterIndex, isSummer);
    handleClose();
  };

  const handleRemoveSemester = () => {
    removeSemester(potentialSemesters['semIndex']);
    handleClose();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Determine where to show Add/Remove course

  return (
    <Droppable key={item.code} droppableId={item.code}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className="inline-block w-[19rem]"
          {...provided.droppableProps}
        >
          <div className="m-2 p-2 w-[18rem] flex flex-row justify-between items-center bg-white rounded-md border-gray-200 border-2">
            {item.title}
            <IconButton
              id="demo-positioned-button"
              aria-controls={open ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <ArrowDropDownCircleIcon />
            </IconButton>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              {potentialSemesters['f'] && (
                <MenuItem onClick={() => handleAddSemester(false)}>Add Fall Semester</MenuItem>
              )}
              {potentialSemesters['s'] && (
                <MenuItem onClick={() => handleAddSemester(false)}>Add Spring Semester</MenuItem>
              )}
              {potentialSemesters['u'] && (
                <MenuItem onClick={() => handleAddSemester(true)}>Add Summer Semester</MenuItem>
              )}

              <MenuItem onClick={handleRemoveSemester}>Remove Semester</MenuItem>
            </Menu>
          </div>
          <div>
            {item.courses.map(
              (
                { id, title, catalogCode, description, creditHours, validation, prerequisites },
                index,
              ) => {
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <CourseCard
                        id={id}
                        key={catalogCode}
                        ref={provided.innerRef}
                        updateOverride={updateOverride}
                        code={catalogCode}
                        title={title}
                        description={description}
                        creditHours={creditHours}
                        prerequisites={prerequisites}
                        isValid={validation ? validation.isValid : true}
                        enabled
                        onOptionRemove={removeCourse}
                        droppableCode={item.code}
                        override={validation.override}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                );
              },
            )}
            <div className="h-32"></div>
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
