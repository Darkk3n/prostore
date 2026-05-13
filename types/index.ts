import {
    insertOrderItemSchema,
    insertOrderSchema,
    insertProductsSchema,
    insertReviewSchema,
    paymentMethodSchema,
    paymentResultSchema,
    shippingAddressSchema,
    updateUserSchema,
} from '@/lib/validators';
import z from 'zod';
import { cartItemSchema, insertCartSchema } from '../lib/validators';

export type Product = z.infer<typeof insertProductsSchema> & {
    id: string;
    rating: number;
    numReviews: number;
    createAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;

export type Cart = z.infer<typeof insertCartSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderItems: OrderItem[];
    user: { name: string; email: string };
};

export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type User = z.infer<typeof updateUserSchema>;

export type Review = z.infer<typeof insertReviewSchema> & {
    id: string;
    createdAt: Date;
    user?: { name: string };
};
