'use client';

import FormInput, { SelectOption } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { createUpdateReview, getReviewByProductId } from '@/lib/actions/review.actions';
import { reviewFormDefaultValues } from '@/lib/constants';
import { insertReviewSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { StarIcon } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const ReviewForm = ({
    userId,
    productId,
    onReviewSubmitted,
}: {
    userId: string;
    productId: string;
    onReviewSubmitted: () => void;
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const form = useForm<z.infer<typeof insertReviewSchema>>({
        resolver: zodResolver(insertReviewSchema),
        defaultValues: reviewFormDefaultValues,
    });
    const handleOpenForm = async () => {
        form.setValue('productId', productId);
        form.setValue('userId', userId);
        const review = await getReviewByProductId({ productId });
        if (review) {
            form.setValue('title', review.title);
            form.setValue('description', review.description);
            form.setValue('rating', review.rating);
        }

        setOpen(true);
    };

    const ratingOptions: SelectOption[] = Array.from({ length: 5 }).map((_, index) => {
        const ratingValue = (index + 1).toString(); // Ensure value is a string
        return {
            key: index.toString(),
            value: ratingValue,
            customDisplay: (
                <div className="flex items-center gap-1">
                    {ratingValue} <StarIcon className="h-4 w-4 inline" />
                </div>
            ),
        };
    });

    const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values) => {
        const res = await createUpdateReview({ ...values, productId });
        if (!res.success) {
            toast.error(res.message, { position: 'top-right' });
            return;
        }
        setOpen(false);
        onReviewSubmitted();
        toast.success(res.message, { position: 'top-right' });
    };
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <Button
                onClick={handleOpenForm}
                variant="default"
            >
                Write a Review
            </Button>
            <DialogContent className="sm:max-w-106.25">
                <form
                    method="post"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                        <DialogDescription>
                            Share your thoughts with other customers
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <FormInput
                            control={form.control}
                            name="title"
                            placeholder="Enter Title"
                            label="Title"
                        />
                        <FormInput
                            control={form.control}
                            name="description"
                            placeholder="Enter Description"
                            label="Description"
                            type="textarea"
                        />
                        <FormInput
                            control={form.control}
                            name="rating"
                            placeholder="Enter Rating"
                            label="Rating"
                            type="select"
                            selectOptions={ratingOptions}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewForm;
