import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem, CartState, User } from '../../types';
import { API_BASE_URL } from '../../config';


export const submitOrder = createAsyncThunk(
    'cart/submitOrder',
    async ({ userId, items }: { userId: number, items: CartItem[] }) => {
        const orderItems = items.map(item => ({ productId: item.id, quantity: item.quantity }));
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, items: orderItems })
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        return await response.json();
    }
);

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
            const product = action.payload;
            const existing = state.items.find((item) => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        incrementQuantity: (state, action: PayloadAction<number>) => {
            const item = state.items.find((cartItem) => cartItem.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        decrementQuantity: (state, action: PayloadAction<number>) => {
            const item = state.items.find((cartItem) => cartItem.id === action.payload);
            if (!item) {
                return;
            }
            if (item.quantity === 1) {
                state.items = state.items.filter((cartItem) => cartItem.id !== action.payload);
            } else {
                item.quantity -= 1;
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
