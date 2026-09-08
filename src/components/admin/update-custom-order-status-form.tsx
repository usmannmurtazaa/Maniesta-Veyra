'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { CustomOrderStatus } from '@prisma/client';

const statuses = Object.values(CustomOrderStatus);

interface UpdateCustomOrderStatusFormProps {
  trackingId: string;
  currentStatus: CustomOrderStatus;
}

export function UpdateCustomOrderStatusForm({ trackingId, currentStatus }: UpdateCustomOrderStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<CustomOrderStatus>(currentStatus);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/custom-orders/${trackingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    if (res.ok) {
      toast({ title: 'Status updated' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border border-mv-border rounded-lg p-4 space-y-4">
      <h3 className="font-semibold">Update Status</h3>
      <Select value={status} onValueChange={(val) => setStatus(val as CustomOrderStatus)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Status'}</Button>
    </form>
  );
}