import { auth } from '@/auth';
import { getOrderById } from '@/lib/actions/order.actions';
import { ShippingAddress } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import OrderDetailsTable from './order-details-table';

export const metadata: Metadata = {
    title: 'Order Details',
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
    const { id } = await props.params;
    const order = await getOrderById(id);
    if (!order) notFound();
    const session = await auth();

    let client_secret = null;

    if (order.paymentMethod === 'Stripe' && !order.isPaid) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.totalPrice) * 100),
            currency: 'USD',
            metadata: { orderId: order.id },
        });
        client_secret = paymentIntent.client_secret;
    }

    return (
        <>
            <OrderDetailsTable
                order={{
                    ...order,
                    itemsPrice: order.itemsPrice.toString(),
                    shippingPrice: order.shippingPrice.toString(),
                    taxPrice: order.taxPrice.toString(),
                    totalPrice: order.totalPrice.toString(),
                    orderItems: order.orderItems.map(
                        ({ name, image, productId, slug, price, qty }) => ({
                            name,
                            image,
                            productId,
                            slug,
                            price: price.toString(),
                            qty,
                        }),
                    ),
                    shippingAddress: order.shippingAddress as ShippingAddress,
                }}
                paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
                isAdmin={session?.user.role === 'admin' || false}
                stripeClientSecret={client_secret}
            />
        </>
    );
};

export default OrderDetailsPage;
