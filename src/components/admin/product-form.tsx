'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  categoryId: z.string().min(1),
  basePrice: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional(),
  skuPrefix: z.string().min(1),
  tags: z.string().default(''),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  colors: z.array(z.object({ name: z.string(), hexCode: z.string() })),
  sizes: z.array(z.object({ label: z.string() })),
  images: z.array(z.object({ url: z.string(), altText: z.string().optional(), isPrimary: z.boolean().optional() })),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: any[];
}

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      colors: [{ name: '', hexCode: '#000000' }],
      sizes: [{ label: '' }],
      images: [{ url: '', altText: '' }],
    },
  });

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control, name: 'colors' });
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: 'sizes' });
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: 'images' });

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        tags: data.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        colors: data.colors.map((c, idx) => ({ ...c, sortOrder: idx })),
        sizes: data.sizes.map((s, idx) => ({ ...s, sortOrder: idx })),
        images: data.images.map((img, idx) => ({ ...img, sortOrder: idx, isPrimary: idx === 0 })),
      };
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast({ title: 'Product created' });
        router.push('/admin/products');
        router.refresh();
      } else {
        const result = await res.json();
        toast({ title: 'Error', description: result.error?.message, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input {...register('name')} />
          {errors.name && <p className="text-mv-error text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...register('slug')} />
          {errors.slug && <p className="text-mv-error text-sm">{errors.slug.message}</p>}
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register('description')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Category</Label>
          <select {...register('categoryId')} className="w-full border border-mv-border rounded-md p-2">
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Base Price (PKR)</Label>
          <Input type="number" step="0.01" {...register('basePrice')} />
        </div>
        <div>
          <Label>Compare At Price</Label>
          <Input type="number" step="0.01" {...register('compareAtPrice')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>SKU Prefix</Label>
          <Input {...register('skuPrefix')} />
        </div>
        <div>
          <Label>Tags (comma separated)</Label>
          <Input {...register('tags')} />
        </div>
      </div>

      <div>
        <Label>Material</Label>
        <Input {...register('material')} />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Colors</h3>
        {colorFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <Input placeholder="Name" {...register(`colors.${index}.name`)} />
            <Input type="color" {...register(`colors.${index}.hexCode`)} className="w-16" />
            <Button type="button" variant="outline" onClick={() => removeColor(index)}>Remove</Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={() => appendColor({ name: '', hexCode: '#000000' })}>Add Color</Button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Sizes</h3>
        {sizeFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <Input placeholder="Label (S, M, L...)" {...register(`sizes.${index}.label`)} />
            <Button type="button" variant="outline" onClick={() => removeSize(index)}>Remove</Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={() => appendSize({ label: '' })}>Add Size</Button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Images</h3>
        {imageFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <Input placeholder="Image URL" {...register(`images.${index}.url`)} />
            <Input placeholder="Alt text" {...register(`images.${index}.altText`)} />
            <Button type="button" variant="outline" onClick={() => removeImage(index)}>Remove</Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={() => appendImage({ url: '', altText: '' })}>Add Image</Button>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </Button>
    </form>
  );
}