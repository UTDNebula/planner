import React from 'react';
import { Story, Meta } from '@storybook/react';
import CourseCard, { CourseCardProps } from '../../nebula-web/components/common/CourseCard';

export default {
  title: 'Planning/CourseCard',
  component: CourseCard,
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

const Template: Story<CourseCardProps> = (args) => <CourseCard {...args} />;

export const PlanningCard = Template.bind({});
PlanningCard.args = {
  code: 'CS 2305',
  title: 'Discrete Mathematics for Computing I',
  description:
    'Principles of counting. Boolean operations. Logic and proof methods. Recurrence relations. Sets, relations, functions. Elementary graph theory. Elementary number theory.',
};
