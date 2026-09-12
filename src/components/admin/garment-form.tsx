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
import { PrintLocation } from '@prisma/client';

const PRINT_LOCATIONS: PrintLocation[] = [
  'FRONT',
  'BACK',
  'LEFT_SLEEVE',
  'RIGHT_SLEEVE',
];

const garmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  basePrice: z.coerce.number().positive('Must be positive'),
  skuPrefix: z.string().min(1, 'SKU prefix is required'),
  supportedPrintLocations: z.array(z.string()).min(1, 'Select at least one print location'),
  printableAreaWidth: z.coerce.number().positive().optional().or(z.literal(0)),
  printableAreaHeight: z.coerce.number().positive().optional().or(z.literal(0)),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),

  newColors: z.array(
    z.object({
      name: z.string().min(1, 'Color name required'),
      hexCode: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Hex code like #1A1A2E'),
    })
  ),

  newSizes: z.array(
    z.object({
      label: z.string().min(1, 'Size label required'),
    })
  ),
});

type GarmentFormValues = z.infer<typeof garmentSchema>;

type NumericLike = number | string | { toString(): string };

interface GarmentFormProps {
  garment?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    basePrice: NumericLike;
    skuPrefix: string;
    supportedPrintLocations: PrintLocation[];
    printableAreaWidth: NumericLike | null;
    printableAreaHeight: NumericLike | null;
    sortOrder: number;
    isActive: boolean;
    colors: { id: string; name: string; hexCode: string }[];
    sizes: { id: string; label: string }[];
  };
}

export function GarmentForm({ garment }: GarmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(garment);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GarmentFormValues>({
    resolver: zodResolver(garmentSchema),
    defaultValues: garment
      ? {
          name: garment.name,
          slug: garment.slug,
          description: garment.description ?? '',
          basePrice: Number(garment.basePrice),
          skuPrefix: garment.skuPrefix,
          supportedPrintLocations: garment.supportedPrintLocations,
          printableAreaWidth: garment.printableAreaWidth
            ? Number(garment.printableAreaWidth)
            : undefined,
          printableAreaHeight: garment.printableAreaHeight
            ? Number(garment.printableAreaHeight)
            : undefined,
          sortOrder: garment.sortOrder,
          isActive: garment.isActive,
          newColors: [],
          newSizes: [],
        }
      : {
          name: '',
          slug: '',
          description: '',
          basePrice: 2000,
          skuPrefix: 'CUST',
          supportedPrintLocations: ['FRONT'],
          sortOrder: 0,
          isActive: true,
          newColors: [{ name: 'Black', hexCode: '#1A1A2E' }],
          newSizes: [
            { label: 'S' },
            { label: 'M' },
            { label: 'L' },
            { label: 'XL' },
          ],
        },
  });

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

  const selectedLocations = watch('supportedPrintLocations') ?? [];

  function toggleLocation(location: PrintLocation) {
    const current = selectedLocations ?? [];
    const next = current.includes(location)
      ? current.filter((l) => l !== location)
      : [...current, location];
    setValue('supportedPrintLocations', next, { shouldValidate: true });
  }

  const onSubmit = async (data: GarmentFormValues) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        basePrice: data.basePrice,
        skuPrefix: data.skuPrefix,
        supportedPrintLocations: data.supportedPrintLocations as PrintLocation[],
        printableAreaWidth: data.printableAreaWidth || undefined,
        printableAreaHeight: data.printableAreaHeight || undefined,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
        newColors: data.newColors,
        newSizes: data.newSizes,
      };

      const url = isEditing
        ? `/api/admin/garments/${garment!.id}`
        : '/api/admin/garments';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast({ title: isEditing ? 'Garment updated' : 'Garment created' });
        router.push('/admin/garments');
        router.refresh();
      } else {
        const result = await res.json().catch(() => null);
        toast({
          title: 'Error',
          description:
            result?.error?.message ?? 'Failed to save garment',
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* Basic info */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-mv-text">
          Basic info
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="Classic T-Shirt" />
            {errors.name && (
              <p className="text-xs text-mv-error">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register('slug')} placeholder="classic-t-shirt" />
            {errors.slug && (
              <p className="text-xs text-mv-error">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            rows={3}
            {...register('description')}
            placeholder="Standard fit tee for custom printing."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base price (PKR)</Label>
            <Input id="basePrice" type="number" step="1" {...register('basePrice')} />
            {errors.basePrice && (
              <p className="text-xs text-mv-error">{errors.basePrice.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="skuPrefix">SKU prefix</Label>
            <Input id="skuPrefix" {...register('skuPrefix')} placeholder="CUST-TS" />
            {errors.skuPrefix && (
              <p className="text-xs text-mv-error">{errors.skuPrefix.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input id="sortOrder" type="number" {...register('sortOrder')} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 rounded border-mv-border"
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Active (visible in the customizer)
          </Label>
        </div>
      </section>

      {/* Print locations */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-mv-text">
            Supported print locations
          </h2>
          <p className="text-sm text-mv-text-secondary mt-1">
            Customers can only choose the print locations you enable here.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PRINT_LOCATIONS.map((location) => {
            const isSelected = selectedLocations.includes(location);
            return (
              <button
                key={location}
                type="button"
                onClick={() => toggleLocation(location)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                  isSelected
                    ? 'border-mv-primary bg-mv-primary text-white'
                    : 'border-mv-border bg-white text-mv-text hover:border-mv-primary'
                }`}
                aria-pressed={isSelected}
              >
                {location.replace(/_/g, ' ')}
              </button>
            );
          })}
        </div>
        {errors.supportedPrintLocations && (
          <p className="text-xs text-mv-error">
            {errors.supportedPrintLocations.message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="printableAreaWidth">
              Printable width (inches, optional)
            </Label>
            <Input
              id="printableAreaWidth"
              type="number"
              step="0.01"
              {...register('printableAreaWidth')}
              placeholder="12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="printableAreaHeight">
              Printable height (inches, optional)
            </Label>
            <Input
              id="printableAreaHeight"
              type="number"
              step="0.01"
              {...register('printableAreaHeight')}
              placeholder="16"
            />
          </div>
        </div>
      </section>

      {/* Existing colors — read only */}
      {isEditing && garment && garment.colors.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-mv-text">
            Existing colors
          </h2>
          <div className="flex flex-wrap gap-2">
            {garment.colors.map((color) => (
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
        </section>
      )}

      {/* Add new colors */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-mv-text">
            Add colors
          </h2>
          <p className="text-sm text-mv-text-secondary mt-1">
            New colors create variants for all existing sizes with stock 0. Set
            stock in the inventory page afterwards.
          </p>
        </div>

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
      </section>

      {/* Existing sizes — read only */}
      {isEditing && garment && garment.sizes.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-mv-text">
            Existing sizes
          </h2>
          <div className="flex flex-wrap gap-2">
            {garment.sizes.map((size) => (
              <div
                key={size.id}
                className="inline-flex items-center rounded-md border border-mv-border bg-white px-3 py-1.5 text-sm"
              >
                {size.label}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Add new sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-mv-text">
            Add sizes
          </h2>
          <p className="text-sm text-mv-text-secondary mt-1">
            New sizes create variants for all existing colors with stock 0.
          </p>
        </div>

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
      </section>

      {/* Submit */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? 'Saving…' : isEditing ? 'Save changes' : 'Create garment'}
        </Button>
      </div>
    </form>
  );
}