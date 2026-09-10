'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

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

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    fetch('/api/account/addresses')
      .then((res) => res.json())
      .then((data) => setAddresses(data.data || []));
  }, []);

  const remove = async (id: string) => {
    await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <p className="text-mv-muted">No addresses saved.</p>
      ) : (
        addresses.map((addr) => (
          <div key={addr.id} className="flex items-start justify-between border border-mv-border rounded-lg p-4">
            <div>
              <p className="font-medium">{addr.fullName}</p>
              <p className="text-sm text-mv-muted">
                {addr.addressLine1}
                {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
              </p>
              <p className="text-sm text-mv-muted">
                {addr.city}, {addr.state} {addr.postalCode}
              </p>
              <p className="text-sm text-mv-muted">{addr.phone}</p>
              {addr.isDefault && <span className="text-xs bg-mv-primary text-white px-2 py-1 rounded-sm mt-2 inline-block">Default</span>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(addr.id)} aria-label="Delete address">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}