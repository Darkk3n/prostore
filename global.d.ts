import { PrismaClient } from '@/lib/generated/prisma/client';

// Extend the globalThis object directly
declare global {
    var prisma: PrismaClient; // Use 'var' to declare a global variable
}

// Ensure this file is treated as a module, not a global script
export {};
