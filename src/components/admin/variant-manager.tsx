'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface VariantManagerProps {
  productId: string;
  variants: any[];
}

export function VariantManager({ productId, variants }: VariantManagerProps) {
  const router = useRouter();
  const [colorId, setColorId] = useState('');
  const [sizeId, setSizeId] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | undefined>();
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);

  const addVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/products/${productId}/variants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colorId, sizeId, sku, price, stock }),
    });
    if (res.ok) {
      toast({ title: 'Variant added' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: 'Failed to add variant', variant: 'destructive' });
    }
    setLoading(false);
  };

  const updateStock = async (variantId: string, newStock: number) => {
    const res = await fetch(`/api/admin/products/variants/${variantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock }),
    });
    if (res.ok) {
      toast({ title: 'Stock updated' });
      router.refresh();
    }
  };

  const deleteVariant = async (variantId: string) => {
    if (!confirm('Delete this variant?')) return;
    const res = await fetch(`/api/admin/products/variants/${variantId}`, { method: 'DELETE' });
    if (res.ok) {
      toast({ title: 'Variant deleted' });
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <form onSubmit={addVariant} className="flex flex-wrap gap-4 items-end">
        <div>
          <Label>Color</Label>
          <Select value={colorId} onValueChange={setColorId}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Color" /></SelectTrigger>
            <SelectContent>
              {variants[0]?.color && <SelectItem value={variants[0].color.id}>{variants[0].color.name}</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Size</Label>
          <Select value={sizeId} onValueChange={setSizeId}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Size" /></SelectTrigger>
            <SelectContent>
              {variants[0]?.size && <SelectItem value={variants[0].size.id}>{variants[0].size.label}</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>SKU</Label>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>
        <div>
          <Label>Price (optional)</Label>
          <Input type="number" value={price ?? ''} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)} />
        </div>
        <div>
          <Label>Stock</Label>
          <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Variant'}</Button>
      </form>

      <div className="border border-mv-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-mv-bg-alt">
            <tr>
              <th className="p-2 text-left">SKU</th>
              <th className="p-2 text-left">Color</th>
              <th className="p-2 text-left">Size</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant.id} className="border-t border-mv-border">
                <td className="p-2">{variant.sku}</td>
                <td className="p-2">{variant.color.name}</td>
                <td className="p-2">{variant.size.label}</td>
                <td className="p-2">₨ {Number(variant.price ?? variant.product.basePrice).toLocaleString()}</td>
                <td className="p-2">
                  <Input
                    type="number"
                    defaultValue={variant.stock}
                    onBlur={(e) => updateStock(variant.id, Number(e.target.value))}
                    className="w-20 inline-block"
                  />
                </td>
                <td className="p-2">
                  <Button variant="ghost" size="sm" onClick={() => deleteVariant(variant.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}