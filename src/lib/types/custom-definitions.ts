// src/types/cart.types.ts

export interface Category {
    id: string;
    name: string;
    desc: string;
    imageKey: string;
    updated_at: Date | null;
    created_at: Date;
}

export interface Product {
    id: string;
    name: string;
    desc: string | null;
    updated_at: Date | null;
    created_at: Date;
    shortDesc: string;
    price: string; // Stored as a string to handle high-precision decimal database types cleanly
    quantity: number; // Inventory stock level
    thresholdQuantity: number | null; // Reorder alarm threshold
    featuredImageKey: string;
    slug: string | null;
    isFeatured: boolean | null;
    categoryId: string | null;
    category: Category | null; // Nested relational category object data
}

export interface CartItem {
    id: string;
    updated_at: Date | null;
    created_at: Date;
    quantity: number | null; // Number of units requested by client user inside their session bag
    productId: string | null;
    userId: string | null;
    isCompleted: boolean | null; // Marks whether this dynamic instance item transaction has completed checkout
    products: Product | null; // Nested relational product detail profile configuration object
}

// Global Array Type definition for lists
export type CartItemList = CartItem[];