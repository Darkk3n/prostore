import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { deleteProduct, getAllProducts } from '@/lib/actions/product.actions';
import { formatCurrency, formatId } from '@/lib/utils';
import Link from 'next/link';

const AdminProductsPage = async (props: {
    searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || '';
    const searchCategory = searchParams.category || '';
    const products = await getAllProducts({ query: searchText, page, category: searchCategory });

    return (
        <div className="space-y-2">
            <div className="flex-between">
                <h1 className="h2-bold">Products</h1>
                <Button
                    asChild
                    variant="default"
                >
                    <Link href="/admin/products/create">Create Product</Link>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>NAME</TableHead>
                        <TableHead className="text-right">PRICE</TableHead>
                        <TableHead>CATEGORY</TableHead>
                        <TableHead>STOCK</TableHead>
                        <TableHead>RATING</TableHead>
                        <TableHead className="w-25">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.data.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{formatId(p.id)}</TableCell>
                            <TableCell>{p.name}</TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(p.price.toString())}
                            </TableCell>
                            <TableCell>{p.category}</TableCell>
                            <TableCell>{p.stock}</TableCell>
                            <TableCell>{p.rating.toString()}</TableCell>
                            <TableCell className="flex gap-1">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                >
                                    <Link href={`/admin/products/${p.id}`}>Edit</Link>
                                </Button>
                                <DeleteDialog
                                    id={p.id}
                                    action={deleteProduct}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {products.totalPages && products.totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={products.totalPages}
                />
            )}
        </div>
    );
};

export default AdminProductsPage;
