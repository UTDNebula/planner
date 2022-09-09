import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Semester } from '../../../modules/common/data';
import CourseCard from '../../common/CourseCard';

export type SemesterContainerProps = {
  item: Semester;
  removeCourse: (itemId: string, droppableId: string) => void;
};

export default function SemesterContainer({ item, removeCourse }: SemesterContainerProps) {
  return (
    <Droppable key={item.code} droppableId={item.code}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className="inline-block w-[19rem]"
          {...provided.droppableProps}
        >
          <div className="m-2 p-2 w-[18rem] bg-white rounded-md border-gray-200 border-2">
            {item.title}
          </div>
          <div>
            {item.courses.map(({ id, title, catalogCode, description, creditHours }, index) => {
              return (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <CourseCard
                      id={id}
                      key={catalogCode}
                      ref={provided.innerRef}
                      code={catalogCode}
                      title={title}
                      description={description}
                      creditHours={creditHours}
                      enabled
                      onOptionRemove={removeCourse}
                      droppableCode={item.code}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
