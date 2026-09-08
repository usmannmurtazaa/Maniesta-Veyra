import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user-service';
import { resetPasswordSchema } from '@/lib/validation/user.schema';
import { rateLimiters } from '@/lib/security/rate-limit';
import { ZodError } from 'zod';
import { NotFoundError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const limiter = rateLimiters.passwordReset;
    const result = await limiter.limit(request.headers.get('x-forwarded-for') || 'anonymous');
    if (!result.success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Too many attempts. Please try again later.' } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const input = resetPasswordSchema.parse(body);
    await userService.resetPassword(input);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Password reset failed' } },
      { status: 500 }
    );
  }
}