export interface Product {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    id?: number;
    name: string;
    email: string;
    token?: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

export interface CatalogState {
    items: Product[];
    loading: boolean;
    error: string | null;
}

export interface CartState {
    items: CartItem[];
}
