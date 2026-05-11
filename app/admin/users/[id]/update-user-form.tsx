'use client';

import FormInput from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { updateUser } from '@/lib/actions/user.actions';
import { updateUserSchema } from '@/lib/validators';
import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const UpdateUserform = ({ user }: { user: User }) => {
    const form = useForm<User>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: user,
    });
    const router = useRouter();
    const onHandleSubmit = async (values: User) => {
        try {
            const res = await updateUser({ ...values, id: user.id });
            if (!res.success) {
                toast.error(res.message, { position: 'top-right' });
                return;
            }
            form.reset();
            toast.success(res.message, { position: 'top-right' });
            router.push('/admin/users');
        } catch (error) {
            toast.error((error as Error).message, { position: 'top-right' });
        }
    };
    return (
        <form
            method="post"
            onSubmit={form.handleSubmit(onHandleSubmit)}
        >
            <FieldGroup>
                <FormInput
                    name="email"
                    control={form.control}
                    label="Email"
                    placeholder="Enter User's Email"
                />
                <FormInput
                    name="name"
                    control={form.control}
                    label="Name"
                    placeholder="Enter User's Name"
                />
                <FormInput
                    name="role"
                    control={form.control}
                    label="Role"
                    placeholder="Enter User's Role"
                    type="select"
                />
            </FieldGroup>
            <div className="flex-between">
                <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? 'Submitting...' : 'Update User'}
                </Button>
            </div>
        </form>
    );
};

export default UpdateUserform;
