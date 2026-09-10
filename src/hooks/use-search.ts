'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = (searchTerm?: string) => {
    const term = searchTerm ?? query;
    if (!term.trim()) return;
    setIsSearching(true);
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    // Optionally reset after navigation
    setTimeout(() => setIsSearching(false), 500);
  };

  return {
    query,
    setQuery,
    isSearching,
    performSearch,
  };
}