'use server';
import prisma from '@/db/prisma';
import 'dotenv/config';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';

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

type GetAllProductsProps = {
    query: string;
    limit?: number;
    page: number;
    category?: string;
};

export async function getAllProducts({
    query,
    limit = PAGE_SIZE,
    page,
    category,
}: GetAllProductsProps) {
    const data = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.product.count();

    return { data, totalPages: Math.ceil(dataCount / limit) };
}
