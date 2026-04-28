'use server';

import { auth } from '@/auth';
import prisma from '@/db/prisma';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { insertOrderSchema } from '../validators';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';

export async function createOrder() {
    try {
        const session = await auth();
        if (!session) throw new Error('User is not authenticated');
        const cart = await getMyCart();
        const userId = session.user?.id;
        if (!userId) throw new Error('User not found');
        const user = await getUserById(userId);
        if (!cart || cart?.items.length === 0) {
            return { success: false, message: 'Your cart is empty', redirect: '/cart' };
        }
        if (!user.address) {
            return {
                success: false,
                message: 'No shipping address',
                redirect: '/shipping-address',
            };
        }
        if (!user.paymentMethod) {
            return { success: false, message: 'No payment method', redirect: '/payment-method' };
        }

        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice,
        });

        const insertedOrderId = await prisma.$transaction(async (tx) => {
            const insertedOrder = await tx.order.create({ data: order });
            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: { ...item, price: item.price, orderId: insertedOrder.id },
                });
            }
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    itemsPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: 0,
                },
            });
            return insertedOrder.id;
        });
        if (!insertedOrderId) throw new Error('Order not created');

        return {
            success: true,
            message: 'Order created successfully',
            redirectTo: `order/${insertedOrderId}`,
        };
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return { success: false, message: formatError(error) };
    }
}
