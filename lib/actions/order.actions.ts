'use server';

import { auth } from '@/auth';
import prisma from '@/db/prisma';
import { PaymentResult } from '@/types';
import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { PAGE_SIZE } from '../constants';
import { Prisma } from '../generated/prisma/client';
import { paypal } from '../paypal';
import { convertToPlainObject, formatError } from '../utils';
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

export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderItems: true,
            user: {
                select: { name: true, email: true },
            },
        },
    });

    return convertToPlainObject(data);
}

export async function createPayPalOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });
        if (!order) throw new Error('Order not found');
        else {
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: '',
                        status: '',
                        pricePaid: 0,
                    },
                },
            });
            return {
                success: true,
                message: 'Item order created successfully',
                data: paypalOrder.id,
            };
        }
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function approvePayPalOrder(orderId: string, data: { orderID: string }) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });
        if (!order) throw new Error('Order not found');

        const captureData = await paypal.capturePayment(data.orderID);
        if (
            !captureData ||
            captureData.id !== (order.paymentResult as PaymentResult).id ||
            captureData.status !== 'COMPLETED'
        ) {
            throw new Error('Error in PayPal payment');
        }

        await updateOrderToPaid({
            orderId,
            paymentResult: {
                id: captureData.id,
                status: captureData.status,
                email_address: captureData.payer.email_address,
                pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
            },
        });

        revalidatePath(`/order/${orderId}`);
        return { success: true, message: 'Your order has been paid' };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

async function updateOrderToPaid({
    orderId,
    paymentResult,
}: {
    orderId: string;
    paymentResult?: PaymentResult;
}) {
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: { orderItems: true },
    });
    if (!order) throw new Error('Order not found');
    if (order.isPaid) throw new Error('Order already paid');

    await prisma.$transaction(async (tx) => {
        for (const item of order.orderItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: { increment: -item.qty },
                },
            });
        }
        await tx.order.update({
            where: { id: orderId },
            data: { isPaid: true, paidAt: new Date(), paymentResult },
        });
    });

    const updatedOrder = await prisma.order.findFirst({
        where: { id: orderId },
        include: { orderItems: true, user: { select: { name: true, email: true } } },
    });
    if (!updatedOrder) throw new Error('Order not found');
}

export async function getMyOrders({ limit = PAGE_SIZE, page }: { limit?: number; page: number }) {
    const session = await auth();
    if (!session) throw new Error('User not authorized');
    const userId = session.user?.id;
    const data = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
    });

    const dataCount = await prisma.order.count({
        where: { userId },
    });

    return { data, totalPages: Math.ceil(dataCount / limit) };
}

type SalesDataType = {
    month: string;
    totalSales: number;
}[];

export async function getOrderSummary() {
    // Counts for each resource
    const ordersCount = await prisma.order.count();
    const productsCount = await prisma.order.count();
    const usersCount = await prisma.order.count();

    // Calculate total sales
    const totalSales = await prisma.order.aggregate({ _sum: { totalPrice: true } });

    // Monthly Sales
    const salesDataRaw = await prisma.$queryRaw<
        Array<{ month: string; totalSales: Prisma.Decimal }>
    >`SELECT to_char("createdAt", 'MM/YY') AS "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

    const salesData: SalesDataType = salesDataRaw.map((sd) => ({
        month: sd.month,
        totalSales: Number(sd.totalSales),
    }));

    const latestSales = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
        take: 6,
    });

    return { ordersCount, productsCount, usersCount, totalSales, salesData, latestSales };
}

export async function getAllOrders({ limit = PAGE_SIZE, page }: { limit?: number; page: number }) {
    const data = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: { user: { select: { name: true } } },
    });

    const dataCount = await prisma.order.count();

    return { data, totalPages: Math.ceil(dataCount / limit) };
}

export async function deleteOrder(orderId: string) {
    try {
        await prisma.order.delete({ where: { id: orderId } });
        revalidatePath('/admin/orders');
        return { success: true, message: 'Order deleted successfully' };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}
