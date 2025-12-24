import { describe, it, expect } from 'vitest';
import { calculateCartTotal, calculateCartItemsCount } from './cartUtils';
import { CartItem } from '../types';

describe('cartUtils', () => {
    describe('calculateCartTotal', () => {
        it('should return 0 for empty cart', () => {
            expect(calculateCartTotal([])).toBe(0);
        });

        it('should calculate correct total', () => {
            const items: CartItem[] = [
                { id: 1, name: 'Item 1', quantity: 2, price: 100, image: '', description: '' },
                { id: 2, name: 'Item 2', quantity: 1, price: 50, image: '', description: '' }
            ];
            expect(calculateCartTotal(items)).toBe(250);
        });

        describe('calculateCartItemsCount', () => {
            it('should return 0 for empty cart', () => {
                expect(calculateCartItemsCount([])).toBe(0);
            });

            it('should calculate correct count', () => {
                const items: CartItem[] = [
                    { id: 1, name: 'Item 1', quantity: 2, price: 100, image: '', description: '' },
                    { id: 2, name: 'Item 2', quantity: 1, price: 50, image: '', description: '' }
                ];
                expect(calculateCartItemsCount(items)).toBe(3);
            });
        });
    });
});
