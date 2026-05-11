import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/product.actions';
import { Menu } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
    const categories = await getAllCategories();
    return (
        <Drawer direction="left">
            <DrawerTrigger asChild>
                <Button variant="outline">
                    <Menu />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full max-w-sm">
                <DrawerHeader>
                    <DrawerTitle>Select a Category</DrawerTitle>
                </DrawerHeader>
                <div className="space-y-1 mt-4">
                    {categories.map((c) => (
                        <Button
                            key={c.category}
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                        >
                            <DrawerClose asChild>
                                <Link href={`/search?category=${c.category}`}>
                                    {c.category}({c._count})
                                </Link>
                            </DrawerClose>
                        </Button>
                    ))}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default CategoryDrawer;
