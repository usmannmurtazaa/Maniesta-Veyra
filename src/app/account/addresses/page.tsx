'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    const res = await fetch('/api/account/addresses');
    const result = await res.json();
    if (result.data) setAddresses(result.data);
    setLoading(false);
  };

  const deleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast({ title: 'Address deleted' });
      fetchAddresses();
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Addresses</h1>
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-mv-muted">No addresses saved.</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className="border border-mv-border rounded-lg p-4 flex items-start justify-between">
              <div>
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-sm text-mv-muted">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                <p className="text-sm text-mv-muted">{addr.city}, {addr.state} {addr.postalCode}</p>
                <p className="text-sm text-mv-muted">{addr.phone}</p>
                {addr.isDefault && <span className="text-xs bg-mv-primary text-white px-2 py-1 rounded-sm mt-2 inline-block">Default</span>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteAddress(addr.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
      <Button className="mt-6" onClick={() => toast({ title: 'Coming soon', description: 'Add address form coming in next update' })}>
        <Plus className="h-4 w-4" /> Add Address
      </Button>
    </div>
  );
}