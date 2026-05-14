'use server';
import prisma from '@/db/prisma';
import { Category } from '@/types';
import { formatError } from '../utils';
import { insertCategorySchema } from '../validators';

export async function createCategory(data: Category) {
    try {
        const category = insertCategorySchema.parse(data);
        await prisma.category.create({ data: category });
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function getAllCategories() {
    return await prisma.category.findMany();
}
