import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/ui/Button';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};

export const AsLink: Story = {
    args: {
        variant: 'primary',
        to: '/some-path',
        children: 'Button as Link',
    },
};
