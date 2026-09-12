'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  basePrice: z.coerce.number().positive('Must be positive'),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal(0)),
  skuPrefix: z.string().min(1, 'SKU prefix is required'),
  tags: z.string().default(''),
  material: z.string().optional(),
  careInstructions: z.string().optional(),

  images: z.array(
    z.object({
      url: z.string().min(1, 'Image URL is required'),
      altText: z.string().optional(),
    })
  ),

  newColors: z.array(
    z.object({
      name: z.string().min(1, 'Color name required'),
      hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex code like #1A1A2E'),
    })
  ),

  newSizes: z.array(
    z.object({
      label: z.string().min(1, 'Size label required'),
    })
  ),
});

type ProductFormValues = z.infer<typeof productSchema>;

/**
 * Prisma returns Decimal for numeric columns. It is not assignable to
 * `number | string` directly, so we accept anything with a toString() —
 * which covers Decimal, number, and string. The form calls Number() on
 * these values at read time.
 */
type NumericLike = number | string | { toString(): string };

interface ProductEditFormProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    categoryId: string;
    basePrice: NumericLike;
    compareAtPrice?: NumericLike | null;
    skuPrefix: string;
    tags: string[];
    material?: string | null;
    careInstructions?: string | null;
    colors: { id: string; name: string; hexCode: string }[];
    sizes: { id: string; label: string }[];
    images: { id: string; url: string; altText: string | null }[];
    variants: { id: string; sku: string; stock: number }[];
  };
  categories: { id: string; name: string }[];
}

export function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      slug: product.slug,
      description: product.description,
      categoryId: product.categoryId,
      basePrice: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice
        ? Number(product.compareAtPrice)
        : undefined,
      skuPrefix: product.skuPrefix,
      tags: product.tags.join(', '),
      material: product.material ?? '',
      careInstructions: product.careInstructions ?? '',
      images: product.images.map((img) => ({
        url: img.url,
        altText: img.altText ?? '',
      })),
      newColors: [],
      newSizes: [],
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: 'images' });

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({ control, name: 'newColors' });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({ control, name: 'newSizes' });

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice || null,
        skuPrefix: data.skuPrefix,
        tags: data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        material: data.material || undefined,
        careInstructions: data.careInstructions || undefined,
        images: data.images.map((img, i) => ({
          url: img.url,
          altText: img.altText || undefined,
          isPrimary: i === 0,
        })),
        newColors: data.newColors,
        newSizes: data.newSizes,
      };

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast({ title: 'Product updated' });
        router.refresh();
      } else {
        const result = await res.json().catch(() => null);
        toast({
          title: 'Error',
          description: result?.error?.message ?? 'Failed to update product',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Network error',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Basic info */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-mv-text">Basic info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-mv-error">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register('slug')} />
            {errors.slug && <p className="text-xs text-mv-error">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register('description')} />
          {errors.description && <p className="text-xs text-mv-error">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              {...register('categoryId')}
              className="w-full h-10 border border-mv-border rounded-md px-3 text-sm bg-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-mv-error">{errors.categoryId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base price (PKR)</Label>
            <Input id="basePrice" type="number" step="1" {...register('basePrice')} />
            {errors.basePrice && <p className="text-xs text-mv-error">{errors.basePrice.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="compareAtPrice">Compare at (optional)</Label>
            <Input id="compareAtPrice" type="number" step="1" {...register('compareAtPrice')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="skuPrefix">SKU prefix</Label>
            <Input id="skuPrefix" {...register('skuPrefix')} />
            {errors.skuPrefix && <p className="text-xs text-mv-error">{errors.skuPrefix.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" {...register('tags')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Input id="material" {...register('material')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="careInstructions">Care instructions</Label>
          <Textarea id="careInstructions" rows={2} {...register('careInstructions')} />
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-mv-text">Images</h2>
          <p className="text-sm text-mv-text-secondary mt-1">
            The first image is used as the primary (cover) image. Others appear as gallery thumbnails.
          </p>
        </div>

        <div className="space-y-3">
          {imageFields.map((field, index) => (
            <div key={field.id} className="flex flex-col md:flex-row gap-2 md:items-start">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input placeholder="Image URL or path" {...register(`images.${index}.url`)} />
                <Input placeholder="Alt text (optional)" {...register(`images.${index}.altText`)} />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeImage(index)}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendImage({ url: '', altText: '' })}
          className="gap-1"
        >
          <Plus className="h-4 w-4" /> Add image
        </Button>
      </section>

      {/* Existing colors (read-only) */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-mv-text">Colors</h2>
          <p className="text-sm text-mv-text-secondary mt-1">
            Existing colors cannot be removed here (they have variants attached). To add new options, use the section below.
          </p>
        </div>

        {product.colors.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <div
                key={color.id}
                className="inline-flex items-center gap-2 rounded-md border border-mv-border bg-white px-3 py-1.5 text-sm"
              >
                <span
                  className="h-4 w-4 rounded-full border border-mv-border"
                  style={{ backgroundColor: color.hexCode }}
                  aria-hidden
                />
                <span>{color.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-mv-muted">No colors yet.</p>
        )}

        {/* New colors */}
        <div className="border border-dashed border-mv-border rounded-lg p-4 space-y-3 bg-mv-bg-alt/50">
          <p className="text-sm font-medium text-mv-text">
            Add new colors
          </p>
          <p className="text-xs text-mv-text-secondary">
            Each new color will create variants for all existing sizes with stock 0. Set stock in the inventory page afterwards.
          </p>

          {colorFields.length > 0 && (
            <div className="space-y-2">
              {colorFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <Input
                    placeholder="Name (e.g., Navy)"
                    {...register(`newColors.${index}.name`)}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    placeholder="#1A1A2E"
                    {...register(`newColors.${index}.hexCode`)}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeColor(index)}
                    aria-label="Remove color"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendColor({ name: '', hexCode: '#1A1A2E' })}
            className="gap-1"
          >
            <Plus className="h-4 w-4" /> Add color
          </Button>
        </div>
      </section>

      {/* Existing sizes (read-only) */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-mv-text">Sizes</h2>
          <p className="text-sm text-mv-text-secondary mt-1">
            Existing sizes cannot be removed here (they have variants attached). To add new options, use the section below.
          </p>
        </div>

        {product.sizes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <div
                key={size.id}
                className="inline-flex items-center rounded-md border border-mv-border bg-white px-3 py-1.5 text-sm"
              >
                {size.label}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-mv-muted">No sizes yet.</p>
        )}

        {/* New sizes */}
        <div className="border border-dashed border-mv-border rounded-lg p-4 space-y-3 bg-mv-bg-alt/50">
          <p className="text-sm font-medium text-mv-text">Add new sizes</p>
          <p className="text-xs text-mv-text-secondary">
            Each new size will create variants for all existing colors with stock 0. Set stock in the inventory page afterwards.
          </p>

          {sizeFields.length > 0 && (
            <div className="space-y-2">
              {sizeFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <Input
                    placeholder="Label (e.g., XXL)"
                    {...register(`newSizes.${index}.label`)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSize(index)}
                    aria-label="Remove size"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendSize({ label: '' })}
            className="gap-1"
          >
            <Plus className="h-4 w-4" /> Add size
          </Button>
        </div>
      </section>

      {/* Submit */}
      <div className="sticky bottom-0 -mx-4 md:-mx-0 px-4 md:px-0 py-4 bg-mv-bg border-t border-mv-border md:static md:border-0 md:bg-transparent md:py-0">
        <Button type="submit" disabled={loading} size="lg" className="w-full md:w-auto">
          {loading ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}