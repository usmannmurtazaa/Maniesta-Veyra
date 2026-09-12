'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ShopFilters } from './shop-filters';

interface FilterDrawerProps {
  categories: { id: string; name: string; slug: string }[];
}

export function FilterDrawer({ categories }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="border-b border-mv-border pb-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <ShopFilters categories={categories} />
        </div>
        <div className="border-t border-mv-border pt-4">
          <Button className="w-full" size="lg" onClick={() => setOpen(false)}>
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}