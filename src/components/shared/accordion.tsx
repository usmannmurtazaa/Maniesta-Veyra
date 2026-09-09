'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-mv-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${index}`}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-mv-text hover:bg-mv-bg-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mv-focus"
            >
              <span className="font-medium">{item.question}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-mv-muted transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div
                id={`accordion-panel-${index}`}
                className="px-5 pb-4 text-mv-text-secondary"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}