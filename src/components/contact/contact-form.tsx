'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const MAX_MESSAGE_LENGTH = 5000;

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(MAX_MESSAGE_LENGTH),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const message = watch('message') ?? '';
  const remaining = MAX_MESSAGE_LENGTH - message.length;

  async function onSubmit(data: ContactFormValues) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        toast({
          title: 'Could not send message',
          description:
            result?.error?.message ??
            'Please try again in a moment.',
          variant: 'destructive',
        });
        return;
      }

      // Success: show the confirmation state, not a toast.
      // Two simultaneous confirmations is confusing.
      reset();
      setSuccess(true);
    } catch {
      toast({
        title: 'Network error',
        description: 'Check your connection and try again.',
        variant: 'destructive',
      });
    }
  }

  // ---- Success state ----
  if (success) {
    return (
      <div
        className="rounded-lg border border-mv-border bg-white p-8 text-center"
        aria-live="polite"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mv-success/10">
          <CheckCircle2
            className="h-7 w-7 text-mv-success"
            aria-hidden
          />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-mv-text">
          Message sent
        </h3>
        <p className="mt-2 text-sm text-mv-text-secondary">
          Thanks for reaching out. We respond within 24–48 hours on business
          days.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  // ---- Form ----
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            placeholder="Your full name"
            autoComplete="name"
            autoFocus
            {...register('name')}
            aria-invalid={!!errors.name}
            className={cn(
              errors.name && 'border-mv-error focus-visible:ring-mv-error'
            )}
          />
          {errors.name && (
            <p className="text-xs text-mv-error">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            className={cn(
              errors.email && 'border-mv-error focus-visible:ring-mv-error'
            )}
          />
          {errors.email && (
            <p className="text-xs text-mv-error">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-phone">
          Phone{' '}
          <span className="font-normal text-mv-muted">(optional)</span>
        </Label>
        <Input
          id="contact-phone"
          type="tel"
          placeholder="+92 300 1234567"
          autoComplete="tel"
          inputMode="tel"
          {...register('phone')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          placeholder="How can we help?"
          {...register('subject')}
          aria-invalid={!!errors.subject}
          className={cn(
            errors.subject && 'border-mv-error focus-visible:ring-mv-error'
          )}
        />
        {errors.subject && (
          <p className="text-xs text-mv-error">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="contact-message">Message</Label>
          <span
            className={cn(
              'text-xs',
              remaining < 200 ? 'text-mv-warning' : 'text-mv-muted'
            )}
            aria-live="polite"
          >
            {remaining.toLocaleString('en-PK')} characters left
          </span>
        </div>
        <Textarea
          id="contact-message"
          rows={5}
          placeholder="Write your message…"
          maxLength={MAX_MESSAGE_LENGTH}
          {...register('message')}
          aria-invalid={!!errors.message}
          className={cn(
            errors.message && 'border-mv-error focus-visible:ring-mv-error'
          )}
        />
        {errors.message && (
          <p className="text-xs text-mv-error">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}