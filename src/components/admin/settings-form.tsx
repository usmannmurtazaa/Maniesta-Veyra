'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export function SettingsForm({ settings }: { settings: any[] }) {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: JSON.parse(value), description }),
    });
    if (res.ok) {
      toast({ title: 'Setting saved' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: 'Failed to save setting', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Settings</h2>
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="border border-mv-border rounded-lg p-4">
              <p className="font-medium">{setting.key}</p>
              <pre className="text-xs text-mv-muted mt-2 overflow-x-auto">{JSON.stringify(setting.value, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Add/Update Setting</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Key</label>
            <Input value={key} onChange={(e) => setKey(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Value (JSON)</label>
            <Textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder='{"key": "value"}' />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Setting'}</Button>
        </form>
      </div>
    </div>
  );
}