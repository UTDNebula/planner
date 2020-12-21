import React from 'react';
import { Story, Meta } from '@storybook/react';
import UserDetailsBlock, { UserDetailsBlockProps } from '../features/home/UserDetailsBlock';

export default {
  title: 'Home/UserDetailsBlock',
  component: UserDetailsBlock,
  argTypes: {
    attemptedHours: {
      control: 'number',
      options: {
        min: 0,
      },
    },
    coursesCompleted: {
      control: 'number',
      options: {
        min: 0,
      },
    },
    coursesRemaining: {
      control: 'number',
      options: {
        min: 0,
      },
    },
    gpa: {
      control: 'number',
      options: {
        min: 0,
        max: 4,
      },
    },
  },
} as Meta;

const Template: Story<UserDetailsBlockProps> = (args) => <UserDetailsBlock {...args} />;

export const SampleUserInfo = Template.bind({});
SampleUserInfo.args = {
  name: 'John Smith',
  planTitle: 'Bachelor of Science in Computer Science and Cognitive Science',
  honorsIndicators: ['bbs'],
  start: '2019f',
  classText: 'Class of 2023',
  estimatedGraduation: 'Spring 2023',
  coursesCompleted: 25,
  attemptedHours: 64,
  coursesRemaining: 32,
  gpa: 3.422,
};

export const NamelessUserInfo = Template.bind({});
NamelessUserInfo.args = {
  planTitle: 'Bachelor of Science in Mathematics',
  honorsIndicators: [],
  start: '2019f',
  classText: 'Class of 2024',
  estimatedGraduation: 'Spring 2024',
  coursesCompleted: 6,
  attemptedHours: 16,
  coursesRemaining: 34,
  gpa: 4.0,
};
