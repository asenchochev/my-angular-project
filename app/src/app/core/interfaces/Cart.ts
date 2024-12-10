import { Perfume } from "./Perfume";

export interface Cart {
    items: CartItem[];
    totalPrice: number;
}

export interface CartItem {
    perfume: Perfume;
    quantity: number;
    price: number;
}