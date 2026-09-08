'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ShopFiltersProps {
  categories: any[];
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Category</h3>
        <Select
          value={searchParams.get('category') || ''}
          onValueChange={(val) => updateParams('category', val || undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-2">Sort by</h3>
        <Select
          value={searchParams.get('sort') || 'newest'}
          onValueChange={(val) => updateParams('sort', val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="rating">Best Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-2">Price range</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={searchParams.get('minPrice') || ''}
            onChange={(e) => updateParams('minPrice', e.target.value || undefined)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={searchParams.get('maxPrice') || ''}
            onChange={(e) => updateParams('maxPrice', e.target.value || undefined)}
          />
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => router.push('/shop')}>
        Clear filters
      </Button>
    </div>
  );
}