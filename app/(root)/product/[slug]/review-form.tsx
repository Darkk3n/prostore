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
import { reviewFormDefaultValues } from '@/lib/constants';
import { insertReviewSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { StarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ReviewForm = ({
    userId,
    productId,
    onReviewSubmitted,
}: {
    userId: string;
    productId: string;
    onReviewSubmitted?: () => void;
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const form = useForm<z.infer<typeof insertReviewSchema>>({
        resolver: zodResolver(insertReviewSchema),
        defaultValues: reviewFormDefaultValues,
    });
    const handleOpenForm = () => {
        setOpen(true);
    };

    const ratingOptions: SelectOption[] = Array.from({ length: 5 }).map((_, index) => {
        const ratingValue = (index + 1).toString(); // Ensure value is a string
        return {
            key: index.toString(), // or ratingValue if you prefer
            value: ratingValue, // This is the data that gets stored in the form
            // This is what the user will see
            customDisplay: (
                <div className="flex items-center gap-1">
                    {ratingValue} <StarIcon className="h-4 w-4 inline" />
                </div>
            ),
        };
    });
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
                <form method="post">
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
