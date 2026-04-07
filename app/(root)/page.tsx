import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';
import { convertToPlainObject } from '@/lib/utils';

const HomePage = async () => {
    const latestProducts = convertToPlainObject(await getLatestProducts()).map((product) => ({
        ...product,
        price: product.price.toString(),
        rating: Number(product.rating),
    }));
    return (
        <>
            <ProductList
                data={latestProducts}
                title="Newest Arrivals"
                limit={4}
            />
        </>
    );
};

export default HomePage;
