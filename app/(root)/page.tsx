import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import ViewAllProductsButton from '@/components/view-all-products-button';
import { getFeaturedProducts, getLatestProducts } from '@/lib/actions/product.actions';
import { convertToPlainObject } from '@/lib/utils';

const HomePage = async () => {
    const latestProducts = convertToPlainObject(await getLatestProducts()).map((product) => ({
        ...product,
        price: product.price.toString(),
        rating: Number(product.rating),
    }));
    const featuredProducts = await getFeaturedProducts();
    return (
        <>
            {featuredProducts.length > 0 && (
                <ProductCarousel
                    data={featuredProducts.map((fp) => ({
                        ...fp,
                        price: fp.price.toString(),
                        rating: Number(fp.rating),
                    }))}
                />
            )}
            <ProductList
                data={latestProducts}
                title="Newest Arrivals"
                limit={4}
            />
            <ViewAllProductsButton />
        </>
    );
};

export default HomePage;
