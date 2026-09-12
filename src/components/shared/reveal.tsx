'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /**
   * Optional semantic element. Defaults to `div`.
   * Uses `motion[as]` under the hood so no extra wrapper is added.
   */
  as?: 'div' | 'section' | 'article';
}

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      variants={variants}
      style={{ willChange: 'transform, opacity' }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}