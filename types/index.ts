import { insertProductsSchema, shippingAddressSchema } from '@/lib/validators';
import z from 'zod';
import { cartItemSchema, insertCartSchema } from '../lib/validators';

export type Product = z.infer<typeof insertProductsSchema> & {
    id: string;
};

export type CartItem = z.infer<typeof cartItemSchema>;

export type Cart = z.infer<typeof insertCartSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
