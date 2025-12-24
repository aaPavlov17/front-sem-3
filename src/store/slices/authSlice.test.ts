import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, { logout, submitAuth, registerUser, loadAuthFromStorage } from './authSlice';
import { AuthState } from '../../types';

describe('authSlice', () => {
    const initialState: AuthState = {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    };

    it('should handle initial state', () => {
        expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle logout', () => {
        const loggedInState: AuthState = {
            user: { id: 1, name: 'Test', email: 'test@test.com' },
            loading: false,
            error: null,
            isAuthenticated: true,
        };
        const actual = authReducer(loggedInState, logout());
        expect(actual.user).toBeNull();
        expect(actual.isAuthenticated).toBe(false);
    });

    describe('loadAuthFromStorage', () => {
        beforeEach(() => {
            localStorage.clear();
        });

        it('should load user from localStorage', () => {
            const user = { id: 1, name: 'Test', email: 'test@test.com' };
            localStorage.setItem('auth', JSON.stringify(user));

            const actual = authReducer(initialState, loadAuthFromStorage());
            expect(actual.user).toEqual(user);
            expect(actual.isAuthenticated).toBe(true);
        });

        it('should ignore invalid json', () => {
            localStorage.setItem('auth', 'invalid json');
            const actual = authReducer(initialState, loadAuthFromStorage());
            expect(actual.user).toBeNull();
        });
    });

    describe('async thunks', () => {
        beforeEach(() => {
            global.fetch = vi.fn();
        });

        it('submitAuth pending', () => {
            const action = { type: submitAuth.pending.type };
            const state = authReducer(initialState, action);
            expect(state.loading).toBe(true);
        });

        it('submitAuth fulfilled', () => {
            const user = { id: 1, name: 'Test', email: 'test@test.com' };
            const action = { type: submitAuth.fulfilled.type, payload: user };
            const state = authReducer(initialState, action);
            expect(state.loading).toBe(false);
            expect(state.user).toEqual(user);
            expect(state.isAuthenticated).toBe(true);
        });

        it('submitAuth rejected', () => {
            const action = { type: submitAuth.rejected.type, error: { message: 'Failed' } };
            const state = authReducer(initialState, action);
            expect(state.loading).toBe(false);
            expect(state.error).toBe('Failed');
        });
    });
});
