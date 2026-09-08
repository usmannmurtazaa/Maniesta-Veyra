import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user-service';
import { forgotPasswordSchema } from '@/lib/validation/user.schema';
import { rateLimiters } from '@/lib/security/rate-limit';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const limiter = rateLimiters.passwordReset;
    const result = await limiter.limit(request.headers.get('x-forwarded-for') || 'anonymous');
    if (!result.success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Too many password reset attempts. Please try again later.' } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);
    await userService.forgotPassword(email);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid email', details: error.issues } },
        { status: 400 }
      );
    }
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Password reset request failed' } },
      { status: 500 }
    );
  }
}