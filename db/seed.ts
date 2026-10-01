import prisma from '@/db/prisma';
import 'dotenv/config';
import sampleData from './sample-data';

async function main() {
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    await prisma.category.createMany({
        data: sampleData.categories,
    });
    const firstCategory = await prisma.category.findFirst();

    const productsWithCategory = sampleData.products.map((product) => ({
        ...product,
        categoryId: firstCategory!.id,
    }));

    await prisma.product.createMany({
        data: productsWithCategory,
    });

    await prisma.user.createMany({
        data: sampleData.users,
    });

    console.log('Database seeded successfully');
}

main();

//npx tsx ./db/seed
