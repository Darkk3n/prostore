import prisma from '@/lib/prisma';
import 'dotenv/config';
import sampleData from './sample-data';

async function main() {
    await prisma.product.deleteMany();

    await prisma.product.createMany({
        data: sampleData.products,
    });

    console.log('Database seeded successfully');
}

main();
