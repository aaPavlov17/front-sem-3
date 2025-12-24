import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import catalogReducer from './slices/catalogSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        catalog: catalogReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
