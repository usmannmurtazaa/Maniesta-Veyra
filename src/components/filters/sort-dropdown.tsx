'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') ?? 'newest';

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <Select value={currentSort} onValueChange={handleChange}>
      <SelectTrigger className="w-full h-9 text-sm" aria-label="Sort products">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="popular">Most Popular</SelectItem>
        <SelectItem value="rating">Best Rated</SelectItem>
      </SelectContent>
    </Select>
  );
}