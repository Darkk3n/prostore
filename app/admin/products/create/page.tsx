import ProductForm from '@/components/admin/product-form';
import { SelectOption } from '@/components/form-input';
import { getAllCategories } from '@/lib/actions/category.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Product',
};

const categoriesData = await getAllCategories();

const categories: SelectOption[] = categoriesData.data.map((c) => ({
    key: c.id,
    value: c.id,
    customDisplay: c.name,
}));

const CreateProductPage = () => {
    return (
        <>
            <h2 className="h2-bold">Create Product</h2>
            <div className="my-8">
                <ProductForm
                    type="Create"
                    categories={categories}
                />
            </div>
        </>
    );
};

export default CreateProductPage;
