'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

const ProductImages = ({ images }: { images: string[] }) => {
    const [current, setCurrent] = useState<number>(0);

    return (
        <div className="space-y-4">
            <Image
                src={images[current]}
                alt="product image"
                width={1000}
                height={1000}
                className="min-h-75 object-cover object-center"
            />
            <div className="flex">
                {images.map((i: string, idx: number) => (
                    <div
                        key={i}
                        className={cn(
                            'border mr-2 cursor-pointer hover:border-orange-600',
                            current === idx && 'border-orange-500',
                        )}
                    >
                        <Image
                            src={i}
                            alt="image"
                            width={100}
                            height={100}
                            onClick={() => setCurrent(idx)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;
