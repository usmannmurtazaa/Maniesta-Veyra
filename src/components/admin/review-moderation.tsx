'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

export function ReviewModeration({ reviews }: { reviews: any[] }) {
  const router = useRouter();

  const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast({ title: 'Review updated' });
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border border-mv-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">{review.user.firstName} {review.user.lastName} on {review.product.name}</p>
            <Badge>{review.status}</Badge>
          </div>
          <p className="text-sm mt-1">Rating: {review.rating}/5</p>
          {review.title && <p className="font-medium mt-2">{review.title}</p>}
          {review.content && <p className="text-sm text-mv-muted mt-1">{review.content}</p>}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => updateStatus(review.id, 'APPROVED')}>Approve</Button>
            <Button variant="outline" size="sm" onClick={() => updateStatus(review.id, 'REJECTED')}>Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
}