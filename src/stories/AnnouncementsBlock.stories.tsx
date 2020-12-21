import React from 'react';
import { Story, Meta } from '@storybook/react';
import AnnouncementsBlock, { AnnouncementsBlockProps } from '../features/home/AnnouncementsBlock';

export default {
  title: 'Home/AnnouncementsBlock',
  component: AnnouncementsBlock,
  argTypes: {
    notices: {
      control: 'object',
    },
  },
} as Meta;

const Template: Story<AnnouncementsBlockProps> = (args) => <AnnouncementsBlock {...args} />;

export const MultipleAnnouncements = Template.bind({});
MultipleAnnouncements.args = {
  notices: [
    {
      title: 'You are about to become a junior by credit hours.',
      action: {
        text: 'Contact academic advisor',
        link: 'https://example.com',
      },
    },
    {
      title: 'It looks like this semester was a little rough. Maybe you should rethink your coursework.',
      action: {
        text: 'Review four year plan',
        link: 'https://example.com',
      },
    },
  ],
};
