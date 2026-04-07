// 1. Import dotenv/config once at the very top
//    This ensures your .env variables are loaded globally for the Node.js process.
//    If your main Next.js app or a global bootstrap file already does this, you might not need it here.
//    However, for standalone scripts or server actions that might run independently, it's safer to include.
import 'dotenv/config';

import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// 2. Instantiate the PrismaPg adapter once
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

// 3. Declare a variable for PrismaClient
//    This allows us to conditionally assign to it.
let prisma: PrismaClient;

// 4. Implement a singleton pattern
//    This is crucial for Next.js development with hot-reloading.
//    In development, Next.js can re-import modules multiple times,
//    leading to multiple PrismaClient instances if not handled.
//    globalThis is a global object that persists across hot reloads.
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({ adapter });
} else {
    // Use globalThis to store the PrismaClient instance
    // This ensures only one instance is created during development hot-reloads
    if (!global.prisma) {
        global.prisma = new PrismaClient({ adapter });
    }
    prisma = global.prisma;
}

// 5. Export the single instance
export default prisma;
