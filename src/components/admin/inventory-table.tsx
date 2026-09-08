'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface InventoryTableProps {
  variants: any[];
}

export function InventoryTable({ variants }: InventoryTableProps) {
  const router = useRouter();
  const [stockValues, setStockValues] = useState<Record<string, number>>({});

  const handleStockChange = (variantId: string, value: number) => {
    setStockValues((prev) => ({ ...prev, [variantId]: value }));
  };

  const updateStock = async (variantId: string) => {
    const stock = stockValues[variantId];
    if (stock === undefined) return;
    const res = await fetch(`/api/admin/inventory/${variantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock }),
    });
    if (res.ok) {
      toast({ title: 'Stock updated' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: 'Failed to update stock', variant: 'destructive' });
    }
  };

  return (
    <div className="overflow-x-auto border border-mv-border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-mv-bg-alt">
          <tr>
            <th className="p-3 text-left">SKU</th>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Color</th>
            <th className="p-3 text-left">Size</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant.id} className="border-t border-mv-border">
              <td className="p-3">{variant.sku}</td>
              <td className="p-3">{variant.product.name}</td>
              <td className="p-3">{variant.color.name}</td>
              <td className="p-3">{variant.size.label}</td>
              <td className="p-3">
                <Input
                  type="number"
                  defaultValue={variant.stock}
                  onChange={(e) => handleStockChange(variant.id, Number(e.target.value))}
                  className="w-24 inline-block"
                />
              </td>
              <td className="p-3">
                <Button variant="outline" size="sm" onClick={() => updateStock(variant.id)}>Update</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}