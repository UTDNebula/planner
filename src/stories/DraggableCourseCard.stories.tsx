import React from 'react';
import { Story, Meta } from '@storybook/react';
import DraggableCourseCard, { DraggableCourseCardProps } from '../features/planner/DraggableCourseCard';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default {
  title: 'Planning/DraggableCourseCard',
  component: DraggableCourseCard,
  argTypes: {
    id: {
      control: 'text',
    },
    code: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
  },
} as Meta;

const Template: Story<DraggableCourseCardProps> = (args) => (
  <DragDropContext onDragEnd={() => { }}>
    <Droppable droppableId="test">
      {(provided) => (
        <div ref={provided.innerRef}>
          <DraggableCourseCard {...args} />
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

export const PlanningCard = Template.bind({});
PlanningCard.args = {
  id: '000001',
  code: 'CS 2305',
  title: 'Discrete Mathematics for Computing I',
  description: 'Principles of counting. Boolean operations. Logic and proof methods. Recurrence relations. Sets, relations, functions. Elementary graph theory. Elementary number theory.'
};
