'use client';

import FormInput, { RadioGroupOption } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { paymentMethodSchema } from '@/lib/validators';
import { PaymentMethod } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const PaymentMethodForm = ({
    preferredPaymentMethod,
}: {
    preferredPaymentMethod: string | null;
}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm<PaymentMethod>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
        },
    });
    const handleOnSubmit = async (values: PaymentMethod) => {
        startTransition(async () => {
            const res = await updateUserPaymentMethod(values);
            if (!res.success) {
                toast.error(res.message, { position: 'top-right' });
                return;
            }
            router.push('/place-order');
        });
    };

    const radioOptionsSimpleValue: RadioGroupOption[] = PAYMENT_METHODS.map((optionText) => ({
        label: optionText,
        value: optionText,
    }));

    return (
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="h2-bold mt-4">Payment Method</h1>
            <p className="text-sm text-muted-foreground">Please select a payment method</p>
            <form
                method="post"
                className="space-y-4"
                onSubmit={form.handleSubmit(handleOnSubmit)}
            >
                <FormInput<PaymentMethod>
                    name="type"
                    control={form.control}
                    label="Payment Method"
                    type="radio"
                    options={radioOptionsSimpleValue}
                />
                <div className="flex gap-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <ArrowRight className="h-4 w-8" />
                        )}{' '}
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PaymentMethodForm;
