import {
    insertOrderItemSchema,
    insertOrderSchema,
    insertProductsSchema,
    paymentMethodSchema,
    paymentResultSchema,
    shippingAddressSchema,
} from '@/lib/validators';
import z from 'zod';
import { cartItemSchema, insertCartSchema } from '../lib/validators';

export type Product = z.infer<typeof insertProductsSchema> & {
    id: string;
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