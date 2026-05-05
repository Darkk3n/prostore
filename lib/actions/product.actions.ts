'use server';
import prisma from '@/db/prisma';
import 'dotenv/config';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { formatError } from '../utils';
import { insertProductsSchema, updateProductSchema } from '../validators';

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

export async function deleteProduct(productId: string) {
    try {
        const productExists = await prisma.product.findFirst({
            where: { id: productId },
        });
        if (!productExists) throw new Error('Product not found');

        await prisma.product.delete({ where: { id: productId } });

        revalidatePath('/admin/products');
        return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function createProduct(data: z.infer<typeof insertProductsSchema>) {
    try {
        const product = insertProductsSchema.parse(data);
        await prisma.product.create({
            data: product,
        });

        revalidatePath('/admin/products');
        return { success: true, message: 'Product created successfully' };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    try {
        const product = updateProductSchema.parse(data);
        const productExists = await prisma.product.findFirst({ where: { id: product.id } });
        if (!productExists) throw new Error('Product not found');

        await prisma.product.update({
            where: { id: product.id },
            data: product,
        });

        revalidatePath('/admin/products');
        return { success: true, message: 'Product updated successfully' };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}
