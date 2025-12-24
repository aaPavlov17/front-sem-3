import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, CatalogState } from '../../types';
import { API_BASE_URL } from '../../config';


export const fetchCatalog = createAsyncThunk<Product[]>(
    'catalog/fetch',
    async () => {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data;
    }
);

const initialState: CatalogState = {
    items: [],
    loading: false,
    error: null,
};

const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCatalog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCatalog.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCatalog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error';
            });
    },
});

export default catalogSlice.reducer;
