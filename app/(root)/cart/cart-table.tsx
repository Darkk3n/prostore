'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { addItemToCart, removeFromCart } from '@/lib/actions/cart.actions';
import { formatCurrency } from '@/lib/utils';
import { Cart } from '@/types';
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

const CartTable = ({ cart }: { cart?: Cart }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleToast = ({ success, message }: { success: boolean; message: string }) => {
        if (!success) {
            toast.error(message, {
                position: 'top-right',
            });
        } else {
            toast.success(message, {
                position: 'top-right',
            });
        }
    };
    return (
        <>
            <h1 className="py-4 h2-bold">Shopping Cart</h1>
            {!cart || cart.items.length == 0 ? (
                <div>
                    Cart is empty. <Link href="/">Go Shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items.map((i) => (
                                    <TableRow key={i.slug}>
                                        <TableCell>
                                            <Link
                                                href={`/product/${i.slug}`}
                                                className="flex items-center"
                                            >
                                                <Image
                                                    src={i.image}
                                                    alt={i.name}
                                                    width={50}
                                                    height={50}
                                                />
                                                <span className="px-2">{i.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="flex-center gap-2">
                                            <Button
                                                disabled={isPending}
                                                variant="outline"
                                                type="button"
                                                onClick={() =>
                                                    startTransition(async () => {
                                                        const res = await removeFromCart(
                                                            i.productId,
                                                        );
                                                        handleToast(res);
                                                    })
                                                }
                                            >
                                                {isPending ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Minus className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <span>{i.qty}</span>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={() =>
                                                    startTransition(async () => {
                                                        const res = await addItemToCart(i);
                                                        handleToast(res);
                                                    })
                                                }
                                            >
                                                {isPending ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(i.price)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <div className="pb-3 text-xl">
                                SubTotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
                                <span className="font-bold">{formatCurrency(cart.itemsPrice)}</span>
                            </div>
                            <Button
                                className="w-full"
                                disabled={isPending}
                                onClick={() =>
                                    startTransition(async () => {
                                        router.push('/shipping-address');
                                    })
                                }
                            >
                                {isPending ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )}{' '}
                                Process to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};

export default CartTable;
