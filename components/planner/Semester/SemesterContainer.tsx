import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Semester } from '../../../modules/common/data';
import CourseCard from '../../common/CourseCard';

export type SemesterContainerProps = {
  item: Semester;
  removeCourse: (itemId: string, droppableId: string) => void;
  updateOverride: (id: string) => void;
};

export default function SemesterContainer({
  item,
  removeCourse,
  updateOverride,
}: SemesterContainerProps) {
  return (
    <Droppable key={item.code} droppableId={item.code}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className="inline-block w-[19rem] h-screen"
          {...provided.droppableProps}
        >
          <div className="m-2 p-2 w-[18rem] bg-white rounded-md border-gray-200 border-2">
            {item.title}
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
