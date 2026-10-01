import { PrismaClient as PrismaClientBase } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

function createExtendedClient() {
    const connectionString = process.env.DATABASE_URL;
    // Prisma 7 driver adapter using node-postgres
    const adapter = new PrismaPg({ connectionString });

    return new PrismaClientBase({ adapter }).$extends({
        result: {
            product: {
                price: {
                    compute(product) {
                        return product.price.toString();
                    },
                },
                rating: {
                    compute(product) {
                        return product.rating.toString();
                    },
                },
            },
            cart: {
                itemsPrice: {
                    needs: { itemsPrice: true },
                    compute(cart) {
                        return cart.itemsPrice.toString();
                    },
                },
                taxPrice: {
                    needs: { taxPrice: true },
                    compute(cart) {
                        return cart.taxPrice.toString();
                    },
                },
                shippingPrice: {
                    needs: { shippingPrice: true },
                    compute(cart) {
                        return cart.shippingPrice.toString();
                    },
                },
                totalPrice: {
                    needs: { totalPrice: true },
                    compute(cart) {
                        return cart.totalPrice.toString();
                    },
                },
            },
            order: {
                itemsPrice: {
                    needs: { itemsPrice: true },
                    compute(cart) {
                        return cart.itemsPrice.toString();
                    },
                },
                taxPrice: {
                    needs: { taxPrice: true },
                    compute(cart) {
                        return cart.taxPrice.toString();
                    },
                },
                shippingPrice: {
                    needs: { shippingPrice: true },
                    compute(cart) {
                        return cart.shippingPrice.toString();
                    },
                },
                totalPrice: {
                    needs: { totalPrice: true },
                    compute(cart) {
                        return cart.totalPrice.toString();
                    },
                },
            },
            orderItem: {
                price: {
                    compute(cart) {
                        return cart.price.toString();
                    },
                },
            },
        },
    });
}

type ExtendedPrismaClient = ReturnType<typeof createExtendedClient>;

const globalForPrisma = globalThis as unknown as {
    prisma: ExtendedPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createExtendedClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
