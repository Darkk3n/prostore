'use client';

import FormInput from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { updateUserAddress } from '@/lib/actions/user.actions';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { shippingAddressSchema } from '@/lib/validators';
import { ShippingAddress } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues,
        mode: 'onChange',
    });
    const [isPending, startTransition] = useTransition();

    const handleOnSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
        values: ShippingAddress,
    ) => {
        startTransition(async () => {
            const res = await updateUserAddress(values);
            if (!res.success) {
                toast.error(res.message, { position: 'top-right' });
                return;
            }
            router.push('/payment-method');
        });
    };

    return (
        <>
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="h2-bold mt-4">Shipping Address</h1>
                <p className="text-sm text-muted-foreground">Please enter an address to ship to</p>
                <form
                    method="post"
                    className="space-y-4"
                    onSubmit={form.handleSubmit(handleOnSubmit)}
                >
                    <FieldGroup>
                        <FormInput
                            name="fullName"
                            control={form.control}
                            label="Full Name"
                            placeholder="Enter Full Name"
                        />
                        <FormInput
                            name="streetAddress"
                            control={form.control}
                            label="Street Address"
                            placeholder="Enter Street Address"
                        />
                        <FormInput
                            name="city"
                            control={form.control}
                            label="City"
                            placeholder="Enter City"
                        />
                        <FormInput
                            name="postalCode"
                            control={form.control}
                            label="Postal Code"
                            placeholder="Enter Postal Code"
                        />
                        <FormInput
                            name="country"
                            control={form.control}
                            label="Country"
                            placeholder="Enter country"
                        />
                    </FieldGroup>
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
        </>
    );
};

export default ShippingAddressForm;
