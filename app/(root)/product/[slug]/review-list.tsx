'use client';

import Rating from '@/components/shared/product/rating';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllReviewsByProductId } from '@/lib/actions/review.actions';
import { formatDateTime } from '@/lib/utils';
import { Review } from '@/types';
import { CalendarIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReviewForm from './review-form';

const ReviewList = ({
    userId,
    productId,
    productSlug,
}: {
    userId: string;
    productId: string;
    productSlug: string;
}) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const loadReviews = async () => {
            const res = await getAllReviewsByProductId({ productId });
            setReviews(res.data);
        };
        loadReviews();
    }, [productId]);

    const reload = async () => {
        const res = await getAllReviewsByProductId({ productId });
        setReviews([...res.data]);
    };

    return (
        <div className="space-y-4">
            {reviews.length === 0 && <div>No reviews yet</div>}
            {userId ? (
                <ReviewForm
                    userId={userId}
                    productId={productId}
                    onReviewSubmitted={reload}
                />
            ) : (
                <div>
                    Please{' '}
                    <Link
                        className="text-blue-700 px-2"
                        href={`/sign-in?callbackUrl=/product/${productSlug}`}
                    >
                        Sign In
                    </Link>{' '}
                    to write a review{' '}
                </div>
            )}
            <div className="flex flex-col gap-3">
                {reviews.map((r) => (
                    <Card key={r.id}>
                        <CardHeader>
                            <div className="flex-between">
                                <CardTitle>{r.title}</CardTitle>
                            </div>
                            <CardDescription>{r.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-4 text-sm text-muted-foreground">
                                <Rating value={r.rating} />
                                <div className="flex items-center">
                                    <UserIcon className="w-3 h-3 mr-1" />
                                    {r.user?.name || 'User'}
                                </div>
                                <div className="flex items-center">
                                    <CalendarIcon className="w-3 h-3 mr-1" />
                                    {formatDateTime(r.createdAt).dateTime}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
