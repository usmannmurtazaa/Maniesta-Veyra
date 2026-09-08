import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user-service';
import { registerSchema } from '@/lib/validation/user.schema';
import { rateLimiters } from '@/lib/security/rate-limit';
import { ZodError } from 'zod';
import { ConflictError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const limiter = rateLimiters.register;
    const result = await limiter.limit(request.headers.get('x-forwarded-for') || 'anonymous');
    if (!result.success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Too many registration attempts. Please try again later.' } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const input = registerSchema.parse(body);

    await userService.register(input);

    return NextResponse.json({ data: { success: true } }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    if (error instanceof ConflictError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Registration failed' } },
      { status: 500 }
    );
  }
}