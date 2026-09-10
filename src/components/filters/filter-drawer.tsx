'use client';

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface FilterDrawerProps {
  children: React.ReactNode;
  triggerLabel?: string;
}

export function FilterDrawer({ children, triggerLabel = 'Filters' }: FilterDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {triggerLabel}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <div className="space-y-6">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}