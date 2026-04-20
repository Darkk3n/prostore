'use client';

import { Button } from '@/components/ui/button';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AddToCart = ({ item }: { item: CartItem }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        const res = await addItemToCart(item);
        if (!res.success) {
            toast.error(res.message, {
                position: 'top-right',
            });
            return;
        }
        toast.success(`${item.name} added to cart`, {
            position: 'top-right',
            action: {
                label: 'Go to Cart',
                onClick: () => {
                    router.push('/cart');
                },
            },
        });
    };
    return (
        <Button
            className="w-full"
            type="button"
            onClick={handleAddToCart}
        >
            + Add to Cart
        </Button>
    );
};

export default AddToCart;
