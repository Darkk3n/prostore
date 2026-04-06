import ProductList from '@/components/shared/product/product-list';
import sampleData from '@/sample-data';

const HomePage = () => {
    return (
        <>
            <ProductList
                data={sampleData.products}
                title="Newest Arrivals"
                limit={4}
            />
        </>
    );
};

export default HomePage;
