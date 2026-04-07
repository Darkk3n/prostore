import { insertProductsSchema } from '@/lib/validators';
import z from 'zod';

export type Product = z.infer<typeof insertProductsSchema> & {
    id: string;
};
