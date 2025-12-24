import { CartItem } from '../types';

export const calculateCartTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0);
};

export const calculateCartItemsCount = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
};
