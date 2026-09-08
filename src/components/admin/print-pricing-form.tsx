'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { PrintLocation } from '@prisma/client';

export function PrintPricingForm({ garments }: { garments: any[] }) {
  const [garmentId, setGarmentId] = useState('');
  const [location, setLocation] = useState<PrintLocation>(PrintLocation.FRONT);
  const [pricing, setPricing] = useState({
    baseCost: 0,
    largePrintThresholdSqIn: 0,
    largePrintSurcharge: 0,
    quantityDiscountTiers: [],
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/print-pricing', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ garmentId, location, pricing }),
    });
    if (res.ok) {
      toast({ title: 'Pricing updated' });
    } else {
      toast({ title: 'Error', description: 'Failed to update pricing', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <Label>Garment</Label>
        <Select value={garmentId} onValueChange={setGarmentId}>
          <SelectTrigger><SelectValue placeholder="Select garment" /></SelectTrigger>
          <SelectContent>
            {garments.map((g) => (
              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Print Location</Label>
        <Select value={location} onValueChange={(val) => setLocation(val as PrintLocation)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.values(PrintLocation).map((loc) => (
              <SelectItem key={loc} value={loc}>{loc.replace(/_/g, ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Base Cost (PKR)</Label>
        <Input type="number" value={pricing.baseCost} onChange={(e) => setPricing({ ...pricing, baseCost: Number(e.target.value) })} />
      </div>
      <div>
        <Label>Large Print Threshold (sq in)</Label>
        <Input type="number" value={pricing.largePrintThresholdSqIn} onChange={(e) => setPricing({ ...pricing, largePrintThresholdSqIn: Number(e.target.value) })} />
      </div>
      <div>
        <Label>Large Print Surcharge (PKR)</Label>
        <Input type="number" value={pricing.largePrintSurcharge} onChange={(e) => setPricing({ ...pricing, largePrintSurcharge: Number(e.target.value) })} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Pricing'}</Button>
    </form>
  );
}