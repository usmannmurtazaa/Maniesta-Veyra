'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const garmentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  basePrice: z.coerce.number().positive(),
  skuPrefix: z.string().min(1),
  supportedPrintLocations: z.array(z.string()),
  printableAreaWidth: z.coerce.number().optional(),
  printableAreaHeight: z.coerce.number().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  colors: z.array(z.object({ name: z.string(), hexCode: z.string() })),
  sizes: z.array(z.object({ label: z.string() })),
});

type GarmentFormValues = z.infer<typeof garmentSchema>;

interface GarmentFormProps {
  garment?: any;
}

export function GarmentForm({ garment }: GarmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<GarmentFormValues>({
    resolver: zodResolver(garmentSchema),
    defaultValues: garment
      ? {
          name: garment.name,
          slug: garment.slug,
          description: garment.description ?? '',
          basePrice: Number(garment.basePrice),
          skuPrefix: garment.skuPrefix,
          supportedPrintLocations: garment.supportedPrintLocations,
          printableAreaWidth: garment.printableAreaWidth ? Number(garment.printableAreaWidth) : undefined,
          printableAreaHeight: garment.printableAreaHeight ? Number(garment.printableAreaHeight) : undefined,
          sortOrder: garment.sortOrder,
          isActive: garment.isActive,
          colors: garment.colors,
          sizes: garment.sizes,
        }
      : {
          supportedPrintLocations: ['FRONT'],
          colors: [{ name: '', hexCode: '#000000' }],
          sizes: [{ label: '' }],
        },
  });

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control, name: 'colors' });
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: 'sizes' });

  const onSubmit = async (data: GarmentFormValues) => {
    setLoading(true);
    const url = garment ? `/api/admin/garments/${garment.id}` : '/api/admin/garments';
    const method = garment ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast({ title: garment ? 'Garment updated' : 'Garment created' });
      router.push('/admin/garments');
      router.refresh();
    } else {
      toast({ title: 'Error', description: 'Failed to save garment', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* Form fields similar to ProductForm, with garment-specific fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input {...register('name')} />
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...register('slug')} />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea {...register('description')} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Base Price</Label>
          <Input type="number" step="0.01" {...register('basePrice')} />
        </div>
        <div>
          <Label>SKU Prefix</Label>
          <Input {...register('skuPrefix')} />
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input type="number" {...register('sortOrder')} />
        </div>
      </div>
      <div>
        <Label>Supported Print Locations (comma separated)</Label>
        <Input {...register('supportedPrintLocations')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Printable Area Width (in)</Label>
          <Input type="number" step="0.01" {...register('printableAreaWidth')} />
        </div>
        <div>
          <Label>Printable Area Height (in)</Label>
          <Input type="number" step="0.01" {...register('printableAreaHeight')} />
        </div>
      </div>
      {/* Colors and Sizes fields similar to ProductForm */}
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Garment'}</Button>
    </form>
  );
}