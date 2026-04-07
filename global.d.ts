// Extend the globalThis object directly
declare global {
    type CustomPrismaClient = PrismaClientBase & ReturnType<PrismaClientBase['$extends']>;
    var prisma: CustomPrismaClient; // Use 'var' to declare a global variable
}

// Ensure this file is treated as a module, not a global script
export {};
