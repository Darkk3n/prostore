'use client';

import { Button } from '@/components/ui/button';
import { createOrder } from '@/lib/actions/order.actions';
import { Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

const PlaceOrderForm = () => {
    const router = useRouter();
    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault();
        const res = await createOrder();
        if (!res.success) {
            toast.error(`An ocurred during order creation: ${res.message}`, {
                position: 'top-right',
            });
            return;
        }
        if (res.redirectTo) {
            router.push(res.redirectTo);
        }
    };
    const PlaceOrderButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button
                disabled={pending}
                className="w-full"
            >
                {pending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                ) : (
                    <Check className="w-4 h-4" />
                )}
                {''} Placer Order
            </Button>
        );
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full"
        >
            <PlaceOrderButton />
        </form>
    );
};

export default PlaceOrderForm;
