'use client';

import { formatId } from '@/lib/utils';
import { Order } from '@/types';

const OrderDetailsTable = ({ order }: { order: Order }) => {
    const {
        shippingAddress,
        orderItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isDelivered,
        isPaid,
        paidAt,
        deliveredAt,
    } = order;
    return (
        <>
            <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                <div className="col-span-2 space-y-4 overflow-x-auto"></div>
            </div>
        </>
    );
};

export default OrderDetailsTable;
