'use server';

import { auth } from '@/auth';
import prisma from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { formatError } from '../utils';
import { insertReviewSchema } from '../validators';

export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {
    try {
        const session = await auth();
        if (!session) throw new Error('User not authenticated');

        const review = insertReviewSchema.parse({ ...data, userId: session.user.id });

        const product = await prisma.product.findFirst({ where: { id: review.productId } });
        if (!product) throw new Error('Product not found');

        const reviewExists = await prisma.review.findFirst({
            where: { productId: review.productId, userId: review.userId },
        });

        await prisma.$transaction(async (tx) => {
            if (reviewExists) {
                await tx.review.update({
                    where: { id: reviewExists.id },
                    data: {
                        title: review.title,
                        description: review.description,
                        rating: review.rating,
                    },
                });
            } else {
                await tx.review.create({ data: review });
            }
            const avgRating = await tx.review.aggregate({
                _avg: { rating: true },
                where: { productId: review.productId },
            });
            const numReviews = await tx.review.count({ where: { productId: review.productId } });

            await tx.product.update({
                where: { id: review.productId },
                data: {
                    rating: avgRating._avg.rating || 0,
                    numReviews,
                },
            });
        });

        revalidatePath(`/product/${product.slug}`);
        return {
            success: true,
            message: `Review ${reviewExists ? 'updated' : 'created'} successfully`,
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}
