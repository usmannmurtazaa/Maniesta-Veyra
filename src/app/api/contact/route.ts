import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { getServerEnv, getPublicEnv } from '@/lib/env';
import { rateLimiters } from '@/lib/security/rate-limit';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const limiter = rateLimiters.contact;
    const result = await limiter.limit(request.headers.get('x-forwarded-for') || 'anonymous');
    if (!result.success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const input = contactFormSchema.parse(body);

    const env = getServerEnv();
    const publicEnv = getPublicEnv();

    // Send email if configured
    if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
      console.warn('Contact email not sent: email service not configured.');
      return NextResponse.json(
        { error: { code: 'EMAIL_NOT_CONFIGURED', message: 'Contact form is temporarily unavailable. Please email us directly.' } },
        { status: 503 }
      );
    }

    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.EMAIL_FROM, // sending to the same configured support email
      replyTo: input.email,
      subject: `[Contact Form] ${input.subject}`,
      html: `
        <h2>New contact message from ${publicEnv.NEXT_PUBLIC_APP_NAME}</h2>
        <p><strong>Name:</strong> ${input.name}</p>
        <p><strong>Email:</strong> ${input.email}</p>
        ${input.phone ? `<p><strong>Phone:</strong> ${input.phone}</p>` : ''}
        <p><strong>Subject:</strong> ${input.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${input.message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to send message' } },
      { status: 500 }
    );
  }
}