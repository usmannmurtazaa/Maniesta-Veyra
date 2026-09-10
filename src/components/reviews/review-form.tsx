'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { RatingStars } from './rating-stars';

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  content: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productSlug: string;
  onSubmitted?: () => void;
}

export function ReviewForm({ productSlug, onSubmitted }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (rating === 0) {
      toast({ title: 'Error', description: 'Please select a rating', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, rating }),
      });
      const result = await res.json();
      if (res.ok) {
        toast({ title: 'Review submitted', description: 'Thank you for your feedback!' });
        reset();
        setRating(0);
        onSubmitted?.();
      } else {
        toast({ title: 'Error', description: result.error?.message || 'Failed to submit review', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Your Rating</Label>
        <div className="mt-1">
          <RatingStars rating={rating} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title (optional)</Label>
        <Input id="title" {...register('title')} placeholder="Summary of your review" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Review (optional)</Label>
        <Textarea id="content" {...register('content')} placeholder="Share your experience..." rows={4} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}