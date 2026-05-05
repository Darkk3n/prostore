'use client';

import { productDefaultValues } from '@/lib/constants';
import { insertProductsSchema, updateProductSchema } from '@/lib/validators';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import slugify from 'slugify';
import { z } from 'zod';
import FormInput from '../form-input';
import { Button } from '../ui/button';
import { FieldGroup } from '../ui/field';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

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
    return (
        <form className="space-y-8">
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
            <div className="upload-field flex flex-col gap-5 md:flex-row">{/* Images */}</div>
            <div className="upload-field">{/* isFeatured */}</div>
            <div>
                <Label className="mb-2">Description</Label>
                <Textarea
                    className="resize-none"
                    {...form.register('description')}
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
