'use client';
import FormInput from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { updateUserProfile } from '@/lib/actions/user.actions';
import { updateProfileSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const ProfileForm = () => {
    const { data: session, update } = useSession();
    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name ?? '',
            email: session?.user?.email ?? '',
        },
    });
    const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
        console.log(values);
        const res = await updateUserProfile(values);
        if (!res.success) {
            toast.error(res.message, { position: 'top-right' });
            return;
        }
        const newSession = { ...session, user: { ...session?.user, name: values.name } };
        await update(newSession);
        toast.success(res.message, { position: 'top-right' });
    };

    return (
        <form
            method="post"
            className="flex flex-col gap-5"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-5">
                <FormInput
                    name="email"
                    disabled
                    control={form.control}
                    label="Email"
                    placeholder="Enter Email"
                />
                <FormInput
                    name="name"
                    control={form.control}
                    label="Name"
                    placeholder="Enter Name"
                />
            </div>
            <Button
                type="submit"
                size="lg"
                className="button col-span-2 w-full"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
            </Button>
        </form>
    );
};

export default ProfileForm;
