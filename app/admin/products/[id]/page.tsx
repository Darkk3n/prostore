import ProductForm from '@/components/admin/product-form';
import { SelectOption } from '@/components/form-input';
import { getAllCategories } from '@/lib/actions/category.actions';
import { getProductById } from '@/lib/actions/product.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Update Product',
};

const categoriesData = await getAllCategories();

const categories: SelectOption[] = categoriesData.data.map((c) => ({
    key: c.id,
    value: c.id,
    customDisplay: c.name,
}));

const AdminProductUpdatePage = async (props: { params: Promise<{ id: string }> }) => {
    const { id } = await props.params;
    const product = await getProductById(id);
    if (!product) return notFound();
    return (
        <div className="space-y-8 mx-w-5xl mx-auto">
            <h1 className="h2-bold">Update Product</h1>
            <ProductForm
                type="Update"
                product={{
                    ...product,
                    price: product.price.toString(),
                    rating: Number(product.rating),
                }}
                productId={id}
                categories={categories}
            />
        </div>
    );
};

export default AdminProductUpdatePage;
