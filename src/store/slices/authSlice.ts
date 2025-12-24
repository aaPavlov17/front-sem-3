import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { API_BASE_URL } from '../../config';


export const submitAuth = createAsyncThunk<User, { email: string; password: string }>(
    'auth/submit',
    async ({ email, password }) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();


        localStorage.setItem('auth', JSON.stringify({ ...data, timestamp: Date.now() }));

        return data;
    }
);


export const registerUser = createAsyncThunk<
    User,
    { name: string; email: string; password: string }
>(
    'auth/register',
    async ({ name, email, password }) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();


        localStorage.setItem('auth', JSON.stringify({ ...data, timestamp: Date.now() }));

        return data;
    }
);

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('auth');
        },
        loadAuthFromStorage: (state) => {
            const savedAuth = localStorage.getItem('auth');
            if (savedAuth) {
                try {
                    const authData = JSON.parse(savedAuth);
                    state.user = authData;
                    state.isAuthenticated = true;
                } catch (e) {
                    console.error('Failed to load auth from storage', e);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(submitAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error';
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error';
            });
    },
});

export const { logout, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
