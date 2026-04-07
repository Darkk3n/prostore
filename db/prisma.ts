/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient as PrismaClientBase } from '@/lib/generated/prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import 'dotenv/config';
import ws from 'ws';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon({ connectionString });

type CustomPrismaClient = PrismaClientBase & ReturnType<PrismaClientBase['$extends']>;
let prisma: CustomPrismaClient;

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClientBase({ adapter }).$extends({
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
        },
    }) as any;
} else {
    if (!globalThis.prisma) {
        globalThis.prisma = new PrismaClientBase({ adapter }).$extends({
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
            },
        }) as any;
    }
    prisma = globalThis.prisma as CustomPrismaClient;
}
export default prisma;
