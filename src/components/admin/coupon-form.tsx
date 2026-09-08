'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { CouponType } from '@prisma/client';

export function CouponForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [type, setType] = useState<CouponType>(CouponType.PERCENTAGE);
  const [value, setValue] = useState(0);
  const [usageLimit, setUsageLimit] = useState<number | undefined>();
  const [perUserLimit, setPerUserLimit] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, type, value, usageLimit, perUserLimit, isActive: true }),
    });
    if (res.ok) {
      toast({ title: 'Coupon created' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: 'Failed to create coupon', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Code</Label>
        <Input value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
      <div>
        <Label>Type</Label>
        <Select value={type} onValueChange={(val) => setType(val as CouponType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={CouponType.PERCENTAGE}>Percentage</SelectItem>
            <SelectItem value={CouponType.FIXED_AMOUNT}>Fixed Amount</SelectItem>
            <SelectItem value={CouponType.FREE_SHIPPING}>Free Shipping</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Value</Label>
        <Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Usage Limit</Label>
          <Input type="number" value={usageLimit ?? ''} onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : undefined)} />
        </div>
        <div>
          <Label>Per User Limit</Label>
          <Input type="number" value={perUserLimit ?? ''} onChange={(e) => setPerUserLimit(e.target.value ? Number(e.target.value) : undefined)} />
        </div>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Coupon'}</Button>
    </form>
  );
}