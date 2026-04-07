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
