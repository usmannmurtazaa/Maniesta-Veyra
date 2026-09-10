'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // In production, this would call an API endpoint to subscribe the user.
    // For now, we simulate a successful subscription.
    setTimeout(() => {
      toast({ title: 'Subscribed!', description: 'Thank you for joining our newsletter.' });
      setEmail('');
      setLoading(false);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="sm:max-w-xs"
        aria-label="Email address"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
}