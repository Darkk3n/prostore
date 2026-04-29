'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

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
        paymentMethod,
    } = order;
    return (
        <>
            <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                <div className="col-span-2 space-y-4 overflow-x-auto">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Payment Method</h2>

                            <p className="mb-2">{paymentMethod}</p>
                            {isPaid ? (
                                <Badge variant="secondary">
                                    Paid at {formatDateTime(paidAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Not Paid</Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="my-2">
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Shipping Address</h2>
                            <p className="mb-2">{shippingAddress.fullName}</p>
                            <p>
                                {shippingAddress.streetAddress}, {shippingAddress.city}
                            </p>
                            <p>
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            {isDelivered ? (
                                <Badge variant="secondary">
                                    Paid at {formatDateTime(deliveredAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Not Delivered</Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="my-2">
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map((i) => (
                                        <TableRow key={i.slug}>
                                            <TableCell>
                                                <Link
                                                    href={`/product/${i.slug}`}
                                                    className="flex items-center"
                                                >
                                                    <Image
                                                        src={i.image}
                                                        alt={i.name}
                                                        height={50}
                                                        width={50}
                                                    />
                                                    <span className="px-2">{i.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2">{i.qty}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-right">${i.price}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Items</div>
                                <div>{formatCurrency(itemsPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Tax Price</div>
                                <div>{formatCurrency(taxPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Shipping Price</div>
                                <div>{formatCurrency(shippingPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total Price</div>
                                <div>{formatCurrency(totalPrice)}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default OrderDetailsTable;
