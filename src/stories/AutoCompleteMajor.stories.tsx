import AutoCompleteMajor from '@/components/AutoCompleteMajor';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AutoCompleteMajor> = {
  component: AutoCompleteMajor,
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
};

export default meta;
type Story = StoryObj<typeof AutoCompleteMajor>;

export const MajorsList: Story = {
  args: {
    options: ['Computer Science', 'Electrical Engineering', 'Chemistry', 'Global Business'],
  },
};
