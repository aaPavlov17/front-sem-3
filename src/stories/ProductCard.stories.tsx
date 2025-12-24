import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { ProductCard } from '../components/ProductCard';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof ProductCard> = {
    title: 'Components/ProductCard',
    component: ProductCard,
    tags: ['autodocs'],
    decorators: [
        (Story: StoryFn) => (
            <BrowserRouter>
                <div style={{ width: '300px' }}>
                    <Story />
                </div>
            </BrowserRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
    args: {
        id: 1,
        name: 'Classic Pullover',
        image: 'https://via.placeholder.com/300x400',
        price: 1500,
    },
};

export const LongName: Story = {
    args: {
        id: 2,
        name: 'Very Long Product Name For Testing Layout Stability And Constraints',
        image: 'https://via.placeholder.com/300x400',
        price: 2500,
    },
};
