import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Print Studio',
  description:
    'Design your own shirt. Upload artwork, position it on the garment, and order it printed to order.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}