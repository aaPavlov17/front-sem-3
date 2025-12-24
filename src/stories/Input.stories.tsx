import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/ui/Input';

const meta: Meta<typeof Input> = {
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
    args: {
        placeholder: 'Enter text...',
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {},
};

export const WithLabel: Story = {
    args: {
        label: 'Email Address',
        id: 'email-input',
    },
};

export const WithError: Story = {
    args: {
        label: 'Username',
        value: 'invaliduser',
        error: 'Username already taken',
    },
};

export const FullWidth: Story = {
    args: {
        label: 'Full Width Input',
        fullWidth: true,
    },
};

export const Password: Story = {
    args: {
        label: 'Password',
        type: 'password',
        value: 'secret123',
    },
};
