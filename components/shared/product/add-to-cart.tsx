'use client';

import { Button } from '@/components/ui/button';
import { addItemToCart, removeFromCart } from '@/lib/actions/cart.actions';
import { Cart, CartItem } from '@/types';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        const res = await addItemToCart(item);
        if (!res.success) {
            toast.error(res.message, {
                position: 'top-right',
            });
            return;
        }
        toast.success(`${res.message}`, {
            position: 'top-right',
            action: {
                label: 'Go to Cart',
                onClick: () => {
                    router.push('/cart');
                },
            },
        });
    };

    const handleRemoveFromCart = async () => {
        const res = await removeFromCart(item.productId);
        toast.success(`${res.message}`, {
            position: 'top-right',
        });
        return;
    };

    const existItem = cart && cart.items.find((i) => i.productId === item.productId);
    return existItem ? (
        <div>
            <Button
                type="button"
                variant="outline"
                onClick={handleRemoveFromCart}
            >
                <Minus className="h-4 w-4" />
            </Button>
            <span className="px-2">{existItem.qty}</span>
            <Button
                type="button"
                variant="outline"
                onClick={handleAddToCart}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    ) : (
        <Button
            className="w-full"
            type="button"
            onClick={handleAddToCart}
        >
            <Plus /> Add to Cart
        </Button>
    );
};

export default AddToCart;
