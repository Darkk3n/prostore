'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import slugify from 'slugify';
import { toast } from 'sonner';
import { z } from 'zod';

import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { productDefaultValues } from '@/lib/constants';
import { insertProductsSchema, updateProductSchema } from '@/lib/validators';
import { Product } from '@/types';

import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';
import FormInput from '../form-input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { FieldGroup } from '../ui/field';

type CreateProductFormProps = {
    type: 'Create' | 'Update';
    product?: Product;
    productId?: string;
};

const ProductForm = ({ type, product, productId }: CreateProductFormProps) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof insertProductsSchema>>({
        resolver: zodResolver(type === 'Create' ? insertProductsSchema : updateProductSchema),
        defaultValues: (product && type === 'Update' ? product : productDefaultValues) as z.infer<
            typeof insertProductsSchema
        >,
    });
    const handleOnSubmit: SubmitHandler<z.infer<typeof insertProductsSchema>> = async (values) => {
        if (type === 'Create') {
            const res = await createProduct(values);
            if (!res.success) {
                toast.error(res.message, { position: 'top-right' });
                return;
            }
            toast.success(res.message, { position: 'top-right' });
            router.push('/admin/products');
        } else if (type === 'Update') {
            if (!productId) {
                router.push('/admin/products');
                return;
            }
            const res = await updateProduct({ ...values, id: productId });
            if (!res.success) {
                toast.error(res.message, { position: 'top-right' });
                return;
            }
            toast.success(res.message, { position: 'top-right' });
            router.push('/admin/products');
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onError = (errors: any) => {
        toast.error('Please check the form for errors', {
            description: 'Some required fields are missing or invalid.',
            position: 'top-right',
        });
        console.log(errors);
    };

    const [isFeatured, banner] = useWatch({
        control: form.control,
        name: ['isFeatured', 'banner'],
    });

    return (
        <form
            className="space-y-8"
            method="post"
            onSubmit={form.handleSubmit(handleOnSubmit, onError)}
        >
            <div className="flex flex-col items-start md:flex-row gap-5">
                <FieldGroup>
                    <FormInput
                        name="name"
                        control={form.control}
                        label="Name"
                        placeholder="Enter Product Name"
                    />
                    <FormInput
                        name="slug"
                        control={form.control}
                        label="Slug"
                        placeholder="Enter Product Slug"
                    />
                </FieldGroup>
            </div>
            <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                onClick={() =>
                    form.setValue('slug', slugify(form.getValues('name'), { lower: true }))
                }
            >
                Generate
            </Button>
            <div className="flex flex-col gap-5 md:flex-row">
                <FieldGroup>
                    <FormInput
                        name="category"
                        control={form.control}
                        label="Category"
                        placeholder="Enter Category"
                    />
                    <FormInput
                        name="brand"
                        control={form.control}
                        label="Brand"
                        placeholder="Enter Product Brand"
                    />
                </FieldGroup>
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
                <FieldGroup>
                    <FormInput
                        name="price"
                        control={form.control}
                        label="Price"
                        placeholder="0"
                        type="number"
                    />
                    <FormInput
                        name="stock"
                        control={form.control}
                        label="Stock"
                        placeholder="0"
                        type="number"
                    />
                </FieldGroup>
            </div>
            <div className="upload-field flex flex-col gap-5 md:flex-row">
                <div className="w-full">
                    <FormInput
                        control={form.control}
                        name="images"
                        type="image"
                        label="Images"
                    />
                </div>
            </div>
            <div className="upload-field">
                <Card>
                    <CardContent className="space-y-2 mt-2 min-h-48">
                        <FormInput
                            control={form.control}
                            name="isFeatured"
                            type="checkbox"
                            label="Is Featured?"
                        />
                        {isFeatured && banner && (
                            <Image
                                src={banner}
                                alt="banner image"
                                className="w-full object-cover rounder-sm"
                                width={1920}
                                height={680}
                            />
                        )}
                        {isFeatured && !banner && (
                            <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res: { url: string }[]) => {
                                    form.setValue('banner', res[0].url);
                                }}
                                onUploadError={(error: Error) => {
                                    toast.error(error.message, {
                                        position: 'top-right',
                                    });
                                }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                <FormInput
                    type="textarea"
                    name="description"
                    control={form.control}
                    label="Description"
                    placeholder=""
                />
            </div>
            <div>
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="button col-span-2 w-full"
                >
                    {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
