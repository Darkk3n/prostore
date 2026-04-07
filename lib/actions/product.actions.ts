'use server';
import prisma from '@/db/prisma';
import 'dotenv/config';
import { LATEST_PRODUCTS_LIMIT } from '../constants';

export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createAt: 'desc' },
    });
    return data;
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findFirst({ where: { slug: slug } });
    return product;
}
