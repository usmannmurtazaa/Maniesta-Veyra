'use client';

import Link from 'next/link';

interface Suggestion {
  label: string;
  href: string;
}

interface SearchSuggestionsProps {
  suggestions: Suggestion[];
  onSelect?: () => void;
}

export function SearchSuggestions({ suggestions, onSelect }: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-md border border-mv-border bg-white p-2 shadow-md">
      {suggestions.map((suggestion, index) => (
        <Link
          key={index}
          href={suggestion.href}
          onClick={onSelect}
          className="block rounded-md px-3 py-2 text-sm text-mv-text hover:bg-mv-bg-alt"
        >
          {suggestion.label}
        </Link>
      ))}
    </div>
  );
}