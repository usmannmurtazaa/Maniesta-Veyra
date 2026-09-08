import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user-service';
import { verifyEmailSchema } from '@/lib/validation/user.schema';
import { ZodError } from 'zod';
import { NotFoundError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = verifyEmailSchema.parse(body);
    await userService.verifyEmail(token);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid token', details: error.issues } },
        { status: 400 }
      );
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Verification failed' } },
      { status: 500 }
    );
  }
}