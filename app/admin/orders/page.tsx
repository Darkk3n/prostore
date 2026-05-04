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
import { getAllOrders } from '@/lib/actions/order.actions';
import { requireAdmin } from '@/lib/auth-guard';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Admin Orders',
};

const AdminOrdersPage = async (props: { searchParams: Promise<{ page: string }> }) => {
    await requireAdmin();
    const { page = '1' } = await props.searchParams;
    const orders = await getAllOrders({ page: Number(page) });
    return (
        <div className="space-y-2">
            <h2 className="h2-bold">Orders</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>DATE</TableHead>
                            <TableHead>TOTAL</TableHead>
                            <TableHead>PAID</TableHead>
                            <TableHead>DELIVERED</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.map((o) => (
                            <TableRow key={o.id}>
                                <TableCell>{formatId(o.id)}</TableCell>
                                <TableCell>{formatDateTime(o.createdAt).dateTime}</TableCell>
                                <TableCell>{formatCurrency(o.totalPrice.toString())}</TableCell>
                                <TableCell>
                                    {o.isPaid && o.paidAt
                                        ? formatDateTime(o.paidAt).dateTime
                                        : 'Not Paid'}
                                </TableCell>
                                <TableCell>
                                    {o.isDelivered && o.deliveredAt
                                        ? formatDateTime(o.deliveredAt).dateTime
                                        : 'Not Deliverd'}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Link href={`/order/${o.id}`}>Details</Link>
                                    </Button>
                                    {/* DELETE */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {orders.totalPages > 1 && (
                    <Pagination
                        page={Number(page) || 1}
                        totalPages={orders?.totalPages}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;
